import React from 'react';
import { motion } from 'framer-motion';
import { FractionMath } from '../page';

export default function ComparaisonSection() {
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
          Comparer des fractions
        </h2>
        <p className="text-gray-600 mb-4">
          Pour comparer deux fractions, on regarde laquelle représente la plus grande partie d'un tout.
          On utilise les symboles &lt; (plus petit que) et &gt; (plus grand que).
        </p>
      </div>

      {/* Règles de comparaison */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Comment comparer des fractions ?
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">Même dénominateur</h4>
            <p className="text-blue-800">
              Quand deux fractions ont le même dénominateur, on compare simplement les numérateurs.
              La fraction avec le plus grand numérateur est la plus grande.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2">Exemple</h4>
            <p className="text-green-800">
              Pour comparer 3/8 et 5/8 :<br/>
              - Les dénominateurs sont les mêmes (8)<br/>
              - 5 est plus grand que 3<br/>
              - Donc <FractionMath a="3" b="8" /> &lt; <FractionMath a="5" b="8" />
            </p>
          </div>
        </div>
      </div>

      {/* Exemples visuels */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Exemples visuels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">
              <FractionMath a="2" b="6" /> &lt; <FractionMath a="4" b="6" />
            </h4>
            <div className="flex justify-center space-x-4">
              {/* Les visualisations seront ajoutées ici */}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">
              <FractionMath a="5" b="8" /> &gt; <FractionMath a="3" b="8" />
            </h4>
            <div className="flex justify-center space-x-4">
              {/* Les visualisations seront ajoutées ici */}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}