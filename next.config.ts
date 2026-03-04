import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      { hostname: "img.clerk.com" },
    ],
  },

  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },

  // experimental: {
  //   optimizePackageImports: ["lucide-react"],
  // },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("handlebars");
    }
    return config;
  },
};

export default nextConfig;
