/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        castle: '#1a120b',
        gold: '#d6b98c',
        veil: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 32px rgba(214,185,140,0.16)',
        soft: '0 18px 60px rgba(0, 0, 0, 0.34)',
      },
      backgroundImage: {
        candle:
          'radial-gradient(circle at top, rgba(214,185,140,0.2), transparent 35%), radial-gradient(circle at 50% 18%, rgba(255,236,199,0.12), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.05), transparent 42%)',
      },
      keyframes: {
        floatGlow: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '0.42' },
          '50%': { transform: 'translate3d(0, -14px, 0) scale(1.08)', opacity: '0.75' },
        },
        slowBreath: {
          '0%, 100%': { opacity: '0.28', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.04)' },
        },
      },
      animation: {
        floatGlow: 'floatGlow 10s ease-in-out infinite',
        slowBreath: 'slowBreath 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
