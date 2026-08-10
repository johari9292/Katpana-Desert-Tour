/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  output: "export",
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./lib/static-image-loader.ts",
    deviceSizes: [480, 768, 1280, 1536],
    imageSizes: [320]
  },
  trailingSlash: true
};

export default nextConfig;
