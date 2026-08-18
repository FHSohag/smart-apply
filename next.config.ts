import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pdf-parse",
    "tesseract.js",
    "mupdf",
    "bmp-js",
    "wasm-feature-detect",
  ],

  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/tesseract.js/**/*",
      "./node_modules/bmp-js/**/*",
      "./node_modules/wasm-feature-detect/**/*",
    ],
  },
};

export default nextConfig;