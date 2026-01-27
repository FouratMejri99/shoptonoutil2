import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Plus, Edit2, Trash2, Key, LogOut, Eye, EyeOff, Users, Search, FileText } from "lucide-react";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-600">Employee Management</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setLocation("/admin/blog")}
              >
                <FileText size={18} className="mr-2" />
                Blog Management
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/admin/reporting")}
              >
                <Users size={18} className="mr-2" />
                Time Tracking
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{employees.length}</div>
              <p className="text-xs text-gray-500 mt-1">All employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeCount}</div>
              <p className="text-xs text-gray-500 mt-1">Currently active</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add Button */}
        <div className="flex gap-4 mb-8 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Add/Edit Employee Form */}
        {showForm && (
          <Card className="mb-8">
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
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingId ? "Update Employee" : "Create Employee"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Manage employee accounts, passwords, and access</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? "No employees match your search." : "No employees yet. Add your first employee above."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Employee ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Password Change</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-sm text-gray-600">{emp.position}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{emp.email}</td>
                        <td className="py-3 px-4 text-gray-700">{emp.employeeId}</td>
                        <td className="py-3 px-4 text-gray-700">{emp.lastPasswordChange || "Never"}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(emp)}
                              title="Edit employee"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setResetPasswordId(emp.id)}
                              title="Reset password"
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <Key size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(emp.id)}
                              title="Delete employee"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Reset Modal */}
        {resetPasswordId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Reset Employee Password</CardTitle>
                <CardDescription>
                  Set a new password for {employees.find((e) => e.id === resetPasswordId)?.firstName}
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleResetPassword(resetPasswordId)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Update Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResetPasswordId(null);
                      setNewPassword("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
