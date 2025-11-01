import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next/resolvers'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // 添加这一段配置
      template: {
        compilerOptions: {
          // 自定义元素
          isCustomElement: (tag) => tag === 'model-viewer',
        },
      },
    }),
    vueDevTools(),
    basicSsl(),
    Components({
      resolvers: [BootstrapVueNextResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
