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
    return dbService.select("blog_posts", {
      order: "createdAt",
      ascending: false,
    });
  },

  async getBySlug(slug: string) {
    const [data] = await dbService.select("blog_posts", {
      eq: { slug },
    });
    return data;
  },

  async getFeatured(limit = 3) {
    return dbService.select("blog_posts", {
      eq: { isPublished: true },
      order: "createdAt",
      ascending: false,
      limit,
    });
  },

  async create(postData: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    author?: string;
    isPublished?: boolean;
    category?: string;
  }) {
    return dbService.insert("blog_posts", postData);
  },

  async update(
    id: number,
    updates: Partial<{
      title: string;
      slug: string;
      content: string;
      excerpt: string;
      coverImage: string;
      author: string;
      isPublished: boolean;
      category: string;
    }>
  ) {
    return dbService.update("blog_posts", id, updates);
  },

  async delete(id: number) {
    return dbService.delete("blog_posts", id);
  },

  async uploadImage(_file: File): Promise<string> {
    // Note: In production, implement proper image upload to Supabase Storage
    // This is a placeholder that returns a mock URL
    return `https://example.com/images/${Date.now()}.jpg`;
  },
};

// Case Studies service
export const caseStudiesService = {
  async getAll() {
    return dbService.select("case_studies", {
      order: "createdAt",
      ascending: false,
    });
  },

  async getBySlug(slug: string) {
    const [data] = await dbService.select("case_studies", {
      eq: { slug },
    });
    return data;
  },

  async getFeatured(limit = 3) {
    return dbService.select("case_studies", {
      eq: { isPublished: true },
      order: "createdAt",
      ascending: false,
      limit,
    });
  },

  async create(studyData: {
    title: string;
    slug: string;
    content: string;
    clientName?: string;
    industry?: string;
    coverImage?: string;
    challenge?: string;
    solution?: string;
    results?: string;
    isPublished?: boolean;
  }) {
    return dbService.insert("case_studies", studyData);
  },

  async update(
    id: number,
    updates: Partial<{
      title: string;
      slug: string;
      content: string;
      clientName: string;
      industry: string;
      coverImage: string;
      challenge: string;
      solution: string;
      results: string;
      isPublished: boolean;
    }>
  ) {
    return dbService.update("case_studies", id, updates);
  },

  async delete(id: number) {
    return dbService.delete("case_studies", id);
  },

  async seed() {
    // Note: In production, seed data would be inserted via Supabase dashboard or migration
    return {
      success: true,
      message: "Seed functionality requires Edge Function",
    };
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

  async create(data: {
    clientName: string;
    company?: string;
    content: string;
    rating?: number;
    avatarUrl?: string;
    isPublished?: boolean;
  }) {
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
      order: "createdAt",
      ascending: false,
    });
  },

  async getById(id: number) {
    const [data] = await dbService.select("employees", {
      eq: { id },
    });
    return data;
  },

  async create(employeeData: {
    email: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: string;
    position?: string;
    isActive?: boolean;
  }) {
    return dbService.insert("employees", employeeData);
  },

  async update(
    id: number,
    updates: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      employeeId: string;
      department: string;
      position: string;
      isActive: boolean;
    }>
  ) {
    return dbService.update("employees", id, updates);
  },

  async delete(id: number) {
    return dbService.delete("employees", id);
  },

  async verifyLogin(email: string) {
    const [employee] = await dbService.select("employees", {
      eq: { email, isActive: true },
    });
    return employee;
  },

  // Time records
  async createTimeRecord(recordData: {
    employeeId: number;
    clockIn?: string;
    clockOut?: string;
    date: string;
    hoursWorked?: number;
    taskDescription?: string;
    taskType?: string;
  }) {
    return dbService.insert("time_records", recordData);
  },

  async getRecords(employeeId: number) {
    return dbService.select("time_records", {
      eq: { employeeId },
      order: "date",
      ascending: false,
    });
  },

  async deleteTimeRecord(id: number) {
    return dbService.delete("time_records", id);
  },
};

// Admin credentials - single hardcoded admin
const ADMIN_EMAIL = "admin@solupedia.com";
const ADMIN_PASSWORD = "Solupedia2024!";

// Admin operations (simplified - in production, use Supabase Edge Functions)
export const adminService = {
  async login(email: string, password: string) {
    // Only allow login with the hardcoded admin credential
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return {
        id: 1,
        email: ADMIN_EMAIL,
        role: "admin",
        createdAt: new Date().toISOString(),
      };
    }
    // Throw error for invalid credentials
    throw new Error("Invalid admin credentials");
  },

  async getAllEmployees() {
    return dbService.select("employees", {
      order: "createdAt",
      ascending: false,
    });
  },

  async createEmployee(data: {
    email: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: string;
    position?: string;
    isActive?: boolean;
  }) {
    return dbService.insert("employees", data);
  },

  async updateEmployee(
    id: number,
    updates: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      employeeId: string;
      department: string;
      position: string;
      isActive: boolean;
    }>
  ) {
    return dbService.update("employees", id, updates);
  },

  async deleteEmployee(id: number) {
    return dbService.delete("employees", id);
  },

  // Reports
  async getMonthlyReportSummary(year: number, month: number) {
    // In production, this would be a complex query or Edge Function
    return dbService.select("time_records", {
      eq: { taskType: "billable" },
    });
  },

  async getDailyReportSummary(startDate: string, endDate: string) {
    return dbService.select("time_records", {
      order: "date",
      ascending: false,
    });
  },

  async getTaskTypeDistribution(startDate: string, endDate: string) {
    return dbService.select("time_records", {
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
