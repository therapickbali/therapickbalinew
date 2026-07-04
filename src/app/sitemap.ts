import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://therapickbali.vercel.app';

  // Core pages
  const routes = [
    '',
    '/store',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Location pages
  const locations = [
    'ubud',
    'canggu',
    'seminyak',
    'uluwatu',
    'sanur',
    'nusa-dua',
  ].map((location) => ({
    url: `${baseUrl}/locations/${location}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...locations];
}
