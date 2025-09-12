// lib/api.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react"; // For session management (optional)

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // Your Django API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach access token
api.interceptors.request.use(
  async (config: import("axios").InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers = config.headers ?? {};
      (
        config.headers as Record<string, string>
      ).Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Refresh token function
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const response = await axios.post(
      "http://localhost:8000/api/token/refresh/",
      {
        refresh: refreshToken,
      }
    );
    const newAccessToken = response.data.access;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

// Auth functions
export const login = async (username: string, password: string) => {
  const response = await axios.post("http://localhost:8000/api/token/", {
    username,
    password,
  });
  const { access, refresh } = response.data;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  return { access, refresh };
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/auth/signin";
};

// API calls for blog
export const getPosts = async () => {
  const response = await api.get("posts/");
  return response.data;
};

export const createPost = async (postData: {
  title: string;
  content: string;
}) => {
  const response = await api.post(
    "http://localhost:8000/blog/posts/",
    postData
  );
  return response.data;
};

export const likePost = async (postId: number) => {
  const response = await api.post(
    `http://localhost:8000/blogposts/${postId}/like/`
  );
  return response.data;
};

export const bookmarkPost = async (postId: number) => {
  const response = await api.post(
    `http://localhost:8000/blog/posts/${postId}/bookmark/`
  );
  return response.data;
};

export const repostPost = async (postId: number) => {
  const response = await api.post(
    `http://localhost:8000/blog/posts/${postId}/repost/`
  );
  return response.data;
};

export const createComment = async (postId: number, content: string) => {
  const response = await api.post(`http://localhost:8000/blog/comments/`, {
    post: postId,
    content,
  });
  return response.data;
};

export default api;
