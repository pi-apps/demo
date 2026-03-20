import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";

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
            .replace(/\$\$BACKEND_URL\$\$/g, () => env.VITE_BACKEND_URL || "$$BACKEND_URL$$")
            .replace(/\$\$SANDBOX_SDK\$\$/g, env.VITE_SANDBOX_SDK || "true");
        },
      },
    ],
    resolve: {
      alias: {
        "@mui/styled-engine": path.resolve(__dirname, "node_modules/@mui/styled-engine-sc"),
      },
    },
    server: {
      port: parseInt(env.PORT) || 3314,
    },
  };
});
