import { hasRole, canAccessResource } from '../auth';

// Mock user roles for testing
const testRoles = ['Administrator', 'Manager', 'Staff'];

describe('hasRole', () => {
	test('should return true when user has the required role', () => {
		expect(hasRole('Administrator', 'Administrator')).toBe(true);
		expect(hasRole('Manager', 'Manager')).toBe(true);
		expect(hasRole('Staff', 'Staff')).toBe(true);
	});

	test('should return false when user does not have the required role', () => {
		expect(hasRole('Staff', 'Administrator')).toBe(false);
		expect(hasRole('Manager', 'Administrator')).toBe(false);
	});

	test('should return true when user has one of the required roles', () => {
		expect(hasRole('Administrator', ['Administrator', 'Manager'])).toBe(true);
		expect(hasRole('Manager', ['Administrator', 'Manager'])).toBe(true);
	});

	test('should return false when user has none of the required roles', () => {
		expect(hasRole('Staff', ['Administrator', 'Manager'])).toBe(false);
	});
});

describe('canAccessResource', () => {
	test('should allow administrators full access to all resources', () => {
		expect(canAccessResource('Administrator', 'restaurants', 'read')).toBe(true);
		expect(canAccessResource('Administrator', 'restaurants', 'write')).toBe(true);
		expect(canAccessResource('Administrator', 'restaurants', 'delete')).toBe(true);
		expect(canAccessResource('Administrator', 'settings', 'delete')).toBe(true);
	});

	test('should allow managers appropriate access', () => {
		expect(canAccessResource('Manager', 'restaurants', 'read')).toBe(true);
		expect(canAccessResource('Manager', 'restaurants', 'write')).toBe(true);
		expect(canAccessResource('Manager', 'restaurants', 'delete')).toBe(false);
		expect(canAccessResource('Manager', 'settings', 'read')).toBe(false);
	});

	test('should allow staff limited access', () => {
		expect(canAccessResource('Staff', 'restaurants', 'read')).toBe(true);
		expect(canAccessResource('Staff', 'restaurants', 'write')).toBe(false);
		expect(canAccessResource('Staff', 'menus', 'write')).toBe(true);
		expect(canAccessResource('Staff', 'settings', 'read')).toBe(false);
	});

	test('should return false for unknown roles', () => {
		expect(canAccessResource('Unknown', 'restaurants', 'read')).toBe(false);
	});
});

describe('Role-based access control', () => {
	test('should properly enforce role hierarchy', () => {
		// Administrator can do everything
		expect(canAccessResource('Administrator', 'staff', 'delete')).toBe(true);
		
		// Manager has limited permissions
		expect(canAccessResource('Manager', 'staff', 'delete')).toBe(false);
		expect(canAccessResource('Manager', 'staff', 'write')).toBe(true);
		
		// Staff has the most limited permissions
		expect(canAccessResource('Staff', 'staff', 'write')).toBe(false);
		expect(canAccessResource('Staff', 'staff', 'read')).toBe(true);
	});
});