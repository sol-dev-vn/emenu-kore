'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleBarChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  height?: number;
  showValues?: boolean;
}

export function SimpleBarChart({
  data,
  title,
  height = 200,
  showValues = true
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height }} className="flex items-end justify-between space-x-2">
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: item.color || '#9B1D20',
                    minHeight: '4px'
                  }}
                />
                {showValues && (
                  <span className="text-sm font-medium mt-2 text-gray-700">
                    {item.value}
                  </span>
                )}
                <span className="text-xs text-gray-500 mt-1 text-center">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}