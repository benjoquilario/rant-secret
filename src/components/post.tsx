import { type Posts } from "@/database/schema"
import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react"
import React from "react"
import { Button } from "./ui/button"

type PostProps = {
  post: Posts
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="overflow-hidden rounded-sm border p-3">
      <div className="flex items-center gap-2">
        <div className="overflow-hidden rounded-full bg-background/80 p-3 text-primary">
          R
        </div>
        <div className="font-bold">User anonymous</div>
      </div>
      <div>
        <p className="line-clamp-3 leading-7 text-foreground/90 [&:not(:first-child)]:mt-6">
          {post.content}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Button className="rounded-full bg-primary/10 p-3 hover:bg-primary/5">
          <div className="flex items-center gap-1">
            <ArrowBigUp className="text-primary" />
            <span className="text-muted-foreground">703</span>
          </div>
        </Button>
        <Button className="rounded-full bg-primary/10 p-3 hover:bg-primary/5">
          <div className="flex items-center gap-1">
            <ArrowBigDown className="text-primary" />
            <span className="text-muted-foreground">444</span>
          </div>
        </Button>
        <Button className="rounded-full bg-primary/10 p-3 hover:bg-primary/5">
          <MessageSquare className="text-primary" />
        </Button>
      </div>
    </div>
  )
}
export default Post
