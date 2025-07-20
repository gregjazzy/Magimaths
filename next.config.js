/** @type {import('next').NextConfig} */
const nextConfig = {
  // Retirer output: 'standalone' en développement
  // output: 'standalone', // Pour containerisation si besoin (uniquement pour production)
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'], // Formats optimisés
  },
  compress: true, // Compression gzip
  poweredByHeader: false, // Sécurité
  generateEtags: false, // Performance cache
  // Optimisation bundle (désactivée temporairement pour résoudre l'erreur critters)
  experimental: {
    // optimizeCss: true,
  },
  // Cache headers pour CDN (désactivés en développement)
  ...(process.env.NODE_ENV === 'production' && {
    async headers() {
      return [
        {
          source: '/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ]
    },
  }),
}

module.exports = nextConfig 