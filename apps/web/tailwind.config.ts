import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crayon: {
          red: '#FF6B6B',
          yellow: '#FFD93D',
          green: '#6BCB77',
          blue: '#4D96FF',
          orange: '#FF922B',
          cream: '#F8F0E3',
        },
        ink: '#2D2D2D',
        paper: '#FCF9F2',
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Nunito', 'sans-serif'],
        number: ['Boogaloo', 'cursive'],
      },
      fontSize: {
        '10xl': '8rem',
        '11xl': '10rem',
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'rubber-band': 'rubberBand 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'squish': 'squish 0.3s ease-in-out',
        'draw-border': 'drawBorder 1.5s ease forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'pop': 'pop 0.3s ease-out',
        'spin-gift': 'spinGift 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'confetti-fall': 'confettiFall 3s ease-in forwards',
        'loading-bounce': 'loadingBounce 1s ease-in-out infinite',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rubberBand: {
          '0%': { transform: 'scaleX(1)' },
          '30%': { transform: 'scaleX(1.25) scaleY(0.75)' },
          '40%': { transform: 'scaleX(0.75) scaleY(1.25)' },
          '50%': { transform: 'scaleX(1.15) scaleY(0.85)' },
          '65%': { transform: 'scaleX(0.95) scaleY(1.05)' },
          '75%': { transform: 'scaleX(1.05) scaleY(0.95)' },
          '100%': { transform: 'scaleX(1) scaleY(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        squish: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        drawBorder: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spinGift: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(10deg) scale(1.05)' },
          '50%': { transform: 'rotate(0deg) scale(1)' },
          '75%': { transform: 'rotate(-10deg) scale(1.05)' },
          '100%': { transform: 'rotate(0deg) scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        loadingBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      dropShadow: {
        comic: '3px 4px 0px #2D2D2D',
        'comic-sm': '2px 2px 0px #2D2D2D',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
