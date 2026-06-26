/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
    },
    extend: {
      colors: {
        brand: {
          green: '#00C853',
          // Pastellgrön aktiv-färg för Services-sidans Shift5-inspirerade
          // funktioner (ersätter Shift5:s röda). Mjukare än brand-green.
          pastel: '#A9E8B4',
          'pastel-soft': '#B8F2C2',
          black: '#050505',
          ink: '#0A0A0A',
          white: '#FFFFFF',
          mist: '#E5E7EB',
          graphite: '#1F2937',
          line: 'rgba(255, 255, 255, 0.12)',
        },
      },
      fontFamily: {
        // Space Grotesk är navbar-/varumärkesfonten och används nu som primär
        // font för hela sajten (rubriker, navigation, knappar, etiketter, kort,
        // formulär, brödtext och sidfot) för en sammanhållen, redaktionell känsla
        // i HackFirst-anda. `sans` och `display` pekar därför på samma familj.
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0, 200, 83, 0.18), 0 24px 80px rgba(0, 200, 83, 0.12)',
      },
      borderRadius: {
        card: '0.5rem',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
