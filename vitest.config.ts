import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        "src/utils/index.ts",
        "sandbox.js",
        "vite.config.ts",
        "vitest.config.ts",
        "src/index_.ts",
        "src/interfaces/index.ts",
      ]
    },
    dir: "tests",
  },
})