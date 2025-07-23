'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

interface Exercise {
  question: string;
  fraction1: string;
  fraction2: string;
  correctAnswer: string;
  hint: string;
  hasVisual: boolean;
}

// Composant pour afficher une fraction mathématique
function FractionMath({a, b, size = 'text-xl'}: {a: string|number, b: string|number, size?: string}) {
  return (
    <span className={`inline-block align-middle ${size} text-gray-900 font-bold`} style={{ minWidth: 24 }}>
      <span className="flex flex-col items-center" style={{lineHeight:1}}>
        <span className="border-b-2 border-gray-800 px-1 text-gray-900">{a}</span>
        <span className="px-1 text-gray-900">{b}</span>
      </span>
    </span>
  );
}



// Animation pour comparer 2/4 vs 1/4  
function ComparaisonAnimation2() {
  const [step, setStep] = useState(0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
      <div className="bg-orange-50 rounded-lg p-4 mb-6">
        <p className="text-center text-lg font-bold text-orange-800">
          ⚠️ <strong>Règle à retenir :</strong> Si le dénominateur est égal, c'est la fraction avec le numérateur le plus GRAND qui est la plus GRANDE !
        </p>
        <p className="text-center text-sm text-orange-700 mt-2">
          Exemple : 2/4 vs 1/4 → même dénominateur (4), mais 2 &gt; 1, donc 2/4 &gt; 1/4
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-8">
          {/* Gâteau 2/4 */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg width="128" height="128" viewBox="0 0 128 128" className="rounded-full">
                {/* Gâteau entier */}
                <circle cx="64" cy="64" r="60" fill="#F59E0B" stroke="#D97706" strokeWidth="4"/>
                {/* Lignes de division */}
                <line x1="64" y1="4" x2="64" y2="124" stroke="#8B5CF6" strokeWidth="2"/>
                <line x1="4" y1="64" x2="124" y2="64" stroke="#8B5CF6" strokeWidth="2"/>
                {/* 2 parts colorées seulement à l'étape 2 */}
                <path
                  d="M 64 64 L 64 4 A 60 60 0 1 1 64 124 Z"
                  fill={step >= 2 ? "#10B981" : "#F59E0B"}
                  className="transition-all duration-1000"
                  stroke="#D97706"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="text-2xl mb-2">
              <FractionMath a="2" b="4" size="text-2xl" />
            </div>
            <p className="text-lg font-bold text-green-600">
              {step >= 1 ? "Numérateur : 2" : ""}
              {step >= 3 ? " → Plus grande !" : ""}
            </p>
          </div>

          {/* VS */}
          <div className={`text-4xl font-bold transition-all duration-500 ${step >= 3 ? 'text-purple-600 scale-125' : 'text-gray-400'}`}>
            VS
          </div>

          {/* Gâteau 1/4 */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg width="128" height="128" viewBox="0 0 128 128" className="rounded-full">
                {/* Gâteau entier */}
                <circle cx="64" cy="64" r="60" fill="#F59E0B" stroke="#D97706" strokeWidth="4"/>
                {/* Lignes de division */}
                <line x1="64" y1="4" x2="64" y2="124" stroke="#8B5CF6" strokeWidth="2"/>
                <line x1="4" y1="64" x2="124" y2="64" stroke="#8B5CF6" strokeWidth="2"/>
                {/* Part colorée seulement à l'étape 2 */}
                <path
                  d="M 64 64 L 64 4 A 60 60 0 0 1 124 64 Z"
                  fill={step >= 2 ? "#EF4444" : "#F59E0B"}
                  className="transition-all duration-1000"
                  stroke="#D97706"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="text-2xl mb-2">
              <FractionMath a="1" b="4" size="text-2xl" />
            </div>
            <p className="text-lg font-bold text-red-600">
              {step >= 1 ? "Numérateur : 1" : ""}
              {step >= 3 ? " → Plus petite !" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Explication étape par étape */}
      <div className="text-center mb-6">
        {step === 0 && (
          <p className="text-xl text-gray-700">
            🍰 Voici deux gâteaux identiques coupés en 4 parts égales
          </p>
        )}
        {step === 1 && (
          <div>
            <p className="text-xl text-blue-700 mb-2">
              🔢 Première fraction : numérateur = 2, dénominateur = 4
            </p>
            <p className="text-xl text-blue-700">
              🔢 Deuxième fraction : numérateur = 1, dénominateur = 4
            </p>
          </div>
        )}
        {step === 2 && (
          <p className="text-xl text-purple-700">
            ⚖️ Même dénominateur (4), mais lequel a le plus grand numérateur ?
          </p>
        )}
        {step >= 3 && (
          <div>
            <p className="text-xl text-green-700 mb-2">
              🏆 <strong>2/4 est plus grand que 1/4</strong>
            </p>
            <p className="text-lg text-gray-600">
              2 &gt; 1, donc 2/4 &gt; 1/4
            </p>
            <div className="bg-yellow-100 rounded-lg p-3 mt-4">
              <p className="text-sm font-bold text-yellow-800">
                💡 Dénominateur égal → Plus grand numérateur = Plus grande fraction !
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setStep(prev => Math.max(0, prev - 1))}
          disabled={step === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 disabled:opacity-50"
        >
          ← Précédent
        </button>
        <button
          onClick={() => setStep(prev => Math.min(3, prev + 1))}
          disabled={step === 3}
          className={`bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 ${
            step < 3 ? 'animate-pulse shadow-lg shadow-orange-300' : ''
          }`}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

// Animation pour comparer 1/3 vs 1/6 - Règle du dénominateur
function ComparaisonAnimation3() {
  const [step, setStep] = useState(0);

  const renderThirds = (colorPart: boolean) => {
    const parts = [];
    for (let i = 0; i < 3; i++) {
      const startAngle = (i * 120) - 90;
      const endAngle = ((i + 1) * 120) - 90;
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = 64 + 60 * Math.cos(startAngleRad);
      const y1 = 64 + 60 * Math.sin(startAngleRad);
      const x2 = 64 + 60 * Math.cos(endAngleRad);
      const y2 = 64 + 60 * Math.sin(endAngleRad);
      
      const pathData = `M 64 64 L ${x1} ${y1} A 60 60 0 0 1 ${x2} ${y2} Z`;
      const fillColor = (i === 0 && colorPart) ? "#10B981" : "#F59E0B";
      
      parts.push(
        <path
          key={i}
          d={pathData}
          fill={fillColor}
          stroke="#D97706"
          strokeWidth="2"
          className="transition-all duration-500"
        />
      );
    }
    return parts;
  };

  const renderSixths = (colorPart: boolean) => {
    const parts = [];
    for (let i = 0; i < 6; i++) {
      const startAngle = (i * 60) - 90;
      const endAngle = ((i + 1) * 60) - 90;
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = 64 + 60 * Math.cos(startAngleRad);
      const y1 = 64 + 60 * Math.sin(startAngleRad);
      const x2 = 64 + 60 * Math.cos(endAngleRad);
      const y2 = 64 + 60 * Math.sin(endAngleRad);
      
      const pathData = `M 64 64 L ${x1} ${y1} A 60 60 0 0 1 ${x2} ${y2} Z`;
      const fillColor = (i === 0 && colorPart) ? "#EF4444" : "#F59E0B";
      
      parts.push(
        <path
          key={i}
          d={pathData}
          fill={fillColor}
          stroke="#D97706"
          strokeWidth="2"
          className="transition-all duration-500"
        />
      );
    }
    return parts;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
             <div className="bg-orange-50 rounded-lg p-4 mb-6">
         <p className="text-center text-lg font-bold text-orange-800">
           ⚠️ <strong>Règle à retenir :</strong> Si le numérateur est égal, c'est la fraction avec le dénominateur le plus GRAND qui est la plus PETITE !
         </p>
         <p className="text-center text-sm text-orange-700 mt-2">
           Exemple : 1/3 vs 1/6 → même numérateur (1), mais 6 &gt; 3, donc 1/6 &lt; 1/3
         </p>
       </div>
      
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-8">
          {/* Gâteau 1/3 */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg width="128" height="128" viewBox="0 0 128 128" className="rounded-full">
                {renderThirds(step >= 2)}
              </svg>
            </div>
            <div className="text-2xl mb-2">
              <FractionMath a="1" b="3" size="text-2xl" />
            </div>
                         <p className="text-lg font-bold text-green-600">
               {step >= 1 ? "Dénominateur : 3" : ""}
               {step >= 3 ? " → Plus grande !" : ""}
             </p>
          </div>

          {/* VS */}
          <div className={`text-4xl font-bold transition-all duration-500 ${step >= 3 ? 'text-purple-600 scale-125' : 'text-gray-400'}`}>
            VS
          </div>

          {/* Gâteau 1/6 */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg width="128" height="128" viewBox="0 0 128 128" className="rounded-full">
                {renderSixths(step >= 2)}
              </svg>
            </div>
            <div className="text-2xl mb-2">
              <FractionMath a="1" b="6" size="text-2xl" />
            </div>
                         <p className="text-lg font-bold text-red-600">
               {step >= 1 ? "Dénominateur : 6" : ""}
               {step >= 3 ? " → Plus petite !" : ""}
             </p>
          </div>
        </div>
      </div>

      {/* Explication étape par étape */}
      <div className="text-center mb-6">
        {step === 0 && (
          <p className="text-xl text-gray-700">
            🍰 Voici deux gâteaux identiques coupés différemment
          </p>
        )}
        {step === 1 && (
          <div>
            <p className="text-xl text-blue-700 mb-2">
              🔢 Première fraction : numérateur = 1, dénominateur = 3
            </p>
            <p className="text-xl text-blue-700">
              🔢 Deuxième fraction : numérateur = 1, dénominateur = 6
            </p>
          </div>
        )}
        {step === 2 && (
          <p className="text-xl text-purple-700">
            ⚖️ Même numérateur (1), mais lequel a le plus grand dénominateur ?
          </p>
        )}
        {step >= 3 && (
          <div>
            <p className="text-xl text-green-700 mb-2">
              🏆 <strong>1/3 est plus grand que 1/6</strong>
            </p>
            <p className="text-lg text-gray-600">
              6 &gt; 3, donc 1/6 &lt; 1/3
            </p>
            <div className="bg-yellow-100 rounded-lg p-3 mt-4">
              <p className="text-sm font-bold text-yellow-800">
                💡 Numérateur égal → Plus grand dénominateur = Plus petite fraction !
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setStep(prev => Math.max(0, prev - 1))}
          disabled={step === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 disabled:opacity-50"
        >
          ← Précédent
        </button>
        <button
          onClick={() => setStep(prev => Math.min(3, prev + 1))}
          disabled={step === 3}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

// Animation pure sur les fractions - Règle mathématique
function AnimationRegleMathematique() {
  const [step, setStep] = useState(0);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg border-2 border-blue-200">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">
        🎯 Animation : Règle Pure des Fractions
      </h2>
      
      <div className="max-w-4xl mx-auto">
        {/* Étape 0 : Présentation des fractions */}
        {step === 0 && (
          <div className="text-center space-y-6">
            {/* Condition mise en avant mais élégamment */}
            <div className="bg-orange-100 rounded-xl p-6 border-2 border-orange-300">
              <p className="text-2xl font-bold text-orange-800 mb-4">
                📏 RÈGLE FONDAMENTALE
              </p>
              <div className="text-4xl font-bold text-orange-900 mb-4 animate-pulse">
                Si le numérateur est égal
              </div>
              <p className="text-xl text-orange-700">
                alors : Plus le dénominateur est grand, plus la fraction est petite !
              </p>
            </div>

            <p className="text-xl text-gray-700">
              📚 Testons avec ces deux fractions :
            </p>
            <div className="flex justify-center items-center space-x-16">
              <div className="text-center">
                <FractionMath a="1" b="3" size="text-6xl" />
              </div>
              <div className="text-4xl text-gray-400">vs</div>
              <div className="text-center">
                <FractionMath a="1" b="6" size="text-6xl" />
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4">
              <p className="text-lg font-bold text-blue-800">
                🔍 Vérifions si cette condition s'applique ici !
              </p>
            </div>
          </div>
        )}

        {/* Étape 1 : Identifier les numérateurs */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-blue-700 mb-8">
              🔍 Étape 1 : Je regarde les numérateurs
            </p>
            <div className="flex justify-center items-center space-x-16">
              <div className="text-center">
                <div className="bg-green-200 rounded-lg p-4 mb-4">
                  <span className="text-4xl font-bold text-green-800">1</span>
                </div>
                <FractionMath a="1" b="3" size="text-6xl" />
                <p className="text-green-700 font-bold mt-2">Numérateur : 1</p>
              </div>
              <div className="text-4xl text-gray-400">=</div>
              <div className="text-center">
                <div className="bg-green-200 rounded-lg p-4 mb-4">
                  <span className="text-4xl font-bold text-green-800">1</span>
                </div>
                <FractionMath a="1" b="6" size="text-6xl" />
                <p className="text-green-700 font-bold mt-2">Numérateur : 1</p>
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <p className="text-lg font-bold text-green-800">
                ✅ Les numérateurs sont égaux (1 = 1)
              </p>
            </div>
          </div>
        )}

        {/* Étape 2 : Identifier les dénominateurs */}
        {step === 2 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-purple-700 mb-8">
              🔍 Étape 2 : Je regarde les dénominateurs
            </p>
            <div className="flex justify-center items-center space-x-16">
              <div className="text-center">
                <FractionMath a="1" b="3" size="text-6xl" />
                <div className="bg-purple-200 rounded-lg p-4 mt-4">
                  <span className="text-4xl font-bold text-purple-800">3</span>
                </div>
                <p className="text-purple-700 font-bold mt-2">Dénominateur : 3</p>
              </div>
              <div className="text-4xl text-gray-400">vs</div>
              <div className="text-center">
                <FractionMath a="1" b="6" size="text-6xl" />
                <div className="bg-purple-200 rounded-lg p-4 mt-4">
                  <span className="text-4xl font-bold text-purple-800">6</span>
                </div>
                <p className="text-purple-700 font-bold mt-2">Dénominateur : 6</p>
              </div>
            </div>
            <div className="bg-purple-100 rounded-lg p-4">
              <p className="text-lg font-bold text-purple-800">
                👀 Les dénominateurs sont différents (3 ≠ 6)
              </p>
            </div>
          </div>
        )}

        {/* Étape 3 : Comparer les dénominateurs */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-orange-700 mb-8">
              ⚖️ Étape 3 : Je compare les dénominateurs
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="bg-orange-100 rounded-lg p-6">
                <span className="text-6xl font-bold text-orange-800">3</span>
              </div>
              <div className="text-6xl font-bold text-red-600">
                &lt;
              </div>
              <div className="bg-orange-100 rounded-lg p-6">
                <span className="text-6xl font-bold text-orange-800">6</span>
              </div>
            </div>
            <div className="bg-orange-100 rounded-lg p-4">
              <p className="text-xl font-bold text-orange-800">
                📊 3 est plus petit que 6 (3 &lt; 6)
              </p>
            </div>
          </div>
        )}

        {/* Étape 4 : Appliquer la règle */}
        {step === 4 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-red-700 mb-8">
              🧮 Étape 4 : J'applique la règle !
            </p>
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-2xl font-bold text-red-800 mb-4">
                📏 RÈGLE FONDAMENTALE
              </p>
              <p className="text-lg text-red-700">
                Si le numérateur est égal,<br/>
                plus le dénominateur est <strong>GRAND</strong>,<br/>
                plus la fraction est <strong>PETITE</strong> !
              </p>
            </div>
            <div className="flex justify-center items-center space-x-8 mt-6">
              <div className="text-center">
                <FractionMath a="1" b="3" size="text-5xl" />
                <p className="text-sm text-gray-600 mt-2">Dénominateur : 3 (plus petit)</p>
              </div>
              <div className="text-4xl font-bold text-green-600">
                &gt;
              </div>
              <div className="text-center">
                <FractionMath a="1" b="6" size="text-5xl" />
                <p className="text-sm text-gray-600 mt-2">Dénominateur : 6 (plus grand)</p>
              </div>
            </div>
          </div>
        )}

        {/* Étape 5 : Conclusion */}
        {step >= 5 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-green-700 mb-8">
              🎉 Étape 5 : Conclusion !
            </p>
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex justify-center items-center space-x-8 mb-6">
                <FractionMath a="1" b="3" size="text-6xl" />
                <div className="text-6xl font-bold text-green-600">
                  &gt;
                </div>
                <FractionMath a="1" b="6" size="text-6xl" />
              </div>
              <p className="text-2xl font-bold text-green-800 mb-4">
                ✅ 1/3 est plus grand que 1/6
              </p>
              <p className="text-lg text-green-700">
                Car 6 &gt; 3, donc 1/6 &lt; 1/3
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex justify-center space-x-6 mt-8">
        <button
          onClick={() => setStep(0)}
          className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition-colors text-lg"
        >
          🔄 Recommencer
        </button>
        <button
          onClick={() => setStep(prev => Math.min(5, prev + 1))}
          disabled={step === 5}
          className={`bg-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors text-lg ${
            step < 5 ? 'animate-pulse shadow-lg shadow-blue-300' : ''
          }`}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

// Animation pure sur les fractions - Règle dénominateur égal
function AnimationRegleMathematique2() {
  const [step, setStep] = useState(0);

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 shadow-lg border-2 border-orange-200">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-900">
        🎯 Animation : Règle Pure des Fractions (Dénominateur Égal)
      </h2>
      
      <div className="max-w-4xl mx-auto">
        {/* Étape 0 : Présentation des fractions */}
        {step === 0 && (
          <div className="text-center space-y-6">
            {/* Condition mise en avant */}
            <div className="bg-orange-100 rounded-xl p-6 border-2 border-orange-300">
              <p className="text-2xl font-bold text-orange-800 mb-4">
                📏 RÈGLE FONDAMENTALE
              </p>
              <div className="text-4xl font-bold text-orange-900 mb-4 animate-pulse">
                Si le dénominateur est égal
              </div>
              <p className="text-xl text-orange-700">
                alors : Plus le numérateur est grand, plus la fraction est grande !
              </p>
            </div>

            <p className="text-xl text-gray-700">
              📚 Testons avec ces deux fractions :
            </p>
            <div className="flex justify-center items-center space-x-16">
              <div className="text-center">
                <FractionMath a="2" b="4" size="text-6xl" />
              </div>
              <div className="text-4xl text-gray-400">vs</div>
              <div className="text-center">
                <FractionMath a="1" b="4" size="text-6xl" />
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4">
              <p className="text-lg font-bold text-blue-800">
                🔍 Vérifions si cette condition s'applique ici !
              </p>
            </div>
          </div>
        )}

        {/* Étape 1 : Identifier les dénominateurs */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-blue-700 mb-8">
              🔍 Étape 1 : Je regarde les dénominateurs
            </p>
            <div className="flex justify-center items-center space-x-16">
              <div className="text-center">
                <FractionMath a="2" b="4" size="text-6xl" />
                <div className="bg-green-200 rounded-lg p-4 mt-4">
                  <span className="text-4xl font-bold text-green-800">4</span>
                </div>
                <p className="text-green-700 font-bold mt-2">Dénominateur : 4</p>
              </div>
              <div className="text-4xl text-gray-400">=</div>
              <div className="text-center">
                <FractionMath a="1" b="4" size="text-6xl" />
                <div className="bg-green-200 rounded-lg p-4 mt-4">
                  <span className="text-4xl font-bold text-green-800">4</span>
                </div>
                <p className="text-green-700 font-bold mt-2">Dénominateur : 4</p>
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <p className="text-lg font-bold text-green-800">
                ✅ Les dénominateurs sont égaux (4 = 4)
              </p>
            </div>
          </div>
        )}

        {/* Étape 2 : Identifier les numérateurs */}
        {step === 2 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-purple-700 mb-8">
              🔍 Étape 2 : Je regarde les numérateurs
            </p>
            <div className="flex justify-center items-center space-x-16">
              <div className="text-center">
                <div className="bg-purple-200 rounded-lg p-4 mb-4">
                  <span className="text-4xl font-bold text-purple-800">2</span>
                </div>
                <FractionMath a="2" b="4" size="text-6xl" />
                <p className="text-purple-700 font-bold mt-2">Numérateur : 2</p>
              </div>
              <div className="text-4xl text-gray-400">vs</div>
              <div className="text-center">
                <div className="bg-purple-200 rounded-lg p-4 mb-4">
                  <span className="text-4xl font-bold text-purple-800">1</span>
                </div>
                <FractionMath a="1" b="4" size="text-6xl" />
                <p className="text-purple-700 font-bold mt-2">Numérateur : 1</p>
              </div>
            </div>
            <div className="bg-purple-100 rounded-lg p-4">
              <p className="text-lg font-bold text-purple-800">
                👀 Les numérateurs sont différents (2 ≠ 1)
              </p>
            </div>
          </div>
        )}

        {/* Étape 3 : Comparer les numérateurs */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-orange-700 mb-8">
              ⚖️ Étape 3 : Je compare les numérateurs
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="bg-orange-100 rounded-lg p-6">
                <span className="text-6xl font-bold text-orange-800">2</span>
              </div>
              <div className="text-6xl font-bold text-green-600">
                &gt;
              </div>
              <div className="bg-orange-100 rounded-lg p-6">
                <span className="text-6xl font-bold text-orange-800">1</span>
              </div>
            </div>
            <div className="bg-orange-100 rounded-lg p-4">
              <p className="text-xl font-bold text-orange-800">
                📊 2 est plus grand que 1 (2 &gt; 1)
              </p>
            </div>
          </div>
        )}

        {/* Étape 4 : Appliquer la règle */}
        {step === 4 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-red-700 mb-8">
              🧮 Étape 4 : J'applique la règle !
            </p>
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-2xl font-bold text-red-800 mb-4">
                📏 RÈGLE FONDAMENTALE
              </p>
              <p className="text-lg text-red-700">
                Si le dénominateur est égal,<br/>
                plus le numérateur est <strong>GRAND</strong>,<br/>
                plus la fraction est <strong>GRANDE</strong> !
              </p>
            </div>
            <div className="flex justify-center items-center space-x-8 mt-6">
              <div className="text-center">
                <FractionMath a="2" b="4" size="text-5xl" />
                <p className="text-sm text-gray-600 mt-2">Numérateur : 2 (plus grand)</p>
              </div>
              <div className="text-4xl font-bold text-green-600">
                &gt;
              </div>
              <div className="text-center">
                <FractionMath a="1" b="4" size="text-5xl" />
                <p className="text-sm text-gray-600 mt-2">Numérateur : 1 (plus petit)</p>
              </div>
            </div>
          </div>
        )}

        {/* Étape 5 : Conclusion */}
        {step >= 5 && (
          <div className="text-center space-y-6">
            <p className="text-xl text-green-700 mb-8">
              🎉 Étape 5 : Conclusion !
            </p>
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex justify-center items-center space-x-8 mb-6">
                <FractionMath a="2" b="4" size="text-6xl" />
                <div className="text-6xl font-bold text-green-600">
                  &gt;
                </div>
                <FractionMath a="1" b="4" size="text-6xl" />
              </div>
              <p className="text-2xl font-bold text-green-800 mb-4">
                ✅ 2/4 est plus grand que 1/4
              </p>
              <p className="text-lg text-green-700">
                Car 2 &gt; 1, donc 2/4 &gt; 1/4
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex justify-center space-x-6 mt-8">
        <button
          onClick={() => setStep(0)}
          className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition-colors text-lg"
        >
          🔄 Recommencer
        </button>
        <button
          onClick={() => setStep(prev => Math.min(5, prev + 1))}
          disabled={step === 5}
          className={`bg-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors text-lg ${
            step < 5 ? 'animate-pulse shadow-lg shadow-blue-300' : ''
          }`}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

// Mini jeu interactif
function MiniJeuComparaison() {
  const [gameStep, setGameStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const gameQuestions = [
    { f1: "1/3", f2: "1/6", answer: ">", explanation: "Même numérateur (1), mais 6 > 3, donc 1/6 < 1/3 !" },
    { f1: "1/4", f2: "3/4", answer: "<", explanation: "Même dénominateur (4), mais 3 > 1, donc 3/4 > 1/4 !" },
    { f1: "1/2", f2: "1/4", answer: ">", explanation: "Même numérateur (1), mais 4 > 2, donc 1/4 < 1/2 !" },
    { f1: "2/5", f2: "1/5", answer: ">", explanation: "Même dénominateur (5), mais 2 > 1, donc 2/5 > 1/5 !" },
    { f1: "1/8", f2: "1/4", answer: "<", explanation: "Même numérateur (1), mais 8 > 4, donc 1/8 < 1/4 !" }
  ];

  const handleAnswer = (answer: string) => {
    const correct = answer === gameQuestions[gameStep].answer;
    if (correct) {
      setScore(score + 1);
      setFeedback("🎉 Bravo ! " + gameQuestions[gameStep].explanation);
    } else {
      setFeedback("🤔 Pas encore ! " + gameQuestions[gameStep].explanation);
    }
    
    setTimeout(() => {
      if (gameStep < gameQuestions.length - 1) {
        setGameStep(gameStep + 1);
        setFeedback('');
      } else {
        setFeedback(`🏆 Fini ! Tu as eu ${score + (correct ? 1 : 0)}/${gameQuestions.length} !`);
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameStep(0);
    setScore(0);
    setFeedback('');
  };

  if (gameStep >= gameQuestions.length) {
    return (
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold mb-4">Bravo champion !</h2>
        <p className="text-xl mb-4">Score : {score}/{gameQuestions.length}</p>
        <button
          onClick={resetGame}
          className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
        >
          🔄 Recommencer
        </button>
      </div>
    );
  }

  const question = gameQuestions[gameStep];

  return (
    <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl p-6 text-white">
      <h2 className="text-2xl font-bold text-center mb-6">
        🎮 Mini-jeu : Question {gameStep + 1}/{gameQuestions.length}
      </h2>
      
      <div className="text-center mb-4">
        <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 inline-block">
          <p className="text-sm">
                            📊 Teste les 2 règles : numérateur égal ou dénominateur égal !
          </p>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-xl mb-4">Qui est le plus grand ?</p>
        <div className="flex items-center justify-center space-x-8">
          <div className="text-4xl">
            <FractionMath a={question.f1.split('/')[0]} b={question.f1.split('/')[1]} size="text-4xl" />
          </div>
          <div className="text-4xl">?</div>
          <div className="text-4xl">
            <FractionMath a={question.f2.split('/')[0]} b={question.f2.split('/')[1]} size="text-4xl" />
          </div>
        </div>
      </div>

      {!feedback ? (
        <div className="flex justify-center space-x-4">
          {['<', '=', '>'].map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleAnswer(symbol)}
              className="w-16 h-16 text-2xl font-bold rounded-lg bg-white text-purple-600 hover:bg-gray-100 transition-colors"
            >
              {symbol}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl font-bold">{feedback}</p>
        </div>
      )}
      
      <div className="text-center mt-4">
        <p className="text-lg">Score : {score}/{gameQuestions.length}</p>
      </div>
    </div>
  );
}

export default function ComparaisonFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'comparaison';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 12; // XP de base pour cette section
    const earnedXP = Math.round(baseXP * percentage);
    
    const progressData = {
      sectionId,
      score: finalScore,
      maxScore,
      attempts: 1,
      completed: true,
      completionDate: new Date().toISOString(),
      xpEarned: earnedXP
    };

    // Sauvegarder dans localStorage
    const savedProgress = localStorage.getItem('ce1-fractions-simples-progress');
    let allProgress = [];
    
    if (savedProgress) {
      allProgress = JSON.parse(savedProgress);
    }
    
    // Mettre à jour ou ajouter le progrès de cette section
    const existingIndex = allProgress.findIndex((p: any) => p.sectionId === sectionId);
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progressData;
    } else {
      allProgress.push(progressData);
    }
    
    localStorage.setItem('ce1-fractions-simples-progress', JSON.stringify(allProgress));
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('storage'));
  };

  const examples = [
    { 
      fraction1: '1/2', 
      fraction2: '1/4', 
      comparison: '>', 
      explanation: 'Une moitié est plus grande qu\'un quart'
    },
    { 
      fraction1: '1/3', 
      fraction2: '1/6', 
      comparison: '>', 
      explanation: 'Un tiers est plus grand qu\'un sixième'
    },
    { 
      fraction1: '2/4', 
      fraction2: '1/4', 
      comparison: '>', 
      explanation: '2 parts sur 4 est plus grand que 1 part sur 4'
    }
  ];

  const exercises: Exercise[] = [
    {
      question: 'Compare ces deux fractions :',
      fraction1: '1/2',
      fraction2: '1/3',
      correctAnswer: '>',
      hint: 'Une moitié est plus grande qu\'un tiers. Compare les tailles des parts !',
      hasVisual: true
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '1/4',
      fraction2: '1/2',
      correctAnswer: '<',
      hint: 'Une moitié est plus grande qu\'un quart',
      hasVisual: true
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '1/3',
      fraction2: '1/6',
      correctAnswer: '>',
      hint: 'Un tiers est plus grand qu\'un sixième',
      hasVisual: true
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '2/4',
      fraction2: '1/4',
      correctAnswer: '>',
      hint: '2 parts de 4 est plus grand que 1 part de 4',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '3/6',
      fraction2: '1/6',
      correctAnswer: '>',
      hint: '3 parts de 6 est plus grand que 1 part de 6',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '1/5',
      fraction2: '1/3',
      correctAnswer: '<',
      hint: 'Plus le nombre du bas est petit, plus la fraction est grande',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '2/3',
      fraction2: '1/3',
      correctAnswer: '>',
      hint: '2 tiers est plus grand que 1 tiers',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '1/8',
      fraction2: '1/4',
      correctAnswer: '<',
      hint: 'Un quart est plus grand qu\'un huitième',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '3/4',
      fraction2: '1/4',
      correctAnswer: '>',
      hint: '3 quarts est plus grand que 1 quart',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '1/6',
      fraction2: '1/3',
      correctAnswer: '<',
      hint: 'Un tiers est plus grand qu\'un sixième',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '2/2',
      fraction2: '1/2',
      correctAnswer: '>',
      hint: '2/2 = le tout complet, 1/2 = la moitié',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '4/8',
      fraction2: '2/8',
      correctAnswer: '>',
      hint: '4 parts de 8 est plus grand que 2 parts de 8',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '1/10',
      fraction2: '1/5',
      correctAnswer: '<',
      hint: 'Un cinquième est plus grand qu\'un dixième',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '3/5',
      fraction2: '1/5',
      correctAnswer: '>',
      hint: '3 cinquièmes est plus grand que 1 cinquième',
      hasVisual: false
    },
    {
      question: 'Compare ces deux fractions :',
      fraction1: '1/4',
      fraction2: '1/8',
      correctAnswer: '>',
      hint: 'Un quart est plus grand qu\'un huitième',
      hasVisual: false
    }
  ];

  // Fonction pour créer la visualisation SVG des fractions en pie chart
  const renderFractionVisual = (fraction: string, x: number, color: string) => {
    const [numerator, denominator] = fraction.split('/').map(Number);
    const radius = 35;
    const centerX = x;
    const centerY = 50;
    
    const svgParts = [];
    const anglePerPart = 360 / denominator;
    
    for (let i = 0; i < denominator; i++) {
      const startAngle = i * anglePerPart - 90; // Commence en haut (-90°)
      const endAngle = (i + 1) * anglePerPart - 90;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const largeArcFlag = anglePerPart > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`, // Move to center
        `L ${x1} ${y1}`, // Line to start of arc
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc
        'Z' // Close path
      ].join(' ');
      
      const fillColor = i < numerator ? color : '#f3f4f6';
      const strokeColor = '#6b7280';
      
      svgParts.push(
        <path
          key={i}
          d={pathData}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
      );
    }
    
    return svgParts;
  };

  const renderFractionVisualExample = (fraction1: string, fraction2: string, comparison?: string) => {
    return (
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="text-center">
          <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderFractionVisual(fraction1, 40, "#ef4444")}
          </svg>
          <div className="mt-2">
            <FractionMath a={fraction1.split('/')[0]} b={fraction1.split('/')[1]} size="text-lg" />
          </div>
        </div>
        {comparison && (
          <div className="text-4xl font-bold text-purple-600">{comparison}</div>
        )}
        <div className="text-center">
          <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderFractionVisual(fraction2, 40, "#3b82f6")}
          </svg>
          <div className="mt-2">
            <FractionMath a={fraction2.split('/')[0]} b={fraction2.split('/')[1]} size="text-lg" />
          </div>
        </div>
      </div>
    );
  };

  const checkAnswer = () => {
    const correct = userAnswer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
          setUserAnswer('');
          setIsCorrect(null);
          setShowHint(false);
        } else {
          const newFinalScore = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(newFinalScore);
          saveProgress(newFinalScore); // Sauvegarder les XP
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    if (isCorrect !== null) {
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserAnswer('');
        setIsCorrect(null);
        setShowHint(false);
      } else {
        setFinalScore(score);
        saveProgress(score); // Sauvegarder les XP
        setShowCompletionModal(true);
      }
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              ⚖️ Comparaison de fractions simples
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Apprends à comparer des fractions simples !
            </p>
          </div>
        </div>

        {/* Onglets Cours/Exercices */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Introduction ludique */}
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6 text-white text-center">
              <div className="text-6xl mb-4">🍰</div>
              <h2 className="text-3xl font-bold mb-4">Le concours des gâteaux !</h2>
              <p className="text-xl">
                Qui a la plus grosse part de gâteau ? C'est parti pour comparer !
              </p>
            </div>

            {/* Section 1: Animations avec dessins (pie charts) */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <h2 className="text-3xl font-bold text-center mb-2 text-blue-900">
                🍰 Apprendre avec des dessins
              </h2>
              <p className="text-center text-lg text-blue-700 mb-6">
                Regardons les parts de gâteaux pour mieux comprendre !
              </p>
              
                             {/* Cas 1: Numérateur égal (avec dessins) */}
               <div className="mb-8">
                 <h3 className="text-2xl font-bold text-center mb-4 text-green-800">
                   📊 Cas 1 : Quand le numérateur est égal
                 </h3>
                 <div className="space-y-6">
                   <ComparaisonAnimation3 />
                 </div>
               </div>

              {/* Cas 2: Dénominateur égal (avec dessins) */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-4 text-orange-800">
                  📊 Cas 2 : Quand le dénominateur est égal
                </h3>
                <ComparaisonAnimation2 />
              </div>
            </div>

            {/* Section 2: Animations purement mathématiques */}
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl p-6 mb-8">
              <h2 className="text-3xl font-bold text-center mb-2 text-indigo-900">
                🔢 Apprendre avec les mathématiques pures
              </h2>
              <p className="text-center text-lg text-indigo-700 mb-6">
                Appliquons la règle directement sur les fractions !
              </p>
              
                             {/* Cas 1: Numérateur égal (version mathématique) */}
               <div className="mb-8">
                 <h3 className="text-2xl font-bold text-center mb-4 text-blue-800">
                   🔢 Cas 1 : Quand le numérateur est égal
                 </h3>
                 <AnimationRegleMathematique />
               </div>

               {/* Cas 2: Dénominateur égal (version mathématique) */}
               <div>
                 <h3 className="text-2xl font-bold text-center mb-4 text-orange-800">
                   🔢 Cas 2 : Quand le dénominateur est égal
                 </h3>
                 <AnimationRegleMathematique2 />
               </div>
             </div>

            {/* Résumé simple */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🏆 Ce qu'il faut retenir
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🔢</div>
                    <h3 className="text-xl font-bold text-blue-800 mb-3">Règle n°1 - Numérateur égal</h3>
                    <p className="text-blue-700 text-base">
                      Si le <strong>numérateur est égal</strong>, plus le dénominateur est grand, plus la fraction est <strong>petite</strong> !
                      <br/>
                      <span className="text-sm font-bold mt-2 block">(1/3 &gt; 1/6 car 6 &gt; 3)</span>
                    </p>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🧮</div>
                    <h3 className="text-xl font-bold text-orange-800 mb-3">Règle n°2 - Dénominateur égal</h3>
                    <p className="text-orange-700 text-base">
                      Si le <strong>dénominateur est égal</strong>, plus le numérateur est grand, plus la fraction est <strong>grande</strong> !
                      <br/>
                      <span className="text-sm font-bold mt-2 block">(2/4 &gt; 1/4 car 2 &gt; 1)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jeu interactif */}
            <MiniJeuComparaison />
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {exercises[currentExercise].question}
                </h3>

                {/* Fractions à comparer */}
                <div className="flex items-center justify-center space-x-8 mb-6">
                  <FractionMath 
                    a={exercises[currentExercise].fraction1.split('/')[0]} 
                    b={exercises[currentExercise].fraction1.split('/')[1]} 
                    size="text-4xl" 
                  />
                  <div className="text-4xl font-bold text-gray-400">?</div>
                  <FractionMath 
                    a={exercises[currentExercise].fraction2.split('/')[0]} 
                    b={exercises[currentExercise].fraction2.split('/')[1]} 
                    size="text-4xl" 
                  />
                </div>

                {/* Visualisation si applicable */}
                {exercises[currentExercise].hasVisual && (
                  <div className="mb-6">
                    {renderFractionVisualExample(
                      exercises[currentExercise].fraction1, 
                      exercises[currentExercise].fraction2
                    )}
                  </div>
                )}

                {/* Boutons de comparaison */}
                <div className="flex justify-center space-x-4 mb-6">
                  {['<', '=', '>'].map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => setUserAnswer(symbol)}
                      className={`w-16 h-16 text-2xl font-bold rounded-lg border-2 transition-all ${
                        userAnswer === symbol
                          ? 'bg-purple-500 text-white border-purple-500'
                          : 'bg-white text-gray-900 border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>

                {/* Affichage de l'indice */}
                {showHint && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
                    <div className="flex">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                      <p className="text-yellow-800">{exercises[currentExercise].hint}</p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4">
                  {/* Bouton indice */}
                  {!showHint && isCorrect === null && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="bg-yellow-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
                    >
                      <Lightbulb className="inline w-4 h-4 mr-2" />
                      Aide
                    </button>
                  )}
                  <button
                    onClick={resetExercise}
                    className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
                  >
                    Effacer
                  </button>
                  <button
                    onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                    disabled={currentExercise === 0}
                    className="bg-gray-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                  >
                    ← Précédent
                  </button>
                  <button
                    onClick={() => {
                      // Si l'utilisateur a choisi une réponse mais n'a pas encore vérifié, on vérifie d'abord
                      if (userAnswer.trim() && isCorrect === null) {
                        checkAnswer();
                      } else {
                        handleNext();
                      }
                    }}
                    disabled={isCorrect === null && !userAnswer.trim()}
                    className="bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                  >
                    {userAnswer.trim() && isCorrect === null 
                      ? '✅ Vérifier' 
                      : currentExercise + 1 < exercises.length 
                        ? 'Suivant →' 
                        : 'Terminer ✨'}
                  </button>
                </div>
              </div>

              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg ${
                  isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">Excellent ! Tu sais comparer les fractions !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        <span className="font-bold">
                          Pas encore ! La bonne réponse est : {exercises[currentExercise].correctAnswer}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { 
                    title: "⚖️ Expert en comparaison !", 
                    message: "Tu maîtrises parfaitement la comparaison de fractions !", 
                    color: "text-green-600",
                    bgColor: "bg-green-50" 
                  };
                  if (percentage >= 70) return { 
                    title: "🎯 Très bien !", 
                    message: "Tu comprends bien comment comparer les fractions !", 
                    color: "text-purple-600",
                    bgColor: "bg-purple-50" 
                  };
                  if (percentage >= 50) return { 
                    title: "📚 En progression !", 
                    message: "Continue à t'entraîner avec la comparaison !", 
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-50" 
                  };
                  return { 
                    title: "💪 Continue !", 
                    message: "La comparaison de fractions demande de l'entraînement !", 
                    color: "text-gray-600",
                    bgColor: "bg-gray-50" 
                  };
                };
                const result = getMessage();
                return (
                  <div className={`${result.bgColor} rounded-2xl p-6`}>
                    <div className="text-6xl mb-4">{percentage >= 70 ? "🎉" : percentage >= 50 ? "😊" : "📖"}</div>
                    <h3 className={`text-2xl font-bold mb-3 ${result.color}`}>{result.title}</h3>
                    <p className={`text-lg mb-4 ${result.color}`}>{result.message}</p>
                    <p className={`text-xl font-bold mb-4 ${result.color}`}>
                      Score final : {finalScore}/{exercises.length} ({percentage}%)
                    </p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {Math.round(12 * (finalScore / exercises.length))} XP gagnés !
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
                      >
                        Fermer
                      </button>
                      <button
                        onClick={() => {
                          setShowCompletionModal(false);
                          resetAll();
                        }}
                        className="bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
                      >
                        Recommencer
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 