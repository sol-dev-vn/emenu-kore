'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PerformanceMonitor } from '@/lib/performance';
import { Activity, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface MetricData {
  name: string;
  duration: number;
  status: 'good' | 'warning' | 'slow';
  timestamp: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [history, setHistory] = useState<MetricData[]>([]);

  useEffect(() => {
    const updateMetrics = () => {
      const currentMetrics = PerformanceMonitor.getAllMetrics();
      setMetrics(currentMetrics);

      // Add to history
      const newHistory: MetricData[] = Object.entries(currentMetrics).map(([name, duration]) => ({
        name,
        duration,
        status: duration < 50 ? 'good' : duration < 100 ? 'warning' : 'slow',
        timestamp: Date.now()
      }));

      setHistory(prev => [...prev.slice(-49), ...newHistory]); // Keep last 50 entries
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    PerformanceMonitor.clearMetrics();
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'slow':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'slow':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const averagePerformance = Object.values(metrics).length > 0
    ? Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.values(metrics).length
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isMonitoring ? 'default' : 'secondary'}>
              {isMonitoring ? 'Monitoring' : 'Stopped'}
            </Badge>
            <Button
              variant={isMonitoring ? 'destructive' : 'default'}
              size="sm"
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
            >
              {isMonitoring ? 'Stop' : 'Start'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {averagePerformance.toFixed(1)}ms
              </div>
              <div className="text-sm text-gray-600">Average Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(metrics).length}
              </div>
              <div className="text-sm text-gray-600">Active Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {history.filter(h => h.status === 'slow').length}
              </div>
              <div className="text-sm text-gray-600">Slow Operations</div>
            </div>
          </div>

          {Object.keys(metrics).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No performance data available</p>
              <p className="text-sm">Click "Start" to begin monitoring</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(metrics)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([name, duration]) => {
                  const status = duration < 50 ? 'good' : duration < 100 ? 'warning' : 'slow';
                  return (
                    <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <div className="font-medium text-sm">{name}</div>
                          <div className="text-xs text-gray-500">
                            Last executed: {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(status)}>
                          {duration.toFixed(1)}ms
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.slice(-20).reverse().map((metric, index) => (
                <div key={`${metric.name}-${metric.timestamp}-${index}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metric.status)}
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(metric.status)} variant="outline">
                      {metric.duration.toFixed(1)}ms
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(metric.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PerformanceMonitor;