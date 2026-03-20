import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      {
        name: "html-env-replace",
        transformIndexHtml(html) {
          return html
            .replace(/\$\$BACKEND_URL\$\$/g, env.VITE_BACKEND_URL || "http://localhost:8000")
            .replace(/\$\$SANDBOX_SDK\$\$/g, env.VITE_SANDBOX_SDK || "true");
        },
      },
    ],
    server: {
      port: parseInt(env.PORT) || 3314,
    },
  };
});
