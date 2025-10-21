'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleLineChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
  height?: number;
  color?: string;
  showPoints?: boolean;
}

export function SimpleLineChart({
  data,
  title,
  height = 200,
  color = '#9B1D20',
  showPoints = true
}: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return { x, y, value: item.value, name: item.name };
  });

  // Create SVG path
  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
    .join(' ');

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height }} className="relative">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="0.5"
              />
            ))}

            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="2"
            />

            {/* Points */}
            {showPoints && points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="3"
                fill={color}
                className="hover:r-4 transition-all cursor-pointer"
              />
            ))}

            {/* X-axis labels */}
            {points.map((point, index) => (
              <text
                key={`x-label-${index}`}
                x={point.x}
                y="95"
                textAnchor="middle"
                fontSize="8"
                fill="#6B7280"
              >
                {point.name}
              </text>
            ))}

            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((y, index) => {
              const value = maxValue - (range * y) / 100;
              return (
                <text
                  key={`y-label-${index}`}
                  x="5"
                  y={y}
                  textAnchor="start"
                  fontSize="8"
                  fill="#6B7280"
                  alignmentBaseline="middle"
                >
                  {Math.round(value)}
                </text>
              );
            })}
          </svg>

          {/* Tooltip on hover */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {points.map((point, index) => (
              <div
                key={`tooltip-${index}`}
                className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -120%)'
                }}
              >
                <div className="font-medium">{point.name}</div>
                <div>Value: {point.value}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}