/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // AWS Brand Colors
        aws: {
          orange: '#FF9900',
          'orange-dark': '#EC7211',
          'orange-light': '#FFBB00',
          blue: '#146EB4',
          'blue-dark': '#0F4A80',
          'blue-light': '#1A8CDE',
          squid: '#232F3E',
          smile: '#131A22',
        },
        // Service Category Colors
        compute: {
          DEFAULT: '#ED7100',
          light: '#F89A3C',
          dark: '#C85A00',
        },
        database: {
          DEFAULT: '#3B48CC',
          light: '#5C6BD4',
          dark: '#2A35A0',
        },
        networking: {
          DEFAULT: '#8C4FFF',
          light: '#A77BFF',
          dark: '#6B38CC',
        },
        storage: {
          DEFAULT: '#3F8624',
          light: '#5FA642',
          dark: '#2D6618',
        },
        messaging: {
          DEFAULT: '#E7157B',
          light: '#EE4A9B',
          dark: '#B80F60',
        },
        security: {
          DEFAULT: '#DD344C',
          light: '#E55D71',
          dark: '#B02A3E',
        },
        monitoring: {
          DEFAULT: '#E7157B',
          light: '#EE4A9B',
          dark: '#B80F60',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'data-flow': 'dataFlow 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        dataFlow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 153, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 153, 0, 0.8)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'aws': '0 4px 14px rgba(255, 153, 0, 0.3)',
        'aws-hover': '0 8px 25px rgba(255, 153, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
