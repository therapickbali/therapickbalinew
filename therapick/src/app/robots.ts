import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") || "www.therapickhomespaubud.com";
  const isBaliDomain = host.includes("balihomespaandmassage.com");
  const baseUrl = isBaliDomain ? 'https://www.balihomespaandmassage.com' : 'https://www.therapickhomespaubud.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
