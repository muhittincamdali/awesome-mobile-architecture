import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // The examples have their own test runners; only the list tooling is tested here.
    include: ['test/**/*.test.ts'],
  },
});
