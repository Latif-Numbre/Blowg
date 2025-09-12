import { type NextRequest, NextResponse } from "next/server";
import { getUser, getAccessToken } from "@/lib/auth";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("Fetching comments for post ID:", params.id);
  try {
    console.log("Starting to fetch comments");
    const response = await axios.get(
      `${API_URL}blog/posts/${params.id}/comments/`
    );

    const comments = response.data;
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("Posting comment for post ID:", params.id);
  const { content, parentId } = await request.json();
  console.log("Comment content:", content, "Parent ID:", parentId);
  try {
    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app, you'd toggle like in database
    // For demo, we'll just return success

    try {
      const response = await axios.post(
        `${API_URL}blog/posts/${params.id}/comments/`,
        { content, parent: parentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const comments = response.data;
      return NextResponse.json({ success: true, comments }, { status: 200 });
    } catch (error) {
      console.error("Error posting comment:", error);
      return NextResponse.json(
        { success: false, error: "Failed to post comment" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
