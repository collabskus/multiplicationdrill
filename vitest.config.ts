import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.cjs',
        'scripts/**',
        'src/__tests__/**',
        'src/main.ts', // Entry point is mostly DOM manipulation
        'src/app.ts', // Mostly DOM manipulation, hard to test without full integration tests
      ],
      include: [
        'src/**/*.ts'
      ],
      all: true, // Include all matching source files in coverage
    }
  }
});