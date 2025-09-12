import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { SocialActions } from "@/components/social-actions";
import type { Post } from "@/lib/posts";

interface PostCardProps {
  post: Post;
  showActions?: boolean;
}

export function PostCard({ post, showActions = true }: PostCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={post.author.avatar_url || "/placeholder-user.jpg"}
                alt={post.author.full_name}
              />
              <AvatarFallback>
                {post.author.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/profile/${post.author.username}`}
                className="font-semibold hover:text-primary transition-colors"
              >
                {post.author.full_name}
              </Link>
              <p className="text-sm text-muted-foreground">
                @{post.author.username} ·{" "}
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Link href={`/posts/${post.id}`} className="block group">
          <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-balance">
            {post.title}
          </h2>
          <p className="text-muted-foreground mb-4 text-pretty line-clamp-3">
            {post.excerpt}
          </p>
        </Link>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {showActions && (
          <SocialActions
            postId={post.id}
            initialLikes={post.likes_count}
            initialComments={post.comments_count}
            initialBookmarks={post.bookmarks_count}
            initialReposts={post.reposts_count}
          />
        )}
      </CardContent>
    </Card>
  );
}
