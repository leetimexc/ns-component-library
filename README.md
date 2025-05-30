git init
vim .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
coverage
dist
dist-ssr
*.local

/cyperss/videos/
/cypress/srceenshots/

.vitepress/dist
.vitepress/cache

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

mkdir packages
echo -e 'packages:\n - "packages/\*"' > pnpm-workspace.yaml
pnpm init
cd packages
mkdir components core docs hooks theme utils
vim init.shell

```
for i in components core docs hooks theme utils; do
 cd $i
 pnpm init
 cd ..

done
```

chmod +x ./init.shell
./init.shell
pnpm create vite play --template vue-ts

vim
packages/components/package.json
packages/core/package.json
packages/docs/package.json
packages/hooks/package.json
packages/play/package.json
packages/theme/package.json
packages/utils/package.json

```
name: @ns-element/components
name: @ns-element/core
name: @ns-element/docs
name: @ns-element/hooks
name: @ns-element/play
name: @ns-element/theme
name: @ns-element/utils
```

cd..
pnpm add -Dw typescript@^5.2.2 vite@^5.1.4 vitest@^1.4.0 vue-tsc@^1.8.27 postcss-color-mix@^1.1.0 postcss-each@^1.1.0 postcss-each-variables@^0.3.0 postcss-for@^2.1.1 postcss-nested@^6.0.1 @types/node@^20.11.20 @types/lodash-es@^4.17.12 @vitejs/plugin-vue@^5.0.4 @vitejs/plugin-vue-jsx@^3.1.0 @vue/tsconfig@^0.5.1
pnpm add -w lodash-es@^4.17.21 vue@^3.4.19

vim package.json

```
"name": "@ns-element/workspace",
"dependencies": {
  "ns-element": "workspace:*",
  "@ns-element/hooks": "workspace:*",
  "@ns-element/utils": "workspace:*",
  "@ns-element/theme": "workspace:*"
}
```

pnpm add -D @vue/test-utils@^2.4.5 @vitest/coverage-v8@^1.4.0 jsdom@^24.0.0 --filter @ns-element/components
pnpm add @popperjs/core@^2.11.8 async-validator@^4.2.5
--filter @ns-element/components

vim packages/core/package.json

```
"dependencies": {
  "@ns-element/components": "workspace:*"
},
```

pnpm add -D vitepress@1.0.0-rc.44 --filter @ns-element/docs

vim packages/play/package.json

```
{
  "name": "@ns-element/play",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.3",
    "@vue/tsconfig": "^0.7.0"
  }
}
```

remove packages/play/tsconfig.json and packages/play/tsconfig.node.json
touch tsconfig.json
vim tsconfig.json

```
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "jsxImportSource": "vue",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "env.d.ts",
    "packages/**/*.ts",
    "packages/**/*.tsx",
    "packages/**/*.vue",
    "packages/play/src/stories/*.stories.ts", "vitest.config.ts",
  ]
}
```

touch tsconfig.node.json
vim tsconfig.node.json

```
{
  "extends": "@tsconfig/node18/tsconfig.json",
  "include": ["packages/**/**.config.ts"],
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  }
}
```

touch postcss.config.cjs

```
/* eslint-env node */
module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-each-variables'),
    require('postcss-each')({
      plugins: {
        beforeEach: [require('postcss-for'), require('postcss-color-mix')]
      }
    }),
    // require('cssnano')({ preset: 'default' })
  ]
}
```

pnpm install
cd packages/utils
touch install.ts
vim install.ts

```
import type { App, Plugin } from 'vue'
import { each } from 'lodash-es'

type SFCWithInstall<T> = T & Plugin

export function makeInstaller(component: any) {
  const installer = (app: App) => each(component, (c) => app.use(c))

  return installer as Plugin
}

export const withInstall = <T>(component: T) => {
  ;(component as SFCWithInstall<T>).install = (app: App) => {
    const name = (component as any)?.name || 'UnnamedComponent'
    app.component(name, component as Plugin)
  }
  return component as SFCWithInstall<T>
}
```

cd packages/components
mkdir Button
cd Button
vim Button.vue

```
约束
/**
 * Button.vue
 * Button.test.tsx
 * types.ts
 * style.css
 * constants.ts
 */

<script lang="ts" setup>
defineOptions({
  name: 'NsButton',
})
</script>
<template>
  <button style="background-color: blue; color: red">this is a button</button>
</template>
```

vim index.ts

```
import Button from './Button.vue'
import { withInstall } from '@ns-element/utils'

export const NsButton = withInstall(Button)
```

cd packages/utils
vim index.ts

```
export * from './install'
```

touch packages/components/index.ts
vim packages/components/index.ts

```
export * from './Button'
```

cd packages/core
vim components.ts

```
import { NsButton } from '@ns-element/components'
import type { Plugin } from 'vue'

export default [NsButton] as Plugin[]
```

cd packages/core
vim index.ts

```
import { makeInstaller } from '@ns-element/utils'
import components from './components'

export const installer = makeInstaller(components)

export * from '@ns-element/components'
export default installer
```

cd packages/play/src
vim main.ts

```
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import NsElement from 'ns-element'

createApp(App).use(NsElement).mount('#app')
```

vim App.vue

```
<script setup lang="ts"></script>

<template>
  <NsButton />
</template>

<style scoped></style>
```

cd /
vim package.json

```
 "scripts": {
    "dev": "pnpm --filter @ns-element/play dev"
  },
```

<!-- https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/ -->
