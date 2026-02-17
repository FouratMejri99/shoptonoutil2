import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { 
  Mail, 
  Search, 
  Users, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  FileText,
  User,
  Building
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  city: string;
  profile: string;
  id_card_url: string | null;
  iban: string | null;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  user_id: string | null;
  street: string | null;
  verified: boolean;
}

export default function AdminSubscribers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // tRPC queries
  const {
    data: subscribersData,
    isLoading: isLoadingSubscribers,
  } = trpc.subscribers.list.useQuery();

  const {
    data: statsData,
    isLoading: isLoadingStats,
  } = trpc.subscribers.stats.useQuery();

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (subscribersData) {
      setSubscribers(subscribersData || []);
    }
  }, [subscribersData]);

  useEffect(() => {
    setIsLoading(isLoadingSubscribers);
  }, [isLoadingSubscribers]);

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = !searchTerm || 
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfile = !selectedProfile || sub.profile === selectedProfile;
    
    return matchesSearch && matchesProfile;
  });

  const verifiedCount = subscribers.filter(s => s.verified).length;
  const unverifiedCount = subscribers.filter(s => !s.verified).length;
  const bricoleurCount = subscribers.filter(s => s.profile === "bricoleur").length;
  const loueurCount = subscribers.filter(s => s.profile === "loueur").length;

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold">S</span>
              </motion.div>
              <div>
                <h1 className="font-bold text-gray-900">Subscribers</h1>
                <p className="text-xs text-gray-600">User Management</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/employees">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                >
                  Users
                </Button>
              </Link>
              <Link href="/admin/reporting">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                >
                  Reports
                </Button>
              </Link>
              <Link href="/admin/blog">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                >
                  Blog
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full hover:bg-red-50 hover:text-red-600 border-gray-200"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Subscribers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {statsData?.total || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">All subscribers</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Verified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {statsData?.verified || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">ID verified</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Bricoleurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {statsData?.byProfile?.bricoleur || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">DIY enthusiasts</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Loueurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {statsData?.byProfile?.loueur || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Equipment owners</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name, email, or city..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full bg-white/80 backdrop-blur-sm border-gray-200"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedProfile === null ? "default" : "outline"}
              onClick={() => setSelectedProfile(null)}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              variant={selectedProfile === "bricoleur" ? "default" : "outline"}
              onClick={() => setSelectedProfile("bricoleur")}
              className="rounded-full"
            >
              Bricoleur
            </Button>
            <Button
              variant={selectedProfile === "loueur" ? "default" : "outline"}
              onClick={() => setSelectedProfile("loueur")}
              className="rounded-full"
            >
              Loueur
            </Button>
          </div>
        </motion.div>

        {/* Subscribers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Subscribers ({filteredSubscribers.length})
              </CardTitle>
              <CardDescription>
                Showing {filteredSubscribers.length} of {subscribers.length} subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : filteredSubscribers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No subscribers found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Profile</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">City</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Verified</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscribers.slice(0, 20).map(sub => (
                        <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User size={16} className="text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">{sub.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail size={14} className="text-gray-400" />
                              {sub.email}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              sub.profile === "bricoleur" 
                                ? "bg-purple-100 text-purple-800" 
                                : "bg-orange-100 text-orange-800"
                            }`}>
                              {sub.profile === "bricoleur" ? "Bricoleur" : "Loueur"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {sub.city ? (
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin size={14} className="text-gray-400" />
                                {sub.city}
                              </div>
                            ) : "-"}
                          </td>
                          <td className="py-3 px-4">
                            {sub.verified ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle size={16} />
                                Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-yellow-600">
                                <XCircle size={16} />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-sm">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredSubscribers.length > 20 && (
                    <div className="text-center py-4 text-gray-500">
                      Showing 20 of {filteredSubscribers.length} subscribers
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
