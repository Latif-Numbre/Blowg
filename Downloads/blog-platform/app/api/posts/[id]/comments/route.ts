import { type NextRequest, NextResponse } from "next/server";
import { getUser, getAccessToken } from "@/lib/auth";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
  const user = await getUser();
  console.log(user, await getAccessToken());
  try {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("passed theres a user");
    const { content, parentId } = await request.json();
    console.log("Creating comment:", { content, parentId });

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // In a real app, you'd save to database
    const response = await axios.post(
      `${API_URL}blog/posts/${params.id}/comments/`,
      {
        content,
        parent: parentId || null,
      },
      {
        headers: { Authorization: `Bearer ${await getAccessToken()}` },
      }
    );

    const newComment = response.data;

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
