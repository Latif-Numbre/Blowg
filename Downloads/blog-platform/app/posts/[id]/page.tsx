import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share } from "lucide-react";
import { SocialActions } from "@/components/social-actions";
import { CommentSection } from "@/components/comment-section";
import { getUser } from "@/lib/auth";
import { mockPosts } from "@/lib/posts";
import Link from "next/link";
import { getComments } from "@/lib/auth";
import { getPost } from "@/lib/auth";

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const user = await getUser();
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container py-8 max-w-4xl">
        <article>
          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={post.author.avatar_url || "/placeholder.jpg"}
                  alt={post.author.full_name}
                />
                <AvatarFallback>
                  {post.author.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/profile/${post.author.username}`}
                  className="font-semibold text-lg hover:text-primary transition-colors"
                >
                  {post.author.full_name}
                </Link>
                <p className="text-muted-foreground">
                  @{post.author.username} ·{" "}
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              {post.title}
            </h1>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Post Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{post.content}</div>
              </div>
            </CardContent>
          </Card>

          {/* Post Actions */}
          <div className="flex items-center justify-between mb-8 p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <SocialActions
                postId={post.id}
                initialLikes={post.likes_count}
                initialComments={post.comments_count}
                initialBookmarks={post.bookmarks_count}
                initialReposts={post.reposts_count}
                showCommentButton={false}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>

          {/* Comments Section */}
          <CommentSection postId={post.id} currentUser={user} />
        </article>
      </main>
    </div>
  );
}
