import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
	if (!siteUrl) {
		throw new Error('Environment variable NEXT_PUBLIC_SITE_URL is not set');
	}

	// Return a basic sitemap for now
	return [
		{
			url: siteUrl,
			lastModified: new Date(),
		},
		{
			url: `${siteUrl}/hub`,
			lastModified: new Date(),
		},
		{
			url: `${siteUrl}/login`,
			lastModified: new Date(),
		}
	];
}
