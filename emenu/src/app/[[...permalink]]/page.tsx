import { fetchPageData } from '@/lib/directus/fetchers';
import { PageBlock } from '@/types/directus-schema';
import { notFound } from 'next/navigation';
import PageClient from './PageClient';
import QRScannerClient from '../QRScannerClient';

export async function generateMetadata({ params }: { params: Promise<{ permalink?: string[] }> }) {
	const { permalink } = await params;
	const permalinkSegments = permalink || [];
	const resolvedPermalink = `/${permalinkSegments.join('/')}`.replace(/\/$/, '') || '/';

	// Handle home page metadata
	if (resolvedPermalink === '/') {
		return {
			title: 'SOL eMenu',
			description: 'Digital menu experience powered by SOL',
		};
	}

	try {
		const page = await fetchPageData(resolvedPermalink);

		if (!page) return;

		return {
			title: page.seo?.title ?? page.title ?? '',
			description: page.seo?.meta_description ?? '',
			openGraph: {
				title: page.seo?.title ?? page.title ?? '',
				description: page.seo?.meta_description ?? '',
				url: `${process.env.NEXT_PUBLIC_SITE_URL}${resolvedPermalink}`,
				type: 'website',
			},
		};
	} catch (error) {
		console.error('Error loading page metadata:', error);

		return;
	}
}

export default async function Page({ params }: { params: Promise<{ permalink?: string[] }> }) {
	const { permalink } = await params;
	const permalinkSegments = permalink || [];
	const resolvedPermalink = `/${permalinkSegments.join('/')}`.replace(/\/$/, '') || '/';

	// Handle home page - simple welcome and QR scan
	if (resolvedPermalink === '/') {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
				<div className="text-center space-y-8 max-w-2xl mx-auto px-4">
					{/* Welcome Message */}
					<div className="space-y-4">
						<h1 className="text-4xl md:text-6xl font-bold text-gray-900">
							Welcome to <span style={{color: '#9B1D20'}}>SOL</span>
						</h1>
						<p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto">
							Digital dining experience at your fingertips
						</p>
					</div>

					{/* QR Scanner Button */}
					<QRScannerClient />

					{/* Simple Info */}
					<div className="text-sm text-gray-500 space-y-1">
						<p>Scan the QR code on your table to view the menu</p>
						<p>Powered by SOL Technology</p>
					</div>
				</div>
			</div>
		);
	}

	try {
		const page = await fetchPageData(resolvedPermalink);

		if (!page || !page.blocks) {
			notFound();
		}

		const blocks: PageBlock[] = page.blocks.filter(
			(block: any): block is PageBlock => typeof block === 'object' && block.collection,
		);

		return <PageClient sections={blocks} pageId={page.id} />;
	} catch (error) {
		console.error('Error loading page:', error);
		notFound();
	}
}
