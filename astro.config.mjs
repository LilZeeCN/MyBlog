import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://yourblog.com',
  output: 'server', // 服务器模式支持动态路由
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    react({
      experimentalReactChildren: true
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      }
    ]
  },
  vite: {
    optimizeDeps: {
      exclude: ['@sanity/client']
    }
  }
});
