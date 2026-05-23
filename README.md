# Katapana Desert Tour

Next.js tourism website for northern Pakistan travel services focused on:

- Tour package pages for Skardu, Hunza, Deosai, Khaplu, Shigar, Astore, and K2-side trekking
- Destination pages with local images, overviews, activities, and route notes
- Skardu hotel and rent a car services
- Suggested routes for Katapana Desert, Kachura Lakes, Deosai, Shigar Fort, Khaplu Palace, Hunza, and Astore
- Downloaded local Skardu hero video with animated destination-point routing
- Clean lower-page Katapana Desert video preview

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Publish

The project is configured for static export with Next.js, so it can be deployed to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

```bash
npm run build
```

The static output is generated in `out/`.

## SEO Notes

The homepage includes Next.js metadata, canonical URL, Open Graph tags, generated `robots.txt`, generated `sitemap.xml`, TravelAgency schema, WebSite schema, FAQ schema, VideoObject schema, descriptive headings, route content, and long-tail Skardu tourism search intent.

Note: the requested stack uses Next.js 14. npm audit currently flags known advisories across the Next.js 14 line. This project is configured as a static export, but a production server-rendered deployment should upgrade to a patched Next.js release when possible.
