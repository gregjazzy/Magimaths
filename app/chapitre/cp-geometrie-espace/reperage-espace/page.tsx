'use client';

import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

export default function ReperageEspaceCP() {
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

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧭 Se repérer dans l'espace
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Découvre les mots qui nous aident à décrire où se trouvent les objets !
            </p>
          </div>
        </div>

        {/* Contenu du cours */}
        <div className="grid gap-8 mb-8">
          {/* Section 1: Introduction */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Les mots de position 📍
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Pour dire où se trouve un objet, nous utilisons des mots spéciaux :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">En haut ou en bas ⬆️⬇️</h3>
                <ul className="list-disc list-inside text-blue-800">
                  <li>Dessus (quand ça touche)</li>
                  <li>Dessous (quand ça touche)</li>
                  <li>Au-dessus (quand il y a de l'espace entre les deux)</li>
                  <li>En-dessous (quand il y a de l'espace entre les deux)</li>
                </ul>
                <div className="mt-3 p-3 bg-blue-100 rounded-lg text-sm text-blue-900">
                  <p className="font-bold mb-2 text-blue-900">🤔 Quelle différence ?</p>
                  <p className="text-blue-800">• Le livre est <span className="font-bold">sur</span> la table = il touche la table</p>
                  <p className="text-blue-800">• La lampe est <span className="font-bold">au-dessus</span> de la table = elle ne touche pas la table, il y a de l'espace entre les deux</p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-purple-900 mb-2">Autour de nous 👀</h3>
                <ul className="list-disc list-inside text-purple-800">
                  <li>Devant</li>
                  <li>Derrière</li>
                  <li>À côté</li>
                  <li>Entre</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-900 mb-2">C'est loin ? 🚶</h3>
                <ul className="list-disc list-inside text-green-800">
                  <li>Près (tout proche)</li>
                  <li>Loin (pas proche)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Exemples */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Exemples dans la vie de tous les jours 🏠
            </h2>
            <h3 className="text-xl font-bold text-indigo-600 mb-4">
              Activité 1 : Entraîne-toi avec Nono le Robot
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-lg text-gray-600">
                • Le chat est <span className="font-bold text-blue-600">sur</span> le canapé
              </p>
              <p className="text-lg text-gray-600">
                • La lampe est <span className="font-bold text-blue-600">au-dessus</span> de la table
              </p>
              <p className="text-lg text-gray-600">
                • Le tapis est <span className="font-bold text-blue-600">sous</span> la table
              </p>
              <p className="text-lg text-gray-600">
                • Le chien est <span className="font-bold text-blue-600">en-dessous</span> du lit
              </p>
              <p className="text-lg text-gray-600">
                • La télévision est <span className="font-bold text-purple-600">devant</span> le fauteuil
              </p>
              <p className="text-lg text-gray-600">
                • La lampe est <span className="font-bold text-purple-600">à côté</span> du lit
              </p>
              <p className="text-lg text-gray-600">
                • Le vase est <span className="font-bold text-purple-600">entre</span> les deux livres
              </p>
              <p className="text-lg text-gray-600">
                • Le chien est <span className="font-bold text-green-600">près</span> de sa niche
              </p>
              <p className="text-lg text-gray-600">
                • L'oiseau vole <span className="font-bold text-green-600">loin</span> de l'arbre
              </p>
              <p className="text-lg text-gray-600">
                • Le ballon est <span className="font-bold text-purple-600">derrière</span> la voiture
              </p>
            </div>
          </div>

          {/* Section 3: Activité 1 */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Activité 1 : Entraîne-toi avec Nono le Robot 🤖
            </h2>
          </div>

          {/* Section 4: Bouton pour jouer */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              🎮 Prêt à t'entraîner ?
            </h2>
            <p className="text-lg text-white mb-6">
              Place le petit robot aux bons endroits et gagne des pièces d'or !
            </p>
            <Link
              href="/chapitre/cp-geometrie-espace/reperage-espace/jeu"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-md"
            >
              <Play className="w-6 h-6 mr-2" />
              Jouer au jeu !
            </Link>
          </div>

          {/* Section 5: Activité 2 */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Activité 2 : Place les objets là où on te le demande 🎯
            </h2>
          </div>

          {/* Bouton Activité 2 */}
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              🎯 À toi de jouer !
            </h2>
            <p className="text-lg text-white mb-6">
              Montre que tu sais placer les objets au bon endroit !
            </p>
            <Link
              href="/chapitre/cp-geometrie-espace/reperage-espace/jeu2"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-md"
            >
              <Play className="w-6 h-6 mr-2" />
              Commencer l'activité
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}