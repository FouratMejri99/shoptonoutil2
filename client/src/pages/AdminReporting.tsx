import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Filter, Calendar, Users, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface EmployeeReport {
  employeeId: number;
  employeeName: string;
  totalHours: number;
  businessDayHours: number;
  overtimeHours: number;
  projectCount: number;
  averageHoursPerDay: number;
}

interface DailyReport {
  date: string;
  totalHours: number;
  employeeCount: number;
  overtimeHours: number;
}

export default function AdminReporting() {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split("T")[0].substring(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Mock data for demonstration
  const employeeReports: EmployeeReport[] = [
    {
      employeeId: 1,
      employeeName: "Ahmed Hassan",
      totalHours: 160,
      businessDayHours: 152,
      overtimeHours: 8,
      projectCount: 12,
      averageHoursPerDay: 8,
    },
    {
      employeeId: 2,
      employeeName: "Fatima Mohamed",
      totalHours: 168,
      businessDayHours: 160,
      overtimeHours: 8,
      projectCount: 15,
      averageHoursPerDay: 8.4,
    },
    {
      employeeId: 3,
      employeeName: "Karim Ibrahim",
      totalHours: 155,
      businessDayHours: 148,
      overtimeHours: 7,
      projectCount: 10,
      averageHoursPerDay: 7.75,
    },
  ];

  const dailyReports: DailyReport[] = [
    { date: "Jan 1", totalHours: 48, employeeCount: 6, overtimeHours: 2 },
    { date: "Jan 2", totalHours: 52, employeeCount: 6, overtimeHours: 3 },
    { date: "Jan 3", totalHours: 50, employeeCount: 6, overtimeHours: 2 },
    { date: "Jan 4", totalHours: 54, employeeCount: 6, overtimeHours: 4 },
    { date: "Jan 5", totalHours: 49, employeeCount: 6, overtimeHours: 1 },
  ];

  const taskTypeDistribution = [
    { name: "Translation", value: 45, color: "#3b82f6" },
    { name: "Review", value: 25, color: "#10b981" },
    { name: "QA", value: 15, color: "#f59e0b" },
    { name: "Desktop Publishing", value: 10, color: "#8b5cf6" },
    { name: "Other", value: 5, color: "#ef4444" },
  ];

  const totalHours = employeeReports.reduce((sum, emp) => sum + emp.totalHours, 0);
  const totalOvertime = employeeReports.reduce((sum, emp) => sum + emp.overtimeHours, 0);
  const averageHours = Math.round((totalHours / employeeReports.length) * 100) / 100;

  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF or Excel file
    alert("Exporting report for " + selectedMonth + "...");
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
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 text-blue-600">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Reporting Dashboard</h1>
            </div>
            <Button onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-600/20">
              <Download size={18} className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-8 bg-white/80 backdrop-blur-md border-white/20 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter size={18} className="text-blue-600" />
                Report Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <select
                    id="reportType"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {reportType !== "yearly" && (
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="rounded-xl bg-white/50"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    min="2020"
                    max="2099"
                    className="rounded-xl bg-white/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Hours", value: totalHours, subtitle: "All employees", color: "text-blue-600" },
            { title: "Employees", value: employeeReports.length, subtitle: "Active employees", color: "text-green-600" },
            { title: "Overtime Hours", value: totalOvertime, subtitle: "Total overtime", color: "text-orange-600" },
            { title: "Avg Hours/Employee", value: averageHours, subtitle: "Monthly average", color: "text-purple-600" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Hours Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg rounded-3xl overflow-hidden h-full">
              <CardHeader>
                <CardTitle>Daily Hours Trend</CardTitle>
                <CardDescription>Total hours tracked per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyReports}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="totalHours" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="overtimeHours" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Task Type Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg rounded-3xl overflow-hidden h-full">
              <CardHeader>
                <CardTitle>Task Type Distribution</CardTitle>
                <CardDescription>Percentage of hours by task type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Employee Hours Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="mb-8 bg-white/80 backdrop-blur-md border-white/20 shadow-lg rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle>Employee Hours Comparison</CardTitle>
              <CardDescription>Business hours vs overtime by employee</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeeReports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="employeeName" angle={0} textAnchor="middle" height={30} stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="businessDayHours" stackId="a" fill="#10b981" name="Business Hours" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="overtimeHours" stackId="a" fill="#f59e0b" name="Overtime" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Employee Details Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="bg-blue-50/50 border-b border-blue-100/50">
              <CardTitle>Employee Details</CardTitle>
              <CardDescription>Detailed breakdown by employee</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Employee</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Total Hours</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Business Hours</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Overtime</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Projects</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Avg/Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeReports.map((emp, idx) => (
                      <motion.tr 
                        key={emp.employeeId} 
                        className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.5 + (idx * 0.05) }}
                      >
                        <td className="py-4 px-6 font-medium text-gray-900">{emp.employeeName}</td>
                        <td className="text-right py-4 px-6 text-gray-700">{emp.totalHours}h</td>
                        <td className="text-right py-4 px-6 text-green-600 font-medium">{emp.businessDayHours}h</td>
                        <td className="text-right py-4 px-6 text-orange-600 font-medium">{emp.overtimeHours}h</td>
                        <td className="text-right py-4 px-6 text-gray-700">{emp.projectCount}</td>
                        <td className="text-right py-4 px-6 text-gray-700">{emp.averageHoursPerDay}h</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
