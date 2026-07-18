import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/blog', '/blog/'],
    },
    sitemap: [
      'https://ilsem.vercel.app/sitemap.xml',
      'https://ilsem.vercel.app/blog/sitemap.xml',
    ],
  };
}
