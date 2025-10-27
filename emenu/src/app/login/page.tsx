'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const { login, isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	
	// Get redirect URL from query params
	const redirectTo = searchParams.get('redirect') || '/hub';

	// Load saved credentials on mount
	useEffect(() => {
		const savedEmail = localStorage.getItem('remembered_email');
		const savedRememberMe = localStorage.getItem('remember_me') === 'true';

		if (savedEmail && savedRememberMe) {
			setEmail(savedEmail);
			setRememberMe(true);
		}
	}, []);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			router.push(redirectTo);
		}
	}, [isAuthenticated, router, redirectTo]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const result = await login(email, password, rememberMe);

			if (result.success) {
				// Save email if remember me is checked
				if (rememberMe) {
					localStorage.setItem('remembered_email', email);
					localStorage.setItem('remember_me', 'true');
				} else {
					localStorage.removeItem('remembered_email');
					localStorage.removeItem('remember_me');
				}

				// Use window.location for a full page refresh to ensure cookies are properly set
				window.location.href = redirectTo;
			} else {
				setError(result.error || 'Login failed');
			}
		} catch (err) {
			setError('An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex flex-col">
			{/* Responsive Header */}
			<header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center space-x-4">
							<img
								className="h-10 w-auto sm:h-12"
								src="/images/logo_trim.png"
								alt="SOL eMenu"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Shield className="h-4 w-4 text-gray-600" />
							<span className="text-sm text-gray-600 hidden sm:inline">
								Secure Login
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md">
					{/* Welcome Section */}
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<Lock className="h-6 w-6 text-primary" />
							</div>
						</div>
						<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
							Welcome back
						</h1>
						<p className="mt-2 text-sm text-gray-600">
							Sign in to access the SOL eMenu dashboard
						</p>
					</div>

					{/* Login Card */}
					<Card className="border-0 shadow-lg">
						<CardHeader className="space-y-1 pb-4">
							<CardTitle className="text-xl text-center text-gray-900 font-semibold">Sign In</CardTitle>
							<CardDescription className="text-center text-gray-600">
								Enter your credentials to continue
							</CardDescription>
						</CardHeader>

						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								{error && (
									<Alert variant="destructive">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								<div className="space-y-2">
									<Label htmlFor="email" className="flex items-center gap-2 text-gray-900">
										<Mail className="h-4 w-4" />
										Email Address
									</Label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="name@example.com"
										required
										disabled={isLoading}
										className="h-11 bg-white text-gray-900 border-gray-300"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password" className="flex items-center gap-2 text-gray-900">
										<Lock className="h-4 w-4" />
										Password
									</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? 'text' : 'password'}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Enter your password"
											required
											disabled={isLoading}
											className="h-11 pr-12 bg-white text-gray-900 border-gray-300"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
											disabled={isLoading}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4 text-gray-600" />
											) : (
												<Eye className="h-4 w-4 text-gray-600" />
											)}
										</Button>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="remember-me"
											checked={rememberMe}
											onCheckedChange={(checked) => setRememberMe(checked as boolean)}
											disabled={isLoading}
										/>
										<Label
											htmlFor="remember-me"
											className="text-sm font-medium cursor-pointer text-gray-900"
										>
											Remember me
										</Label>
									</div>
								</div>
							</CardContent>

							<CardFooter className="flex flex-col space-y-4 pt-6">
								<Button
									type="submit"
									className="w-full h-11"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Signing in...
										</>
									) : (
										'Sign In'
									)}
								</Button>
							</CardFooter>
						</form>
					</Card>

					{/* Help Section */}
					<div className="mt-8 text-center">
						<div className="space-y-4">
							<Separator className="max-w-xs mx-auto" />
							<div className="space-y-2">
								<p className="text-sm text-gray-600">
									Need assistance with your account?
								</p>
								<div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
									<Button variant="link" className="h-auto p-0 text-gray-900 hover:text-red-600">
										Contact Administrator
									</Button>
									<span className="text-gray-500 hidden sm:inline">•</span>
									<Button variant="link" className="h-auto p-0 text-gray-900 hover:text-red-600">
										System Support
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t bg-gray-50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-14 items-center justify-center">
						<p className="text-xs text-gray-600">
							© 2025 SOL eMenu. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}