import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "tesseract.js", "mupdf"],

  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/tesseract.js/src/worker-script/**/*",
    ],
  },
};

export default nextConfig;