import React from 'react';
import { motion } from 'framer-motion';
import { FractionMath } from '../page';

export default function DroiteSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Introduction */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Fractions sur la droite graduée
        </h2>
        <p className="text-gray-600 mb-4">
          Une droite graduée nous aide à visualiser et à ordonner les fractions.
          Chaque graduation représente une fraction de l'unité.
        </p>
      </div>

      {/* Règles de placement */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Comment placer une fraction ?
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">Diviser l'unité</h4>
            <p className="text-blue-800">
              Le dénominateur nous dit en combien de parts égales on divise l'unité.
              Par exemple, pour placer des quarts, on divise l'unité en 4 parts égales.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2">Compter les parts</h4>
            <p className="text-green-800">
              Le numérateur nous dit combien de parts on compte.
              Par exemple, pour <FractionMath a="3" b="4" />, on compte 3 parts sur les 4.
            </p>
          </div>
        </div>
      </div>

      {/* Exemples visuels */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Exemples sur la droite
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">Placer des demis</h4>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full h-2 bg-gray-300 rounded-full relative">
                <div className="absolute -top-2 left-0 h-6 w-0.5 bg-gray-800"></div>
                <div className="absolute -top-2 left-1/2 h-6 w-0.5 bg-gray-800"></div>
                <div className="absolute -top-2 right-0 h-6 w-0.5 bg-gray-800"></div>
                <div className="absolute -top-8 left-0 text-sm">0</div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm">
                  <FractionMath a="1" b="2" />
                </div>
                <div className="absolute -top-8 right-0 text-sm">1</div>
              </div>
              <p className="text-sm text-gray-600">
                L'unité est divisée en 2 parts égales. <FractionMath a="1" b="2" /> est à mi-chemin entre 0 et 1.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">Placer des quarts</h4>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full h-2 bg-gray-300 rounded-full relative">
                <div className="absolute -top-2 left-0 h-6 w-0.5 bg-gray-800"></div>
                <div className="absolute -top-2 left-1/4 h-6 w-0.5 bg-gray-800"></div>
                <div className="absolute -top-2 left-1/2 h-6 w-0.5 bg-gray-800"></div>
                <div className="absolute -top-2 left-3/4 h-6 w-0.5 bg-gray-800"></div>
                <div className="absolute -top-2 right-0 h-6 w-0.5 bg-gray-800"></div>
                <div className="absolute -top-8 left-0 text-sm">0</div>
                <div className="absolute -top-8 left-1/4 transform -translate-x-1/2 text-sm">
                  <FractionMath a="1" b="4" />
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm">
                  <FractionMath a="2" b="4" />
                </div>
                <div className="absolute -top-8 left-3/4 transform -translate-x-1/2 text-sm">
                  <FractionMath a="3" b="4" />
                </div>
                <div className="absolute -top-8 right-0 text-sm">1</div>
              </div>
              <p className="text-sm text-gray-600">
                L'unité est divisée en 4 parts égales. Chaque graduation représente un quart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}