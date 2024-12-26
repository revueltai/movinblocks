/**
 * Configs:
 * - Builds the package for Production (package.json, .css, .esm, .js, .umd, min.js and ts types).
*/

import fs from 'fs'
import path from 'path'
import cssnano from 'cssnano'
import postcss from 'postcss'
import { defineConfig } from 'vite'
import progress from 'vite-plugin-progress'
import colors from 'picocolors'
import { visualizer } from 'rollup-plugin-visualizer'
import type { PluginOption } from 'vite'

function minifyCss() {
  return {
    name: 'post-build-css-minifier',
    closeBundle: async () => {
      const sources = [
        {
          input: path.resolve(__dirname, 'src/styles'),
          output: path.resolve(__dirname, 'dist/styles')
        },
        {
          input: path.resolve(__dirname, 'src/styles/animations'),
          output: path.resolve(__dirname, 'dist/styles/animations')
        }
      ]

      for (const source of sources) {
        if (!fs.existsSync(source.output)) {
          fs.mkdirSync(source.output, { recursive: true })
        }

        const cssFiles = fs.readdirSync(source.input)
          .filter((file) => file.endsWith('.css'))

        for (const file of cssFiles) {
          const filePath = path.join(source.input, file)
          const css = fs.readFileSync(filePath, 'utf-8')

          const result = await postcss([cssnano({ preset: 'default' })])
            .process(css, { from: filePath })

          const outputFilePath = path.join(source.output, file)

          fs.writeFileSync(outputFilePath, result.css)
        }
      }
    },
  }
}

function getPlugins() {
  return [
    minifyCss() as PluginOption,
    visualizer() as PluginOption,
    progress({
      format: `Building ${colors.green('[:bar]')} :percent :eta`,
      total: 100,
      width: 60,
    }),
  ]
}

function getBuildConfig(): any {
  return {
    minify: 'terser',
    terserOptions: {
      keep_classnames: true
    },
    reportCompressedSize: true,
    lib: {
      name: 'Movinblocks',
      formats: ['es', 'cjs', 'iife', 'umd'],
      entry: path.resolve(__dirname, 'src/movinblocks.ts'),
      fileName: (format: string) => {
        let filename = 'movinblocks'

        switch (format) {
          case 'es':
            filename += '.esm.js'
            break
          case 'cjs':
            filename += '.cjs'
            break
          case 'iife':
            filename += '.min.js'
            break
          case 'umd':
            filename += '.umd.js'
            break
        }

        return filename
      },
    }
  }
}

export default defineConfig({
  plugins: getPlugins(),
  build: getBuildConfig()
})
