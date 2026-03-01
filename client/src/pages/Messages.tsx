import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Search, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation as useWouterLocation } from "wouter";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  reservation_id: string | null;
  tool_id: number;
  created_at: string;
  updated_at: string;
  tool_name?: string;
  other_user_name?: string;
  other_user_email?: string;
  last_message?: string;
  last_message_date?: string;
  unread_count?: number;
}

export default function Messages() {
  const [location, setLocation] = useWouterLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await fetchConversations(user.id);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // Handle conversation query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const conversationParam = urlParams.get("conversation");
    if (conversationParam && conversations.length > 0) {
      // Check if this conversation belongs to the user
      const conv = conversations.find(c => c.id === conversationParam);
      if (conv) {
        setSelectedConversation(conversationParam);
        // Clear the URL parameter after selecting
        window.history.replaceState({}, document.title, "/messages");
      }
    }
  }, [conversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      // Mark messages as read
      markAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  const fetchConversations = async (userId: string) => {
    // Fetch conversations where user is participant
    const { data: conversationsData, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return;
    }

    if (conversationsData && conversationsData.length > 0) {
      // Get tool names
      const toolIds = conversationsData.map(c => c.tool_id);
      const { data: toolsData } = await supabase
        .from("publish")
        .select("id, name")
        .in("id", toolIds);

      // Get last message for each conversation
      const conversationsWithInfo = await Promise.all(
        conversationsData.map(async conv => {
          const otherUserId =
            conv.participant1_id === userId
              ? conv.participant2_id
              : conv.participant1_id;

          // Get last message
          const { data: lastMsgData } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact" })
            .eq("conversation_id", conv.id)
            .neq("sender_id", userId)
            .is("read_at", null);

          const tool = toolsData?.find(t => t.id === conv.tool_id);

          return {
            ...conv,
            tool_name: tool?.name || "Outil",
            other_user_id: otherUserId,
            last_message: lastMsgData?.content || "Aucun message",
            last_message_date: lastMsgData?.created_at,
            unread_count: count || 0,
          };
        })
      );

      // Get user names for other participants from profiles table
      const otherUserIds = conversationsWithInfo.map(c => c.other_user_id);

      // First, try to fetch profiles for other users
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", otherUserIds);

        if (profilesData && !profilesError) {
          // Update conversations with user names from profiles
          for (let i = 0; i < conversationsWithInfo.length; i++) {
            const conv = conversationsWithInfo[i];
            const profile = profilesData.find(p => p.id === conv.other_user_id);
            if (profile && profile.full_name) {
              conversationsWithInfo[i].other_user_name = profile.full_name;
            }
          }
        }
      } catch (profilesErr) {
        console.log("Could not fetch profiles, trying auth API");
        // Fallback: try auth admin API
        try {
          const { data: usersData, error: usersError } =
            await supabase.auth.admin.listUsers();
          if (usersData && !usersError && usersData.users) {
            for (let i = 0; i < conversationsWithInfo.length; i++) {
              const conv = conversationsWithInfo[i];
              const otherUser = usersData.users.find(
                u => u.id === conv.other_user_id
              );
              if (otherUser) {
                const userMeta = otherUser.user_metadata || {};
                const displayName =
                  userMeta.full_name ||
                  userMeta.name ||
                  otherUser.email?.split("@")[0] ||
                  "Utilisateur";
                conversationsWithInfo[i].other_user_name = displayName;
                conversationsWithInfo[i].other_user_email =
                  otherUser.email || "";
              }
            }
          }
        } catch (authErr) {
          console.log("Could not fetch user names, using user ID");
          for (let i = 0; i < conversationsWithInfo.length; i++) {
            if (!conversationsWithInfo[i].other_user_name) {
              const userId = conversationsWithInfo[i].other_user_id;
              conversationsWithInfo[i].other_user_name =
                `User ${userId?.substring(0, 8) || "Unknown"}`;
            }
          }
        }
      }

      setConversations(conversationsWithInfo);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const markAsRead = async (conversationId: string) => {
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user?.id)
      .is("read_at", null);

    // Update local state
    setMessages(prev =>
      prev.map(m => ({
        ...m,
        read_at: m.read_at || new Date().toISOString(),
      }))
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: selectedConversation,
            sender_id: user.id,
            content: newMessage,
          },
        ])
        .select()
        .single();

      if (error) {
        toast.error("Erreur lors de l'envoi du message");
        console.error(error);
      } else {
        // Add message to local state
        setMessages(prev => [...prev, data]);

        // Update conversation updated_at
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", selectedConversation);

        setNewMessage("");
        toast.success("Message envoyé !");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) return "À l'instant";
    if (diffHours < 24) return `Il y a ${Math.floor(diffHours)}h`;
    if (diffDays < 7) return `Il y a ${Math.floor(diffDays)}j`;
    return date.toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion requise
            </h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour voir vos messages.
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto py-4 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="text-blue-600" />
          Mes messages
        </h1>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex h-[70vh] md:h-[600px]">
            {/* Conversations List */}
            <div
              className={`w-full md:w-1/3 border-r ${selectedConversation ? "hidden md:block" : ""}`}
            >
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher une conversation..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="overflow-y-auto h-[calc(100%-65px)]">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune conversation</p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conv.id ? "bg-blue-50" : ""
                      } ${conv.unread_count && conv.unread_count > 0 ? "bg-blue-50/50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-gray-900 truncate">
                              {conv.other_user_name ||
                                conv.other_user_email ||
                                "Utilisateur"}
                            </p>
                            <span className="text-xs text-gray-500">
                              {conv.last_message_date
                                ? formatDate(conv.last_message_date)
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.tool_name}
                          </p>
                          <p
                            className={`text-sm truncate ${conv.unread_count && conv.unread_count > 0 ? "font-medium text-gray-900" : "text-gray-500"}`}
                          >
                            {conv.last_message}
                          </p>
                        </div>
                        {conv.unread_count && conv.unread_count > 0 && (
                          <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                            {conv.unread_count}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`flex-1 flex flex-col ${!selectedConversation ? "hidden md:flex" : ""}`}
            >
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden text-gray-500"
                    >
                      ←
                    </button>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {conversations.find(c => c.id === selectedConversation)
                          ?.other_user_name ||
                          conversations.find(c => c.id === selectedConversation)
                            ?.other_user_email ||
                          "Utilisateur"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {
                          conversations.find(c => c.id === selectedConversation)
                            ?.tool_name
                        }
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => {
                      const isOwn = msg.sender_id === user.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              isOwn
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <span
                              className={`text-xs ${isOwn ? "text-blue-200" : "text-gray-500"}`}
                            >
                              {formatDate(msg.created_at)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        onKeyPress={e =>
                          e.key === "Enter" && !sending && handleSendMessage()
                        }
                        disabled={sending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={sending || !newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Sélectionnez une conversation pour voir les messages
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
