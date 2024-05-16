import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/utils/env";
import * as schema from "./schema";
import * as relations from "./relations";

const client = postgres(env.DATABASE_URL, { prepare: false, max: 1 });

const db = drizzle(client, {
  schema: {
    ...schema,
    ...relations,
  },
  logger: true,
});

const serverDb = Object.assign(db, {
  schema,
});

export { serverDb };
