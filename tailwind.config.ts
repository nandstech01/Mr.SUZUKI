import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Noto Sans JP', 'Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, hsl(222 47% 5%) 0%, hsl(222 44% 12%) 50%, hsl(222 47% 8%) 100%)',
        'card-gradient': 'linear-gradient(135deg, hsl(222 44% 12% / 0.8) 0%, hsl(222 47% 8% / 0.6) 100%)',
        'cyan-gradient': 'linear-gradient(135deg, hsl(190 100% 50%) 0%, hsl(190 95% 60%) 100%)',
        'gold-gradient': 'linear-gradient(135deg, hsl(43 96% 70%) 0%, hsl(43 80% 75%) 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsl(190 100% 50% / 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(43 96% 70% / 0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, hsl(190 100% 50% / 0.06) 0px, transparent 50%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Midnight Azure Palette
        midnight: {
          '50': 'hsl(222 40% 95%)',
          '100': 'hsl(222 35% 85%)',
          '200': 'hsl(222 30% 70%)',
          '300': 'hsl(222 25% 50%)',
          '400': 'hsl(222 30% 35%)',
          '500': 'hsl(222 35% 25%)',
          '600': 'hsl(222 39% 18%)',
          '700': 'hsl(222 44% 12%)',
          '800': 'hsl(222 47% 8%)',
          '900': 'hsl(222 47% 5%)',
        },
        // Cyan Accent - ロゴカラー (#3CC8E8)
        cyan: {
          glow: '#40D0F0',
          bright: '#3CC8E8',
          soft: '#5DD4F0',
          muted: '#8DE4F8',
        },
        // Brand Cyan for Tailwind classes
        brand: {
          cyan: '#3CC8E8',
          'cyan-light': '#5DD4F0',
          'cyan-dark': '#2BB8D8',
          'cyan-glow': '#40D0F0',
        },
        // Gold Accent
        gold: {
          bright: 'hsl(43 96% 70%)',
          soft: 'hsl(43 80% 75%)',
          muted: 'hsl(43 50% 80%)',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(10px, -20px) scale(1.05)' },
          '50%': { transform: 'translate(-5px, 10px) scale(0.95)' },
          '75%': { transform: 'translate(-15px, -10px) scale(1.02)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
        },
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'subtle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'fade-in-subtle': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // 軽量フロートアニメーション
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'float-slow-reverse': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(15px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.8s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.8s ease-out forwards',
        'float': 'float 20s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'skeleton': 'skeleton-shimmer 1.5s ease-in-out infinite',
        'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
        'fade-subtle': 'fade-in-subtle 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        // 軽量フロートアニメーション
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-slow-reverse': 'float-slow-reverse 7s ease-in-out infinite',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 212, 255, 0.2)',
        'glow': '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)',
        'glow-lg': '0 0 30px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.2)',
        'glow-gold': '0 0 20px rgba(245, 200, 105, 0.3), 0 0 40px rgba(245, 200, 105, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 212, 255, 0.1)',
        // Minimal shadows for cleaner design
        'minimal': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'minimal-md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'minimal-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'lift': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'lift-lg': '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
