/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Pour déploiement statique sur Netlify
  images: {
    unoptimized: true, // Requis pour export statique
  },
  compress: true, // Compression gzip
  poweredByHeader: false, // Sécurité
  generateEtags: false, // Performance cache
  trailingSlash: true, // Pour export statique
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