import { getDashboardData, type DashboardData } from './dashboard';

interface CacheEntry<T> {
	data: T;
	timestamp: number;
	expiresAt: number;
}

class DataCache {
	private cache = new Map<string, CacheEntry<any>>();
	private defaultTTL = 30000; // 30 seconds default TTL

	set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
		const now = Date.now();
		this.cache.set(key, {
			data,
			timestamp: now,
			expiresAt: now + ttl
		});
	}

	get<T>(key: string): T | null {
		const entry = this.cache.get(key);
		if (!entry) return null;

		if (Date.now() > entry.expiresAt) {
			this.cache.delete(key);
			return null;
		}

		return entry.data;
	}

	clear(): void {
		this.cache.clear();
	}

	// Clean up expired entries
	cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now > entry.expiresAt) {
				this.cache.delete(key);
			}
		}
	}
}

// Global cache instance
const dataCache = new DataCache();

// Cache cleanup interval (every minute)
setInterval(() => dataCache.cleanup(), 60000);

export class DataSync {
	private static instance: DataSync;
	private subscribers = new Map<string, Set<(data: any) => void>>();
	private syncIntervals = new Map<string, NodeJS.Timeout>();

	private constructor() {}

	static getInstance(): DataSync {
		if (!DataSync.instance) {
			DataSync.instance = new DataSync();
		}
		return DataSync.instance;
	}

	// Subscribe to data changes
	subscribe(key: string, callback: (data: any) => void): () => void {
		if (!this.subscribers.has(key)) {
			this.subscribers.set(key, new Set());
		}
		this.subscribers.get(key)!.add(callback);

		// Return unsubscribe function
		return () => {
			const subscribers = this.subscribers.get(key);
			if (subscribers) {
				subscribers.delete(callback);
				if (subscribers.size === 0) {
					this.subscribers.delete(key);
				}
			}
		};
	}

	// Notify subscribers of data changes
	private notify(key: string, data: any): void {
		const subscribers = this.subscribers.get(key);
		if (subscribers) {
			subscribers.forEach(callback => {
				try {
					callback(data);
				} catch (error) {
					console.error('Error in data sync subscriber:', error);
				}
			});
		}
	}

	// Start periodic sync for a data key
	startSync(key: string, dataFetcher: () => Promise<any>, interval: number = 30000): void {
		// Clear existing interval if any
		if (this.syncIntervals.has(key)) {
			clearInterval(this.syncIntervals.get(key)!);
		}

		// Set up new interval
		const syncInterval = setInterval(async () => {
			try {
				const data = await dataFetcher();
				dataCache.set(key, data);
				this.notify(key, data);
			} catch (error) {
				console.error(`Error syncing data for key ${key}:`, error);
			}
		}, interval);

		this.syncIntervals.set(key, syncInterval);

		// Initial fetch
		dataFetcher().then(data => {
			dataCache.set(key, data);
			this.notify(key, data);
		}).catch(error => {
			console.error(`Initial fetch error for key ${key}:`, error);
		});
	}

	// Stop periodic sync for a data key
	stopSync(key: string): void {
		const interval = this.syncIntervals.get(key);
		if (interval) {
			clearInterval(interval);
			this.syncIntervals.delete(key);
		}
	}

	// Get cached data or fetch fresh data
	async getData(key: string, dataFetcher: () => Promise<any>, ttl: number = 30000): Promise<any> {
		// Try cache first
		const cached = dataCache.get(key);
		if (cached) {
			return cached;
		}

		// Fetch fresh data
		try {
			const data = await dataFetcher();
			dataCache.set(key, data, ttl);
			return data;
		} catch (error) {
			console.error(`Error fetching data for key ${key}:`, error);
			throw error;
		}
	}

	// Force refresh data for a key
	async refreshData(key: string, dataFetcher: () => Promise<any>): Promise<any> {
		try {
			const data = await dataFetcher();
			dataCache.set(key, data);
			this.notify(key, data);
			return data;
		} catch (error) {
			console.error(`Error refreshing data for key ${key}:`, error);
			throw error;
		}
	}
}

// Dashboard-specific sync utilities
export const dashboardSync = {
	// Get dashboard data with caching
	async getDashboardData(branchId: string, userId?: string): Promise<DashboardData> {
		const key = `dashboard:${branchId}:${userId || 'anonymous'}`;
		const dataSync = DataSync.getInstance();

		return dataSync.getData(key, () => getDashboardData(branchId, userId));
	},

	// Start real-time sync for dashboard
	startRealTimeSync(branchId: string, userId: string, callback: (data: DashboardData) => void): () => void {
		const key = `dashboard:${branchId}:${userId}`;
		const dataSync = DataSync.getInstance();

		// Subscribe to changes
		const unsubscribe = dataSync.subscribe(key, callback);

		// Start periodic sync
		dataSync.startSync(key, () => getDashboardData(branchId, userId), 30000); // 30 seconds

		// Return cleanup function
		return () => {
			unsubscribe();
			dataSync.stopSync(key);
		};
	},

	// Force refresh dashboard data
	async refreshDashboardData(branchId: string, userId?: string): Promise<DashboardData> {
		const key = `dashboard:${branchId}:${userId || 'anonymous'}`;
		const dataSync = DataSync.getInstance();

		return dataSync.refreshData(key, () => getDashboardData(branchId, userId));
	}
};

export default DataSync;