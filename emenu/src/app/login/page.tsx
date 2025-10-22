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
import { Loader2, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PageContainer from '@/components/ui/PageContainer';

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
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 py-12">
			<PageContainer size="sm" className="w-full space-y-8">
				<div className="text-center">
					<img
						className="mx-auto h-16 w-auto mb-4"
						src="/icons/logo_trim.png"
						alt="SOL eMenu"
					/>
					<h2 className="text-3xl font-bold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Access the SOL eMenu system
					</p>
				</div>

				<Card className="bg-brand-background/95 backdrop-blur-sm border-accent/20">
					<CardHeader>
						<CardTitle className="text-brand-text">Login</CardTitle>
						<CardDescription className="text-brand-text/70">
							Enter your credentials to access the dashboard
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
								<Label htmlFor="email" className="text-brand-text">Email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									required
									disabled={isLoading}
									className="bg-background/50 border-accent/30 text-brand-text placeholder:text-brand-text/50"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-brand-text">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										required
										disabled={isLoading}
										className="bg-background/50 border-accent/30 text-brand-text placeholder:text-brand-text/50"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-brand-text/60 hover:text-brand-text"
										onClick={() => setShowPassword(!showPassword)}
										disabled={isLoading}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="remember-me"
									checked={rememberMe}
									onCheckedChange={(checked) => setRememberMe(checked as boolean)}
									disabled={isLoading}
									className="border-accent/30"
								/>
								<Label
									htmlFor="remember-me"
									className="text-sm text-brand-text cursor-pointer"
								>
									Remember me
								</Label>
							</div>
						</CardContent>

						<CardFooter>
							<Button
								type="submit"
								className="w-full"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<LoadingSpinner size="sm" className="mr-2" />
										Signing in...
									</>
								) : (
									'Sign in'
								)}
							</Button>
						</CardFooter>
					</form>
				</Card>

				<div className="text-center text-sm text-gray-600">
					<p>
						Need help? Contact your system administrator
					</p>
				</div>
			</PageContainer>
		</div>
	);
}