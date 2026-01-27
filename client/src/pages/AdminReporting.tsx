import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Filter, Calendar, Users } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Reporting Dashboard</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download size={18} className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalHours}</div>
              <p className="text-xs text-gray-500 mt-1">All employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{employeeReports.length}</div>
              <p className="text-xs text-gray-500 mt-1">Active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overtime Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{totalOvertime}</div>
              <p className="text-xs text-gray-500 mt-1">Total overtime</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Hours/Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{averageHours}</div>
              <p className="text-xs text-gray-500 mt-1">Monthly average</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Hours Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Hours Trend</CardTitle>
              <CardDescription>Total hours tracked per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalHours" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="overtimeHours" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Task Type Distribution */}
          <Card>
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
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Employee Hours Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Employee Hours Comparison</CardTitle>
            <CardDescription>Business hours vs overtime by employee</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeReports}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="employeeName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="businessDayHours" stackId="a" fill="#10b981" name="Business Hours" />
                <Bar dataKey="overtimeHours" stackId="a" fill="#f59e0b" name="Overtime" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Details</CardTitle>
            <CardDescription>Detailed breakdown by employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Employee</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Total Hours</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Business Hours</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Overtime</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Projects</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg/Day</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeReports.map((emp) => (
                    <tr key={emp.employeeId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{emp.employeeName}</td>
                      <td className="text-right py-3 px-4 text-gray-700">{emp.totalHours}h</td>
                      <td className="text-right py-3 px-4 text-green-600 font-medium">{emp.businessDayHours}h</td>
                      <td className="text-right py-3 px-4 text-orange-600 font-medium">{emp.overtimeHours}h</td>
                      <td className="text-right py-3 px-4 text-gray-700">{emp.projectCount}</td>
                      <td className="text-right py-3 px-4 text-gray-700">{emp.averageHoursPerDay}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
