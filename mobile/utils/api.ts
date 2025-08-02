import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://x-clone-phi-ashen.vercel.app/";

export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/api/users/sync"),           // ✅ patched
  getCurrentUser: (api: AxiosInstance) => api.get("/api/users/me"),        // ✅ patched
  updateProfile: (api: AxiosInstance, data: any) => api.put("/api/users/profile", data), // ✅ patched
};

export const postApi = {
  createPost: (api: AxiosInstance, data: { content: string; image?: string }) =>
    api.post("/api/posts", data),
  getPosts: (api: AxiosInstance) => api.get("/api/posts"),
  getUserPosts: (api: AxiosInstance, username: string) =>
    api.get(`/api/posts/user/${username}`),
  likePost: (api: AxiosInstance, postId: string) =>
    api.post(`/api/posts/${postId}/like`),
  deletePost: (api: AxiosInstance, postId: string) =>
    api.delete(`/api/posts/${postId}`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/api/comments/post/${postId}`, { content }),
};