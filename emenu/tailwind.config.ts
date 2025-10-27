import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

const config: Config = {
	darkMode: 'class',
	content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				heading: ['Poppins', 'sans-serif'],
				sans: ['Inter', 'sans-serif'],
				code: ['Fira Mono', 'monospace'],
			},
			fontSize: {
				tagline: ['24px', '33.6px'], // Tagline
				headline: ['56px', '64px'], // Headline
				h1: ['56px', '78.4px'], // Heading 1
				h2: ['36px', '50.4px'], // Heading 2
				h3: ['24px', '33.6px'], // Heading 3
				description: ['16px', '22.4px'], // Description
				regular: ['16px', '24px'], // Regular text
				bold: ['16px', '22.4px'], // Bolded text
				nav: ['16px', '22.4px'], // Navbar link
				code: ['14px', '16.8px'], // Code snippet
			},
			alignments: {
				left: 'text-left',
				center: 'text-center',
				right: 'text-right',
			},
			colors: {
				background: {
					DEFAULT: 'var(--background-color)',
					muted: 'var(--background-color-muted)',
					variant: 'var(--background-variant-color)',
				},
				foreground: 'var(--foreground-color)',
				primary: 'var(--accent-color-light)',
				input: 'var(--input-color)',
				secondary: 'var(--accent-color-dark)',
				accent: 'var(--accent-color)',
				soft: 'var(--accent-color-soft)',
	brand: {
					primary: '#9B1D20', // Ruby red
					background: '#FFE4E1', // Soft peach-red
					text: '#333333', // Dark gray
					nav: '#F5F5F5', // Light gray-white
				},
				blue: {
					DEFAULT: '#172940',
				},
				gray: {
					DEFAULT: '#F5F5F5',
					muted: '#A5B0BD',
					dark: '#333333',
				},
				// Override pink/rose colors with brand ruby red for better contrast
				pink: {
					50: 'var(--accent-color-light)',
					100: 'var(--accent-color-soft)',
					200: 'var(--accent-color-soft)',
					300: 'var(--accent-color)',
					400: 'var(--accent-color)',
					500: 'var(--accent-color)',
					600: 'var(--accent-color)',
					700: 'var(--secondary)',
					800: 'var(--secondary)',
					900: 'var(--secondary)',
					950: 'var(--accent-color-dark)',
				},
				rose: {
					50: 'var(--accent-color-light)',
					100: 'var(--accent-color-soft)',
					200: 'var(--accent-color-soft)',
					300: 'var(--accent-color)',
					400: 'var(--accent-color)',
					500: 'var(--accent-color)',
					600: 'var(--accent-color)',
					700: 'var(--secondary)',
					800: 'var(--secondary)',
					900: 'var(--secondary)',
					950: 'var(--accent-color-dark)',
				},
				fuchsia: {
					50: 'var(--accent-color-light)',
					100: 'var(--accent-color-soft)',
					200: 'var(--accent-color-soft)',
					300: 'var(--accent-color)',
					400: 'var(--accent-color)',
					500: 'var(--accent-color)',
					600: 'var(--accent-color)',
					700: 'var(--secondary)',
					800: 'var(--secondary)',
					900: 'var(--secondary)',
					950: 'var(--accent-color-dark)',
				},
			},
			typography: {
				DEFAULT: {
					css: {
						color: 'var(--foreground-color)',
						textAlign: 'left',
						a: {
							color: 'var(--accent-color)',
							textDecoration: 'none',
							'&:hover': {
								textDecoration: 'underline',
							},
						},
						h1: {
							fontFamily: 'Poppins',
							fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
							fontWeight: '400',
							lineHeight: '1.2',
							marginTop: '1rem',
						},
						h2: {
							fontFamily: 'Poppins',
							fontSize: 'clamp(2rem, 4vw, 2.5rem)',
							fontWeight: '400',
							lineHeight: '1.3',
							marginTop: '1rem',
						},
						h3: {
							fontFamily: 'Poppins',
							fontSize: 'clamp(1.5rem, 3vw, 2rem)',
							fontWeight: '400',
							lineHeight: '1.4',
							marginTop: '0',
						},
						p: {
							fontFamily: 'Inter',
							fontSize: 'clamp(1rem, 2vw, 1.25rem)',
							fontWeight: '400',
							lineHeight: '1.75',
						},
						img: {
							borderRadius: '8px',
							margin: '1rem 0',
							maxWidth: '100%',
							height: 'auto',
						},
						iframe: {
							borderRadius: '8px',
							margin: '1rem 0',
						},
						code: {
							fontFamily: 'Fira Mono',
							fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
							fontWeight: '400',
							lineHeight: '1.6',
							backgroundColor: 'var(--background-color-muted)',
							color: 'var(--foreground-color)',
							borderRadius: '4px',
							padding: '0.15rem 0.35rem',
							display: 'inline',
							'&::before': {
								content: 'none',
							},
							'&::after': {
								content: 'none',
							},
						},
						'p > code': {
							'&::before': {
								content: 'none',
							},
							'&::after': {
								content: 'none',
							},
						},
						pre: {
							fontFamily: 'Fira Mono',
							fontSize: 'clamp(0.9rem, 1.125rem, 1.25rem)',
							lineHeight: '1.6',
							backgroundColor: 'var(--background-color-muted)',
							color: 'var(--foreground-color)',
							borderRadius: '8px',
							padding: '1rem',
							overflowX: 'auto',
						},
						blockquote: {
							fontStyle: 'italic',
							borderLeft: '4px solid var(--accent-color)',
							paddingLeft: '1rem',
							textAlign: 'left',
						},
						ul: {
							listStyleType: 'disc',
							paddingLeft: '1.25rem',
							listStylePosition: 'inside',
						},
						ol: {
							listStyleType: 'decimal',
							paddingLeft: '1.25rem',
							listStylePosition: 'inside',
						},
						li: {
							marginBottom: '0.5rem',
							'& p': {
								display: 'inline',
								margin: '0',
							},
						},
					},
				},
				dark: {
					css: {
						color: 'var(--foreground-color)',
						a: {
							color: 'var(--accent-color)',
							textDecoration: 'none',
							'&:hover': {
								textDecoration: 'underline',
							},
						},
						blockquote: {
							borderLeftColor: 'var(--gray-700)',
						},
					},
				},
			},
		},
	},
	plugins: [tailwindcssAnimate, typography],
	safelist: [
		'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3',
		// Brand colors safelist
		'text-brand-primary',
		'bg-brand-primary',
		'border-brand-primary',
		'ring-brand-primary',
		'text-brand-background',
		'bg-brand-background',
		'text-brand-text',
		'bg-brand-text',
		'text-brand-nav',
		'bg-brand-nav',
		// Accent colors
		'text-accent',
		'bg-accent',
		'border-accent',
		'ring-accent',
		// Common combinations
		'bg-brand-primary/10',
		'bg-brand-primary/20',
		'bg-brand-primary/90',
		'bg-brand-primary/95',
		'border-brand-primary/20',
		'border-brand-primary/30',
		'text-brand-primary/70',
		'text-brand-primary/50',
		'hover:bg-brand-primary/10',
		'hover:text-brand-primary',
		'focus:ring-brand-primary',
		'focus:border-brand-primary',
	],
};

export default config;
