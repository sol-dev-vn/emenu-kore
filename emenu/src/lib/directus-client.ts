import { useDirectus } from './directus/directus';

export async function createDirectusClient() {
  const { directus } = useDirectus();

  return directus;
}