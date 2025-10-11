'use client';

import { useState } from 'react';
import VisualTableCanvas from '@/components/VisualTableCanvas';

export default function VisualTableManagement() {
  const [selectedTable, setSelectedTable] = useState<any>(null);

  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
    // Here you could open a modal or show table details
    console.log('Selected table:', table);
  };

  return (
    <VisualTableCanvas
      onTableSelect={handleTableSelect}
      readOnly={false}
    />
  );
}