import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const API_URL = "http://127.0.0.1:8000/";

export async function POST(request: NextRequest) {
  const { email, username, password, full_name } = await request.json();
  try {
    const res = await axios.post(`${API_URL}/blog/signup/`, {
      email,
      username,
      password,
      full_name,
    });

    const { access, refresh } = res.data;

    // Save tokens in HTTP-only cookies
    cookies().set("access", access, { httpOnly: true });
    cookies().set("refresh", refresh, { httpOnly: true });

    return NextResponse.json({ success: true, access, refresh });
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}
