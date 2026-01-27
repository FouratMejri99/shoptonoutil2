import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { Plus, Clock, LogOut, Calendar, Briefcase, Users } from "lucide-react";

interface TimeRecord {
  id: number;
  workDate: string;
  projectNumber?: string;
  projectName?: string;
  taskType: string;
  client?: string;
  languages?: string;
  startTime: string;
  endTime: string;
  duration: number;
  businessDayTime: number;
  overtime: number;
}

export default function EmployeeDashboard() {
  const [, setLocation] = useLocation();
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [formData, setFormData] = useState({
    projectNumber: "",
    projectName: "",
    taskType: "translation",
    client: "",
    languages: "",
    startTime: "09:00",
    endTime: "17:00",
    notes: "",
  });

  // Check employee session on mount
  useEffect(() => {
    const employeeSession = localStorage.getItem("employeeSession");
    if (!employeeSession) {
      setLocation("/employee/login");
      return;
    }
    
    // Verify session is still valid (check if expired)
    try {
      const session = JSON.parse(employeeSession);
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      // Session expires after 24 hours
      if (hoursSinceLogin > 24) {
        localStorage.removeItem("employeeSession");
        setLocation("/employee/login");
      }
    } catch (error) {
      localStorage.removeItem("employeeSession");
      setLocation("/employee/login");
    }
  }, [setLocation]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate duration and overtime
    const [startHour, startMin] = formData.startTime.split(":").map(Number);
    const [endHour, endMin] = formData.endTime.split(":").map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    let durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }
    
    const duration = Math.round((durationMinutes / 60) * 100) / 100;
    
    // Business hours: 9 AM to 5 PM
    const businessStartMinutes = 9 * 60;
    const businessEndMinutes = 17 * 60;
    
    let businessDayTime = 0;
    let overtime = 0;
    
    if (startMinutes >= businessEndMinutes || endMinutes <= businessStartMinutes) {
      overtime = duration;
    } else if (startMinutes >= businessStartMinutes && endMinutes <= businessEndMinutes) {
      businessDayTime = duration;
    } else {
      const overlapStart = Math.max(startMinutes, businessStartMinutes);
      const overlapEnd = Math.min(endMinutes, businessEndMinutes);
      businessDayTime = Math.round(((overlapEnd - overlapStart) / 60) * 100) / 100;
      overtime = Math.round((duration - businessDayTime) * 100) / 100;
    }
    
    const newRecord: TimeRecord = {
      id: Date.now(),
      workDate: selectedDate,
      projectNumber: formData.projectNumber,
      projectName: formData.projectName,
      taskType: formData.taskType,
      client: formData.client,
      languages: formData.languages,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      businessDayTime,
      overtime,
    };
    
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      projectNumber: "",
      projectName: "",
      taskType: "translation",
      client: "",
      languages: "",
      startTime: "09:00",
      endTime: "17:00",
      notes: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("employeeSession");
    setLocation("/employee/login");
    localStorage.removeItem("employeeEmail");
    window.location.href = "/employee/login";
  };

  const totalHours = records.reduce((sum, r) => sum + r.duration, 0);
  const totalBusinessHours = records.reduce((sum, r) => sum + r.businessDayTime, 0);
  const totalOvertime = records.reduce((sum, r) => sum + r.overtime, 0);
  
  // Calculate additional statistics
  const uniqueDays = new Set(records.map(r => r.workDate)).size;
  const uniqueProjects = new Set(records.filter(r => r.projectName).map(r => r.projectName)).size;
  const averageHoursPerDay = uniqueDays > 0 ? (totalHours / uniqueDays).toFixed(2) : "0.00";
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthRecords = records.filter(r => {
    const recordDate = new Date(r.workDate);
    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
  });
  const thisMonthHours = thisMonthRecords.reduce((sum, r) => sum + r.duration, 0);

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
                <h1 className="font-bold text-gray-900">Time Tracking</h1>
                <p className="text-xs text-gray-600">Employee Portal</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalHours.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">All tracked hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalBusinessHours.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">9 AM - 5 PM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overtime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{totalOvertime.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">Outside business hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{thisMonthHours.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">Hours this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Days Worked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700">{uniqueDays}</div>
              <p className="text-xs text-gray-500 mt-1">Unique days tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700">{uniqueProjects}</div>
              <p className="text-xs text-gray-500 mt-1">Different projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Hours/Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700">{averageHoursPerDay}</div>
              <p className="text-xs text-gray-500 mt-1">Average per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Record Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            Add Time Entry
          </Button>
        </div>

        {/* Add Record Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add Time Entry</CardTitle>
              <CardDescription>Record your work time for a project</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddRecord} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workDate">Work Date</Label>
                    <Input
                      id="workDate"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskType">Task Type</Label>
                    <select
                      id="taskType"
                      value={formData.taskType}
                      onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="translation">Translation</option>
                      <option value="review">Review</option>
                      <option value="qa">QA</option>
                      <option value="desktop_publishing">Desktop Publishing</option>
                      <option value="voiceover">Voice Over</option>
                      <option value="subtitle">Subtitle</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectNumber">Project Number</Label>
                    <Input
                      id="projectNumber"
                      placeholder="e.g., PROJ-2024-001"
                      value={formData.projectNumber}
                      onChange={(e) => setFormData({ ...formData, projectNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      placeholder="e.g., Website Localization"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      placeholder="e.g., Acme Corp"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages</Label>
                    <Input
                      id="languages"
                      placeholder="e.g., English, Spanish, French"
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    placeholder="Add any additional notes about this time entry"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Save Entry
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Records List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Time Entries</h2>
          {records.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No time entries yet. Add your first entry above.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <Card key={record.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold">{record.workDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-semibold">{record.startTime} - {record.endTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Task</p>
                        <p className="font-semibold capitalize">{record.taskType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold text-blue-600">{record.duration}h</p>
                      </div>
                      {record.projectName && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Project</p>
                          <p className="font-semibold">{record.projectName}</p>
                        </div>
                      )}
                      {record.client && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Client</p>
                          <p className="font-semibold">{record.client}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Business Hours</p>
                        <p className="font-semibold text-green-600">{record.businessDayTime}h</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Overtime</p>
                        <p className="font-semibold text-orange-600">{record.overtime}h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
