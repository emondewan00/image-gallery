import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["mui-file-input"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
