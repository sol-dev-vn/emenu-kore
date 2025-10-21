'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { VirtualScroller } from '@/lib/performance';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
}

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  className,
  overscan = 3,
  onScroll
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const virtualScroller = useMemo(
    () => new VirtualScroller(items, itemHeight, height),
    [items, itemHeight, height]
  );

  const visibleItems = useMemo(() => {
    virtualScroller.updateScrollTop(scrollTop);
    const result = virtualScroller.getVisibleItems();

    // Add overscan items for smoother scrolling
    const startIndex = Math.max(0, result.startIndex - overscan);
    const endIndex = Math.min(items.length - 1, result.endIndex + overscan);

    return {
      items: items.slice(startIndex, endIndex + 1),
      startIndex,
      endIndex
    };
  }, [items, scrollTop, itemHeight, height, overscan]);

  const totalHeight = virtualScroller.getTotalHeight();
  const offsetY = virtualScroller.getOffsetY();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  };

  return (
    <div
      ref={scrollElementRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.items.map((item, index) => {
            const actualIndex = visibleItems.startIndex + index;
            return (
              <div
                key={actualIndex}
                style={{ height: itemHeight }}
                className="flex items-center"
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;