'use client';

import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

export default function TracerFormesCP() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/chapitre/cp-geometrie-espace"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la géométrie et espace</span>
          </Link>

          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              📏 Tracer des formes géométriques
            </h1>
            <p className="text-base text-gray-600">
              Apprends à utiliser ta règle et ton équerre pour dessiner des formes parfaites !
            </p>
          </div>
        </div>

        {/* Les outils */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Mes outils de géométrie 🛠️
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                <span className="text-2xl mr-2">📏</span> La règle
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center">
                  <span className="mr-2">✨</span>
                  Elle sert à tracer des traits droits
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📐</span>
                  Elle aide à mesurer les longueurs
                </li>
                <li className="flex items-center">
                  <span className="mr-2">👉</span>
                  On la tient bien appuyée avec ses doigts
                </li>
              </ul>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2 flex items-center">
                <span className="text-2xl mr-2">📐</span> L'équerre
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li className="flex items-center">
                  <span className="mr-2">✨</span>
                  Elle sert à faire des angles droits
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📐</span>
                  Elle a la forme d'un triangle
                </li>
                <li className="flex items-center">
                  <span className="mr-2">👉</span>
                  On la place bien contre la règle
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comment bien tenir ses outils */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Comment bien tenir mes outils ? 🤔
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">La règle :</h3>
              <ol className="space-y-2 text-green-800">
                <li className="flex items-center">
                  <span className="font-bold mr-2">1.</span>
                  Pose ta règle sur la feuille
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">2.</span>
                  Appuie avec tes doigts pour qu'elle ne bouge pas
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">3.</span>
                  Trace le long de la règle sans appuyer trop fort
                </li>
              </ol>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">L'équerre :</h3>
              <ol className="space-y-2 text-yellow-800">
                <li className="flex items-center">
                  <span className="font-bold mr-2">1.</span>
                  Place le coin droit de l'équerre
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">2.</span>
                  Tiens-la bien avec une main
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">3.</span>
                  Trace le long des deux côtés
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Activités */}
        <div className="grid grid-cols-2 gap-6">
          {/* Activité 1 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Activité 1 : Les traits droits 📏
            </h2>
            <p className="text-lg text-white mb-4">
              Entraîne-toi à tracer des traits droits avec ta règle !
            </p>
            <Link
              href="/chapitre/cp-geometrie-espace/tracer-formes/traits"
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-colors shadow-md"
            >
              <Play className="w-6 h-6 mr-2" />
              Commencer
            </Link>
          </div>

          {/* Activité 2 */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Activité 2 : Les angles droits 📐
            </h2>
            <p className="text-lg text-white mb-4">
              Apprends à utiliser ton équerre pour faire des angles droits !
            </p>
            <Link
              href="/chapitre/cp-geometrie-espace/tracer-formes/angles"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-md"
            >
              <Play className="w-6 h-6 mr-2" />
              Commencer
            </Link>
          </div>

          {/* Activité 3 */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Activité 3 : Les carrés 🟥
            </h2>
            <p className="text-lg text-white mb-4">
              Trace des carrés parfaits avec ta règle et ton équerre !
            </p>
            <Link
              href="/chapitre/cp-geometrie-espace/tracer-formes/carres"
              className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-md"
            >
              <Play className="w-6 h-6 mr-2" />
              Commencer
            </Link>
          </div>

          {/* Activité 4 */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Activité 4 : Les rectangles 🟨
            </h2>
            <p className="text-lg text-white mb-4">
              Trace des rectangles en mesurant bien les côtés !
            </p>
            <Link
              href="/chapitre/cp-geometrie-espace/tracer-formes/rectangles"
              className="inline-flex items-center px-6 py-3 bg-white text-yellow-600 rounded-xl font-bold text-lg hover:bg-yellow-50 transition-colors shadow-md"
            >
              <Play className="w-6 h-6 mr-2" />
              Commencer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
