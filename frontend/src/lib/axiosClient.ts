import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined" && window.__ENV?.backendURL) {
    return window.__ENV.backendURL;
  }
  return import.meta.env.VITE_BACKEND_URL;
};

export const axiosClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 20_000,
  withCredentials: true,
});
