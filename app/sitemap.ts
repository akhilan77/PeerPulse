import { MetadataRoute } from 'next';
import { getAllDistricts } from '@/lib/data/districts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://peerpulse.ai';
  const districts = getAllDistricts();

  const districtEntries: MetadataRoute.Sitemap = districts.map((d) => ({
    url: `${baseUrl}/districts/${d.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/districts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...districtEntries,
  ];
}
