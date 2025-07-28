/** @type {import('next').NextConfig} */
const nextConfig = {
  // Retirer output: 'standalone' en développement
  // output: 'standalone', // Pour containerisation si besoin (uniquement pour production)
  
  // Exclure les dossiers de sauvegarde du build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Exclure les dossiers de sauvegarde
    config.module.rules.push({
      test: /\.(tsx|ts|jsx|js)$/,
      exclude: [
        /backup-.*$/,
        /.*\.backup$/,
        /temp_broken_files/,
        /backups/
      ]
    });
    return config;
  },
  
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'], // Formats optimisés
  },
  compress: true, // Compression gzip
  poweredByHeader: false, // Sécurité
  generateEtags: false, // Performance cache
  // Optimisation bundle
  experimental: {
    // optimizeCss: true, // Désactivé pour éviter l'erreur critters
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