import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sdk } from "./_core/sdk";
import {
  getServices,
  getServiceBySlug,
  getCaseStudies,
  getFeaturedCaseStudies,
  getCaseStudyBySlug,
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  deleteBlogPost,
  getAllBlogPosts,
  getTestimonials,
  getFeaturedTestimonials,
  createLead,
  getEmployeeByEmail,
  createEmployee,
  getAllEmployees,
  createTimeTrackingRecord,
  getEmployeeTimeRecords,
  updateTimeTrackingRecord,
  deleteTimeTrackingRecord,
  createMonthlyReport,
  getMonthlyReport,
  getEmployeeMonthlyReports,
  createAdminCredential,
  getAdminByEmail,
  updateAdminLastLogin,
} from "./db";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";

// Helper function to calculate duration and overtime
function calculateTimeMetrics(startTime: string, endTime: string) {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  let durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Handle next day
  }
  
  const duration = durationMinutes / 60;
  
  // Business hours: 9 AM to 5 PM (8 hours)
  const businessStartMinutes = 9 * 60;
  const businessEndMinutes = 17 * 60;
  
  let businessDayTime = 0;
  let overtime = 0;
  
  if (startMinutes >= businessEndMinutes || endMinutes <= businessStartMinutes) {
    // Entirely outside business hours
    overtime = duration;
  } else if (startMinutes >= businessStartMinutes && endMinutes <= businessEndMinutes) {
    // Entirely within business hours
    businessDayTime = duration;
  } else {
    // Partially within business hours
    const overlapStart = Math.max(startMinutes, businessStartMinutes);
    const overlapEnd = Math.min(endMinutes, businessEndMinutes);
    businessDayTime = (overlapEnd - overlapStart) / 60;
    overtime = duration - businessDayTime;
  }
  
  return {
    duration: Math.round(duration * 100) / 100,
    businessDayTime: Math.round(businessDayTime * 100) / 100,
    overtime: Math.round(overtime * 100) / 100,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Services router
  services: router({
    list: publicProcedure.query(() => getServices()),
    bySlug: publicProcedure
      .input(z.string())
      .query(({ input }) => getServiceBySlug(input)),
  }),

  // Case Studies router
  caseStudies: router({
    list: publicProcedure.query(() => getCaseStudies()),
    featured: publicProcedure.query(() => getFeaturedCaseStudies()),
    bySlug: publicProcedure
      .input(z.string())
      .query(({ input }) => getCaseStudyBySlug(input)),
  }),

  // Blog router
  blog: router({
    list: publicProcedure.query(() => getBlogPosts()),
    all: publicProcedure.query(() => getAllBlogPosts()),
    bySlug: publicProcedure
      .input(z.string())
      .query(({ input }) => getBlogPostBySlug(input)),
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          excerpt: z.string().optional(),
          content: z.string().min(1),
          author: z.string().optional(),
          category: z.string().optional(),
          tags: z.string().optional(),
          featuredImage: z.string().optional(),
          published: z.boolean().default(true),
          publishedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createBlogPost({
          ...input,
          publishedAt: input.publishedAt || new Date(),
        });
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return deleteBlogPost(input);
      }),
    uploadImage: publicProcedure
      .input(
        z.object({
          fileName: z.string().min(1),
          contentType: z.string().min(1),
          dataUrl: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { fileName, contentType, dataUrl } = input;
        const base64Match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
        const base64Data = base64Match ? base64Match[2] : dataUrl;
        const buffer = Buffer.from(base64Data, "base64");
        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `blog/${Date.now()}-${safeName}`;
        const { url } = await storagePut(key, buffer, contentType);
        return { key, url };
      }),
  }),

  // Testimonials router
  testimonials: router({
    list: publicProcedure.query(() => getTestimonials()),
    featured: publicProcedure.query(() => getFeaturedTestimonials()),
  }),

  // Leads router
  leads: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          company: z.string().optional(),
          serviceType: z.string().optional(),
          message: z.string().optional(),
          source: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createLead(input);
      }),
  }),

  // Employee Time Tracking router
  employee: router({
    // Employee login
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const employee = await getEmployeeByEmail(input.email);
        if (!employee) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        const passwordMatch = await bcrypt.compare(input.password, employee.password);
        if (!passwordMatch) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Create session token for employee
        const sessionToken = await sdk.createSessionToken(
          `employee:${employee.id}`,
          {
            name: `${employee.firstName} ${employee.lastName}`,
            expiresInMs: ONE_YEAR_MS,
          }
        );

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return {
          id: employee.id,
          email: employee.email,
          firstName: employee.firstName,
          lastName: employee.lastName,
          employeeId: employee.employeeId,
        };
      }),

    // Get employee profile
    profile: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        // In a real app, you'd verify the employee is accessing their own data
        const employee = await getEmployeeByEmail("");
        return employee;
      }),

    // Create time tracking record
    createTimeRecord: publicProcedure
      .input(
        z.object({
          employeeId: z.number(),
          workDate: z.date(),
          projectNumber: z.string().optional(),
          projectName: z.string().optional(),
          taskType: z.string(),
          client: z.string().optional(),
          languages: z.string().optional(),
          startTime: z.string(),
          endTime: z.string(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const metrics = calculateTimeMetrics(input.startTime, input.endTime);
        
        return createTimeTrackingRecord({
          employeeId: input.employeeId,
          workDate: input.workDate,
          projectNumber: input.projectNumber,
          projectName: input.projectName,
          taskType: input.taskType,
          client: input.client,
          languages: input.languages,
          startTime: input.startTime,
          endTime: input.endTime,
          duration: String(metrics.duration),
          businessDayTime: String(metrics.businessDayTime),
          overtime: String(metrics.overtime),
          notes: input.notes,
        });
      }),

    // Get employee time records
    getRecords: publicProcedure
      .input(
        z.object({
          employeeId: z.number(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .query(async ({ input }) => {
        return getEmployeeTimeRecords(input.employeeId, input.startDate, input.endDate);
      }),

    // Update time record
    updateRecord: publicProcedure
      .input(
        z.object({
          id: z.number(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
          projectNumber: z.string().optional(),
          projectName: z.string().optional(),
          taskType: z.string().optional(),
          client: z.string().optional(),
          languages: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, startTime, endTime, ...rest } = input;
        
        let updates: any = rest;
        
        if (startTime && endTime) {
          const metrics = calculateTimeMetrics(startTime, endTime);
          updates = {
            ...updates,
            startTime,
            endTime,
            duration: metrics.duration,
            businessDayTime: metrics.businessDayTime,
            overtime: metrics.overtime,
          };
        }
        
        return updateTimeTrackingRecord(id, updates);
      }),

    // Delete time record
    deleteRecord: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return deleteTimeTrackingRecord(input);
      }),

    // Get monthly report for employee
    getMonthlyReport: publicProcedure
      .input(
        z.object({
          employeeId: z.number(),
          year: z.number(),
          month: z.number(),
        })
      )
      .query(async ({ input }) => {
        return getMonthlyReport(input.employeeId, input.year, input.month);
      }),

    // Get all monthly reports for employee
    getYearlyReports: publicProcedure
      .input(
        z.object({
          employeeId: z.number(),
          year: z.number(),
        })
      )
      .query(async ({ input }) => {
        return getEmployeeMonthlyReports(input.employeeId, input.year);
      }),
  }),

  // Admin reporting router
  admin: router({
    // Get all employees
    getAllEmployees: publicProcedure.query(async () => {
      return getAllEmployees();
    }),

    // Get employee time records (admin view)
    getEmployeeRecords: publicProcedure
      .input(
        z.object({
          employeeId: z.number(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .query(async ({ input }) => {
        return getEmployeeTimeRecords(input.employeeId, input.startDate, input.endDate);
      }),

    // Get all employees' records for a date range
    getAllRecords: publicProcedure
      .input(
        z.object({
          startDate: z.date(),
          endDate: z.date(),
        })
      )
      .query(async ({ input }) => {
        const employees = await getAllEmployees();
        const allRecords = await Promise.all(
          employees.map(async (emp) => ({
            employee: emp,
            records: await getEmployeeTimeRecords(emp.id, input.startDate, input.endDate),
          }))
        );
        return allRecords;
      }),

    // Create monthly report
    createMonthlyReport: publicProcedure
      .input(
        z.object({
          employeeId: z.number(),
          year: z.number(),
          month: z.number(),
          totalHours: z.number(),
          businessDayHours: z.number(),
          overtimeHours: z.number(),
          projectCount: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return createMonthlyReport({
          employeeId: input.employeeId,
          year: input.year,
          month: input.month,
          totalHours: String(input.totalHours),
          businessDayHours: String(input.businessDayHours),
          overtimeHours: String(input.overtimeHours),
          projectCount: input.projectCount,
        });
      }),

    // Get monthly report
    getMonthlyReport: publicProcedure
      .input(
        z.object({
          employeeId: z.number(),
          year: z.number(),
          month: z.number(),
        })
      )
      .query(async ({ input }) => {
        return getMonthlyReport(input.employeeId, input.year, input.month);
      }),

    // Get all monthly reports for employee
    getEmployeeReports: publicProcedure
      .input(
        z.object({
          employeeId: z.number(),
          year: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        return getEmployeeMonthlyReports(input.employeeId, input.year);
      }),
  }),

  // Admin authentication router
  adminAuth: router({
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const admin = await getAdminByEmail(input.email);
        
        if (!admin || !admin.isActive) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        const passwordMatch = await bcrypt.compare(input.password, admin.passwordHash);
        
        if (!passwordMatch) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Update last login
        await updateAdminLastLogin(admin.id);

        // Create session token for admin
        const sessionToken = await sdk.createSessionToken(
          `admin:${admin.id}`,
          {
            name: admin.email,
            expiresInMs: ONE_YEAR_MS,
          }
        );

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return {
          success: true,
          admin: {
            id: admin.id,
            email: admin.email,
          },
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

