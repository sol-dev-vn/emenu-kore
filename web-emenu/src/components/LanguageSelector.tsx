'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LanguageSelectorProps {
  currentLanguage: 'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'ru';
  onLanguageChange: (language: 'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'ru') => void;
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'vi' as const, name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ja' as const, name: '日本語', flag: '🇯🇵' },
    { code: 'ko' as const, name: '한국어', flag: '🇰🇷' },
    { code: 'zh' as const, name: '中文', flag: '🇨🇳' },
    { code: 'ru' as const, name: 'Русский', flag: '🇷🇺' }
  ];

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <Select
        value={currentLanguage}
        onValueChange={(value: 'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'ru') => onLanguageChange(value)}
      >
        <SelectTrigger className="w-32 bg-white border-gray-200 shadow-sm">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentLanguageData?.flag}</span>
              <span className="text-sm">{currentLanguageData?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200 shadow-lg">
          {languages.map((language) => (
            <SelectItem
              key={language.code}
              value={language.code}
              className="cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}