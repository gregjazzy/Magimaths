'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ChaptersSection from '@/components/ChaptersSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ChaptersSection />
      <PricingSection />
      <Footer />
    </div>
  );
} 