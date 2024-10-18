import { InferSelectModel } from "drizzle-orm"
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type Posts = InferSelectModel<typeof posts>
