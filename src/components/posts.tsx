"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { type Posts as IPosts } from "@/database/schema"
import { POST_PER_PAGE } from "@/lib/constants"
import { insertPostSchema, type InsertPost } from "@/lib/validation/post"
import { createPost, getPosts } from "@/server/post"
import { type IPage } from "@/types/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Textarea } from "./ui/textarea"

const defaultValues = {
  content: "",
}

const Posts = () => {
  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues,
  })
  const queryClient = useQueryClient()
  const queryKey = ["InfinitePosts"]

  const {
    data: posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await getPosts(POST_PER_PAGE, pageParam)

      return data
    },

    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    refetchOnWindowFocus: false,
  })

  const createPostMutation = useMutation({
    mutationFn: (post: InsertPost) => createPost(post),
    onSuccess: (newPost) => {
      queryClient.setQueryData<InfiniteData<IPage<IPosts[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newPosts = {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  posts: [
                    newPost?.data,
                    ...(page.posts ? page.posts : new Array()),
                  ],
                }
              }

              return page
            }),
          }

          return newPosts
        }
      )
    },
  })

  const submit = async (post: InsertPost) => {
    await createPostMutation.mutateAsync(post)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button disabled={form.formState.isSubmitting} type="submit">
            Post
          </button>
        </form>
      </Form>
      {posts?.pages.map((page, index) =>
        page.posts.map((post) => <div key={post.id}>{post.content}</div>)
      )}
      {/* <button onClick={loadMorePosts}>Load more</button> */}
    </div>
  )
}
export default Posts
