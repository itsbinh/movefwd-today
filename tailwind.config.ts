import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: '#E76F51',
          50: '#FDF5F3',
          100: '#FAE8E3',
          200: '#F5D1C7',
          300: '#EFB9A9',
          400: '#E89C85',
          500: '#E76F51',
          600: '#D94F2A',
          700: '#B33F1F',
          800: '#8D3119',
          900: '#672313',
        },
        secondary: {
          DEFAULT: '#2A9D8F',
          50: '#E8F6F5',
          100: '#D1EDE9',
          200: '#A3DBD3',
          300: '#75C9BD',
          400: '#4DB7A5',
          500: '#2A9D8F',
          600: '#1F7A70',
          700: '#175C57',
          800: '#10413E',
          900: '#082325',
        },
        background: '#FEFEFE',
        text: {
          DEFAULT: '#2C2C2C',
          muted: '#6B6B6B',
        },
        success: '#6B9B7A',
        // Category colors
        category: {
          food: '#4CAF50',
          housing: '#2196F3',
          health: '#009688',
          legal: '#7E57C2',
          employment: '#FF9800',
          education: '#5C6BC0',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        heading: ['DM Sans', 'system-ui', 'sans-serif'],
        accent: ['Fraunces', 'serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [],
}

export default config
