import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/../drizzle/schema";

const connectionString =
  process.env.LOVABLE_DB_MIGRATION_URL ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set LOVABLE_DB_MIGRATION_URL, DATABASE_URL, or POSTGRES_URL.",
  );
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
