/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  output: "export",
  poweredByHeader: false,
  images: {
    domains: ["images.pexels.com", "images.unsplash.com", "upload.wikimedia.org"],
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
