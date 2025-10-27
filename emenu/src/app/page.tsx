import { Metadata } from 'next';
import QRScannerClient from './QRScannerClient';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'SOL eMenu',
		description: 'Digital menu experience powered by SOL',
	};
}

export default function HomePage() {
	return (
		<div className="text-center space-y-8 max-w-2xl mx-auto px-4 bg-white min-h-screen">
			{/* Welcome Message */}
			<div className="space-y-4">
				<h1 className="text-4xl md:text-6xl font-bold text-gray-900">
					Welcome to <span className="text-brand-primary">SOL</span>
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
	);
}