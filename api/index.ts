import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createContextFetch } from "../server/_core/context-fetch";
import { appRouter } from "../server/routers";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Get allowed origins from environment
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "http://localhost:5173,https://app.solupedia.com,https://www.solupedia.com"
  ).split(",");

  const origin = request.headers.origin || "";

  // Set CORS headers - allow request origin if it's in the allowed list
  if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
    response.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    response.setHeader("Access-Control-Allow-Origin", "");
  }
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  // Get the pathname from the request URL
  const url = request.url || "/";
  const pathname = url.split("?")[0];

  // Health check endpoint
  if (pathname === "/api/health" && request.method === "GET") {
    return response
      .status(200)
      .json({ status: "ok", timestamp: new Date().toISOString() });
  }

  // Handle tRPC requests - match both paths
  // /solupedia-admin/api/trpc/... and /api/trpc/...
  if (
    pathname.startsWith("/api/trpc") ||
    pathname.startsWith("/solupedia-admin/api/trpc")
  ) {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: createContextFetch,
    });
  }

  // 404 for unmatched routes
  return response.status(404).json({ error: "Not found", path: pathname });
}
