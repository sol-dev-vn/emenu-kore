import type { NextConfig } from 'next';
import { generateRedirects } from './src/lib/redirects';

const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    frame-src *;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src *;
    connect-src *;
    font-src 'self' data:;
    frame-ancestors 'self' http://localhost:3000 ${process.env.NEXT_PUBLIC_DIRECTUS_URL};
`;

const nextConfig: NextConfig = {
	// Turbopack is enabled by default in next.config.js when using --turbopack flag
	// For build, use the default Next.js compiler
	// Enable React strict mode
	reactStrictMode: true,

	// Disable ESLint during builds
	eslint: {
		ignoreDuringBuilds: true,
	},

	// Disable TypeScript type checking during builds
	typescript: {
		ignoreBuildErrors: true,
	},

	// Image optimization
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: process.env.NEXT_PUBLIC_DIRECTUS_URL?.split('//')[1] || '',
				pathname: '/assets/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8055',
				pathname: '/assets/**',
			},
		],
	},

	// Environment variables
	env: {
		DIRECTUS_PUBLIC_TOKEN: process.env.DIRECTUS_PUBLIC_TOKEN,
		DIRECTUS_FORM_TOKEN: process.env.DIRECTUS_FORM_TOKEN,
		DRAFT_MODE_SECRET: process.env.DRAFT_MODE_SECRET,
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: ContentSecurityPolicy.replace(/\n/g, '').trim(),
					},
				],
			},
		];
	},
	async redirects() {
		const redirects = await generateRedirects();

		return redirects;
	},
};

export default nextConfig;
