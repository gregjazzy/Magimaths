import Router from 'next/router';

// Précharge la page suivante dès que l'utilisateur survole un lien
export function setupPreloading() {
  if (typeof window === 'undefined') return;

  document.addEventListener('mouseover', (e) => {
    const link = (e.target as HTMLElement).closest('a');
    if (link?.href && !link.href.startsWith('javascript:')) {
      Router.prefetch(link.href);
    }
  });
}

// Précharge les ressources critiques
export function preloadCriticalAssets() {
  const criticalImages = [
    '/image/pirate-small.png',
    '/image/Minecraftstyle.png'
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

