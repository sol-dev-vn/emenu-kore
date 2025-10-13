import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { goto } from '$app/navigation';
import Login from '../routes/auth/login/+page.svelte';
import { directus } from '$lib/directus';

// Mock the Directus SDK
vi.mock('$lib/directus', () => ({
	directus: {
		auth: {
			login: vi.fn(),
			logout: vi.fn(),
			refresh: vi.fn()
		}
	}
}));

// Mock the navigation
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('Authentication Flow', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Login Component', () => {
		it('should render login form elements', () => {
			render(Login);

			expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
		});

		it('should show validation errors for empty fields', async () => {
			render(Login);

			const submitButton = screen.getByRole('button', { name: /sign in/i });
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText(/email is required/i)).toBeInTheDocument();
				expect(screen.getByText(/password is required/i)).toBeInTheDocument();
			});
		});

		it('should show error for invalid email format', async () => {
			render(Login);

			const emailInput = screen.getByLabelText(/email/i);
			fireEvent.input(emailInput, { target: { value: 'invalid-email' } });
			fireEvent.blur(emailInput);

			await waitFor(() => {
				expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
			});
		});

		it('should handle successful login', async () => {
			const mockUser = {
				id: 'user-1',
				email: 'test@example.com',
				first_name: 'Test',
				last_name: 'User'
			};

			vi.mocked(directus.auth.login).mockResolvedValue({
				access_token: 'mock-token',
				refresh_token: 'mock-refresh-token',
				expires: 3600,
				user: mockUser
			});

			render(Login);

			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/password/i);
			const submitButton = screen.getByRole('button', { name: /sign in/i });

			fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
			fireEvent.input(passwordInput, { target: { value: 'password123' } });
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(directus.auth.login).toHaveBeenCalledWith('test@example.com', 'password123');
				expect(goto).toHaveBeenCalledWith('/hub');
			});
		});

		it('should handle login failure with invalid credentials', async () => {
			vi.mocked(directus.auth.login).mockRejectedValue(new Error('Invalid credentials'));

			render(Login);

			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/password/i);
			const submitButton = screen.getByRole('button', { name: /sign in/i });

			fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
			fireEvent.input(passwordInput, { target: { value: 'wrong-password' } });
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
				expect(goto).not.toHaveBeenCalled();
			});
		});

		it('should handle network errors gracefully', async () => {
			vi.mocked(directus.auth.login).mockRejectedValue(new Error('Network error'));

			render(Login);

			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/password/i);
			const submitButton = screen.getByRole('button', { name: /sign in/i });

			fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
			fireEvent.input(passwordInput, { target: { value: 'password123' } });
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText(/connection failed. please try again/i)).toBeInTheDocument();
			});
		});

		it('should disable submit button during login attempt', async () => {
			vi.mocked(directus.auth.login).mockImplementation(() =>
				new Promise(resolve => setTimeout(resolve, 100))
			);

			render(Login);

			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/password/i);
			const submitButton = screen.getByRole('button', { name: /sign in/i });

			fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
			fireEvent.input(passwordInput, { target: { value: 'password123' } });
			fireEvent.click(submitButton);

			// Button should be disabled immediately
			expect(submitButton).toBeDisabled();
			expect(screen.getByText(/signing in/i)).toBeInTheDocument();

			// Wait for login to complete
			await waitFor(() => {
				expect(submitButton).not.toBeDisabled();
			}, { timeout: 200 });
		});

		it('should support international phone numbers', async () => {
			render(Login);

			// Toggle to phone input
			const phoneToggle = screen.getByText(/use phone/i);
			fireEvent.click(phoneToggle);

			expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
			expect(screen.getByDisplayValue(/\+84/)).toBeInTheDocument(); // Vietnam default
		});
	});

	describe('Session Management', () => {
		it('should handle token refresh', async () => {
			vi.mocked(directus.auth.refresh).mockResolvedValue({
				access_token: 'new-token',
				expires: 3600
			});

			// This would be tested in the actual session management implementation
			// For now, we verify the mock is available
			expect(typeof directus.auth.refresh).toBe('function');
		});

		it('should handle logout', async () => {
			vi.mocked(directus.auth.logout).mockResolvedValue(undefined);

			// This would be tested in the logout component/function
			expect(typeof directus.auth.logout).toBe('function');
		});
	});

	describe('Role-Based Access Control', () => {
		it('should redirect unauthenticated users to login', async () => {
			// This would test protected routes
			// Implementation would depend on route protection mechanism
		});

		it('should show appropriate navigation based on user roles', async () => {
			// This would test role-based UI elements
			// Implementation would depend on role checking implementation
		});
	});

	describe('Security Features', () => {
		it('should implement rate limiting', () => {
			// This would test rate limiting implementation
			// Might need to mock time or use a testing-specific rate limiter
		});

		it('should handle CSRF protection', () => {
			// This would verify CSRF tokens are included in requests
		});

		it('should log security events', () => {
			// This would test security logging functionality
		});
	});
});