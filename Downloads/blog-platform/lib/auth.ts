import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}
export interface Post {
  id: string;
  title: string;
  author: User;
  content: string;
  date_posted: Date;
}
const API_URL = "http://127.0.0.1:8000/";

export async function getUser(): Promise<User | null> {
  const access = await getAccessToken();

  if (!access) {
    redirect("/auth/signin"); // not logged in
  }

  // Fetch user data
  const res = await axios.get(`${API_URL}blog/me/`, {
    headers: { Authorization: `Bearer ${access}` },
  });

  return res.data as User;
}
// In a real app, you'd fetch from database
// For now, return mock user data

export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) {
    redirect("/auth/signin");
  }

  return user;
}

export async function getAccessToken() {
  const cookieStore = cookies();

  const access = cookieStore.get("access")?.value;

  const refresh = cookieStore.get("refresh")?.value;

  if (!access) return null;

  // ✅ Try using access first
  try {
    const res = await axios.get(`${API_URL}blog/me/`, {
      headers: { Authorization: `Bearer ${access}` },
    });

    return access;
  } catch (error) {
    // ❌ Access expired → try refresh

    if (refresh) {
      try {
        const res = await axios.post(`${API_URL}api/token/refresh/`, {
          refresh,
        });
        const newAccess = res.data.access;

        // Update cookie
        cookies().set("access", newAccess, { httpOnly: true });
        return newAccess;
      } catch (refreshError) {
        // ❌ Refresh also expired → redirect to login

        return null;
      }
    }
    return null;
  }
}

export async function signIn(username: string, password: string) {
  try {
    const res = await axios.post(`${API_URL}/blog/signin/`, {
      username,
      password,
    });

    const { access, refresh, user } = res.data;

    // Save tokens in HTTP-only cookies
    cookies().set("access", access, { httpOnly: true });
    cookies().set("refresh", refresh, { httpOnly: true });

    return { user };
  } catch (error) {
    return { error: "Invalid credentials" };
  }
}

export async function signUp(
  email: string,
  username: string,
  password: string,
  full_name: string
) {
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

    return { access, refresh };
  } catch (error) {
    return { error: "Failed to sign up" };
  }
}

export async function getPosts() {
  const res = await axios.get(`${API_URL}blog/posts/`);
  return res.data;
}

export async function getComments(postId: string) {
  const res = await axios.get(`${API_URL}blog/posts/${postId}/comments/`);
  return res.data;
}

export async function addComment(
  postId: string,
  content: string,
  parentId?: string
) {
  const access = await getAccessToken();
  if (!access) {
    redirect("/auth/signin");
  }

  try {
    const res = await axios.post(
      `${API_URL}blog/posts/${postId}/comments/`,
      { content, parent: parentId || null },
      {
        headers: { Authorization: `Bearer ${access}` },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error("Failed to add comment");
  }
}

export async function getPost(postId: string) {
  const res = await axios.get(`${API_URL}blog/posts/${postId}/`);
  return res.data;
}
