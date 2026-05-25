import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/studio/"],
        crawlDelay: 10
      }
    ],
    sitemap: "https://www.katpanadesert.com/sitemap.xml"
  };
}
