// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Solo si usas imágenes externas — por ahora déjalo vacío
      // { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;