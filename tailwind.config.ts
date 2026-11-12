import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

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
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        // Identidad REDPAS 2026
        ink: {
          DEFAULT: '#0A1633', // fondo oscuro / texto principal
          800: '#111E42',
          700: '#1A2A57',
          600: '#2A3B6B',
        },
        brand: {
          50: '#EEF3FF',
          100: '#DCE6FF',
          200: '#B9CCFF',
          300: '#8AA9FF',
          400: '#5B82FA',
          500: '#3563F0', // azul REDPAS modernizado
          600: '#2450D6',
          700: '#1D3FAB',
          800: '#1B3587',
          900: '#1A2F6B',
        },
        spark: {
          // naranja del nodo central del logo, usado para CTAs
          400: '#FF9A4D', // solo decorativo (gradientes)
          500: '#C2410C', // CTA: texto blanco 5.2:1
          600: '#9A3412',
        },
        mint: {
          50: '#E9FBF4',
          500: '#12B886', // decorativo
          600: '#047857', // texto/badges sobre blanco 5.5:1
        },
        // Compatibilidad con clases anteriores
        logo: {
          blue1: '#3563F0',
          blue2: '#1D3FAB',
          blue3: '#5B82FA',
          blue4: '#1A2A57',
          blue5: '#8AA9FF',
        },
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10,22,51,.04), 0 8px 24px -8px rgba(10,22,51,.12)',
        lift: '0 2px 4px rgba(10,22,51,.04), 0 24px 48px -16px rgba(10,22,51,.28)',
        glow: '0 0 0 1px rgba(53,99,240,.25), 0 12px 32px -8px rgba(53,99,240,.45)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'fade-up': 'fade-up .5s ease-out both',
      },
    },
  },
  plugins: [animate],
}

export default config
