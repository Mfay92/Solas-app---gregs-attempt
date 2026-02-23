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
                    // Short names (existing code compatibility)
                    dark: '#025A40',   // Dark Green
                    mid: '#008C67',    // Mid Green
                    bright: '#6BD052', // Bright Green
                    blue: '#009EA5',   // Teal Blue
                    teal: '#009EA5',   // Teal Blue (alias)
                    paper: '#FFF6F1',  // Off-White (User calls this "White")
                    amber: '#E8A547',  // User defined Amber
                    rouge: '#E07A5F',  // User defined Red Alert
                    slate: '#4A5859',  // User defined Slate
                    // Hyphenated names (for clarity)
                    'dark-green': '#025A40',
                    'mid-green': '#008C67',
                    'bright-green': '#6BD052',
                },
                // Keep generic grays for neutral text if needed, but prefer ivolve colors
            },
            fontFamily: {
                sans: ['"Volte Rounded"', 'Inter', 'sans-serif'], // ivolve brand font
                rounded: ['"Volte Rounded"', 'sans-serif'], // ivolve brand font
            }
        },
    },
    plugins: [],
}
