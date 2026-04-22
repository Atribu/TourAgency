import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        allow: "/",
        userAgent: "*",
      },
      {
        disallow: ["/api/", "/tr/admin", "/en/admin", "/de/admin", "/ru/admin"],
        userAgent: "*",
      },
    ],
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
