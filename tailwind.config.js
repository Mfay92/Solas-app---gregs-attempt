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
                    blue: '#009EA5',   // Teal Blue
                    paper: '#FFF6F1',  // Off-White (User calls this "White")
                    amber: '#E8A547',  // User defined Amber
                    rouge: '#E07A5F',  // User defined Red Alert
                    slate: '#4A5859',  // User defined Slate
                },
                // Keep generic grays for neutral text if needed, but prefer ivolve colors
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Modern font
                rounded: ['"M PLUS Rounded 1c"', 'sans-serif'], // Friendly, premium rounded font
            }
        },
    },
    plugins: [],
}
