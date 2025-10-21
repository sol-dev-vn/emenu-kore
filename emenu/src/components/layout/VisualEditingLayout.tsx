'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { useVisualEditing } from '@/hooks/useVisualEditing';
import { useRouter, usePathname } from 'next/navigation';
import NavigationBar from '@/components/layout/NavigationBar';
import Footer from '@/components/layout/Footer';

interface VisualEditingLayoutProps {
	headerNavigation: any;
	footerNavigation: any;
	globals: any;
	children: ReactNode;
}

export default function VisualEditingLayout({
	headerNavigation,
	footerNavigation,
	globals,
	children,
}: VisualEditingLayoutProps) {
	const navRef = useRef<HTMLElement>(null);
	const footerRef = useRef<HTMLElement>(null);
	const { isVisualEditingEnabled, apply } = useVisualEditing();
	const router = useRouter();
	const pathname = usePathname();

	// Check if we're on pages that shouldn't show header/footer
	const isExcludedPage = ['/', '/login'].includes(pathname);

	useEffect(() => {
		if (isVisualEditingEnabled && !isExcludedPage) {
			// Apply visual editing for the navigation bar if its ref is set.
			if (navRef.current) {
				apply({
					elements: [navRef.current],
					onSaved: () => router.refresh(),
				});
			}
			// Apply visual editing for the footer if its ref is set.
			if (footerRef.current) {
				apply({
					elements: [footerRef.current],
					onSaved: () => router.refresh(),
				});
			}
		}
	}, [isVisualEditingEnabled, apply, router, isExcludedPage]);

	return (
		<>
			{/* Only show navigation and footer if not on excluded pages */}
			{!isExcludedPage && <NavigationBar ref={navRef} navigation={headerNavigation} globals={globals} />}
			{children}
			{!isExcludedPage && <Footer ref={footerRef} navigation={footerNavigation} globals={globals} />}
		</>
	);
}
