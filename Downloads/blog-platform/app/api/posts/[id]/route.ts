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
        `${API_URL}blog/posts/${params.id}/repost/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const repost = response.data.detail === "Repost removed" ? false : true;
      console.log(repost);
      return NextResponse.json(
        { success: true, reposted: repost },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error reposting post:", error);
      return NextResponse.json(
        { success: false, error: "Failed to repost post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error toggling repost:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
