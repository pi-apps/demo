import axios from "axios";

const getBaseURL = () => {
  const runtimeURL = typeof window !== "undefined" ? window.__ENV?.backendURL : undefined;

  if (runtimeURL && runtimeURL !== "$$BACKEND_URL$$") {
    return runtimeURL;
  }

  return import.meta.env.VITE_BACKEND_URL;
};

export const axiosClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 20_000,
  withCredentials: true,
});
