'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ManualTableEntryProps {
  onSubmit: (tableId: string) => void;
  onClose: () => void;
  language: 'en' | 'vi';
}

export default function ManualTableEntry({ onSubmit, onClose, language }: ManualTableEntryProps) {
  const [tableNumber, setTableNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    en: {
      title: 'Enter Table Number',
      label: 'Table Number',
      placeholder: 'e.g., A01, B12, etc.',
      submit: 'Go to Menu',
      cancel: 'Cancel',
      invalid: 'Please enter a valid table number',
      examples: 'Examples: A01, B12, C05, D10'
    },
    vi: {
      title: 'Nhập Số Bàn',
      label: 'Số Bàn',
      placeholder: 'ví dụ: A01, B12, v.v.',
      submit: 'Vào Menu',
      cancel: 'Hủy',
      invalid: 'Vui lòng nhập số bàn hợp lệ',
      examples: 'Ví dụ: A01, B12, C05, D10'
    }
  };

  const t = translations[language];

  const validateTableNumber = (value: string): boolean => {
    // Accept formats like A01, B12, C05, etc.
    const tablePattern = /^[A-Za-z]\d{2,}$/;
    return tablePattern.test(value.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTableNumber = tableNumber.trim();

    if (!trimmedTableNumber) {
      toast.error(t.invalid);
      return;
    }

    if (!validateTableNumber(trimmedTableNumber)) {
      toast.error(t.invalid);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate a brief loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      onSubmit(trimmedTableNumber.toUpperCase());
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-format to uppercase and limit to valid characters
    let value = e.target.value.toUpperCase();

    // Limit to letter followed by max 4 digits
    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    // Ensure first character is a letter
    if (value.length > 0 && !/^[A-Za-z]/.test(value[0])) {
      return;
    }

    // Ensure remaining characters are digits
    const lettersOnly = value.slice(0, 1);
    const digitsOnly = value.slice(1).replace(/[^0-9]/g, '');

    setTableNumber(lettersOnly + digitsOnly);
  };

  const handleQuickTableSelect = (tableNumber: string) => {
    setTableNumber(tableNumber);
  };

  const quickTables = ['A01', 'A02', 'B01', 'B02', 'C01', 'C02'];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tableNumber">{t.label}</Label>
            <Input
              id="tableNumber"
              type="text"
              value={tableNumber}
              onChange={handleInputChange}
              placeholder={t.placeholder}
              className="text-center text-lg font-mono"
              maxLength={5}
              autoFocus
            />
            <p className="text-xs text-gray-500 text-center">
              {t.examples}
            </p>
          </div>

          {/* Quick Selection Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Quick Select:</p>
            <div className="grid grid-cols-3 gap-2">
              {quickTables.map((table) => (
                <Button
                  key={table}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTableSelect(table)}
                  className="font-mono"
                >
                  {table}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !tableNumber.trim()}
            >
              {isSubmitting ? 'Loading...' : t.submit}
            </Button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500 border-t pt-4">
          <p>If you're unsure about your table number,</p>
          <p>please check the card on your table or ask staff for assistance.</p>
        </div>
      </CardContent>
    </Card>
  );
}