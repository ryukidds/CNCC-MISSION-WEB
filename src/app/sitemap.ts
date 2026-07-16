import type { MetadataRoute } from 'next';
import db from '@/data/cncc_db.json';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cncc-web.vercel.app';
const lastModified = new Date();

const staticRoutes = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/global', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/projects', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/support', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const ministryRoutes = db.ministryDetails.map((ministry) => ({
    url: `${siteUrl}/ministries/${ministry.id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...ministryRoutes,
  ];
}
