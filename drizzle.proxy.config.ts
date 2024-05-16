/**
 * This is the configuration for the client-side database.
 */

import { defineConfig } from "drizzle-kit";
import { env } from "~/utils/env";

const base = "./app/database/.server";
const migrationsFolder = `${base}/migrations`;

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: env.ELECTRIC_PROXY,
  },
  schema: `${base}/schema.ts`,
  out: migrationsFolder,
  verbose: false,
});

export { migrationsFolder };
