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
import Post from "./post"
import { Button } from "./ui/button"
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
    if (post?.content?.trim() === "") return

    await createPostMutation.mutateAsync(post)

    form.reset(defaultValues)
  }

  return (
    <div>
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">Name</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Express your rant"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="self-end">
                <Button disabled={form.formState.isSubmitting} type="submit">
                  Post
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {posts?.pages.map((page, index) =>
          page.posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>

      <button onClick={() => fetchNextPage()}>Load more</button>
    </div>
  )
}
export default Posts
