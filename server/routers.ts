import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  createBlogPost,
  createCaseStudy,
  createEmployee,
  createLead,
  createMonthlyReport,
  createTimeTrackingRecord,
  deleteBlogPost,
  deleteCaseStudy,
  deleteEmployee,
  deleteTimeTrackingRecord,
  getAdminByEmail,
  getAllBlogPosts,
  getAllCaseStudies,
  getAllEmployees,
  getAllEmployeesMonthlyReports,
  getBlogPostBySlug,
  getBlogPosts,
  getCaseStudies,
  getCaseStudyBySlug,
  getDailyReportSummary,
  getEmployeeByEmail,
  getEmployeeById,
  getEmployeeMonthlyReports,
  getEmployeeTimeRecords,
  getFeaturedCaseStudies,
  getFeaturedTestimonials,
  getLeadByEmail,
  getMonthlyReport,
  getMonthlyReportSummary,
  getServiceBySlug,
  getServices,
  getTaskTypeDistribution,
  getTestimonials,
  seedSampleCaseStudies,
  updateAdminLastLogin,
  updateBlogPost,
  updateCaseStudy,
  updateEmployee,
  updateTimeTrackingRecord,
} from "./db";
import {
  LeadEmailData,
  sendAutoReply,
  sendLeadMagnetEmail,
  sendLeadNotification,
  sendNewsletterConfirmation,
} from "./email";
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

  if (
    startMinutes >= businessEndMinutes ||
    endMinutes <= businessStartMinutes
  ) {
    // Entirely outside business hours
    overtime = duration;
  } else if (
    startMinutes >= businessStartMinutes &&
    endMinutes <= businessEndMinutes
  ) {
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
    all: publicProcedure.query(() => getAllCaseStudies()),
    featured: publicProcedure.query(() => getFeaturedCaseStudies()),
    bySlug: publicProcedure
      .input(z.string())
      .query(({ input }) => getCaseStudyBySlug(input)),
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          clientName: z.string().min(1),
          clientLogo: z.string().optional(),
          industry: z.string().optional(),
          serviceType: z.string().min(1),
          challenge: z.string().optional(),
          solution: z.string().optional(),
          results: z.string().optional(),
          testimonial: z.string().optional(),
          testimonialAuthor: z.string().optional(),
          testimonialRole: z.string().optional(),
          imageUrl: z.string().optional(),
          featured: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        return createCaseStudy(input);
      }),
    delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
      return deleteCaseStudy(input);
    }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          clientName: z.string().min(1).optional(),
          clientLogo: z.string().optional(),
          industry: z.string().optional(),
          serviceType: z.string().min(1).optional(),
          challenge: z.string().optional(),
          solution: z.string().optional(),
          results: z.string().optional(),
          testimonial: z.string().optional(),
          testimonialAuthor: z.string().optional(),
          testimonialRole: z.string().optional(),
          imageUrl: z.string().optional(),
          featured: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...rest } = input;
        return updateCaseStudy(id, rest);
      }),
    seed: publicProcedure.mutation(async () => {
      return seedSampleCaseStudies();
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
        const key = `case-studies/${Date.now()}-${safeName}`;
        const { url } = await storagePut(key, buffer, contentType);
        return { key, url };
      }),
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
    delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
      return deleteBlogPost(input);
    }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          excerpt: z.string().optional(),
          content: z.string().min(1).optional(),
          author: z.string().optional(),
          category: z.string().optional(),
          tags: z.string().optional(),
          featuredImage: z.string().optional(),
          published: z.boolean().optional(),
          publishedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...rest } = input;
        return updateBlogPost(id, rest);
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
        // Create the lead in the database
        const lead = await createLead(input);

        const emailData: LeadEmailData = {
          name: input.name,
          email: input.email,
          phone: input.phone || "",
          company: input.company || "",
          serviceType: input.serviceType || "",
          message: input.message || "",
        };

        // Handle different lead sources
        if (input.source === "lead_magnet") {
          // Send lead magnet email with guide
          await sendLeadMagnetEmail({
            name: input.name,
            email: input.email,
            company: input.company || "",
          });
        } else {
          // Send notification email to info@solupedia.com
          await sendLeadNotification(emailData);

          // Send auto-reply to the customer
          await sendAutoReply(emailData);
        }

        return lead;
      }),
    subscribeNewsletter: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
        })
      )
      .mutation(async ({ input }) => {
        // Check if email already exists as a lead
        const existingLead = await getLeadByEmail(input.email);

        if (existingLead) {
          // Update existing lead to be subscribed to newsletter
          await createLead({
            email: input.email,
            name: existingLead.name || "Newsletter Subscriber",
            source: "newsletter",
          });
        } else {
          // Create new lead for newsletter subscriber
          await createLead({
            email: input.email,
            name: "Newsletter Subscriber",
            source: "newsletter",
          });
        }

        // Send newsletter confirmation email
        await sendNewsletterConfirmation(input.email);

        return { success: true };
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

        // Check if employee is active
        if (!employee.isActive) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "Your account has been deactivated. Please contact an administrator.",
          });
        }

        const passwordMatch = await bcrypt.compare(
          input.password,
          employee.password
        );
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
    profile: publicProcedure.input(z.number()).query(async ({ input }) => {
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
        return getEmployeeTimeRecords(input.employeeId);
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
        return getEmployeeMonthlyReports(input.employeeId);
      }),
  }),

  // Admin reporting router
  admin: router({
    // Get all employees
    getAllEmployees: publicProcedure.query(async () => {
      return getAllEmployees();
    }),

    // Get employee by ID
    getEmployee: publicProcedure.input(z.number()).query(async ({ input }) => {
      return getEmployeeById(input);
    }),

    // Create new employee
    createEmployee: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          employeeId: z.string().min(1),
          department: z.string().optional(),
          position: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Check if employee already exists
        const existing = await getEmployeeByEmail(input.email);
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Employee with this email already exists",
          });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(input.password, 10);

        return createEmployee({
          email: input.email,
          password: passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          employeeId: input.employeeId,
          department: input.department,
          position: input.position,
          isActive: true,
        });
      }),

    // Update employee
    updateEmployee: publicProcedure
      .input(
        z.object({
          id: z.number(),
          email: z.string().email().optional(),
          password: z.string().min(6).optional(),
          firstName: z.string().min(1).optional(),
          lastName: z.string().min(1).optional(),
          employeeId: z.string().min(1).optional(),
          department: z.string().optional(),
          position: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, password, ...rest } = input;

        const updates: any = { ...rest };

        // Hash password if provided
        if (password) {
          updates.password = await bcrypt.hash(password, 10);
        }

        return updateEmployee(id, updates);
      }),

    // Delete employee (soft delete)
    deleteEmployee: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return deleteEmployee(input);
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
        return getEmployeeTimeRecords(
          input.employeeId,
          input.startDate,
          input.endDate
        );
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
          employees.map(async emp => ({
            employee: emp,
            records: await getEmployeeTimeRecords(
              emp.id,
              input.startDate,
              input.endDate
            ),
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

    // Get monthly report summary for all employees
    getMonthlyReportSummary: publicProcedure
      .input(
        z.object({
          year: z.number(),
          month: z.number(),
        })
      )
      .query(async ({ input }) => {
        return getMonthlyReportSummary(input.year, input.month);
      }),

    // Get daily report summary for a date range
    getDailyReportSummary: publicProcedure
      .input(
        z.object({
          startDate: z.date(),
          endDate: z.date(),
        })
      )
      .query(async ({ input }) => {
        return getDailyReportSummary(input.startDate, input.endDate);
      }),

    // Get task type distribution
    getTaskTypeDistribution: publicProcedure
      .input(
        z.object({
          startDate: z.date(),
          endDate: z.date(),
        })
      )
      .query(async ({ input }) => {
        return getTaskTypeDistribution(input.startDate, input.endDate);
      }),

    // Get all employees' monthly reports for a year
    getAllEmployeesMonthlyReports: publicProcedure
      .input(
        z.object({
          year: z.number(),
        })
      )
      .query(async ({ input }) => {
        return getAllEmployeesMonthlyReports(input.year);
      }),

    // Seed sample data for reporting (for testing)
    seedSampleReports: publicProcedure
      .input(
        z.object({
          year: z.number(),
          month: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        // Get all employees
        const employeesList = await getAllEmployees();

        if (employeesList.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No employees found. Please create employees first.",
          });
        }

        const results = [];

        for (const emp of employeesList) {
          // Check if report already exists
          const existing = await getMonthlyReport(
            emp.id,
            input.year,
            input.month
          );
          if (existing) {
            results.push({ employeeId: emp.id, status: "already_exists" });
            continue;
          }

          // Generate random data for the month
          const totalHours = 150 + Math.floor(Math.random() * 40); // 150-190 hours
          const businessDayHours =
            totalHours -
            (Math.random() < 0.7 ? 5 + Math.floor(Math.random() * 15) : 0);
          const overtimeHours = totalHours - businessDayHours;
          const projectCount = 8 + Math.floor(Math.random() * 10);

          await createMonthlyReport({
            employeeId: emp.id,
            year: input.year,
            month: input.month,
            totalHours: String(totalHours),
            businessDayHours: String(businessDayHours),
            overtimeHours: String(overtimeHours),
            projectCount,
          });

          results.push({ employeeId: emp.id, status: "created" });
        }

        return results;
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

        const passwordMatch = await bcrypt.compare(
          input.password,
          admin.passwordHash
        );

        if (!passwordMatch) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Update last login
        await updateAdminLastLogin(admin.id);

        // Create session token for admin
        const sessionToken = await sdk.createSessionToken(`admin:${admin.id}`, {
          name: admin.email,
          expiresInMs: ONE_YEAR_MS,
        });

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
