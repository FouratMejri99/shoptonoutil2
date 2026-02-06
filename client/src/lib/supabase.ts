import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Auth helpers
export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Generic table operations
export const dbService = {
  async select<T>(
    table: string,
    options?: {
      select?: string;
      eq?: Record<string, any>;
      order?: string;
      ascending?: boolean;
      limit?: number;
    }
  ) {
    let query = supabase.from(table).select(options?.select || "*");

    if (options?.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (options?.order) {
      query = query.order(options.order, {
        ascending: options.ascending ?? false,
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  },

  async insert<T>(table: string, row: Partial<T>) {
    const { data, error } = await supabase
      .from(table)
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  },

  async update<T>(table: string, id: number | string, updates: Partial<T>) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  },

  async delete(table: string, id: number | string) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
  },
};

// Blog service
export const blogService = {
  async getAll() {
    return dbService.select("blogposts", {
      // Supabase columns use snake_case in this project
      order: "createdat",
      ascending: false,
    });
  },

  async getBySlug(slug: string) {
    const [data] = await dbService.select("blogposts", {
      eq: { slug },
    });
    return data;
  },

  async getFeatured(limit = 3) {
    return dbService.select("blogposts", {
      // Match Supabase column names
      eq: { ispublished: true },
      order: "createdat",
      ascending: false,
      limit,
    });
  },

  async create(postData: any) {
    return dbService.insert("blogposts", postData);
  },

  async update(id: number, updates: any) {
    return dbService.update("blogposts", id, updates);
  },

  async delete(id: number) {
    return dbService.delete("blogposts", id);
  },

  async uploadImage(_file: File): Promise<string> {
    return `https://example.com/images/${Date.now()}.jpg`;
  },
};

// Case Studies service
export const caseStudiesService = {
  async getAll() {
    return dbService.select("casestudies", {
      order: "createdat",
      ascending: false,
    });
  },

  async getBySlug(slug: string) {
    const [data] = await dbService.select("casestudies", {
      eq: { slug },
    });
    return data;
  },

  async getFeatured(limit = 3) {
    return dbService.select("casestudies", {
      eq: { ispublished: true },
      order: "createdat",
      ascending: false,
      limit,
    });
  },

  async create(studyData: any) {
    return dbService.insert("casestudies", studyData);
  },

  async update(id: number, updates: any) {
    return dbService.update("casestudies", id, updates);
  },

  async delete(id: number) {
    return dbService.delete("casestudies", id);
  },

  async uploadImage(_file: File): Promise<string> {
    return `https://example.com/images/${Date.now()}.jpg`;
  },

  // Simple seeding helper to populate example case studies
  async seedSample() {
    const samples = [
      {
        title: "Global Tech Platform Localization",
        slug: "global-tech-platform-localization",
        clientName: "TechCorp",
        industry: "Technology",
        serviceType: "Document Localization",
        challenge:
          "Expanding to 12 new markets with complex technical documentation.",
        solution:
          "Localized technical manuals, UI text, and support content into 12 languages.",
        results: "40% faster onboarding and 25% increase in user adoption.",
        featured: true,
        ispublished: true,
      },
      {
        title: "eLearning Program for Healthcare",
        slug: "elearning-program-healthcare",
        clientName: "MediLearn",
        industry: "Healthcare",
        serviceType: "eLearning Localization",
        challenge:
          "Deliver compliant training to a global healthcare workforce.",
        solution:
          "Localized interactive eLearning modules and assessments for 8 regions.",
        results: "95% course completion rate and improved compliance scores.",
        featured: true,
        ispublished: true,
      },
    ];

    let inserted = 0;
    for (const sample of samples) {
      await dbService.insert("casestudies", sample);
      inserted += 1;
    }

    return { inserted };
  },
};

// Services service
export const servicesService = {
  async getAll() {
    return dbService.select("services", {
      order: "orderIndex",
      ascending: true,
    });
  },

  async getBySlug(slug: string) {
    const [data] = await dbService.select("services", {
      eq: { slug },
    });
    return data;
  },
};

// Testimonials service
// Normalize Supabase rows into a consistent shape for the UI
const normalizeTestimonial = (item: any) => ({
  id: item.id,
  clientName: item.clientName ?? item.client_name ?? item.name ?? "",
  clientCompany:
    item.clientCompany ?? item.company ?? item.client_company ?? "",
  content:
    item.content ?? item.message ?? item.testimonial ?? item.text ?? "",
});

export const testimonialsService = {
  async getAll() {
    const rows = await dbService.select("testimonials", {
      order: "createdat",
      ascending: false,
    });
    return (rows as any[]).map(normalizeTestimonial);
  },

  async getFeatured(limit = 3) {
    const rows = await dbService.select("testimonials", {
      eq: { ispublished: true },
      order: "createdat",
      ascending: false,
      limit,
    });
    return (rows as any[]).map(normalizeTestimonial);
  },

  async create(data: any) {
    return dbService.insert("testimonials", data);
  },
};

// Leads service
export const leadsService = {
  async submit(data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message?: string;
    serviceInterest?: string;
  }) {
    return dbService.insert("leads", data);
  },

  async subscribeNewsletter(email: string) {
    return dbService.insert("newsletter_subscriptions", { email });
  },

  async getAll() {
    return dbService.select("leads", {
      order: "createdat",
      ascending: false,
    });
  },
};

// Employee table operations
const mapEmployeePayload = (data: any) => {
  const row: any = {};

  if (data.email !== undefined) row.email = data.email;

  if (data.firstName !== undefined || data.firstname !== undefined) {
    row.firstname = data.firstName ?? data.firstname;
  }
  if (data.lastName !== undefined || data.lastname !== undefined) {
    row.lastname = data.lastName ?? data.lastname;
  }

  if (data.employeeId !== undefined || data.employeeid !== undefined) {
    row.employeeid = data.employeeId ?? data.employeeid;
  }

  if (data.department !== undefined) row.department = data.department;
  if (data.position !== undefined) row.position = data.position;

  if (data.isActive !== undefined || data.isactive !== undefined) {
    row.isactive = data.isActive ?? data.isactive;
  }

  return row;
};

export const employeeService = {
  async getAll() {
    return dbService.select("employees", {
      order: "createdat",
      ascending: false,
    });
  },

  async getById(id: number) {
    const [data] = await dbService.select("employees", {
      eq: { id },
    });
    return data;
  },

  async create(employeeData: any) {
    const row = mapEmployeePayload(employeeData);
    return dbService.insert("employees", row);
  },

  async update(id: number, updates: any) {
    const row = mapEmployeePayload(updates);
    return dbService.update("employees", id, row);
  },

  async delete(id: number) {
    return dbService.delete("employees", id);
  },

  async verifyLogin(email: string, password: string) {
    // For this Supabase schema, we only validate that the employee exists
    // and is marked as active. The password is collected in the UI but not
    // stored in this table, so we cannot validate it here.
    const [employee] = await dbService.select("employees", {
      eq: { email, isactive: true },
    });
    return employee;
  },

  // Time records
  async createTimeRecord(recordData: any) {
    // Map camelCase fields from the UI to snake_case columns in Supabase
    const row: any = {};

    // Required: which employee, which day
    if (
      recordData.employeeId !== undefined ||
      recordData.employeeid !== undefined
    ) {
      row.employeeid = recordData.employeeId ?? recordData.employeeid;
    }

    if (recordData.workDate !== undefined || recordData.date !== undefined) {
      // Accept both Date and string
      const d = recordData.workDate ?? recordData.date;
      row.date = d instanceof Date ? d.toISOString().split("T")[0] : d;
    }

    // Optional metadata
    if (
      recordData.projectNumber !== undefined ||
      recordData.projectnumber !== undefined
    ) {
      row.projectnumber = recordData.projectNumber ?? recordData.projectnumber;
    }

    if (
      recordData.projectName !== undefined ||
      recordData.projectname !== undefined
    ) {
      row.projectname = recordData.projectName ?? recordData.projectname;
    }

    if (recordData.taskType !== undefined || recordData.tasktype !== undefined) {
      row.tasktype = recordData.taskType ?? recordData.tasktype;
    }

    if (recordData.client !== undefined) {
      row.client = recordData.client;
    }

    if (recordData.languages !== undefined) {
      row.languages = recordData.languages;
    }

    if (
      recordData.startTime !== undefined ||
      recordData.starttime !== undefined
    ) {
      row.starttime = recordData.startTime ?? recordData.starttime;
    }

    if (recordData.endTime !== undefined || recordData.endtime !== undefined) {
      row.endtime = recordData.endTime ?? recordData.endtime;
    }

    if (recordData.duration !== undefined) {
      row.duration = recordData.duration;
    }

    if (
      recordData.businessDayTime !== undefined ||
      recordData.businessdaytime !== undefined
    ) {
      row.businessdaytime =
        recordData.businessDayTime ?? recordData.businessdaytime;
    }

    if (recordData.overtime !== undefined) {
      row.overtime = recordData.overtime;
    }

    if (recordData.notes !== undefined) {
      row.notes = recordData.notes;
    }

    return dbService.insert("timetrackingrecords", row);
  },

  async getRecords(employeeId: number) {
    return dbService.select("timetrackingrecords", {
      eq: { employeeid: employeeId },
      order: "date",
      ascending: false,
    });
  },

  async deleteTimeRecord(id: number) {
    return dbService.delete("timetrackingrecords", id);
  },
};

// Admin operations
export const adminService = {
  async login(email: string, password: string) {
    const [admin] = await dbService.select<{
      id: number;
      email: string;
      password: string;
      role?: string;
      createdat?: string;
    }>("admincredentials", {
      eq: { email, password },
    });

    if (admin) {
      return {
        id: admin.id,
        email: admin.email,
        role: admin.role || "admin",
        createdAt: admin.createdat,
      };
    }

    throw new Error("Invalid admin credentials");
  },

  async getAllEmployees() {
    const rows = await dbService.select("employees", {
      // Use snake_case column name from Supabase
      order: "createdat",
      ascending: false,
    });

    // Normalise to camelCase for the UI
    return (rows as any[]).map(emp => ({
      id: emp.id,
      email: emp.email,
      firstName: emp.firstName ?? emp.firstname ?? "",
      lastName: emp.lastName ?? emp.lastname ?? "",
      employeeId: emp.employeeId ?? emp.employeeid ?? "",
      department: emp.department ?? "",
      position: emp.position ?? "",
      isActive: emp.isActive ?? emp.isactive ?? true,
      createdAt: emp.createdAt ?? emp.createdat,
    }));
  },

  async createEmployee(data: any) {
    const row = mapEmployeePayload(data);
    return dbService.insert("employees", row);
  },

  async updateEmployee(id: number, updates: any) {
    const row = mapEmployeePayload(updates);
    return dbService.update("employees", id, row);
  },

  async deleteEmployee(id: number) {
    return dbService.delete("employees", id);
  },

  async getMonthlyReportSummary(year: number, month: number) {
    return dbService.select("monthlyreports", {
      eq: { year, month },
    });
  },

  async getDailyReportSummary(startDate: string, endDate: string) {
    return dbService.select("timetrackingrecords", {
      order: "date",
      ascending: false,
    });
  },

  async getTaskTypeDistribution(startDate: string, endDate: string) {
    return dbService.select("timetrackingrecords", {
      order: "date",
      ascending: false,
    });
  },

  async seedSampleReports() {
    return {
      success: true,
      message: "Seed functionality requires Edge Function",
    };
  },
};
