// app/login/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  // Call Django backend to get JWTs
  console.log("Received login request:", { username, password });
  try {
    const res = await axios.post(`${API_URL}blog/signin/`, {
      username,
      password,
    });

    const { access, refresh, user } = res.data;
    console.log("Login response data:", res.data);

    // Save tokens in HTTP-only cookies
    cookies().set("access", access, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    cookies().set("refresh", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
