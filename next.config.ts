/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ezzel a beállítással a build sikeresen lefut,
    // még akkor is, ha a projektben típus-hibák vannak.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
