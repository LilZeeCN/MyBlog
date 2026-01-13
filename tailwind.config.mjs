/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDFBF7',  // 暖白背景
          100: '#F7F1EB', // 浅米
          200: '#E8D5C4', // 浅驼
          300: '#D4A574', // 金棕
          400: '#C49864',
          500: '#B48B54',
        },
        text: {
          primary: '#3D3D3D',   // 深灰
          secondary: '#6B6B6B', // 中灰
          muted: '#9A9A9A',     // 浅灰
        },
        functional: {
          success: '#7CB9A8', // 鼠尾草绿
          warning: '#E6B87D', // 柔和橙
          error: '#C4786A',   // 玫瑰红
        }
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0,0,0,0.04)',
        md: '0 4px 16px rgba(0,0,0,0.08)',
        lg: '0 8px 32px rgba(0,0,0,0.12)',
        glow: '0 0 20px rgba(212, 165, 116, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
