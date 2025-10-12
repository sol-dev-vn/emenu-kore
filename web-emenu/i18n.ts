import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Supported locales
const locales = ['en', 'vi'] as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const messages: Record<string, string> = (await import(`./messages/${locale}.json`)).default as Record<string, string>;

  return {
    locale,
    messages,
  };
});