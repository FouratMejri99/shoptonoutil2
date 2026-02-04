import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createContextFetch } from "../server/_core/context-fetch";
import { appRouter } from "../server/routers";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Set CORS headers
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

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
