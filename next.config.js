/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Pour containerisation si besoin
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'], // Formats optimisés
  },
  compress: true, // Compression gzip
  poweredByHeader: false, // Sécurité
  generateEtags: false, // Performance cache
  // Optimisation bundle
  experimental: {
    // optimizeCss: true, // Désactivé temporairement pour éviter l'erreur critters sur Netlify
  },
  // Cache headers pour CDN
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 