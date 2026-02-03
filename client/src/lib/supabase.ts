import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Employee table operations
// NOTE: For secure operations (create, update, delete, login), use tRPC endpoints instead.
// These Supabase functions are kept for read-only operations if needed.
export const employeeService = {
  // Get all employees
  async getAll() {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("isActive", true)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get employee by ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create employee (admin only - requires service role key for RLS bypass)
  async create(employeeData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: string;
    position?: string;
    isActive?: boolean;
  }) {
    // Note: This function requires the service role key in RLS policies
    // For production, use tRPC endpoints instead
    const { data, error } = await supabase
      .from("employees")
      .insert(employeeData)
      .select()
      .single();

    if (error) {
      console.error("[Supabase] Error creating employee:", error);
      throw error;
    }
    return data;
  },

  // Update employee (admin only)
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
    const { data, error } = await supabase
      .from("employees")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete employee (soft delete - admin only)
  async delete(id: number) {
    const { data, error } = await supabase
      .from("employees")
      .update({ isActive: false })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Employee login verification
  async verifyLogin(email: string, password: string) {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("email", email)
      .eq("isActive", true)
      .single();

    if (error) {
      console.error("[Supabase] Error verifying login:", error);
      throw new Error("Invalid email or password");
    }

    return data;
  },
};

// Admin table operations
// NOTE: Admin login should use tRPC endpoints for secure password verification.
// This service is kept for reference but login should go through tRPC.
export const adminService = {
  // DEPRECATED: Use tRPC adminAuth.login instead for secure password verification
  // This function does not properly verify hashed passwords
  async login(email: string, password: string) {
    throw new Error(
      "Admin login should use tRPC adminAuth.login endpoint for secure authentication"
    );
  },
};
