import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

/* -- Post -- */
const post = pgTable("post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  creatorId: uuid("creator_id"),
});

export { post };
