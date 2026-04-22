import type { MetadataRoute } from "next";
import { allLandingPages, blogPosts, tours } from "@/lib/catalog";
import { locales, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    urls.push({
      url: `${siteConfig.baseUrl}/${locale}`,
      lastModified: now,
      priority: locale === "tr" ? 1 : 0.9,
    });

    urls.push({
      url: `${siteConfig.baseUrl}/${locale}/turlar`,
      lastModified: now,
      priority: 0.95,
    });

    urls.push({
      url: `${siteConfig.baseUrl}/${locale}/kampanyalar`,
      lastModified: now,
      priority: 0.85,
    });

    urls.push({
      url: `${siteConfig.baseUrl}/${locale}/rehber`,
      lastModified: now,
      priority: 0.75,
    });

    for (const tour of tours) {
      urls.push({
        url: `${siteConfig.baseUrl}/${locale}/turlar/${tour.slugs[locale]}`,
        lastModified: now,
        priority: 0.9,
      });
    }

    for (const page of allLandingPages) {
      urls.push({
        url:
          page.kind === "campaign"
            ? `${siteConfig.baseUrl}/${locale}/kampanyalar/${page.slugs[locale]}`
            : `${siteConfig.baseUrl}/${locale}/${page.slugs[locale]}`,
        lastModified: now,
        priority:
          page.kind === "category" || page.kind === "destination" ? 0.82 : 0.65,
      });
    }

    for (const post of blogPosts) {
      urls.push({
        url: `${siteConfig.baseUrl}/${locale}/rehber/${post.slugs[locale]}`,
        lastModified: now,
        priority: 0.7,
      });
    }
  }

  return urls;
}
