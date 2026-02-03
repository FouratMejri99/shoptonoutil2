// Storage helpers for Supabase Storage
// Uses the server-side Supabase admin client for storage operations

import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";
import { ENV } from "./_core/env";

type StorageConfig = {
  supabaseUrl: string;
  supabaseServiceKey: string;
  storageBucket: string;
};

function getStorageConfig(): StorageConfig {
  const supabaseUrl = ENV.supabaseUrl || "";
  // Try service role key first, then access token
  const supabaseServiceKey =
    ENV.supabaseServiceKey || ENV.supabaseAccessToken || "";
  const storageBucket = ENV.supabaseStorageBucket || "public-assets";

  if (!supabaseUrl) {
    throw new Error(
      "Supabase URL is not configured. Set SUPABASE_URL or VITE_SUPABASE_URL environment variable."
    );
  }

  if (!supabaseServiceKey) {
    throw new Error(
      "Supabase credentials are not configured. Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ACCESS_TOKEN environment variable."
    );
  }

  return { supabaseUrl, supabaseServiceKey, storageBucket };
}

function getSupabaseClient(serviceKey: string) {
  const { supabaseUrl } = getStorageConfig();
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const { supabaseUrl, supabaseServiceKey, storageBucket } = getStorageConfig();

  try {
    const supabase = getSupabaseClient(supabaseServiceKey);

    // Normalize the key
    const key = relKey.replace(/^\/+/, "");

    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from(storageBucket)
      .upload(key, data, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase storage upload failed: ${error.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(key);

    console.log(`[Storage] Upload successful: ${urlData.publicUrl}`);
    return { key: uploadData.path, url: urlData.publicUrl };
  } catch (error: any) {
    console.error("[Storage] Upload error:", error);
    throw new Error(
      `Storage upload failed: ${error?.message || "Unknown error"}`
    );
  }
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const { storageBucket } = getStorageConfig();
  const supabase = getSupabaseClient(ENV.supabaseServiceKey || "");

  const key = relKey.replace(/^\/+/, "");

  try {
    const { data: urlData } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(key);

    return { key, url: urlData.publicUrl };
  } catch (error: any) {
    console.error("[Storage] Get URL error:", error);
    throw new Error(
      `Storage get URL failed: ${error?.message || "Unknown error"}`
    );
  }
}

export async function storageDelete(relKey: string): Promise<boolean> {
  const { storageBucket } = getStorageConfig();
  const supabase = getSupabaseClient(ENV.supabaseServiceKey || "");

  const key = relKey.replace(/^\/+/, "");

  try {
    const { error } = await supabase.storage.from(storageBucket).remove([key]);

    if (error) {
      throw new Error(`Supabase storage delete failed: ${error.message}`);
    }

    return true;
  } catch (error: any) {
    console.error("[Storage] Delete error:", error);
    return false;
  }
}

// Helper function to get a signed URL for private files
export async function storageGetSignedUrl(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const { storageBucket } = getStorageConfig();
  const supabase = getSupabaseClient(ENV.supabaseServiceKey || "");

  const key = relKey.replace(/^\/+/, "");

  try {
    const result = await supabase.storage
      .from(storageBucket)
      .createSignedUrl(key, expiresIn);

    if (result.error) {
      throw new Error(`Supabase signed URL failed: ${result.error.message}`);
    }

    return { key, url: result.data.signedUrl };
  } catch (error: any) {
    console.error("[Storage] Signed URL error:", error);
    throw new Error(
      `Storage signed URL failed: ${error?.message || "Unknown error"}`
    );
  }
}
