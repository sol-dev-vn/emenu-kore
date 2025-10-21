'use client';

import { useState, useEffect } from 'react';

export default function HealthStatusClient() {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<number>(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1) {
          setLastRefreshed(new Date());
          window.location.reload(); // Refresh the page to get new health data
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm text-gray-500">
      <p>
        Auto-refresh in <span className="font-medium">{timeUntilRefresh}s</span> •
        Last updated: <span className="font-medium">{lastRefreshed.toLocaleTimeString()}</span>
      </p>
      <p className="mt-1">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          <span className="w-2 h-2 bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>
          Live Monitoring
        </span>
      </p>
    </div>
  );
}