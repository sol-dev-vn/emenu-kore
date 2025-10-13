import { describe, it, expect } from 'vitest';
import { formatDate, getErrorMessage } from './utils';

describe('Utility Functions', () => {
	describe('formatDate', () => {
		it('should format date strings correctly', () => {
			const dateString = '2024-01-15';
			const result = formatDate(dateString);
			expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Matches MM/DD/YYYY format
		});

		it('should format Date objects correctly', () => {
			const date = new Date('2024-01-15');
			const result = formatDate(date);
			expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
		});

		it('should return empty string for null/undefined input', () => {
			expect(formatDate(null)).toBe('');
			expect(formatDate(undefined)).toBe('');
			expect(formatDate('')).toBe('');
		});

		it('should handle invalid date strings', () => {
			const result = formatDate('invalid-date');
			expect(result).toBe('Invalid Date'); // Should return Invalid Date for invalid inputs
		});
	});

	describe('getErrorMessage', () => {
		it('should return error message from Error object', () => {
			const error = new Error('Test error message');
			expect(getErrorMessage(error)).toBe('Test error message');
		});

		it('should return default message for null/undefined', () => {
			expect(getErrorMessage(null)).toBe('An unexpected error occurred');
			expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
		});

		it('should return default message when error has no message', () => {
			const error = new Error();
			expect(getErrorMessage(error)).toBe('An unexpected error occurred');
		});

		it('should handle objects with message property', () => {
			const error = { message: 'Custom error message' };
			expect(getErrorMessage(error)).toBe('Custom error message');
		});

		it('should return default message for non-error objects', () => {
			const error = { someProperty: 'value' };
			expect(getErrorMessage(error)).toBe('An unexpected error occurred');
		});
	});
});