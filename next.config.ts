import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/design/**",
      },
      {
        // Allow any HTTPS image source returned by the backend
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
