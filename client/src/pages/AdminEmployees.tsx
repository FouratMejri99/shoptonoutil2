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
import { LogOut, Mail, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
  lastSignIn: string | null;
  emailConfirmed: string | null;
}

export default function AdminEmployees() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // tRPC query to get users from Supabase Auth
  const {
    data: usersData,
    refetch: refetchUsers,
    isLoading: isLoadingUsers,
  } = trpc.auth.listUsers.useQuery();

  useEffect(() => {
    if (usersData) {
      setUsers(usersData || []);
    }
  }, [usersData]);

  useEffect(() => {
    setIsLoading(isLoadingUsers);
  }, [isLoadingUsers]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    window.location.href = "/";
  };

  const filteredUsers = users.filter(
    user =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmedCount = users.filter(user => user.emailConfirmed).length;

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
                <h1 className="font-bold text-gray-900">User Management</h1>
                <p className="text-xs text-gray-600">Admin Portal</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/change-password">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                >
                  Change Password
                </Button>
              </Link>
              <Link href="/admin/subscribers">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                >
                  Subscribers
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
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {users.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">All registered users</p>
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
                  Confirmed Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {confirmedCount}
                </div>
                <p className="text-xs text-gray-500 mt-1">Users with verified email</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Registered Users
              </CardTitle>
              <CardDescription>
                List of all users registered in Supabase Authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No users found matching your search" : "No users registered yet"}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            ID: {user.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.emailConfirmed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.emailConfirmed ? "Confirmed" : "Pending"}
                        </span>
                        {user.lastSignIn && (
                          <p className="text-xs text-gray-500 mt-1">
                            Last sign in: {new Date(user.lastSignIn).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
