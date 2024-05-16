import { pgSchema, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { post } from "../shared.schema";

/* -- Supabase -- */
// 💡 We are not creating any schema here, just declaring it to be able to reference user id

const SupabaseAuthSchema = pgSchema("auth");

const SupabaseAuthUsers = SupabaseAuthSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
});

/* -- User -- */

const user = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => SupabaseAuthUsers.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  name: text("name"),
});

export { user, post };
