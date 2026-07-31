import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/persistence/firestore/*.integration.ts"],
    testTimeout: 15_000,
  },
});
