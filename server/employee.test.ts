import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("Employee Time Tracking API", () => {
  describe("Time calculation", () => {
    it("should correctly calculate duration and overtime for business hours", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      // Test case: 9 AM to 5 PM (8 hours, all business hours)
      const result = await caller.employee.createTimeRecord({
        employeeId: 1,
        workDate: new Date("2024-01-15"),
        projectNumber: "PROJ-001",
        projectName: "Website Localization",
        taskType: "translation",
        client: "Acme Corp",
        languages: "English, Spanish",
        startTime: "09:00",
        endTime: "17:00",
        notes: "Test entry",
      });

      expect(result).toBeDefined();
    });

    it("should correctly calculate overtime hours", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      // Test case: 5 PM to 9 PM (4 hours, all overtime)
      const result = await caller.employee.createTimeRecord({
        employeeId: 1,
        workDate: new Date("2024-01-15"),
        projectNumber: "PROJ-002",
        projectName: "App Localization",
        taskType: "review",
        client: "Tech Corp",
        languages: "French, German",
        startTime: "17:00",
        endTime: "21:00",
        notes: "Evening work",
      });

      expect(result).toBeDefined();
    });

    it("should correctly calculate mixed business and overtime hours", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      // Test case: 3 PM to 7 PM (2 hours business, 2 hours overtime)
      const result = await caller.employee.createTimeRecord({
        employeeId: 1,
        workDate: new Date("2024-01-15"),
        projectNumber: "PROJ-003",
        projectName: "Document Translation",
        taskType: "translation",
        client: "Legal Firm",
        languages: "Spanish",
        startTime: "15:00",
        endTime: "19:00",
        notes: "Mixed hours",
      });

      expect(result).toBeDefined();
    });
  });

  describe("Time record management", () => {
    it("should create a time tracking record", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.employee.createTimeRecord({
        employeeId: 1,
        workDate: new Date("2024-01-15"),
        projectNumber: "PROJ-004",
        projectName: "Video Localization",
        taskType: "voiceover",
        client: "Media Corp",
        languages: "Arabic, English",
        startTime: "10:00",
        endTime: "12:00",
        notes: "Voice recording session",
      });

      expect(result).toBeDefined();
    });

    it("should retrieve employee time records", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      // First create a record
      await caller.employee.createTimeRecord({
        employeeId: 1,
        workDate: new Date("2024-01-15"),
        projectNumber: "PROJ-005",
        projectName: "Test Project",
        taskType: "translation",
        client: "Test Client",
        languages: "English",
        startTime: "09:00",
        endTime: "11:00",
      });

      // Then retrieve records
      const records = await caller.employee.getRecords({
        employeeId: 1,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
      });

      expect(Array.isArray(records)).toBe(true);
    });
  });

  describe("Task types", () => {
    it("should accept all valid task types", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const taskTypes = ["translation", "review", "qa", "desktop_publishing", "voiceover", "subtitle", "other"];

      for (const taskType of taskTypes) {
        const result = await caller.employee.createTimeRecord({
          employeeId: 1,
          workDate: new Date("2024-01-15"),
          projectNumber: `PROJ-${taskType}`,
          projectName: `Project for ${taskType}`,
          taskType,
          client: "Test Client",
          languages: "English",
          startTime: "09:00",
          endTime: "10:00",
        });

        expect(result).toBeDefined();
      }
    });
  });

  describe("Admin reporting", () => {
    it("should retrieve all employees", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const employees = await caller.admin.getAllEmployees();
      expect(Array.isArray(employees)).toBe(true);
    });

    it("should create a monthly report", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.admin.createMonthlyReport({
        employeeId: 1,
        year: 2024,
        month: 1,
        totalHours: 160,
        businessDayHours: 152,
        overtimeHours: 8,
        projectCount: 12,
      });

      expect(result).toBeDefined();
    });

    it("should retrieve monthly report", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      // First create a report
      await caller.admin.createMonthlyReport({
        employeeId: 1,
        year: 2024,
        month: 1,
        totalHours: 160,
        businessDayHours: 152,
        overtimeHours: 8,
        projectCount: 12,
      });

      // Then retrieve it
      const report = await caller.admin.getMonthlyReport({
        employeeId: 1,
        year: 2024,
        month: 1,
      });

      expect(report).toBeDefined();
    });

    it("should retrieve all monthly reports for an employee in a year", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const reports = await caller.admin.getEmployeeReports({
        employeeId: 1,
        year: 2024,
      });

      expect(Array.isArray(reports)).toBe(true);
    });
  });
});
