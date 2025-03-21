import type { Config } from 'tailwindcss';

import tailwindcss_animate from 'tailwindcss-animate';
import tailwindcss_typography from '@tailwindcss/typography';
import tailwindcss_scrollbar_hide from 'tailwind-scrollbar-hide';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        view: '0 0 40px 3px rgba(174, 174, 174, 0.25)',
        card: '0 10px 20px 1px rgba(0, 0, 0, 0.05)',
        button: '0 4px 4px 0px rgba(174, 174, 174, 0.25)',
      },
    },
  },
  plugins: [tailwindcss_animate, tailwindcss_typography, tailwindcss_scrollbar_hide],
} satisfies Config;
