import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import updateDocPlugin from './vite-plugin-update-doc'; // 引入自定义插件

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    updateDocPlugin() // 添加自动更新文档时间的插件
  ]
});
