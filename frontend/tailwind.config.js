export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'vogue-black': '#0a0a0a',
        'vogue-offwhite': '#f5f0e8',
        'vogue-ivory': '#faf7f2',
        'vogue-crimson': '#8b1a1a',
        'vogue-crimson-light': '#c0392b',
        'vogue-gold': '#c9a84c',
        'vogue-gray': '#888',
        'vogue-light-gray': '#e8e3dc',
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'serif'],
        'sans': ['DM Sans', 'sans-serif'],
      },
      letterSpacing: {
        'widest': '0.3em',
        'wide': '0.2em',
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: false }, // keep our base styles
}