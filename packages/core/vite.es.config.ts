import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { readdirSync } from 'fs'
import { filter, map, includes } from 'lodash-es'

// const COMP_NAMES = [
//   'Alert',
//   'Button',
//   'Collapse',
//   'Dropdown',
//   'Form',
//   'Icon',
//   'Input',
//   'Loading',
//   'Message',
//   'MessageBox',
//   'Notification',
//   'Overlay',
//   'Popconfirm',
//   'Select',
//   'Switch',
//   'Tooltip',
//   'Upload',
// ] as const

function getDirectoriesSync(basePath: string) {
  const entries = readdirSync(basePath, { withFileTypes: true })

  return map(
    filter(entries, (entry) => entry.isDirectory()),
    (entry) => entry.name
  )
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: '../../tsconfig.build.json',
      outDir: 'dist/types',
    }),
  ],
  build: {
    outDir: 'dist/es',
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'XcElement',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
        '@popperjs/core',
        'async-validator',
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css'
          return assetInfo.name as string
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('/packages/hooks')) {
            return 'hooks'
          }
          if (
            id.includes('/packages/utils') ||
            includes(id, 'plugin-vue:export-helper')
          ) {
            return 'utils'
          }
          // for (const item of COMP_NAMES) {
          //   if (id.includes(`/packages/components/${item}`)) {
          //     return item
          //   }
          // }
          for (const dirName of getDirectoriesSync('../components')) {
            if (id.includes(`/packages/components/${dirName}`)) {
              return dirName
            }
          }
        },
      },
    },
  },
})
