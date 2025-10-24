import { useDirectus } from './directus/directus';

export async function createDirectusClient() {
  const { directus } = useDirectus();

  return directus;
}

// Alias for backward compatibility
export const getDirectusClient = createDirectusClient;