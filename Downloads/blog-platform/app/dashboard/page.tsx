// "use client";
import { requireAuth } from "@/lib/auth";
import { Header } from "@/components/header";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { mockPosts } from "@/lib/posts";
import { PenSquare, TrendingUp, Users, BookOpen } from "lucide-react";
import Link from "next/link";

import { getPosts } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireAuth();
  const res = await getPosts();
  const posts = res.results;

  // In a real app, you'd fetch posts from API
  // const posts = mockPosts.filter((post) => post.published);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container py-8 px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Your Feed</h1>
              <Button asChild>
                <Link href="/write">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Write Post
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start following writers or create your first post!
                </p>
                <Button asChild>
                  <Link href="/write">Write Your First Post</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Posts</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Followers</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Likes</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Trending Tags</h3>
              <div className="space-y-2">
                {[
                  "web-development",
                  "javascript",
                  "react",
                  "nextjs",
                  "programming",
                ].map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
