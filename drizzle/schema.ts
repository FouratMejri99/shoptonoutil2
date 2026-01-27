import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, numeric, serial } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
// Enum for user role
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("shortDescription"),
  icon: varchar("icon", { length: 255 }),
  category: varchar("category", { length: 100 }).notNull(), // 'creation', 'document', 'elearning', 'video'
  order: integer("order").default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// Case Studies table
export const caseStudies = pgTable("caseStudies", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientLogo: varchar("clientLogo", { length: 500 }),
  industry: varchar("industry", { length: 100 }),
  serviceType: varchar("serviceType", { length: 100 }).notNull(),
  challenge: text("challenge"),
  solution: text("solution"),
  results: text("results"),
  testimonial: text("testimonial"),
  testimonialAuthor: varchar("testimonialAuthor", { length: 255 }),
  testimonialRole: varchar("testimonialRole", { length: 255 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  featured: boolean("featured").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = typeof caseStudies.$inferInsert;

// Blog Posts table
export const blogPosts = pgTable("blogPosts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }),
  category: varchar("category", { length: 100 }),
  tags: varchar("tags", { length: 500 }),
  featuredImage: varchar("featuredImage", { length: 500 }),
  published: boolean("published").default(true),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientRole: varchar("clientRole", { length: 255 }),
  clientCompany: varchar("clientCompany", { length: 255 }),
  clientLogo: varchar("clientLogo", { length: 500 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  featured: boolean("featured").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Enum for lead status
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "qualified", "converted", "lost"]);

// Leads table
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  serviceType: varchar("serviceType", { length: 100 }),
  message: text("message"),
  source: varchar("source", { length: 100 }), // 'contact_form', 'lead_magnet', 'appointment'
  status: leadStatusEnum("status").default("new"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// Enum for appointment status
export const appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "completed", "cancelled"]);

// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  serviceType: varchar("serviceType", { length: 100 }).notNull(),
  preferredDate: timestamp("preferredDate", { mode: "date" }),
  preferredTime: varchar("preferredTime", { length: 20 }),
  message: text("message"),
  status: appointmentStatusEnum("status").default("pending"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// Industry Pages table
export const industryPages = pgTable("industryPages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  challenges: text("challenges"),
  solutions: text("solutions"),
  caseStudies: text("caseStudies"), // JSON array of case study IDs
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type IndustryPage = typeof industryPages.$inferSelect;
export type InsertIndustryPage = typeof industryPages.$inferInsert;
// Employees table for time tracking system
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  employeeId: varchar("employeeId", { length: 50 }).notNull().unique(),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

// Time Tracking Records table
export const timeTrackingRecords = pgTable("timeTrackingRecords", {
  id: serial("id").primaryKey(),
  employeeId: integer("employeeId").notNull(),
  workDate: timestamp("workDate", { mode: "date" }).notNull(),
  projectNumber: varchar("projectNumber", { length: 100 }),
  projectName: varchar("projectName", { length: 255 }),
  taskType: varchar("taskType", { length: 100 }).notNull(),
  client: varchar("client", { length: 255 }),
  languages: varchar("languages", { length: 500 }),
  startTime: varchar("startTime", { length: 10 }).notNull(),
  endTime: varchar("endTime", { length: 10 }).notNull(),
  duration: numeric("duration", { precision: 5, scale: 2 }),
  businessDayTime: numeric("businessDayTime", { precision: 5, scale: 2 }),
  overtime: numeric("overtime", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type TimeTrackingRecord = typeof timeTrackingRecords.$inferSelect;
export type InsertTimeTrackingRecord = typeof timeTrackingRecords.$inferInsert;

// Monthly Report Summary table
export const monthlyReports = pgTable("monthlyReports", {
  id: serial("id").primaryKey(),
  employeeId: integer("employeeId").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  totalHours: numeric("totalHours", { precision: 7, scale: 2 }),
  businessDayHours: numeric("businessDayHours", { precision: 7, scale: 2 }),
  overtimeHours: numeric("overtimeHours", { precision: 7, scale: 2 }),
  projectCount: integer("projectCount"),
  generatedAt: timestamp("generatedAt", { mode: "date" }).defaultNow(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type MonthlyReport = typeof monthlyReports.$inferSelect;
export type InsertMonthlyReport = typeof monthlyReports.$inferInsert;

// Admin Credentials table
export const adminCredentials = pgTable("adminCredentials", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  isActive: boolean("isActive").default(true),
  lastLoginAt: timestamp("lastLoginAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type AdminCredential = typeof adminCredentials.$inferSelect;
export type InsertAdminCredential = typeof adminCredentials.$inferInsert;
