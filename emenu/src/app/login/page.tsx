'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	
	const { login, isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	
	// Get redirect URL from query params
	const redirectTo = searchParams.get('redirect') || '/hub';

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
			const result = await login(email, password);
			
			if (result.success) {
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
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<img
						className="mx-auto h-12 w-auto"
						src="/images/logo.svg"
						alt="SOL.com.vn"
					/>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Access the SOL staff dashboard
					</p>
				</div>
				
				<Card>
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>
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
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									required
									disabled={isLoading}
								/>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										required
										disabled={isLoading}
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
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
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
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
			</div>
		</div>
	);
}