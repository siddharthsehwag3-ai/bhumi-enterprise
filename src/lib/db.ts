import "server-only";

import postgres from "postgres";

let databaseClient: ReturnType<typeof postgres> | null = null;

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl === "replace_later") {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!databaseClient) {
    databaseClient = postgres(databaseUrl, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      ssl: "require",
    });
  }

  return databaseClient;
}