"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post-card"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Heart, Bookmark, Loader2 } from "lucide-react"
import type { Post } from "@/lib/posts"

interface ProfileTabsProps {
  username: string
}

export function ProfileTabs({ username }: ProfileTabsProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserPosts()
  }, [username])

  const fetchUserPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${username}/posts`)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error("Error fetching user posts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Posts
        </TabsTrigger>
        <TabsTrigger value="liked" className="gap-2">
          <Heart className="h-4 w-4" />
          Liked
        </TabsTrigger>
        <TabsTrigger value="bookmarks" className="gap-2">
          <Bookmark className="h-4 w-4" />
          Bookmarks
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">@{username} hasn't published any posts yet.</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="liked" className="mt-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Liked Posts</h3>
            <p className="text-muted-foreground">Liked posts will appear here in a future update.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bookmarks" className="mt-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Bookmarked Posts</h3>
            <p className="text-muted-foreground">Bookmarked posts will appear here in a future update.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
