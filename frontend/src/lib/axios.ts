import axios, { AxiosError, type AxiosInstance } from "axios";
import { toast } from "sonner";

// const BASE_URL: string = 
//   import.meta.env.MODE === "development" 
//     ? "http://localhost:5001/api" 
//     : "/api";

const apiOrigin = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : (import.meta.env.MODE === "production"
      ? "https://virasat-backend-production.up.railway.app"
      : "http://localhost:5001");

const BASE_URL: string = `${apiOrigin}/api`;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});