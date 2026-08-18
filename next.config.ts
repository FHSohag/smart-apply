import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pdf-parse",
    "tesseract.js",
    "mupdf",
    "bmp-js",
  ],

  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/tesseract.js/**/*",
      "./node_modules/bmp-js/**/*",
    ],
  },
};

export default nextConfig;