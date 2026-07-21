import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://therapickdubai.vercel.app';

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
    'downtown-dubai',
    'dubai-marina',
    'jumeirah',
    'palm-jumeirah',
    'difc',
    'business-bay',
  ].map((location) => ({
    url: `${baseUrl}/locations/${location}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...locations];
}
