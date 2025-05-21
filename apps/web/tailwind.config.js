const defaultTheme = require("tailwindcss/defaultTheme");
const svgToDataUri = require("mini-svg-data-uri");
const colors = require("tailwindcss/colors");
const {
    default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./styles/**/*.{css}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                afacad: ['Afacad', 'sans-serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            colors: {
                primary: '#f5a331',
                secDark: '#1c1c1c',
                terDark: '#1f1f1f',
                light: '#f7f5f2',
                secondLight: '#e0ddda',
                dark: '#171717',
                lightText: '#2e2d2c',
                darkText: '#f5f5f5',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            keyframes: {
                pulseCustom: {
                    '0%, 100%': {
                        opacity: '1',
                    },
                    '50%': {
                        opacity: '0.9',
                    },
                },
            },
            animation: {
                pulseCustom: 'pulseCustom 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        addVariablesForColors,
        function ({ matchUtilities, theme }) {
            matchUtilities({
                "bg-grid": (value) => ({
                    backgroundImage: `url("${svgToDataUri(
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                    )}")`,
                }),
                "bg-grid-small": (value) => ({
                    backgroundImage: `url("${svgToDataUri(
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                    )}")`,
                }),
                "bg-dot": (value) => ({
                    backgroundImage: `url("${svgToDataUri(
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
                    )}")`,
                }),
            }, { values: flattenColorPalette(theme("backgroundColor")), type: "color" });
        },
    ],
    variants: {
        extend: {
            backgroundColor: ['checked'],
            borderColor: ['checked'],
        },
    },
};

function addVariablesForColors({ addBase, theme }) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));
    addBase({
        ":root": newVars,
    });
}