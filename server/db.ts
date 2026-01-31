import { eq, and, gte, lte, desc } from "drizzle-orm";
import { services, caseStudies, blogPosts, testimonials, leads, industryPages, InsertLead, employees, timeTrackingRecords, monthlyReports, InsertEmployee, InsertTimeTrackingRecord, InsertMonthlyReport, adminCredentials, InsertAdminCredential, InsertBlogPost } from "../drizzle/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const connectionString = process.env.DATABASE_URL;
      
      if (connectionString.startsWith('http://') || connectionString.startsWith('https://')) {
        console.error("[Database] Invalid DATABASE_URL value. Use a PostgreSQL connection string, not the project URL.");
        console.error("[Database] Expected format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres");
        console.error("[Database] Tip: run `pnpm run db:get-connection` then update .env");
        return null;
      }

      // Validate connection string format for Supabase
      if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
        console.error("[Database] Invalid DATABASE_URL format. Expected postgresql:// or postgres://");
        console.error("[Database] For Supabase, use: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres");
        return null;
      }

      // Create postgres client with SSL for Supabase
      const isSupabase = connectionString.includes('supabase.co') || connectionString.includes('pooler.supabase.com');
      _client = postgres(connectionString, { 
        max: 1,
        ssl: isSupabase ? 'require' : false,
        connection: {
          application_name: 'solupedia-dashboard'
        },
        connect_timeout: 10
      });
      
      // Test connection
      await _client`SELECT 1`;
      console.log("[Database] Successfully connected to database");
      
      _db = drizzle(_client);
    } catch (error: any) {
      console.error("[Database] Failed to connect:", error?.message || error);
      
      // Provide helpful error messages
      if (error?.message?.includes('ENOTFOUND') || error?.code === 'ENOTFOUND') {
        console.error("[Database] ❌ DNS Error: Cannot resolve hostname");
        console.error("[Database] 💡 This usually means:");
        console.error("[Database]   1. The Supabase project might be paused or deleted");
        console.error("[Database]   2. The connection string hostname is incorrect");
        console.error("[Database]   3. Check your Supabase dashboard: https://supabase.com/dashboard");
        console.error("[Database]   4. Get a fresh connection string from: Settings → Database");
      } else if (error?.message?.includes('password') || error?.message?.includes('authentication')) {
        console.error("[Database] ❌ Authentication Error: Invalid password");
        console.error("[Database] 💡 Check your database password in the connection string");
      } else if (error?.message?.includes('SSL')) {
        console.error("[Database] ❌ SSL Error: Connection requires SSL");
        console.error("[Database] 💡 SSL should be enabled automatically for Supabase");
      }
      
      console.error("[Database] Connection string (first 30 chars):", process.env.DATABASE_URL?.substring(0, 30) + "...");
      _db = null;
      _client = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Services queries
export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(services.order);
}

export async function getServiceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Case Studies queries
export async function getCaseStudies(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  if (limit) {
    return db.select().from(caseStudies).orderBy(caseStudies.order).limit(limit);
  }
  return db.select().from(caseStudies).orderBy(caseStudies.order);
}

export async function getFeaturedCaseStudies(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseStudies).where(eq(caseStudies.featured, true)).orderBy(caseStudies.order).limit(limit);
}

export async function getCaseStudyBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Blog Posts queries
export async function getBlogPosts(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    if (limit) {
      return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt)).limit(limit);
    }
    return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt));
  } catch (error) {
    console.error("[Database] Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create blog post: database not available");
    throw new Error("Database not available");
  }
  try {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete blog post: database not available");
    throw new Error("Database not available");
  }
  try {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to delete blog post:", error);
    throw error;
  }
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
}

// Testimonials queries
export async function getTestimonials(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  if (limit) {
    return db.select().from(testimonials).orderBy(testimonials.order).limit(limit);
  }
  return db.select().from(testimonials).orderBy(testimonials.order);
}

export async function getFeaturedTestimonials(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.featured, true)).orderBy(testimonials.order).limit(limit);
}

// Leads queries
export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(leads).values(lead);
  return result;
}

// Industry Pages queries
export async function getIndustryPages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(industryPages);
}

export async function getIndustryPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(industryPages).where(eq(industryPages.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Employee queries
export async function getEmployeeByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEmployee(employee: InsertEmployee) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(employees).values(employee);
  return result;
}

export async function getAllEmployees() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(employees).where(eq(employees.isActive, true));
}

// Time Tracking queries
export async function createTimeTrackingRecord(record: InsertTimeTrackingRecord) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create time tracking record: database not available");
    throw new Error("Database not available");
  }
  try {
    const result = await db.insert(timeTrackingRecords).values(record).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create time tracking record:", error);
    throw error;
  }
}

export async function getEmployeeTimeRecords(employeeId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  try {
    if (startDate && endDate) {
      return await db.select().from(timeTrackingRecords).where(
        and(
          eq(timeTrackingRecords.employeeId, employeeId),
          gte(timeTrackingRecords.workDate, startDate),
          lte(timeTrackingRecords.workDate, endDate)
        )
      ).orderBy(desc(timeTrackingRecords.workDate));
    }
    
    return await db.select().from(timeTrackingRecords).where(eq(timeTrackingRecords.employeeId, employeeId)).orderBy(desc(timeTrackingRecords.workDate));
  } catch (error) {
    console.error("[Database] Error fetching employee time records:", error);
    return [];
  }
}

export async function updateTimeTrackingRecord(id: number, updates: Partial<InsertTimeTrackingRecord>) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.update(timeTrackingRecords).set(updates).where(eq(timeTrackingRecords.id, id));
  return result;
}

export async function deleteTimeTrackingRecord(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.delete(timeTrackingRecords).where(eq(timeTrackingRecords.id, id));
  return result;
}

// Monthly Report queries
export async function createMonthlyReport(report: InsertMonthlyReport) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(monthlyReports).values(report);
  return result;
}

export async function getMonthlyReport(employeeId: number, year: number, month: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(monthlyReports).where(
    and(
      eq(monthlyReports.employeeId, employeeId),
      eq(monthlyReports.year, year),
      eq(monthlyReports.month, month)
    )
  ).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeeMonthlyReports(employeeId: number, year?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (year) {
    return db.select().from(monthlyReports).where(
      and(
        eq(monthlyReports.employeeId, employeeId),
        eq(monthlyReports.year, year)
      )
    ).orderBy(monthlyReports.month);
  }
  
  return db.select().from(monthlyReports).where(eq(monthlyReports.employeeId, employeeId)).orderBy(monthlyReports.year, monthlyReports.month);
}

// Admin Credentials helpers
export async function createAdminCredential(email: string, passwordHash: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create admin credential: database not available");
    return;
  }

  try {
    await db.insert(adminCredentials).values({
      email,
      passwordHash,
      isActive: true,
    });
  } catch (error) {
    console.error("[Database] Failed to create admin credential:", error);
    throw error;
  }
}

export async function getAdminByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get admin: database not available");
    return undefined;
  }

  const result = await db.select().from(adminCredentials).where(eq(adminCredentials.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAdminLastLogin(adminId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update admin last login: database not available");
    return;
  }

  try {
    await db.update(adminCredentials).set({
      lastLoginAt: new Date(),
    }).where(eq(adminCredentials.id, adminId));
  } catch (error) {
    console.error("[Database] Failed to update admin last login:", error);
  }
}
