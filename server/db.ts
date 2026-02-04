import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import {
  adminCredentials,
  blogPosts,
  caseStudies,
  employees,
  InsertBlogPost,
  InsertEmployee,
  InsertLead,
  InsertMonthlyReport,
  InsertTimeTrackingRecord,
  InsertUser,
  leads,
  monthlyReports,
  services,
  testimonials,
  timeTrackingRecords,
  users,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const connectionString = process.env.DATABASE_URL;

      if (
        connectionString.startsWith("http://") ||
        connectionString.startsWith("https://")
      ) {
        console.error(
          "[Database] Invalid DATABASE_URL value. Use a PostgreSQL connection string, not the project URL."
        );
        return null;
      }

      _client = postgres(connectionString, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
      });
      _db = drizzle(_client, { schema });
      console.log("[Database] Connected to database");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      return null;
    }
  }
  return _db;
}

export async function closeDb() {
  if (_client) {
    await _client.end();
    _client = null;
    _db = null;
    console.log("[Database] Connection closed");
  }
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
}

export async function createUser(data: InsertUser) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(users).values(data).returning();
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.openId, openId),
  });
}

export async function upsertUser(data: InsertUser) {
  const db = await getDb();
  if (!db) return null;
  return db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.openId,
      set: {
        name: data.name,
        email: data.email,
        loginMethod: data.loginMethod,
        lastSignedIn: data.lastSignedIn,
        avatarUrl: data.avatarUrl,
      },
    })
    .returning();
}

export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(leads).values(data).returning();
}

export async function getLeadByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  return db.query.leads.findFirst({
    where: (leads, { eq }) => eq(leads.email, email),
  });
}

export async function getAllLeads() {
  const db = await getDb();
  if (!db) return null;
  return db.query.leads.findMany({
    orderBy: [desc(leads.createdAt)],
  });
}

export async function updateLeadStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return null;
  return db
    .update(leads)
    .set({ status, updatedAt: new Date() })
    .where(eq(leads.id, id))
    .returning();
}

export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return db.query.services.findMany({
    orderBy: [desc(services.featured)],
  });
}

export async function getServiceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  return db.query.services.findFirst({
    where: (services, { eq }) => eq(services.slug, slug),
  });
}

export async function getTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.query.testimonials.findMany({
    orderBy: [desc(testimonials.featured)],
  });
}

export async function getFeaturedTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.query.testimonials.findMany({
    where: (testimonials, { eq }) => eq(testimonials.featured, true),
    limit: 3,
  });
}

export async function getCaseStudies() {
  const db = await getDb();
  if (!db) return [];
  return db.query.caseStudies.findMany({
    orderBy: [desc(caseStudies.featured)],
  });
}

export async function getFeaturedCaseStudies() {
  const db = await getDb();
  if (!db) return [];
  return db.query.caseStudies.findMany({
    where: (caseStudies, { eq }) => eq(caseStudies.featured, true),
    limit: 3,
  });
}

export async function getCaseStudyBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  return db.query.caseStudies.findFirst({
    where: (caseStudies, { eq }) => eq(caseStudies.slug, slug),
  });
}

export async function getIndustryPages() {
  const db = await getDb();
  if (!db) return [];
  return db.query.industryPages.findMany();
}

export async function getIndustryPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  return db.query.industryPages.findFirst({
    where: (industryPages, { eq }) => eq(industryPages.slug, slug),
  });
}

export async function getAllEmployees() {
  const db = await getDb();
  if (!db) return [];
  return db.query.employees.findMany({
    orderBy: [desc(employees.createdAt)],
  });
}

export async function getEmployeeByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  return db.query.employees.findFirst({
    where: (employees, { eq }) => eq(employees.email, email),
  });
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.query.employees.findFirst({
    where: (employees, { eq }) => eq(employees.id, id),
  });
}

export async function createEmployee(data: InsertEmployee) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(employees).values(data).returning();
}

export async function updateEmployee(
  id: number,
  data: Partial<InsertEmployee>
) {
  const db = await getDb();
  if (!db) return null;
  return db
    .update(employees)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(employees.id, id))
    .returning();
}

export async function deleteEmployee(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(employees).where(eq(employees.id, id)).returning();
}

export async function getEmployeeTimeRecords(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.query.timeTrackingRecords.findMany({
    where: (timeTrackingRecords, { eq }) =>
      eq(timeTrackingRecords.employeeId, employeeId),
    orderBy: [desc(timeTrackingRecords.workDate)],
  });
}

export async function createTimeTrackingRecord(data: InsertTimeTrackingRecord) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(timeTrackingRecords).values(data).returning();
}

export async function updateTimeTrackingRecord(
  id: number,
  data: Partial<InsertTimeTrackingRecord>
) {
  const db = await getDb();
  if (!db) return null;
  return db
    .update(timeTrackingRecords)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(timeTrackingRecords.id, id))
    .returning();
}

export async function deleteTimeTrackingRecord(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db
    .delete(timeTrackingRecords)
    .where(eq(timeTrackingRecords.id, id))
    .returning();
}

export async function getEmployeeMonthlyReports(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.query.monthlyReports.findMany({
    where: (monthlyReports, { eq }) =>
      eq(monthlyReports.employeeId, employeeId),
    orderBy: [desc(monthlyReports.year), desc(monthlyReports.month)],
  });
}

export async function getMonthlyReport(
  employeeId: number,
  year: number,
  month: number
) {
  const db = await getDb();
  if (!db) return null;
  return db.query.monthlyReports.findFirst({
    where: (monthlyReports, { and, eq }) =>
      and(
        eq(monthlyReports.employeeId, employeeId),
        eq(monthlyReports.year, year),
        eq(monthlyReports.month, month)
      ),
  });
}

export async function createMonthlyReport(data: InsertMonthlyReport) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(monthlyReports).values(data).returning();
}

// Reporting functions that fetch directly from employees and timeTrackingRecords tables
export async function getMonthlyReportSummary(year: number, month: number) {
  const db = await getDb();
  if (!db) return [];

  // Get all employees
  const employees = await db.query.employees.findMany({
    where: (employees, { eq }) => eq(employees.isActive, true),
  });

  const results = [];
  for (const employee of employees) {
    // Get time records for this employee for the specified month
    const timeRecords = await db.query.timeTrackingRecords.findMany({
      where: (tr, { eq, and, gte, lte }) =>
        and(
          eq(tr.employeeId, employee.id),
          gte(tr.workDate, new Date(year, month - 1, 1)),
          lte(tr.workDate, new Date(year, month, 0))
        ),
    });

    if (timeRecords.length > 0) {
      const totalHours = timeRecords.reduce(
        (sum: number, tr: any) => sum + parseFloat(tr.duration) || 0,
        0
      );
      const businessDayHours = timeRecords.reduce(
        (sum: number, tr: any) => sum + parseFloat(tr.businessDayTime) || 0,
        0
      );
      const overtimeHours = timeRecords.reduce(
        (sum: number, tr: any) => sum + parseFloat(tr.overtime) || 0,
        0
      );
      const projectCount = new Set(
        timeRecords.map((tr: any) => tr.projectName).filter(Boolean)
      ).size;

      results.push({
        employeeId: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        totalHours: String(totalHours.toFixed(2)),
        businessDayHours: String(businessDayHours.toFixed(2)),
        overtimeHours: String(overtimeHours.toFixed(2)),
        projectCount,
      });
    }
  }

  return results;
}

export async function getDailyReportSummary(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];

  // Get all time records within the date range
  const timeRecords = await db.query.timeTrackingRecords.findMany({
    where: (tr, { and, gte, lte }) =>
      and(gte(tr.workDate, startDate), lte(tr.workDate, endDate)),
    orderBy: [asc(tr.workDate)],
  });

  // Group by date
  const dailyMap = new Map<string, any>();

  for (const record of timeRecords) {
    const dateKey = record.workDate.toISOString().split("T")[0];
    const existing = dailyMap.get(dateKey) || {
      date: dateKey,
      totalHours: 0,
      employeeCount: new Set<number>(),
      overtimeHours: 0,
    };

    existing.totalHours += parseFloat(record.duration) || 0;
    existing.employeeCount.add(record.employeeId);
    existing.overtimeHours += parseFloat(record.overtime) || 0;
    dailyMap.set(dateKey, existing);
  }

  return Array.from(dailyMap.values()).map((day: any) => ({
    date: day.date,
    totalHours: String(day.totalHours.toFixed(2)),
    employeeCount: day.employeeCount.size,
    overtimeHours: String(day.overtimeHours.toFixed(2)),
  }));
}

export async function getTaskTypeDistribution(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];

  // Get all time records within the date range
  const timeRecords = await db.query.timeTrackingRecords.findMany({
    where: (tr, { and, gte, lte }) =>
      and(gte(tr.workDate, startDate), lte(tr.workDate, endDate)),
  });

  // Group by task type
  const taskMap = new Map<string, number>();

  for (const record of timeRecords) {
    const taskType = record.taskType || "Other";
    const existing = taskMap.get(taskType) || 0;
    taskMap.set(taskType, existing + (parseFloat(record.duration) || 0));
  }

  return Array.from(taskMap.entries()).map(([taskType, totalHours]) => ({
    taskType,
    totalHours: String(totalHours.toFixed(2)),
  }));
}

export async function getAllEmployeesMonthlyReports(year: number) {
  const db = await getDb();
  if (!db) return [];

  // Get all employees
  const employees = await db.query.employees.findMany({
    where: (employees, { eq }) => eq(employees.isActive, true),
  });

  const results = [];
  for (const employee of employees) {
    // Get monthly summaries for this employee for the specified year
    const monthlyData = await db.query.monthlyReports.findMany({
      where: (mr, { and, eq }) =>
        and(eq(mr.employeeId, employee.id), eq(mr.year, year)),
      orderBy: [asc(mr.month)],
    });

    if (monthlyData.length > 0) {
      results.push({
        employeeId: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        department: employee.department,
        monthlyData,
      });
    }
  }

  return results;
}

export async function getAdminByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  return db.query.adminCredentials.findFirst({
    where: (adminCredentials, { eq }) => eq(adminCredentials.email, email),
  });
}

export async function updateAdminLastLogin(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db
    .update(adminCredentials)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminCredentials.id, id))
    .returning();
}

// Seed sample data for reporting
const sampleEmployees = [
  {
    email: "john.doe@solupedia.com",
    firstName: "John",
    lastName: "Doe",
    employeeId: "EMP001",
    department: "Development",
    position: "Senior Developer",
    isActive: true,
  },
  {
    email: "jane.smith@solupedia.com",
    firstName: "Jane",
    lastName: "Smith",
    employeeId: "EMP002",
    department: "Design",
    position: "UI/UX Designer",
    isActive: true,
  },
  {
    email: "bob.wilson@solupedia.com",
    firstName: "Bob",
    lastName: "Wilson",
    employeeId: "EMP003",
    department: "Marketing",
    position: "Marketing Manager",
    isActive: true,
  },
  {
    email: "alice.johnson@solupedia.com",
    firstName: "Alice",
    lastName: "Johnson",
    employeeId: "EMP004",
    department: "Development",
    position: "Full Stack Developer",
    isActive: true,
  },
  {
    email: "charlie.brown@solupedia.com",
    firstName: "Charlie",
    lastName: "Brown",
    employeeId: "EMP005",
    department: "QA",
    position: "QA Engineer",
    isActive: false,
  },
];

export async function seedSampleEmployees() {
  const db = await getDb();
  if (!db) return { inserted: 0, skipped: 0 };

  let inserted = 0;
  let skipped = 0;

  try {
    for (const employee of sampleEmployees) {
      // Check if employee with this email already exists
      const existing = await db.query.employees.findFirst({
        where: (emp, { eq }) => eq(emp.email, employee.email),
      });

      if (!existing) {
        await db.insert(employees).values(employee);
        inserted++;
      } else {
        skipped++;
      }
    }
    console.log(
      `[Database] Seeded ${inserted} employees, skipped ${skipped} existing`
    );
    return { inserted, skipped };
  } catch (error) {
    console.error("[Database] Failed to seed employees:", error);
    throw error;
  }
}

// Helper function to calculate duration and overtime
function calculateTimeMetrics(startTime: string, endTime: string) {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  let durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Handle overnight shifts
  }

  const regularMinutes = 8 * 60; // 8 hours regular time
  const overtimeMinutes = Math.max(0, durationMinutes - regularMinutes);

  return {
    duration: durationMinutes / 60,
    overtime: overtimeMinutes / 60,
  };
}

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const sampleTimeRecords = [
  {
    employeeId: 1,
    date: new Date(currentYear, currentMonth - 1, 1),
    startTime: "09:00",
    endTime: "17:30",
    project: "Project Alpha",
    task: "Development",
    notes: "",
  },
  {
    employeeId: 1,
    date: new Date(currentYear, currentMonth - 1, 2),
    startTime: "09:00",
    endTime: "18:00",
    project: "Project Alpha",
    task: "Development",
    notes: "",
  },
  {
    employeeId: 1,
    date: new Date(currentYear, currentMonth - 1, 3),
    startTime: "09:00",
    endTime: "17:00",
    project: "Project Beta",
    task: "Code Review",
    notes: "",
  },
  {
    employeeId: 1,
    date: new Date(currentYear, currentMonth - 1, 4),
    startTime: "09:00",
    endTime: "19:00",
    project: "Project Alpha",
    task: "Bug Fixes",
    notes: "Overtime",
  },
  {
    employeeId: 1,
    date: new Date(currentYear, currentMonth - 1, 5),
    startTime: "09:00",
    endTime: "17:00",
    project: "Internal",
    task: "Meeting",
    notes: "",
  },
  {
    employeeId: 2,
    date: new Date(currentYear, currentMonth - 1, 1),
    startTime: "08:30",
    endTime: "17:00",
    project: "Project Alpha",
    task: "UI Design",
    notes: "",
  },
  {
    employeeId: 2,
    date: new Date(currentYear, currentMonth - 1, 2),
    startTime: "08:30",
    endTime: "17:30",
    project: "Project Beta",
    task: "UX Research",
    notes: "",
  },
  {
    employeeId: 2,
    date: new Date(currentYear, currentMonth - 1, 3),
    startTime: "09:00",
    endTime: "18:00",
    project: "Project Alpha",
    task: "Prototyping",
    notes: "",
  },
  {
    employeeId: 2,
    date: new Date(currentYear, currentMonth - 1, 4),
    startTime: "08:30",
    endTime: "17:00",
    project: "Internal",
    task: "Design System",
    notes: "",
  },
  {
    employeeId: 2,
    date: new Date(currentYear, currentMonth - 1, 5),
    startTime: "09:00",
    endTime: "17:00",
    project: "Project Beta",
    task: "User Testing",
    notes: "",
  },
  {
    employeeId: 3,
    date: new Date(currentYear, currentMonth - 1, 1),
    startTime: "09:00",
    endTime: "17:00",
    project: "Marketing",
    task: "Campaign Planning",
    notes: "",
  },
  {
    employeeId: 3,
    date: new Date(currentYear, currentMonth - 1, 2),
    startTime: "09:00",
    endTime: "18:00",
    project: "Marketing",
    task: "Content Creation",
    notes: "",
  },
  {
    employeeId: 3,
    date: new Date(currentYear, currentMonth - 1, 3),
    startTime: "09:00",
    endTime: "17:00",
    project: "Marketing",
    task: "Social Media",
    notes: "",
  },
  {
    employeeId: 3,
    date: new Date(currentYear, currentMonth - 1, 4),
    startTime: "09:00",
    endTime: "19:00",
    project: "Marketing",
    task: "Analytics",
    notes: "Overtime",
  },
  {
    employeeId: 3,
    date: new Date(currentYear, currentMonth - 1, 5),
    startTime: "09:00",
    endTime: "17:00",
    project: "Marketing",
    task: "Email Campaign",
    notes: "",
  },
  {
    employeeId: 4,
    date: new Date(currentYear, currentMonth - 1, 1),
    startTime: "10:00",
    endTime: "18:00",
    project: "Project Beta",
    task: "Backend Dev",
    notes: "",
  },
  {
    employeeId: 4,
    date: new Date(currentYear, currentMonth - 1, 2),
    startTime: "09:00",
    endTime: "17:00",
    project: "Project Beta",
    task: "API Development",
    notes: "",
  },
  {
    employeeId: 4,
    date: new Date(currentYear, currentMonth - 1, 3),
    startTime: "09:00",
    endTime: "18:30",
    project: "Project Beta",
    task: "Integration",
    notes: "",
  },
  {
    employeeId: 4,
    date: new Date(currentYear, currentMonth - 1, 4),
    startTime: "09:00",
    endTime: "17:00",
    project: "Internal",
    task: "Documentation",
    notes: "",
  },
  {
    employeeId: 4,
    date: new Date(currentYear, currentMonth - 1, 5),
    startTime: "09:00",
    endTime: "17:00",
    project: "Project Alpha",
    task: "Testing",
    notes: "",
  },
];

export async function seedSampleTimeRecords() {
  const db = await getDb();
  if (!db) return { inserted: 0, skipped: 0 };

  let inserted = 0;
  let skipped = 0;

  try {
    // First, ensure we have employees to reference
    await seedSampleEmployees();

    // Get all employees to map IDs
    const employeesData = await db.query.employees.findMany();
    if (employeesData.length === 0) {
      console.warn(
        "[Database] No employees found, skipping time records seeding"
      );
      return { inserted: 0, skipped: 0 };
    }

    for (const record of sampleTimeRecords) {
      // Find employee by sequential ID
      const employee = employeesData.find(
        (e: any) => e.id === record.employeeId
      );
      if (!employee) continue;

      // Check if a similar record already exists
      const existing = await db.query.timeTrackingRecords.findFirst({
        where: (tr, { and, eq }) =>
          and(eq(tr.employeeId, employee.id), eq(tr.workDate, record.date)),
      });

      if (!existing) {
        const { duration, overtime } = calculateTimeMetrics(
          record.startTime,
          record.endTime
        );
        await db.insert(timeTrackingRecords).values({
          employeeId: employee.id,
          workDate: record.date,
          startTime: record.startTime,
          endTime: record.endTime,
          projectNumber: record.project,
          projectName: record.project,
          taskType: record.task,
          notes: record.notes,
          duration,
          overtime,
        });
        inserted++;
      } else {
        skipped++;
      }
    }
    console.log(
      `[Database] Seeded ${inserted} time records, skipped ${skipped} existing`
    );
    return { inserted, skipped };
  } catch (error) {
    console.error("[Database] Failed to seed time records:", error);
    throw error;
  }
}

export async function seedSampleMonthlyReports() {
  const db = await getDb();
  if (!db) return { inserted: 0, skipped: 0 };

  let inserted = 0;
  let skipped = 0;

  try {
    // First, ensure we have time records
    await seedSampleTimeRecords();

    // Get all employees
    const employeesData = await db.query.employees.findMany();
    if (employeesData.length === 0) {
      console.warn(
        "[Database] No employees found, skipping monthly reports seeding"
      );
      return { inserted: 0, skipped: 0 };
    }

    for (const employee of employeesData) {
      // Get time records for this employee for the current month
      const timeRecords = await db.query.timeTrackingRecords.findMany({
        where: (tr, { eq, and, gte, lte }) =>
          and(
            eq(tr.employeeId, employee.id),
            gte(tr.workDate, new Date(currentYear, currentMonth - 1, 1)),
            lte(tr.workDate, new Date(currentYear, currentMonth, 0))
          ),
      });

      if (timeRecords.length === 0) continue;

      // Calculate totals
      const totalHours = timeRecords.reduce(
        (sum: number, tr: any) => sum + (tr.duration || 0),
        0
      );
      const overtimeHours = timeRecords.reduce(
        (sum: number, tr: any) => sum + (tr.overtime || 0),
        0
      );
      const projects = [
        ...new Set(timeRecords.map((tr: any) => tr.projectName)),
      ];
      const billableHours = totalHours * 0.85; // Assume 85% billable

      // Check if report already exists
      const existing = await db.query.monthlyReports.findFirst({
        where: (mr, { and, eq }) =>
          and(
            eq(mr.employeeId, employee.id),
            eq(mr.year, currentYear),
            eq(mr.month, currentMonth)
          ),
      });

      if (!existing) {
        await db.insert(monthlyReports).values({
          employeeId: employee.id,
          year: currentYear,
          month: currentMonth,
          totalHours,
          overtimeHours,
          billableHours,
          projects: projects.join(", "),
          utilizationRate: (billableHours / (totalHours || 1)) * 100,
        });
        inserted++;
      } else {
        skipped++;
      }
    }
    console.log(
      `[Database] Seeded ${inserted} monthly reports, skipped ${skipped} existing`
    );
    return { inserted, skipped };
  } catch (error) {
    console.error("[Database] Failed to seed monthly reports:", error);
    throw error;
  }
}

export async function seedSampleData() {
  const empResult = await seedSampleEmployees();
  const timeResult = await seedSampleTimeRecords();
  const reportResult = await seedSampleMonthlyReports();
  return {
    employees: empResult,
    timeRecords: timeResult,
    monthlyReports: reportResult,
  };
}

// Blog Posts functions
export async function getBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.query.blogPosts.findMany({
    orderBy: [desc(blogPosts.publishedAt)],
    where: (blogPosts, { eq }) => eq(blogPosts.published, true),
  });
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.query.blogPosts.findMany({
    orderBy: [desc(blogPosts.createdAt)],
  });
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  return db.query.blogPosts.findFirst({
    where: (blogPosts, { eq }) => eq(blogPosts.slug, slug),
  });
}

export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(blogPosts).values(data).returning();
}

export async function updateBlogPost(
  id: number,
  data: Partial<InsertBlogPost>
) {
  const db = await getDb();
  if (!db) return null;
  return db
    .update(blogPosts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
}

// Get all case studies
export async function getAllCaseStudies() {
  const db = await getDb();
  if (!db) return [];
  return db.query.caseStudies.findMany({
    orderBy: [desc(caseStudies.createdAt)],
  });
}

// Create case study
export async function createCaseStudy(data: {
  title: string;
  slug: string;
  clientName: string;
  clientLogo?: string;
  industry?: string;
  serviceType: string;
  challenge?: string;
  solution?: string;
  results?: string;
  testimonial?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  imageUrl?: string;
  featured?: boolean;
}) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(caseStudies).values(data).returning();
}

// Update case study
export async function updateCaseStudy(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    clientName: string;
    clientLogo: string;
    industry: string;
    serviceType: string;
    challenge: string;
    solution: string;
    results: string;
    testimonial: string;
    testimonialAuthor: string;
    testimonialRole: string;
    imageUrl: string;
    featured: boolean;
  }>
) {
  const db = await getDb();
  if (!db) return null;
  return db
    .update(caseStudies)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(caseStudies.id, id))
    .returning();
}

// Delete case study
export async function deleteCaseStudy(id: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete case study:", error);
    throw error;
  }
}

// Seed sample case studies for testing
const sampleCaseStudiesData = [
  {
    title: "E-Learning Platform Transformation",
    slug: "elearning-platform-transformation",
    clientName: "GlobalTech Solutions",
    clientLogo: "",
    industry: "Education Technology",
    serviceType: "E-Learning Development",
    challenge:
      "Client needed to modernize their legacy e-learning platform to support mobile devices and improve engagement metrics.",
    solution:
      "We rebuilt their platform using React and Node.js, implementing responsive design and interactive learning modules.",
    results:
      "200% increase in student engagement, 40% reduction in course completion time, and 50% increase in mobile learning adoption.",
    testimonial:
      "Solupedia transformed our learning platform completely. The new system has exceeded our expectations.",
    testimonialAuthor: "Sarah Johnson",
    testimonialRole: "CEO, GlobalTech Solutions",
    imageUrl: "/Solupedia-creation-solutions.jpg",
    featured: true,
  },
  {
    title: "Multilingual Video Localization Project",
    slug: "multilingual-video-localization",
    clientName: "Entertainment Plus",
    clientLogo: "",
    industry: "Media & Entertainment",
    serviceType: "Video Localization",
    challenge:
      "Client needed to localize 50+ hours of video content into 12 languages within a tight 3-month deadline.",
    solution:
      "Our team implemented a streamlined localization workflow with AI-assisted transcription and quality assurance processes.",
    results:
      "Completed project 2 weeks early, 99.5% quality score, and client expanded localization to 20 languages.",
    testimonial:
      "The quality and speed of localization was incredible. Solupedia is now our exclusive localization partner.",
    testimonialAuthor: "Michael Chen",
    testimonialRole: "Director of International Content, Entertainment Plus",
    imageUrl: "/Solupedia-video-editing-localization.jpg",
    featured: true,
  },
  {
    title: "Corporate Documentation Overhaul",
    slug: "corporate-documentation-overhaul",
    clientName: "FinanceFirst Bank",
    clientLogo: "",
    industry: "Finance & Banking",
    serviceType: "Technical Documentation",
    challenge:
      "Client had thousands of pages of outdated documentation across multiple systems with no centralized knowledge base.",
    solution:
      "We migrated and restructured all documentation into a modern knowledge management system with search and categorization.",
    results:
      "60% reduction in support tickets, 45% faster onboarding time for new employees, and improved compliance documentation.",
    testimonial:
      "Our internal documentation is now a strategic asset. The transformation has touched every department positively.",
    testimonialAuthor: "Jennifer Martinez",
    testimonialRole: "VP of Operations, FinanceFirst Bank",
    imageUrl: "/Solupedia-document-localization.jpg",
    featured: false,
  },
  {
    title: "Interactive Training Module Development",
    slug: "interactive-training-modules",
    clientName: "HealthCare Innovations",
    clientLogo: "",
    industry: "Healthcare",
    serviceType: "Interactive Content Development",
    challenge:
      "Client needed engaging training modules for healthcare compliance that would work on all devices.",
    solution:
      "Created SCORM-compliant interactive modules with gamification elements and adaptive learning paths.",
    results:
      "95% completion rate (up from 65%), 50% increase in knowledge retention scores, and zero compliance violations post-training.",
    testimonial:
      "Our compliance training is now something employees actually look forward to. The results speak for themselves.",
    testimonialAuthor: "Dr. Robert Williams",
    testimonialRole: "Chief Medical Officer, HealthCare Innovations",
    imageUrl: "/36douFTBRlV3.jpg",
    featured: true,
  },
  {
    title: "Document Automation System",
    slug: "document-automation-system",
    clientName: "Legal Services Group",
    clientLogo: "",
    industry: "Legal Services",
    serviceType: "Document Automation",
    challenge:
      "Client was spending hundreds of hours manually preparing legal documents with high error rates.",
    solution:
      "Implemented a custom document automation system with templates, workflows, and integration to their practice management software.",
    results:
      "75% reduction in document preparation time, 90% reduction in errors, and ability to handle 3x more clients with same staff.",
    testimonial:
      "This system has revolutionized how we work. It's paid for itself many times over in the first year alone.",
    testimonialAuthor: "Amanda Thompson",
    testimonialRole: "Managing Partner, Legal Services Group",
    imageUrl: "/3tprjqqseIBH.jpeg",
    featured: false,
  },
];

export async function seedSampleCaseStudies() {
  const db = await getDb();
  if (!db) return { inserted: 0, skipped: 0 };

  let inserted = 0;
  let skipped = 0;

  try {
    for (const study of sampleCaseStudiesData) {
      // Check if a case study with this slug already exists
      const existing = await db.query.caseStudies.findFirst({
        where: (cs, { eq }) => eq(cs.slug, study.slug),
      });

      if (!existing) {
        await db.insert(caseStudies).values(study as any);
        inserted++;
      } else {
        skipped++;
      }
    }
    console.log(
      `[Database] Seeded ${inserted} case studies, skipped ${skipped} existing`
    );
    return { inserted, skipped };
  } catch (error) {
    console.error("[Database] Failed to seed case studies:", error);
    throw error;
  }
}
