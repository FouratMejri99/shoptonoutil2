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
      order: "createdAt",
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
      eq: { isPublished: true },
      order: "createdAt",
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
export const testimonialsService = {
  async getAll() {
    return dbService.select("testimonials", {
      order: "createdAt",
      ascending: false,
    });
  },

  async getFeatured(limit = 3) {
    return dbService.select("testimonials", {
      eq: { isPublished: true },
      order: "createdAt",
      ascending: false,
      limit,
    });
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
      order: "createdAt",
      ascending: false,
    });
  },
};

// Employee table operations
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
    return dbService.insert("employees", employeeData);
  },

  async update(id: number, updates: any) {
    return dbService.update("employees", id, updates);
  },

  async delete(id: number) {
    return dbService.delete("employees", id);
  },

  async verifyLogin(email: string) {
    const [employee] = await dbService.select("employees", {
      eq: { email, isactive: true },
    });
    return employee;
  },

  // Time records
  async createTimeRecord(recordData: any) {
    return dbService.insert("timetrackingrecords", recordData);
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
    return dbService.select("employees", {
      order: "createdAt",
      ascending: false,
    });
  },

  async createEmployee(data: any) {
    return dbService.insert("employees", data);
  },

  async updateEmployee(id: number, updates: any) {
    return dbService.update("employees", id, updates);
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
