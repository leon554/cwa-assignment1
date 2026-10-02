import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const api = process.env.INTERNAL_API_URL ?? "http://api:3000";
    return [
      {
        source: "/health",
        destination: `${api}/health`,
      },
    ];
  },
};

export default nextConfig;
