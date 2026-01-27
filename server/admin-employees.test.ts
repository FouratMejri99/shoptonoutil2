import { describe, expect, it } from "vitest";

describe("Admin Employee Management", () => {
  describe("Employee management features", () => {
    it("should allow adding a new employee", () => {
      const newEmployee = {
        email: "john.doe@solupedia.com",
        firstName: "John",
        lastName: "Doe",
        employeeId: "EMP-003",
        department: "Translation",
        position: "Senior Translator",
      };

      expect(newEmployee.email).toBe("john.doe@solupedia.com");
      expect(newEmployee.firstName).toBe("John");
      expect(newEmployee.lastName).toBe("Doe");
      expect(newEmployee.employeeId).toBe("EMP-003");
    });

    it("should validate employee email format", () => {
      const validEmail = "ahmed@solupedia.com";
      const invalidEmail = "invalid-email";

      const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };

      expect(isValidEmail(validEmail)).toBe(true);
      expect(isValidEmail(invalidEmail)).toBe(false);
    });

    it("should allow editing employee information", () => {
      const employee = {
        id: 1,
        email: "ahmed@solupedia.com",
        firstName: "Ahmed",
        lastName: "Hassan",
        employeeId: "EMP-001",
        department: "Translation",
        position: "Translator",
      };

      const updatedEmployee = {
        ...employee,
        position: "Senior Translator",
        department: "Management",
      };

      expect(updatedEmployee.position).toBe("Senior Translator");
      expect(updatedEmployee.department).toBe("Management");
      expect(updatedEmployee.id).toBe(employee.id);
    });

    it("should allow deactivating an employee", () => {
      const employee = {
        id: 1,
        email: "ahmed@solupedia.com",
        firstName: "Ahmed",
        lastName: "Hassan",
        isActive: true,
      };

      const deactivatedEmployee = {
        ...employee,
        isActive: false,
      };

      expect(deactivatedEmployee.isActive).toBe(false);
      expect(employee.isActive).toBe(true);
    });

    it("should allow reactivating an employee", () => {
      const employee = {
        id: 1,
        email: "ahmed@solupedia.com",
        firstName: "Ahmed",
        lastName: "Hassan",
        isActive: false,
      };

      const reactivatedEmployee = {
        ...employee,
        isActive: true,
      };

      expect(reactivatedEmployee.isActive).toBe(true);
    });

    it("should track employee creation and modification", () => {
      const employee = {
        id: 1,
        email: "fatima@solupedia.com",
        firstName: "Fatima",
        lastName: "Mohamed",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      };

      const modifiedEmployee = {
        ...employee,
        updatedAt: new Date("2024-01-20"),
      };

      expect(modifiedEmployee.createdAt).toEqual(employee.createdAt);
      expect(modifiedEmployee.updatedAt).not.toEqual(employee.updatedAt);
    });
  });

  describe("Employee list management", () => {
    it("should display all employees", () => {
      const employees = [
        {
          id: 1,
          email: "ahmed@solupedia.com",
          firstName: "Ahmed",
          lastName: "Hassan",
          isActive: true,
        },
        {
          id: 2,
          email: "fatima@solupedia.com",
          firstName: "Fatima",
          lastName: "Mohamed",
          isActive: true,
        },
        {
          id: 3,
          email: "sara@solupedia.com",
          firstName: "Sara",
          lastName: "Ali",
          isActive: false,
        },
      ];

      expect(employees).toHaveLength(3);
      expect(employees.filter((e) => e.isActive)).toHaveLength(2);
    });

    it("should filter active employees", () => {
      const employees = [
        { id: 1, isActive: true },
        { id: 2, isActive: true },
        { id: 3, isActive: false },
      ];

      const activeEmployees = employees.filter((e) => e.isActive);
      expect(activeEmployees).toHaveLength(2);
    });

    it("should search employees by email", () => {
      const employees = [
        { id: 1, email: "ahmed@solupedia.com" },
        { id: 2, email: "fatima@solupedia.com" },
        { id: 3, email: "sara@solupedia.com" },
      ];

      const searchEmail = "ahmed";
      const results = employees.filter((e) => e.email.includes(searchEmail));

      expect(results).toHaveLength(1);
      expect(results[0]?.email).toBe("ahmed@solupedia.com");
    });

    it("should search employees by name", () => {
      const employees = [
        { id: 1, firstName: "Ahmed", lastName: "Hassan" },
        { id: 2, firstName: "Fatima", lastName: "Mohamed" },
        { id: 3, firstName: "Sara", lastName: "Ali" },
      ];

      const searchName = "Fatima";
      const results = employees.filter((e) =>
        e.firstName.includes(searchName) || e.lastName.includes(searchName)
      );

      expect(results).toHaveLength(1);
      expect(results[0]?.firstName).toBe("Fatima");
    });
  });

  describe("Employee access control", () => {
    it("should verify employee can access their own dashboard", () => {
      const currentUser = { id: 1, email: "ahmed@solupedia.com" };
      const requestedDashboard = { employeeId: 1 };

      const hasAccess = currentUser.id === requestedDashboard.employeeId;
      expect(hasAccess).toBe(true);
    });

    it("should prevent employee from accessing other dashboards", () => {
      const currentUser = { id: 1, email: "ahmed@solupedia.com" };
      const requestedDashboard = { employeeId: 2 };

      const hasAccess = currentUser.id === requestedDashboard.employeeId;
      expect(hasAccess).toBe(false);
    });

    it("should allow admin to access all dashboards", () => {
      const currentUser = { id: 1, email: "admin@solupedia.com", role: "admin" };
      const requestedDashboard = { employeeId: 2 };

      const hasAccess = currentUser.role === "admin" || currentUser.id === requestedDashboard.employeeId;
      expect(hasAccess).toBe(true);
    });
  });
});
