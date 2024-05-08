import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig({
  ...viteConfig,
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
    },
  },
  resolve: {
    alias: {
      "~": "/app",
    },
  },
});
