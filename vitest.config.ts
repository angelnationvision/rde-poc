import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reporter: ['text', 'lcov', 'cobertura', 'clover', 'json'],
      exclude: [
        '**/build.mjs',
        '**/postinstall.js',
        '**/blocks/a-archive/**',
        '**/tools/**',
        '**/scripts/**',
        '**/plugins/**',
        '**/columns/**',
        '**/commerce-mini-cart/**',
        '**/product-list-page/**',
        '**/product-list-page-custom/**',
        '**/teaser/**',
        '**/product-details/**',
        '**/product-recommendations/**',
        ...coverageConfigDefaults.exclude,
      ],
      reportsDirectory: './coverage',
      clean: true,
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
        perFile: false,
      },
    },
  },
});
