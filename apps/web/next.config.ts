import "@website/env/web";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
  poweredByHeader: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

// Consumed by the Next.js build, never imported by TypeScript code.
// fallow-ignore-next-line unused-export
export default nextConfig;

void initOpenNextCloudflareForDev();
