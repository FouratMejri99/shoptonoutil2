import { COOKIE_NAME } from "@shared/const";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: FetchCreateContextFnOptions["req"];
  res: any;
  user: User | null;
};

export async function createContextFetch(
  opts: FetchCreateContextFnOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get user from session cookie
    const cookieHeader = opts.req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split("; ")
        .map(c => {
          const [key, ...v] = c.split("=");
          return [key.trim(), v.join("=")];
        })
        .filter(([k]) => k)
    );

    const sessionCookie = cookies[COOKIE_NAME];

    if (sessionCookie) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
      const { jwtVerify } = await import("jose");
      try {
        const { payload } = await jwtVerify(sessionCookie, secret, {
          algorithms: ["HS256"],
        });

        // Parse the openId to get user info
        const openId = payload.openId as string;
        if (openId && openId.startsWith("employee:")) {
          // Fetch employee from database
          const { getDb } = await import("../db");
          const db = await getDb();
          if (db) {
            const { employees, eq } = await import("../../drizzle/schema");
            const result = await db
              .select()
              .from(employees)
              .where(eq(employees.id, parseInt(openId.split(":")[1])))
              .limit(1);
            if (result.length > 0) {
              user = {
                id: result[0].id,
                email: result[0].email,
                name: `${result[0].firstName} ${result[0].lastName}`,
              } as User;
            }
          }
        } else if (openId && openId.startsWith("admin:")) {
          // Fetch admin from database
          const { getDb } = await import("../db");
          const db = await getDb();
          if (db) {
            const { adminCredentials, eq } = await import(
              "../../drizzle/schema"
            );
            const result = await db
              .select()
              .from(adminCredentials)
              .where(eq(adminCredentials.id, parseInt(openId.split(":")[1])))
              .limit(1);
            if (result.length > 0) {
              user = {
                id: result[0].id,
                email: result[0].email,
                name: result[0].email,
              } as User;
            }
          }
        }
      } catch (error) {
        // Session invalid, user stays null
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: null,
    user,
  };
}
