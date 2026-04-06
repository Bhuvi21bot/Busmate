import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, "src/visual-edits/component-tagger-loader.js");
const enableOrchidsTagger = process.env.ENABLE_ORCHIDS_TAGGER === "1";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: enableOrchidsTagger
    ? {
        rules: {
          "*.{jsx,tsx}": {
            loaders: [LOADER],
          },
        },
      }
    : undefined,
};

export default nextConfig;
