import axios from "axios";
import { ApiResponse, RegisterPayload, LoginPayload } from "@/types/user";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (payload: RegisterPayload): Promise<ApiResponse> => {
  try {
    const { data } = await api.post<ApiResponse>("/api/users/register", payload);
    return data;
  } catch (e: any) {
    const message = e.response?.data?.message || "Registration failed. Please try again.";
    throw new Error(message);
  }
};

export const loginUser = async (payload: LoginPayload): Promise<ApiResponse> => {
  try {
    const { data } = await api.post<ApiResponse>("/api/users/login", payload);
    console.log(data)
    return data;
  } catch (e: any) {
    const message = e.response?.data?.message || "Login failed. Please try again.";
    throw new Error(message);
  }
};
