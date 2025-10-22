'use client';

import PageBuilder from '@/components/layout/PageBuilder';
import { PageBlock } from '@/types/directus-schema';

interface PageClientProps {
	sections: PageBlock[];
	pageId?: string;
}

export default function PageClient({ sections }: PageClientProps) {
	return (
		<div className="relative">
			<PageBuilder sections={sections} />
		</div>
	);
}
