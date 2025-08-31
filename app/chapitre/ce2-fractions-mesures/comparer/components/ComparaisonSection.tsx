import React from 'react';
import { motion } from 'framer-motion';
import { FractionMath } from './FractionMath';

export default function ComparaisonSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Introduction */}
      <div id="intro-section" className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
          Comparer des fractions
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-4">
          Pour comparer deux fractions, on regarde laquelle est la plus grande.
          On utilise les symboles &lt; (plus petit) et &gt; (plus grand).
        </p>
      </div>

      {/* Règles de comparaison */}
      <div id="comparison-rules" className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">
          Comment comparer des fractions ?
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Même dénominateur</h4>
            <p className="text-blue-800 text-sm sm:text-base">
              Si le dénominateur est le même, on compare les numérateurs.
              Le plus grand numérateur donne la plus grande fraction.
            </p>
          </div>
          <div id="comparison-example" className="bg-green-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-bold text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">Exemple</h4>
            <p className="text-green-800 text-sm sm:text-base">
              Pour comparer <FractionMath a="3" b="8" /> et <FractionMath a="5" b="8" /> :<br/>
              - Même dénominateur (<FractionMath a="3" b="8" /> et <FractionMath a="5" b="8" />)<br/>
              - <FractionMath a="5" b="8" /> est plus grand que <FractionMath a="3" b="8" /><br/>
              - Donc <FractionMath a="3" b="8" /> &lt; <FractionMath a="5" b="8" />
            </p>
          </div>
        </div>
      </div>

      {/* Exemples visuels */}
      <div id="visual-examples" className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
          Exemples visuels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm mb-4">
                <span className="text-purple-800 font-bold flex items-center gap-3">
                  <FractionMath a="2" b="6" size="text-lg sm:text-2xl" />
                  <span className="text-lg sm:text-2xl">&lt;</span>
                  <FractionMath a="4" b="6" size="text-lg sm:text-2xl" />
                </span>
              </div>
              <div className="w-full bg-white rounded-lg p-3">
                <div className="flex justify-center items-center gap-4">
                  <div className="flex-1 h-8 bg-purple-200 rounded-lg overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-lg" style={{ width: '33.33%' }}></div>
                  </div>
                  <div className="flex-1 h-8 bg-blue-200 rounded-lg overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-lg" style={{ width: '66.66%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm mb-4">
                <span className="text-green-800 font-bold flex items-center gap-3">
                  <FractionMath a="5" b="8" size="text-lg sm:text-2xl" />
                  <span className="text-lg sm:text-2xl">&gt;</span>
                  <FractionMath a="3" b="8" size="text-lg sm:text-2xl" />
                </span>
              </div>
              <div className="w-full bg-white rounded-lg p-3">
                <div className="flex justify-center items-center gap-4">
                  <div className="flex-1 h-8 bg-green-200 rounded-lg overflow-hidden">
                    <div className="h-full bg-green-500 rounded-lg" style={{ width: '62.5%' }}></div>
                  </div>
                  <div className="flex-1 h-8 bg-emerald-200 rounded-lg overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-lg" style={{ width: '37.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}