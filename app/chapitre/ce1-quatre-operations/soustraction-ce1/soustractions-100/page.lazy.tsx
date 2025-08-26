import dynamic from 'next/dynamic';

const LazySoustractions100 = dynamic(
  () => import('./page'),
  {
    loading: () => <div>Chargement...</div>,
    ssr: false
  }
);

export default LazySoustractions100;

