import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure Next.js uses this app directory as the workspace root
  outputFileTracingRoot: path.join(__dirname),
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);