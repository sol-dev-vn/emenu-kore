/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class', // Enable class-based dark mode
	theme: {
		extend: {
			colors: {
				'deep-navy': '#1E3A8A',
				'medium-teal': '#0D9488',
				'light-mint': '#6EE7B7',
				'cyan-accent': '#06B6D4',
				'dark-teal': '#0F766E'
			}
		}
	},
	plugins: []
};
