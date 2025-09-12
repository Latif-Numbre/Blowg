import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/lib/users"
import { getUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const currentUser = await getUser()
    const userProfile = mockUsers.find((user) => user.username === params.username)

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // In a real app, you'd check if current user is following this user
    const profileWithFollowStatus = {
      ...userProfile,
      is_following: currentUser ? Math.random() > 0.5 : false, // Mock follow status
    }

    return NextResponse.json({ user: profileWithFollowStatus })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
