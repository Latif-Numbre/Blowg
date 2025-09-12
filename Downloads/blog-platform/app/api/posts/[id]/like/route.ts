import { type NextRequest, NextResponse } from "next/server";
import { getUser, getAccessToken } from "@/lib/auth";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app, you'd toggle like in database
    // For demo, we'll just return success

    try {
      const response = await axios.post(
        `${API_URL}blog/posts/${params.id}/like/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const like = response.data.detail === "Unliked" ? false : true;
      return NextResponse.json({ success: true, liked: like }, { status: 200 });
    } catch (error) {
      console.error("Error liking post:", error);
      return NextResponse.json(
        { success: false, error: "Failed to like post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
