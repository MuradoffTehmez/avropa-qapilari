import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*/admin",
          "/*/admin/",
          "/*/hesab",
          "/*/hesab/",
          "/*/sebet",
          "/*/sifaris",
          "/*/service/door/",
          "/api/",
        ],
      },
    ],
    sitemap: `${brand.siteUrl}/sitemap.xml`,
    host: brand.siteUrl,
  };
}
