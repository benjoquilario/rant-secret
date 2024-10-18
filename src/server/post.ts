"use server"

import { db } from "@/database"
import { posts } from "@/database/schema"
import { type InsertPost, insertPostSchema } from "@/lib/validation/post"
import { desc } from "drizzle-orm"

export const createPost = async (data: InsertPost) => {
  const validatedFields = insertPostSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors[0].message,
    }
  }

  try {
    const { content } = validatedFields.data

    const newPosts = await db.insert(posts).values({ content }).returning()

    return {
      data: newPosts[0],
      success: true,
      message: "Post created successfully",
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: "An error occurred",
    }
  }
}

export const getPosts = async (limit = 5, skip = 0) => {
  const selectPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(skip)

  if (selectPosts.length === 0) {
    return {
      posts: [],
      hasNextPage: false,
      nextOffset: null,
    }
  }

  return {
    posts: selectPosts,
    hasNextPage: selectPosts.length < (Number(limit) || 5) ? false : true,
    nextOffset:
      selectPosts.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  }
}
