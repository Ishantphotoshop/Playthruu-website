import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/news";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();
  return [
    {
      url: "https://playthruu.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://playthruu.com/news",
      lastModified: articles[0] ? new Date(articles[0].updated_at) : new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    ...articles.map(function (a) {
      return {
        url: "https://playthruu.com/news/" + a.slug,
        lastModified: new Date(a.updated_at),
        changeFrequency: "daily" as const,
        priority: a.importance === "breaking" ? 0.8 : 0.6,
      };
    }),
  ];
}
