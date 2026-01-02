/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    blue: '#00f3ff',   // Cyan
                    purple: '#bc13fe', // Deep Purple
                    pink: '#ff00ff',   // Magenta
                    green: '#0aff00',  // Lime
                    red: '#ff003c',    // Cyber Red
                },
                dark: {
                    bg: '#030303',      // Deepest Black
                    surface: '#0a0a0a', // Surface
                    surfaceLight: '#151515',
                    border: '#333333'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'monospace']
            },
            boxShadow: {
                'neon-blue': '0 0 10px #00f3ff, 0 0 20px rgba(0, 243, 255, 0.3)',
                'neon-purple': '0 0 10px #bc13fe, 0 0 20px rgba(188, 19, 254, 0.3)',
                'neon-green': '0 0 10px #0aff00, 0 0 20px rgba(10, 255, 0, 0.3)',
            },
            animation: {
                'scanline': 'scanline 2s linear infinite',
            },
            keyframes: {
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' }
                }
            }
        },
    },
    plugins: [],
}
