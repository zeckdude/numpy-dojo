import path from 'path';
import { defineConfig } from 'vitest/config';

/** Lessons/scenarios are mostly static data with many `validate` fns never run in tests — excluding keeps thresholds meaningful. */
const coverageInclude = [
  'src/lib/**/*.ts',
  'src/app/api/**/*.ts',
  'src/data/modules.ts',
  'src/data/quizzes.ts',
  'src/data/lessonDocLinks.ts',
];

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: coverageInclude,
      exclude: [
        '**/*.test.ts',
        '**/types.ts',
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        statements: 90,
        branches: 80,
      },
      reporter: ['text', 'text-summary', 'lcov'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, './vitest-shims/server-only.ts'),
    },
  },
});
