import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") || "www.elexoirhomespaubud.com";
  const isBaliDomain = host.includes("balihomespaandmassage.com");
  const baseUrl = isBaliDomain ? 'https://www.balihomespaandmassage.com' : 'https://www.elexoirhomespaubud.com';

  // Core pages
  const routes = [
    '',
    '/store',
    '/review',
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
