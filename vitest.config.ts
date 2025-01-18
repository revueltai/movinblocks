import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/movinblocks.ts'],
      exclude: [
        ...configDefaults.exclude,
        'docs',
        'playgrounds',
        'dist',
        'commitlint.config.js',
      ],
    },
  },
})
