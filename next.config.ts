import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qzrjsurtdguvmipusefj.supabase.co',
      },
    ],
  },
};

export default nextConfig;
