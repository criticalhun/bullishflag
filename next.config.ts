// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! FIGYELEM !!
    // Ezzel a beállítással a production build sikeresen lefut,
    // még akkor is, ha a projektben típus-hibák vannak.
    // !! FIGYELEM !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;