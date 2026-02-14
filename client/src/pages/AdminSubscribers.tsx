import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Mail, Phone, Search, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

type SubscriberType = 'all' | 'lead' | 'newsletter' | 'quote_request';

export default function AdminSubscribers() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<SubscriberType>('all');

  // Check if admin is logged in
  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      setLocation("/solupedia-admin");
    }
  }, [setLocation]);

  // Fetch all leads and subscriptions
  const { data: leadsData, isLoading: loadingLeads, refetch: refetchLeads } = 
    trpc.leads.getLeads.useQuery(activeTab === 'all' ? undefined : activeTab);
  
  const { data: subscriptionsData, isLoading: loadingSubs, refetch: refetchSubs } = 
    trpc.leads.getSubscriptions.useQuery(activeTab === 'all' ? undefined : activeTab);

  const isLoading = loadingLeads || loadingSubs;

  // Combine and filter data
  const allSubscribers = [
    ...(leadsData || []).map((item: any) => ({
      ...item,
      source: 'lead',
      subscriptionDate: item.createdat
    })),
    ...(subscriptionsData || []).map((item: any) => ({
      ...item,
      source: 'newsletter',
      subscriptionDate: item.subscribedat
    }))
  ].filter(item => {
    // Filter by tab
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        (item.name && item.name.toLowerCase().includes(search)) ||
        (item.email && item.email.toLowerCase().includes(search)) ||
        (item.company && item.company.toLowerCase().includes(search))
      );
    }
    return true;
  });

  // Stats
  const leadCount = (leadsData || []).length;
  const newsletterCount = (subscriptionsData || []).length;
  const quoteRequestCount = (leadsData || []).filter((l: any) => l.type === 'quote_request').length;

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Phone', 'Type', 'Source', 'Date'];
    const rows = allSubscribers.map((sub: any) => [
      sub.name || '-',
      sub.email,
      sub.company || '-',
      sub.phone || '-',
      sub.type || 'lead',
      sub.source,
      sub.subscriptionDate ? new Date(sub.subscriptionDate).toLocaleString() : '-'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      'lead': 'bg-blue-100 text-blue-700',
      'newsletter': 'bg-green-100 text-green-700',
      'quote_request': 'bg-purple-100 text-purple-700',
    };
    const labels: Record<string, string> = {
      'lead': 'Lead',
      'newsletter': 'Newsletter',
      'quote_request': 'Quote Request',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type] || styles.lead}`}>
        {labels[type] || type}
      </span>
    );
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
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 text-blue-600">
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
                <h1 className="font-bold text-gray-900">Subscriber Management</h1>
                <p className="text-xs text-gray-600">Leads & Newsletter Subscribers</p>
              </div>
            </div>
            <div className="flex gap-3">
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
                    <p className="text-sm text-gray-500">Total Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{leadCount}</p>
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
                    <p className="text-sm text-gray-500">Newsletter Subscribers</p>
                    <p className="text-3xl font-bold text-gray-900">{newsletterCount}</p>
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
                    <p className="text-sm text-gray-500">Quote Requests</p>
                    <p className="text-3xl font-bold text-gray-900">{quoteRequestCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'lead', 'newsletter', 'quote_request'] as SubscriberType[]).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab)}
                className="rounded-full capitalize"
              >
                {tab === 'all' ? 'All' : tab.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Subscribers Table */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
            <CardDescription>
              {allSubscribers.length} subscriber(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : allSubscribers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No subscribers found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Company</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Phone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Source</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
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
                            <span className="font-medium">{subscriber.name || '-'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <a href={`mailto:${subscriber.email}`} className="text-blue-600 hover:underline">
                            {subscriber.email}
                          </a>
                        </td>
                        <td className="py-3 px-4">{subscriber.company || '-'}</td>
                        <td className="py-3 px-4">{subscriber.phone || '-'}</td>
                        <td className="py-3 px-4">{getTypeBadge(subscriber.type || 'lead')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscriber.source === 'lead' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {subscriber.source}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(subscriber.subscriptionDate)}
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
