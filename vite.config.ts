import { defineConfig, loadEnv, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxy: Record<string, ProxyOptions> = {
    "^/api(?:/|$)": {
      target: env.API_TARGET || "http://127.0.0.1:8086",
      changeOrigin: true,
    },
    "^/s3/": {
      target: env.S3_TARGET || "http://127.0.0.1:9300",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/s3/, ""),
    },
  };

  return {
    plugins: [react()],
    server: { port: 3000, strictPort: true, host: "127.0.0.1", proxy },
    preview: { port: 3000, strictPort: true, proxy },
  };
});
