import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createContextFetch } from "../server/_core/context-fetch";
import { appRouter } from "../server/routers";

const handler = async (request: VercelRequest, response: VercelResponse) => {
  // Handle CORS
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  // Health check
  if (request.url === "/api/health" && request.method === "GET") {
    return response
      .status(200)
      .json({ status: "ok", timestamp: new Date().toISOString() });
  }

  // Handle tRPC requests
  if (request.url?.startsWith("/api/trpc")) {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: createContextFetch,
    });
  }

  return response.status(404).json({ error: "Not found" });
};

export default handler;
