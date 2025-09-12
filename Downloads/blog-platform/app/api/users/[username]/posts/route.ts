import { type NextRequest, NextResponse } from "next/server"
import { mockPosts } from "@/lib/posts"
import { mockUsers } from "@/lib/users"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const user = mockUsers.find((u) => u.username === params.username)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Filter posts by user
    const userPosts = mockPosts.filter((post) => post.author.username === params.username && post.published)

    // Sort by creation date (newest first)
    userPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ posts: userPosts })
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
