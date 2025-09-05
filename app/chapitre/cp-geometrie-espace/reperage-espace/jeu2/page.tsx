'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ReperageEspaceJeu2CP() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/chapitre/cp-geometrie-espace/reperage-espace"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au cours</span>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Place les objets au bon endroit !
            </h1>
            <p className="text-lg text-gray-600">
              Suis les instructions et place chaque objet exactement où on te le demande.
            </p>
          </div>
        </div>

        {/* Iframe pour le jeu 2 */}
        <div className="relative w-full h-[80vh] bg-black rounded-xl shadow-lg overflow-hidden">
          <iframe
            src="/micro-apps/position-mots/index.html"
            title="Place les objets"
            className="w-full h-full border-none"
            allow="autoplay; fullscreen; xr-spatial-tracking; gamepad; microphone;"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
