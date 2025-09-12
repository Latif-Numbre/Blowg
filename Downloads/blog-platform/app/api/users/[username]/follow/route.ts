import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const currentUser = await getUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you'd toggle follow status in database
    const isFollowing = Math.random() > 0.5 // Mock follow status

    return NextResponse.json({
      following: isFollowing,
      message: isFollowing ? `You are now following @${params.username}` : `You unfollowed @${params.username}`,
    })
  } catch (error) {
    console.error("Error toggling follow:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
