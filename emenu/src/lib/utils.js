/**
 * Simple utility functions for the emenu project
 */

/**
 * Format date for display
 * @param {string | Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
	if (!date) return '';
	const d = new Date(date);
	return d.toLocaleDateString();
}

/**
 * Simple error handler
 * @param {Error} error - Error to handle
 * @returns {string} Error message
 */
export function getErrorMessage(error) {
	return error?.message || 'An unexpected error occurred';
}