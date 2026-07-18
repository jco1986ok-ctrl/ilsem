import { MetadataRoute } from 'next';

const baseUrl = 'https://ilsem.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const calcPages = [
    '/calc/average-wage',
    '/calc/retirement-pay',
    '/calc/annual-leave-pay',
    '/calc/four-insurance',
    '/calc/injury-leave-pay',
    '/calc/disability-pay',
    '/calc/survivor-pay',
    '/calc/overwork-risk',
    '/calc/injury-insurance-fee',
    '/calc/self-diagnosis',
  ];

  const staticPages = ['/', '/report', '/blog', '/privacy', '/terms'];

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1.0 : 0.8,
    })),
    ...calcPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ];
}
