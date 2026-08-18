import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "tesseract.js", "mupdf"],

  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/tesseract.js/**/*",
    ],
  },
};

export default nextConfig;