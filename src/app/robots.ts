import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kilausongket.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/Teedud/", "/teedud/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

