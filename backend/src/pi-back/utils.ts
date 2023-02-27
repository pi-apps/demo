import axios, { AxiosInstance } from "axios";
import { AxiosClientOptions } from "./types";

export const getAxiosClient = (apiKey: string, options: AxiosClientOptions | null): AxiosInstance => {
  const axiosClient = axios.create({
    baseURL: "https://api.minepi.com",
    timeout: 20000,
    headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" },
  });

  return axiosClient;
};
