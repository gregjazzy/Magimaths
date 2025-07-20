/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export statique seulement pour la production (Netlify)
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: {
    // Images désoptimisées seulement pour l'export statique
    ...(process.env.NODE_ENV === 'production' ? { unoptimized: true } : {}),
  },
  compress: true, // Compression gzip
  poweredByHeader: false, // Sécurité
  generateEtags: false, // Performance cache
  // Trailing slash seulement pour l'export statique
  ...(process.env.NODE_ENV === 'production' ? { trailingSlash: true } : {}),
  // Optimisation CSS désactivée pour éviter les erreurs de build
  experimental: {
    optimizeCss: false,
  },
  // Headers désactivés pour export statique (gérés par Netlify)
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ]
  // },
}

module.exports = nextConfig 