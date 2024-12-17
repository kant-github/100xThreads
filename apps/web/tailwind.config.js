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
	plugins: [require("tailwindcss-animate"),

	],
};
