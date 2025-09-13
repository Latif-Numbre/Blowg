import { Header } from "@/components/header";
import { PostCard } from "@/components/post-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/auth";
import { mockPosts } from "@/lib/posts";
import { mockUsers } from "@/lib/users";
import { TrendingUp, Users, UserPlus } from "lucide-react";
import Link from "next/link";

export default async function ExplorePage() {
  const user = await getUser();
  const trendingPosts = mockPosts.filter((post) => post.published).slice(0, 5);
  const suggestedUsers = mockUsers.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container py-8 px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Trending Posts</h1>
            </div>

            <div className="space-y-6">
              {trendingPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Who to Follow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.map((suggestedUser) => (
                  <div
                    key={suggestedUser.id}
                    className="flex items-center justify-between"
                  >
                    <Link
                      href={`/profile/${suggestedUser.username}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={suggestedUser.avatar_url || "/placeholder.svg"}
                          alt={suggestedUser.full_name}
                        />
                        <AvatarFallback>
                          {suggestedUser.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {suggestedUser.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          @{suggestedUser.username}
                        </p>
                      </div>
                    </Link>
                    {user && (
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "web-development",
                    "javascript",
                    "react",
                    "nextjs",
                    "programming",
                    "typescript",
                  ].map((tag, index) => (
                    <div
                      key={tag}
                      className="flex items-center justify-between"
                    >
                      <Link href={`/tags/${tag}`} className="flex-1">
                        <Badge
                          variant="secondary"
                          className="w-full justify-start"
                        >
                          #{tag}
                        </Badge>
                      </Link>
                      <span className="text-sm text-muted-foreground ml-2">
                        {Math.floor(Math.random() * 100) + 10}k
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
