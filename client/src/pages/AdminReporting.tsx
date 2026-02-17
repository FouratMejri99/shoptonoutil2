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
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, Filter, MapPin, RefreshCw, Search, Tag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface PublishItem {
  id: number;
  created_at: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  subcategory: string | null;
  characteristics: string | null;
  deposit: number | null;
  description: string | null;
  user_id: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Chantier & gros œuvre": "#3b82f6",
  "Plomberie": "#10b981",
  "Électricité": "#f59e0b",
  "Menuiserie": "#8b5cf6",
  "Peinture": "#ef4444",
  "Jardinage": "#14b8a6",
  "Autre": "#6b7280",
};

const CITY_COLORS: Record<string, string> = {
  Reims: "#3b82f6",
  Paris: "#10b981",
  Lyon: "#f59e0b",
  Marseille: "#8b5cf6",
  Toulouse: "#ef4444",
  Nice: "#14b8a6",
  "Default": "#6b7280",
};

export default function AdminReporting() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // tRPC queries
  const {
    data: publishData,
    refetch: refetchPublish,
    isLoading: isLoadingPublish,
  } = trpc.publish.list.useQuery();

  const {
    data: statsData,
    refetch: refetchStats,
    isLoading: isLoadingStats,
  } = trpc.publish.stats.useQuery();

  const [items, setItems] = useState<PublishItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (publishData) {
      setItems(publishData || []);
    }
  }, [publishData]);

  useEffect(() => {
    setIsLoading(isLoadingPublish);
  }, [isLoadingPublish]);

  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Prepare chart data from stats
  const categoryData = statsData?.byCategory ? 
    Object.entries(statsData.byCategory).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS["Default"],
    })) : [];

  const cityData = statsData?.byCity ?
    Object.entries(statsData.byCity).map(([name, value]) => ({
      name,
      value,
      color: CITY_COLORS[name] || CITY_COLORS["Default"],
    })) : [];

  const totalValue = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const averagePrice = items.length > 0 ? totalValue / items.length : 0;

  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));

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
                <h1 className="font-bold text-gray-900">Publish Reports</h1>
                <p className="text-xs text-gray-600">Tools & Equipment Listings</p>
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
              <Link href="/admin/subscribers">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                >
                  Subscribers
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
                  Total Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {statsData?.total || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Published tools</p>
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
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  €{totalValue.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Combined price</p>
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
                  Average Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  €{averagePrice.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Per item</p>
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
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {categories.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">Unique categories</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  By Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* City Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  By City
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : cityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cityData.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No city data available
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name, category, or city..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full bg-white/80 backdrop-blur-sm border-gray-200"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              All
            </Button>
            {categories.slice(0, 4).map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Listings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Listings ({filteredItems.length})
              </CardTitle>
              <CardDescription>
                Showing {filteredItems.length} of {items.length} listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No listings found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Deposit</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">City</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.slice(0, 20).map(item => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            {item.subcategory && (
                              <div className="text-xs text-gray-500">{item.subcategory}</div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-green-600">
                            €{Number(item.price).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {item.deposit ? `€${item.deposit}` : "-"}
                          </td>
                          <td className="py-3 px-4">
                            {item.city ? (
                              <span className="flex items-center gap-1">
                                <MapPin size={14} className="text-gray-400" />
                                {item.city}
                              </span>
                            ) : "-"}
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-sm">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredItems.length > 20 && (
                    <div className="text-center py-4 text-gray-500">
                      Showing 20 of {filteredItems.length} listings
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
