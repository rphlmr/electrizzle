import { relations } from "drizzle-orm";
import { post, user } from "./schema";

/* -- User -- */

const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
}));

/* -- Post -- */

const postRelations = relations(post, ({ one }) => ({
  creator: one(user, {
    fields: [post.creatorId],
    references: [user.id],
  }),
}));

export { userRelations, postRelations };
