import { Posts, posts } from "@/database/schema"
import { createInsertSchema } from "drizzle-zod"
import * as z from "zod"

export const insertPostSchema = createInsertSchema(posts, {
  content: z.string().min(1).max(1000),
}).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
})

export type InsertPost = z.infer<typeof insertPostSchema>
export type IPosts = {
  posts: Posts[]
  hasNextPage: boolean
  nextOffset: number | null
}
