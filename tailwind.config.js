/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ivolve: {
                    dark: '#025A40',   // Dark Green
                    mid: '#008C67',    // Mid Green
                    bright: '#6BD052', // Bright Green
                    blue: '#009EA5',   // Blue
                    paper: '#FFF6F1',  // Off-White
                    amber: '#F59E0B',  // Warning (Standard Amber for now, can tune)
                    rouge: '#C0392B',  // Rougy Red for warnings
                },
                // Keep generic grays for neutral text if needed, but prefer ivolve colors
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Modern font
            }
        },
    },
    plugins: [],
}
