import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Plus, Edit2, Trash2, Key, LogOut, Eye, EyeOff, Users, Search, FileText, ArrowLeft, BarChart } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Employee {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department?: string;
  position?: string;
  isActive: boolean;
  lastPasswordChange?: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      email: "ahmed.hassan@solupedia.com",
      firstName: "Ahmed",
      lastName: "Hassan",
      employeeId: "EMP-001",
      department: "Translation",
      position: "Senior Translator",
      isActive: true,
      lastPasswordChange: "2024-01-10",
    },
    {
      id: 2,
      email: "fatima.mohamed@solupedia.com",
      firstName: "Fatima",
      lastName: "Mohamed",
      employeeId: "EMP-002",
      department: "Review",
      position: "QA Specialist",
      isActive: true,
      lastPasswordChange: "2024-01-15",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    employeeId: "",
    department: "",
    position: "",
    password: "",
  });

  // Check admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      setLocation("/solupedia-admin");
      return;
    }
    
    // Verify session is still valid (check if expired)
    try {
      const session = JSON.parse(adminSession);
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      // Session expires after 24 hours
      if (hoursSinceLogin > 24) {
        localStorage.removeItem("adminSession");
        setLocation("/solupedia-admin");
      }
    } catch (error) {
      localStorage.removeItem("adminSession");
      setLocation("/solupedia-admin");
    }
  }, [setLocation]);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingId
            ? {
                ...emp,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                employeeId: formData.employeeId,
                department: formData.department,
                position: formData.position,
              }
            : emp
        )
      );
      toast.success("Employee updated successfully");
      setEditingId(null);
    } else {
      const newEmployee: Employee = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        employeeId: formData.employeeId,
        department: formData.department,
        position: formData.position,
        isActive: true,
        lastPasswordChange: new Date().toISOString().split("T")[0],
      };
      setEmployees([...employees, newEmployee]);
      toast.success("Employee created successfully");
    }

    setShowForm(false);
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      employeeId: "",
      department: "",
      position: "",
      password: "",
    });
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      employeeId: employee.employeeId,
      department: employee.department || "",
      position: employee.position || "",
      password: "",
    });
    setEditingId(employee.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
      toast.success("Employee deleted");
    }
  };

  const handleResetPassword = (id: number) => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              lastPasswordChange: new Date().toISOString().split("T")[0],
            }
          : emp
      )
    );

    toast.success(`Password reset for ${employees.find((e) => e.id === id)?.firstName}`);
    setResetPasswordId(null);
    setNewPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    setLocation("/solupedia-admin");
    localStorage.removeItem("adminSession");
    toast.success("Logged out successfully");
    setLocation("/solupedia-admin");
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = employees.filter((emp) => emp.isActive).length;

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
                <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-600">Employee Management</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/blog">
                <Button
                  variant="outline"
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                >
                  <FileText size={18} className="mr-2" />
                  Blog Management
                </Button>
              </Link>
              <Link href="/admin/reporting">
                <Button
                  variant="outline"
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                >
                  <BarChart size={18} className="mr-2" />
                  Time Tracking
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
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{employees.length}</div>
                <p className="text-xs text-gray-500 mt-1">All employees</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{activeCount}</div>
                <p className="text-xs text-gray-500 mt-1">Currently active</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Add Button */}
        <motion.div 
          className="flex gap-4 mb-8 flex-col md:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={() => {
              setEditingId(null);
              setFormData({
                email: "",
                firstName: "",
                lastName: "",
                employeeId: "",
                department: "",
                position: "",
                password: "",
              });
              setShowForm(!showForm);
            }}
            className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} className="mr-2" />
            Add Employee
          </Button>
        </motion.div>

        {/* Add/Edit Employee Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl rounded-3xl">
                <CardHeader>
                  <CardTitle>{editingId ? "Edit Employee" : "Add New Employee"}</CardTitle>
                  <CardDescription>
                    {editingId
                      ? "Update employee information"
                      : "Create a new employee account for time tracking"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddEmployee} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="e.g., Ahmed"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          required
                          className="rounded-xl bg-white/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="e.g., Hassan"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          required
                          className="rounded-xl bg-white/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g., ahmed@solupedia.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          className="rounded-xl bg-white/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input
                          id="employeeId"
                          placeholder="e.g., EMP-001"
                          value={formData.employeeId}
                          onChange={(e) =>
                            setFormData({ ...formData, employeeId: e.target.value })
                          }
                          required
                          className="rounded-xl bg-white/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          placeholder="e.g., Translation"
                          value={formData.department}
                          onChange={(e) =>
                            setFormData({ ...formData, department: e.target.value })
                          }
                          className="rounded-xl bg-white/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          placeholder="e.g., Senior Translator"
                          value={formData.position}
                          onChange={(e) =>
                            setFormData({ ...formData, position: e.target.value })
                          }
                          className="rounded-xl bg-white/50"
                        />
                      </div>

                      {!editingId && (
                        <div className="space-y-2">
                          <Label htmlFor="password">Initial Password</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter initial password"
                              value={formData.password}
                              onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                              }
                              required={!editingId}
                              className="rounded-xl bg-white/50 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                        {editingId ? "Update Employee" : "Create Employee"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                        }}
                        className="rounded-full px-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Employees Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg overflow-hidden rounded-3xl">
            <CardHeader className="bg-blue-50/50 border-b border-blue-100/50">
              <CardTitle>Employees</CardTitle>
              <CardDescription>Manage employee accounts, passwords, and access</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    {searchTerm ? "No employees match your search." : "No employees yet."}
                  </p>
                  {!searchTerm && (
                    <p className="text-sm text-gray-500 mt-1">Add your first employee to get started.</p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Name</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Email</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Employee ID</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Last Password Change</th>
                        <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp, idx) => (
                        <motion.tr 
                          key={emp.id} 
                          className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: idx * 0.05 }}
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">
                              {emp.firstName} {emp.lastName}
                            </div>
                            <div className="text-sm text-blue-600 font-medium">{emp.position}</div>
                          </td>
                          <td className="py-4 px-6 text-gray-700">{emp.email}</td>
                          <td className="py-4 px-6 text-gray-700 font-mono text-sm bg-gray-50 rounded px-2 py-1 inline-block my-3 ml-6">{emp.employeeId}</td>
                          <td className="py-4 px-6 text-gray-700">{emp.lastPasswordChange || "Never"}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(emp)}
                                title="Edit employee"
                                className="h-8 w-8 p-0 rounded-full hover:bg-blue-100 text-blue-600"
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setResetPasswordId(emp.id)}
                                title="Reset password"
                                className="h-8 w-8 p-0 rounded-full hover:bg-orange-100 text-orange-600"
                              >
                                <Key size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(emp.id)}
                                title="Delete employee"
                                className="h-8 w-8 p-0 rounded-full hover:bg-red-100 text-red-600"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Password Reset Modal */}
        <AnimatePresence>
          {resetPasswordId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setResetPasswordId(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md"
              >
                <Card className="w-full shadow-2xl rounded-3xl border-white/20">
                  <CardHeader>
                    <CardTitle>Reset Employee Password</CardTitle>
                    <CardDescription>
                      Set a new password for <span className="font-semibold text-blue-600">{employees.find((e) => e.id === resetPasswordId)?.firstName}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoFocus
                          className="rounded-xl pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setResetPasswordId(null);
                          setNewPassword("");
                        }}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleResetPassword(resetPasswordId)}
                        className="bg-blue-600 hover:bg-blue-700 rounded-full"
                      >
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
