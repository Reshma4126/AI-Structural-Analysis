/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f2f7fb',
          100: '#e3effe',
          200: '#cceeef',
          300: '#96ccff',
          400: '#58a7e0',
          500: '#4682B4', // Primary Steel Blue
          600: '#1c6090',
          700: '#144970',
          800: '#113a5a',
          900: '#001d32',
        },
        concrete: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#D5DBDB', // Secondary Concrete Gray
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        cyanAccent: {
          50: '#e6f9fc',
          100: '#b5ebff',
          200: '#80dcfb',
          300: '#58d5fb',
          400: '#007f9b',
          500: '#00A8CC', // Accent Electric Cyan
          600: '#0084a3',
          700: '#00657b',
          800: '#004e60',
          900: '#001f28',
        },
        navy: {
          50: '#f0f3f6',
          100: '#dbe2e9',
          200: '#b7c5d3',
          300: '#8ca3b8',
          400: '#62809d',
          500: '#415a77',
          600: '#26313d',
          700: '#1B2631', // Neutral Navy / Dark Charcoal
          800: '#111d27',
          900: '#0a1017',
        },
        bgApp: '#F8F9F9',
        surface: '#FFFFFF',
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        'md': '8px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'blueprint': '0 0 0 1px rgba(27, 38, 49, 0.08), 0 4px 20px rgba(27, 38, 49, 0.04)',
        'glow-cyan': '0 0 15px rgba(0, 168, 204, 0.25)',
      }
    },
  },
  plugins: [],
}
