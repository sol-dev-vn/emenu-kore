'use client';

import { PageBlock } from '@/types/directus-schema';

interface PageClientProps {
  sections: PageBlock[];
  pageId: string;
}

export default function PageClient({ sections, pageId }: PageClientProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {sections.map((block) => (
        <div key={block.id} className="page-block">
          {block.collection === 'block_hero' && (
            <section className="py-20 px-4 text-center bg-gradient-to-br from-brand-primary/10 to-brand-background">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-brand-primary">SOL</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover amazing dining experiences with our digital menu solution
              </p>
            </section>
          )}

          {block.collection === 'block_richtext' && (
            <section className="py-16 px-4 max-w-4xl mx-auto">
              <div className="prose prose-lg mx-auto">
                <p className="text-gray-600 leading-relaxed">
                  Content block coming soon...
                </p>
              </div>
            </section>
          )}

          {/* Default block renderer */}
          {!['block_hero', 'block_richtext'].includes(block.collection || '') && (
            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {block.collection?.replace('block_', '').replace(/_/g, ' ') || 'Content Block'}
                  </h2>
                  <p className="text-gray-600">
                    Content for {block.collection} block will be rendered here.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      ))}
    </div>
  );
}