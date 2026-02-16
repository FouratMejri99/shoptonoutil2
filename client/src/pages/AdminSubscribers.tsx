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
import { ArrowLeft, Download, Mail, Search, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export default function AdminSubscribers() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Check if admin is logged in
  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      setLocation("/solupedia-admin");
    }
  }, [setLocation]);

  // Fetch newsletter subscriptions directly from newsletter_subscriptions table
  const {
    data: subscriptionsData,
    isLoading,
    refetch,
    error,
  } = trpc.leads.getNewsletterSubscriptions.useQuery();

  // Log the data for debugging
  console.log("Subscriptions data:", subscriptionsData);
  console.log("Error:", error);

  // Filter data
  const allSubscribers = (subscriptionsData || []).filter((item: any) => {
    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        (item.name && item.name.toLowerCase().includes(search)) ||
        getEmail(item).toLowerCase().includes(search) ||
        (item.company && item.company.toLowerCase().includes(search))
      );
    }
    return true;
  });

  // Stats
  const totalCount = (subscriptionsData || []).length;

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Company", "Phone", "Subscribed At"];
    const rows = allSubscribers.map((sub: any) => [
      sub.name || "-",
      getEmail(sub),
      sub.company || "-",
      sub.phone || "-",
      getSubscribedDate(sub)
        ? new Date(getSubscribedDate(sub)).toLocaleString()
        : "-",
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to get subscribed date from different column names
  const getSubscribedDate = (item: any) => {
    return item.subscribedat || item.created_at || item.subscribed_at || null;
  };

  // Helper to get email from different formats
  const getEmail = (item: any) => {
    if (!item) return "-";
    if (typeof item.email === "string") return item.email;
    if (typeof item.email === "object" && item.email !== null)
      return item.email.email || "-";
    return "-";
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
              <Link href="/admin/employees">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-blue-50 text-blue-600"
                >
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold">S</span>
              </motion.div>
              <div>
                <h1 className="font-bold text-gray-900">
                  Newsletter Subscriptions
                </h1>
                <p className="text-xs text-gray-600">
                  Manage newsletter subscribers from Supabase
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="rounded-full"
              >
                <Download size={18} className="mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="rounded-full"
              >
                <Download size={18} className="mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Subscribers</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Subscribers</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Data Source</p>
                    <p className="text-lg font-bold text-gray-900">
                      newsletter_subscriptions
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Subscribers Table */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Newsletter Subscribers</CardTitle>
            <CardDescription>
              {allSubscribers.length} subscriber(s) found from
              newsletter_subscriptions table
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                Error loading subscriptions: {error.message}
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="ml-4"
                >
                  Retry
                </Button>
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : allSubscribers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No subscribers found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Company
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Subscribed At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSubscribers.map((subscriber: any, idx: number) => (
                      <motion.tr
                        key={subscriber.id || idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User size={14} className="text-blue-600" />
                            </div>
                            <span className="font-medium">
                              {subscriber.name || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={`mailto:${getEmail(subscriber)}`}
                            className="text-blue-600 hover:underline"
                          >
                            {getEmail(subscriber)}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          {subscriber.company || "-"}
                        </td>
                        <td className="py-3 px-4">{subscriber.phone || "-"}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(getSubscribedDate(subscriber))}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
