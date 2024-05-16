import { electrify } from "electric-sql/pglite";
import { insecureAuthToken } from "electric-sql/auth";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { env } from "~/utils/env";
import { schema } from "./generated";
import * as drizzleSchema from "../shared.schema";

const config = {
  url: env.ELECTRIC_URL,
  debug: true,
};

const driver = new PGlite("idb://electric.db", {
  relaxedDurability: true,
});

const electric = await electrify(driver, schema, config);

const token = insecureAuthToken({ sub: "dummy" });

await electric.connect(token);

// Just for testing, can cause troubles to share the same driver. It must be only owned by Electric
const db = drizzle(driver, {
  schema: drizzleSchema,
  logger: true,
});

const localDb = Object.assign(db, {
  schema: drizzleSchema,
});

export { electric, localDb };
