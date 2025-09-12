import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { full_name, bio, website, location } = await request.json()

    // In a real app, you'd update the user in database
    // For demo purposes, we'll just return success
    const updatedUser = {
      ...user,
      full_name: full_name || user.full_name,
      bio,
      website,
      location,
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
