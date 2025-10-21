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

	// Handle home page - show QR scanner instead of CMS content
	if (resolvedPermalink === '/') {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary via-[#7a1618] to-[#5a0f10]">
				<div className="text-center space-y-8">
					{/* SOL Logo */}
					<div className="flex justify-center">
						<div className="w-32 h-32 bg-brand-nav rounded-full flex items-center justify-center shadow-2xl border-2 border-accent p-4">
							<img
								src="/icons/logo_trim.png"
								alt="SOL eMenu"
								className="w-full h-full object-contain"
							/>
						</div>
					</div>

					{/* QR Scanner Button */}
					<QRScannerClient />

					{/* Additional Info */}
					<div className="text-brand-nav/80 text-sm max-w-md mx-auto">
						<p>Scan the QR code to access the digital menu</p>
						<p className="mt-2 text-brand-nav/60">Powered by SOL Technology</p>
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
