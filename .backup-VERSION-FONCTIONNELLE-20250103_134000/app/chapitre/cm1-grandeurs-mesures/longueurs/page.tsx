'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play, RotateCcw, Target, Trophy, Eye, Edit } from 'lucide-react';

// Types pour les exemples de conversion
interface ConversionExample {
  id: number;
  value: string;
  fromUnit: string;
  toUnit: string;
  result: string;
  steps: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  };
}

export default function LongueursPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  // Exemples de conversion avec la méthode du tableau
  const conversionExamples: ConversionExample[] = [
    {
      id: 1,
      value: "3,5",
      fromUnit: "m",
      toUnit: "cm",
      result: "350 cm",
      steps: {
        step1: "Je place dans la colonne m le chiffre des unités (3, dernier chiffre avant la virgule) avec la virgule, puis 5 dans la colonne dm",
        step2: "Je complète avec des 0 jusqu'à la colonne cm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cm",
        step5: "Je lis le résultat : 350 cm"
      }
    },
    {
      id: 2,
      value: "2300",
      fromUnit: "mm",
      toUnit: "m",
      result: "2,3 m",
      steps: {
        step1: "Je place dans la colonne mm le chiffre des unités (0), puis je répartis : 0 dans cm, 3 dans dm, 2 dans m",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne m",
        step5: "Je lis le résultat : 2,3 m"
      }
    },
    {
      id: 3,
      value: "0,85",
      fromUnit: "m",
      toUnit: "dm",
      result: "8,5 dm",
      steps: {
        step1: "Je place dans la colonne m le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 8 dans dm, 5 dans cm",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dm",
        step5: "Je lis le résultat : 8,5 dm"
      }
    },
    {
      id: 4,
      value: "1,2",
      fromUnit: "km",
      toUnit: "hm",
      result: "12 hm",
      steps: {
        step1: "Je place dans la colonne km le chiffre des unités (1, dernier chiffre avant la virgule) avec la virgule, puis 2 dans la colonne hm",
        step2: "Je complète avec des 0 jusqu'à la colonne hm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne hm",
        step5: "Je lis le résultat : 12 hm"
      }
    },
    {
      id: 5,
      value: "750",
      fromUnit: "cm",
      toUnit: "dm",
      result: "75 dm",
      steps: {
        step1: "Je place dans la colonne cm le chiffre des unités (0), puis je répartis : 5 dans dm, 7 dans m",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne dm",
        step5: "Je lis le résultat : 75 dm"
      }
    },
    {
      id: 6,
      value: "4,5",
      fromUnit: "dam",
      toUnit: "dm",
      result: "450 dm",
      steps: {
        step1: "Je place dans la colonne dam le chiffre des unités (4, dernier chiffre avant la virgule) avec la virgule, puis 5 dans la colonne m",
        step2: "Je complète avec des 0 jusqu'à la colonne dm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dm",
        step5: "Je lis le résultat : 450 dm"
      }
    },
    {
      id: 7,
      value: "2,8",
      fromUnit: "km",
      toUnit: "m",
      result: "2800 m",
      steps: {
        step1: "Je place dans la colonne km le chiffre des unités (2, dernier chiffre avant la virgule) avec la virgule, puis 8 dans la colonne hm",
        step2: "Je complète avec des 0 jusqu'à la colonne m",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne m",
        step5: "Je lis le résultat : 2800 m"
      }
    },
    {
      id: 8,
      value: "650",
      fromUnit: "mm",
      toUnit: "cm",
      result: "65 cm",
      steps: {
        step1: "Je place dans la colonne mm le chiffre des unités (0), puis je répartis : 5 dans cm, 6 dans dm",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne cm",
        step5: "Je lis le résultat : 65 cm"
      }
    },
    {
      id: 9,
      value: "0,045",
      fromUnit: "hm",
      toUnit: "mm",
      result: "4500 mm",
      steps: {
        step1: "Je place dans la colonne hm le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 0 dans dam, 4 dans m, 5 dans dm",
        step2: "Je complète avec des 0 jusqu'à la colonne mm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mm",
        step5: "Je lis le résultat : 4500 mm"
      }
    },
    {
      id: 10,
      value: "1250",
      fromUnit: "dm",
      toUnit: "dam",
      result: "12,5 dam",
      steps: {
        step1: "Je place dans la colonne dm le chiffre des unités (0), puis je répartis : 5 dans m, 2 dans dam, 1 dans hm",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne dam",
        step5: "Je lis le résultat : 12,5 dam"
      }
    },
    {
      id: 11,
      value: "6,75",
      fromUnit: "m",
      toUnit: "mm",
      result: "6750 mm",
      steps: {
        step1: "Je place dans la colonne m le chiffre des unités (6, dernier chiffre avant la virgule) avec la virgule, puis 7 dans dm, 5 dans cm",
        step2: "Je complète avec des 0 jusqu'à la colonne mm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mm",
        step5: "Je lis le résultat : 6750 mm"
      }
    },
    {
      id: 12,
      value: "4200",
      fromUnit: "cm",
      toUnit: "km",
      result: "0,042 km",
      steps: {
        step1: "Je place dans la colonne cm le chiffre des unités (0), puis je répartis : 0 dans dm, 2 dans m, 4 dans dam",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne km",
        step5: "Je lis le résultat : 0,042 km"
      }
    },
    {
      id: 13,
      value: "0,38",
      fromUnit: "dam",
      toUnit: "cm",
      result: "380 cm",
      steps: {
        step1: "Je place dans la colonne dam le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 3 dans m, 8 dans dm",
        step2: "Je complète avec des 0 jusqu'à la colonne cm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cm",
        step5: "Je lis le résultat : 380 cm"
      }
    },
    {
      id: 14,
      value: "850",
      fromUnit: "dm",
      toUnit: "hm",
      result: "0,85 hm",
      steps: {
        step1: "Je place dans la colonne dm le chiffre des unités (0), puis je répartis : 5 dans m, 8 dans dam",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne hm",
        step5: "Je lis le résultat : 0,85 hm"
      }
    },
    {
      id: 15,
      value: "3,6",
      fromUnit: "hm",
      toUnit: "dm",
      result: "3600 dm",
      steps: {
        step1: "Je place dans la colonne hm le chiffre des unités (3, dernier chiffre avant la virgule) avec la virgule, puis 6 dans la colonne dam",
        step2: "Je complète avec des 0 jusqu'à la colonne dm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dm",
        step5: "Je lis le résultat : 3600 dm"
      }
    },
    {
      id: 16,
      value: "9200",
      fromUnit: "mm",
      toUnit: "dam",
      result: "0,92 dam",
      steps: {
        step1: "Je place dans la colonne mm le chiffre des unités (0), puis je répartis : 0 dans cm, 2 dans dm, 9 dans m",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne dam",
        step5: "Je lis le résultat : 0,92 dam"
      }
    },
    {
      id: 17,
      value: "0,125",
      fromUnit: "km",
      toUnit: "dm",
      result: "1250 dm",
      steps: {
        step1: "Je place dans la colonne km le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 1 dans hm, 2 dans dam, 5 dans m",
        step2: "Je complète avec des 0 jusqu'à la colonne dm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dm",
        step5: "Je lis le résultat : 1250 dm"
      }
    },
    {
      id: 18,
      value: "5400",
      fromUnit: "cm",
      toUnit: "hm",
      result: "0,54 hm",
      steps: {
        step1: "Je place dans la colonne cm le chiffre des unités (0), puis je répartis : 0 dans dm, 4 dans m, 5 dans dam",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne hm",
        step5: "Je lis le résultat : 0,54 hm"
      }
    },
    {
      id: 19,
      value: "7,25",
      fromUnit: "dam",
      toUnit: "mm",
      result: "72500 mm",
      steps: {
        step1: "Je place dans la colonne dam le chiffre des unités (7, dernier chiffre avant la virgule) avec la virgule, puis 2 dans m, 5 dans dm",
        step2: "Je complète avec des 0 jusqu'à la colonne mm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mm",
        step5: "Je lis le résultat : 72500 mm"
      }
    },
    {
      id: 20,
      value: "1800",
      fromUnit: "mm",
      toUnit: "hm",
      result: "0,018 hm",
      steps: {
        step1: "Je place dans la colonne mm le chiffre des unités (0), puis je répartis : 0 dans cm, 8 dans dm, 1 dans m",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne hm",
        step5: "Je lis le résultat : 0,018 hm"
      }
    },
    {
      id: 21,
      value: "0,6",
      fromUnit: "hm",
      toUnit: "cm",
      result: "600 cm",
      steps: {
        step1: "Je place dans la colonne hm le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 6 dans la colonne dam",
        step2: "Je complète avec des 0 jusqu'à la colonne cm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cm",
        step5: "Je lis le résultat : 600 cm"
      }
    },
    {
      id: 22,
      value: "3250",
      fromUnit: "dm",
      toUnit: "km",
      result: "0,325 km",
      steps: {
        step1: "Je place dans la colonne dm le chiffre des unités (0), puis je répartis : 5 dans m, 2 dans dam, 3 dans hm",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne km",
        step5: "Je lis le résultat : 0,325 km"
      }
    },
    {
      id: 23,
      value: "9,4",
      fromUnit: "m",
      toUnit: "dam",
      result: "0,94 dam",
      steps: {
        step1: "Je place dans la colonne m le chiffre des unités (9, dernier chiffre avant la virgule) avec la virgule, puis 4 dans la colonne dm",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dam",
        step5: "Je lis le résultat : 0,94 dam"
      }
    },
    {
      id: 24,
      value: "1450",
      fromUnit: "cm",
      toUnit: "m",
      result: "14,5 m",
      steps: {
        step1: "Je place dans la colonne cm le chiffre des unités (0), puis je répartis : 5 dans dm, 4 dans m, 1 dans dam",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne m",
        step5: "Je lis le résultat : 14,5 m"
      }
    },
    {
      id: 25,
      value: "0,028",
      fromUnit: "km",
      toUnit: "cm",
      result: "280 cm",
      steps: {
        step1: "Je place dans la colonne km le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 0 dans hm, 2 dans dam, 8 dans m",
        step2: "Je complète avec des 0 jusqu'à la colonne cm",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cm",
        step5: "Je lis le résultat : 280 cm"
      }
    }
  ];

  const startAnimation = () => {
    setAnimationStep(0);
    setShowSteps(true);
    setIsAnimating(true);
  };

  const nextStep = () => {
    setAnimationStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setAnimationStep(prev => Math.max(prev - 1, 0));
  };

  const resetAnimation = () => {
    setAnimationStep(0);
    setShowSteps(false);
    setIsAnimating(false);
  };

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % conversionExamples.length);
    setAnimationStep(0);
    setShowSteps(false);
  };

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + conversionExamples.length) % conversionExamples.length);
    setAnimationStep(0);
    setShowSteps(false);
  };

  const currentConversionExample = conversionExamples[currentExample];

  // Fonction pour distribuer les chiffres dans les bonnes colonnes
  const getContentForUnit = (unit: string) => {
    if (animationStep === 0) return '';
    
    const value = currentConversionExample.value;
    const fromUnit = currentConversionExample.fromUnit;
    const toUnit = currentConversionExample.toUnit;
    const units = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
    const fromUnitIndex = units.indexOf(fromUnit);
    const currentUnitIndex = units.indexOf(unit);
    
    // Étape 4: Afficher la virgule à droite de la colonne d'arrivée
    if (animationStep === 4 && unit === toUnit && (currentConversionExample.result.includes(',') || value.includes(','))) {
      // Récupérer le contenu normal de la cellule
      let normalContent = '';
      
      // Récupérer le contenu des étapes précédentes
      if (value.includes(',')) {
        const [integerPart, decimalPart] = value.split(',');
        const digitIndex = currentUnitIndex - fromUnitIndex;
        
        if (digitIndex <= 0) {
          const integerDigits = integerPart.split('').reverse();
          const integerIndex = Math.abs(digitIndex);
          if (integerIndex < integerDigits.length) {
            normalContent = integerDigits[integerIndex];
          }
        } else {
          const decimalIndex = digitIndex - 1;
          if (decimalIndex < decimalPart.length) {
            normalContent = decimalPart[decimalIndex];
          }
        }
      } else {
        const digits = value.split('').reverse();
        const digitIndex = currentUnitIndex - fromUnitIndex;
        if (digitIndex <= 0) {
          const integerIndex = Math.abs(digitIndex);
          if (integerIndex < digits.length) {
            normalContent = digits[integerIndex];
          }
        }
      }
      
      // Compléter avec des 0 si nécessaire
      if (normalContent === '') {
        const needsZero = currentUnitIndex > fromUnitIndex && currentUnitIndex <= units.indexOf(toUnit);
        
        let hasDecimalDigit = false;
        if (value.includes(',')) {
          const [integerPart, decimalPart] = value.split(',');
          const digitIndex = currentUnitIndex - fromUnitIndex;
          if (digitIndex > 0 && digitIndex <= decimalPart.length) {
            hasDecimalDigit = true;
          }
        }
        
        if (needsZero && !hasDecimalDigit) {
          normalContent = '0';
        }
      }
      
      // Afficher le contenu avec la virgule à droite
      if (normalContent !== '') {
        return (
          <span className="relative inline-block">
            {normalContent}
            <span className="text-green-600 animate-pulse text-xl font-bold bg-green-100 px-1 py-0.5 rounded ml-0.5">
              ,
            </span>
          </span>
        );
      } else {
        // Afficher juste la virgule si la colonne est vide mais que c'est la colonne d'arrivée
        return (
          <span className="text-green-600 animate-pulse text-xl font-bold bg-green-100 px-1 py-0.5 rounded">
            ,
          </span>
        );
      }
    }
    
    // Étape 1: Placer les chiffres dans les bonnes colonnes
          if (animationStep >= 1) {
        if (value.includes(',')) {
        // Nombre décimal comme 3,5 ou 0,85
          const [integerPart, decimalPart] = value.split(',');
          const digitIndex = currentUnitIndex - fromUnitIndex;
          
          // Partie entière : place les chiffres de droite à gauche
          if (digitIndex <= 0) {
            const integerDigits = integerPart.split('').reverse();
            const integerIndex = Math.abs(digitIndex);
            if (integerIndex < integerDigits.length) {
              const digit = integerDigits[integerIndex];
              // Si c'est la colonne de l'unité de départ et qu'il y a une partie décimale, gérer l'affichage de la virgule
              if (digitIndex === 0 && decimalPart.length > 0) {
                if (animationStep <= 2) {
                  // Étapes 1-2 : afficher le chiffre avec la virgule
                  return digit + ',';
                } else if (animationStep === 3) {
                  // Étape 3 : animation de disparition de la virgule
                  return (
                    <span className="relative">
                      {digit}
                      <span className="text-red-600 animate-pulse text-2xl font-bold bg-red-100 px-1 rounded">
                        ,
                      </span>
                    </span>
                  );
                } else {
                  // Étapes 4+ : afficher seulement le chiffre
                  return digit;
                }
              }
              return digit;
            }
          }
          
          // Partie décimale : place les chiffres de gauche à droite
          if (digitIndex > 0) {
            const decimalIndex = digitIndex - 1;
            if (decimalIndex < decimalPart.length) {
              return decimalPart[decimalIndex];
            }
          }
        } else {
        // Nombre entier comme 7
        const digits = value.split('').reverse();
        const digitIndex = currentUnitIndex - fromUnitIndex;
        
        if (digitIndex <= 0) {
          const integerIndex = Math.abs(digitIndex);
          if (integerIndex < digits.length) {
            return digits[integerIndex];
          }
        }
      }
    }
    
    // Étape 2: Compléter avec des 0
    if (animationStep >= 2) {
      const fromUnitIndex = units.indexOf(fromUnit);
      const toUnitIndex = units.indexOf(toUnit);
      const currentUnitIndex = units.indexOf(unit);
      
      // Vérifier s'il faut ajouter un zéro dans cette colonne
      const needsZero = currentUnitIndex > fromUnitIndex && currentUnitIndex <= toUnitIndex;
      
      // Vérifier si cette colonne n'a pas déjà un chiffre de la partie décimale
      let hasDecimalDigit = false;
      if (value.includes(',')) {
        const [integerPart, decimalPart] = value.split(',');
        const digitIndex = currentUnitIndex - fromUnitIndex;
        if (digitIndex > 0 && digitIndex <= decimalPart.length) {
          hasDecimalDigit = true;
        }
      }
      
      if (needsZero && !hasDecimalDigit) {
        if (animationStep === 2) {
          // Animation d'apparition des zéros avec délai progressif
          const delayIndex = currentUnitIndex - fromUnitIndex - 1;
          return (
            <span 
              className="animate-pulse text-green-600 font-bold text-2xl bg-green-100 px-2 py-1 rounded-full border-2 border-green-400"
              style={{ 
                animationDelay: `${delayIndex * 500}ms`,
                animationDuration: '1200ms',
                animationFillMode: 'both'
              }}
            >
              0
            </span>
          );
        } else {
          // Étapes 3+ : afficher les zéros normalement
          return '0';
        }
      }
    }
    
    // Étape 5+: Afficher normalement avec virgule
    if (animationStep >= 5) {
      const toUnitIndex = units.indexOf(toUnit);
      const currentUnitIndex = units.indexOf(unit);
      const resultIsDecimal = currentConversionExample.result.includes(',');
      const inputHasComma = value.includes(',');
      const shouldShowComma = resultIsDecimal || inputHasComma;
      
      if (currentUnitIndex === toUnitIndex && shouldShowComma) {
        // Récupérer le contenu normal
        let normalContent = '';
        
        if (value.includes(',')) {
          const [integerPart, decimalPart] = value.split(',');
          const digitIndex = currentUnitIndex - fromUnitIndex;
          
          if (digitIndex <= 0) {
            const integerDigits = integerPart.split('').reverse();
            const integerIndex = Math.abs(digitIndex);
            if (integerIndex < integerDigits.length) {
              normalContent = integerDigits[integerIndex];
            }
          } else {
            const decimalIndex = digitIndex - 1;
            if (decimalIndex < decimalPart.length) {
              normalContent = decimalPart[decimalIndex];
            }
          }
        } else {
          const digits = value.split('').reverse();
          const digitIndex = currentUnitIndex - fromUnitIndex;
          if (digitIndex <= 0) {
            const integerIndex = Math.abs(digitIndex);
            if (integerIndex < digits.length) {
              normalContent = digits[integerIndex];
            }
          }
        }
        
        if (normalContent === '') {
          const fromUnitIndex = units.indexOf(fromUnit);
          const needsZero = currentUnitIndex > fromUnitIndex && currentUnitIndex <= toUnitIndex;
          
          let hasDecimalDigit = false;
          if (value.includes(',')) {
            const [integerPart, decimalPart] = value.split(',');
            const digitIndex = currentUnitIndex - fromUnitIndex;
            if (digitIndex > 0 && digitIndex <= decimalPart.length) {
              hasDecimalDigit = true;
            }
          }
          
          if (needsZero && !hasDecimalDigit) {
            normalContent = '0';
          }
        }
        
        if (normalContent !== '') {
          return (
            <span className="relative inline-block">
              {normalContent}
              <span className="text-green-600 font-bold text-lg ml-0.5">
                ,
              </span>
            </span>
          );
        }
      }
    }
    
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/chapitre/cm1-grandeurs-mesures" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft size={20} />
              <span>Retour au chapitre</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                📏
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Longueurs</h1>
                <p className="text-gray-600 text-lg">
                  Mesurer, comparer et convertir les longueurs (mm, cm, m, km)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu Méthode */}
          <div className="space-y-8">
            {/* Section 1: Les unités de longueur */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📏 Les unités de longueur</h2>
              
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">Millimètre (mm)</h3>
                  <p className="text-sm text-red-700">Très petites longueurs</p>
                  <p className="text-xs text-red-600 mt-1">Ex: épaisseur d'un ongle</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-bold text-orange-800 mb-2">Centimètre (cm)</h3>
                  <p className="text-sm text-orange-700">Petites longueurs</p>
                <p className="text-xs text-orange-600 mt-1">Ex: largeur d'un doigt</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-2">Décimètre (dm)</h3>
                  <p className="text-sm text-yellow-700">Longueurs moyennes</p>
                <p className="text-xs text-yellow-600 mt-1">Ex: longueur d'une règle</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">Mètre (m)</h3>
                  <p className="text-sm text-green-700">Longueurs courantes</p>
                <p className="text-xs text-green-600 mt-1">Ex: hauteur d'une table</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h3 className="font-bold text-teal-800 mb-2">Décamètre (dam)</h3>
                  <p className="text-sm text-teal-700">Grandes longueurs</p>
                <p className="text-xs text-teal-600 mt-1">Ex: longueur d'une piscine</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">Hectomètre (hm)</h3>
                  <p className="text-sm text-blue-700">Très grandes longueurs</p>
                  <p className="text-xs text-blue-600 mt-1">Ex: longueur d'un stade</p>
                </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h3 className="font-bold text-indigo-800 mb-2">Kilomètre (km)</h3>
                <p className="text-sm text-indigo-700">Distances</p>
                <p className="text-xs text-indigo-600 mt-1">Ex: distance entre villes</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4">📏 Tableau des conversions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2 text-gray-800">km</th>
                        <th className="border border-gray-300 p-2 text-gray-800">hm</th>
                        <th className="border border-gray-300 p-2 text-gray-800">dam</th>
                        <th className="border border-gray-300 p-2 text-gray-800">m</th>
                        <th className="border border-gray-300 p-2 text-gray-800">dm</th>
                        <th className="border border-gray-300 p-2 text-gray-800">cm</th>
                        <th className="border border-gray-300 p-2 text-gray-800">mm</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">1</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">10</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">100</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">1000</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">10 000</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">100 000</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">1 000 000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 2: Tableau interactif des conversions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🔢 Tableau interactif des conversions</h2>
            
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <button
                onClick={() => setCurrentExample((prev) => (prev - 1 + conversionExamples.length) % conversionExamples.length)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      ← Exemple précédent
                    </button>
              
              <div className="flex-1 text-center">
                <p className="text-lg font-medium text-gray-700">
                  Exemple {currentExample + 1}/{conversionExamples.length} : Convertir {currentConversionExample.value} {currentConversionExample.fromUnit} en {currentConversionExample.toUnit}
                </p>
              </div>
              
                    <button
                onClick={() => setCurrentExample((prev) => (prev + 1) % conversionExamples.length)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Exemple suivant →
                    </button>
                </div>
                
                <div className="flex justify-center mb-6">
                  <button
                    onClick={startAnimation}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                ▶️ Animation démarrée
                  </button>
                </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex flex-col lg:flex-row gap-4 justify-center">
                    <button
                      onClick={prevStep}
                      disabled={animationStep === 0}
                  className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
                    >
                      ← Étape précédente
                    </button>
                
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-800">
                    Étape {animationStep}/5
                  </span>
                    </div>
                
                    <button
                      onClick={nextStep}
                      disabled={animationStep === 5}
                  className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
                    >
                      Étape suivante →
                    </button>
                
                    <button
                      onClick={resetAnimation}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                  🔄 Recommencer
                    </button>
                  </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 mb-4">
                    <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">km</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">hm</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">dam</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">m</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">dm</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">cm</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">mm</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('km')}
                            </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('hm')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('dam')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('m')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('dm')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('cm')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('mm')}
                      </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {showSteps && (
                  <div className="space-y-4">
                    <div className={`transition-all duration-500 ${
                      animationStep >= 1 ? 'opacity-100' : 'opacity-30'
                    } ${animationStep === 1 ? 'ring-2 ring-blue-400 ring-opacity-75' : ''}`}>
                      <div className={`p-3 rounded border-l-4 ${
                        animationStep === 1 ? 'bg-blue-200 border-blue-600' : 'bg-blue-100 border-blue-500'
                      }`}>
                        <p className="text-gray-800"><strong>Étape 1:</strong> {currentConversionExample.steps.step1}</p>
                      </div>
                    </div>
                    
                    <div className={`transition-all duration-500 ${
                      animationStep >= 2 ? 'opacity-100' : 'opacity-30'
                    } ${animationStep === 2 ? 'ring-2 ring-green-400 ring-opacity-75' : ''}`}>
                      <div className={`p-3 rounded border-l-4 ${
                        animationStep === 2 ? 'bg-green-200 border-green-600' : 'bg-green-100 border-green-500'
                      }`}>
                        <p className="text-gray-800"><strong>Étape 2:</strong> {currentConversionExample.steps.step2}</p>
                      </div>
                    </div>
                    
                    <div className={`transition-all duration-500 ${
                      animationStep >= 3 ? 'opacity-100' : 'opacity-30'
                    } ${animationStep === 3 ? 'ring-2 ring-orange-400 ring-opacity-75' : ''}`}>
                      <div className={`p-3 rounded border-l-4 ${
                        animationStep === 3 ? 'bg-orange-200 border-orange-600' : 'bg-orange-100 border-orange-500'
                      }`}>
                        <p className="text-gray-800"><strong>Étape 3:</strong> {currentConversionExample.steps.step3}</p>
                      </div>
                    </div>
                    
                    <div className={`transition-all duration-500 ${
                      animationStep >= 4 ? 'opacity-100' : 'opacity-30'
                    } ${animationStep === 4 ? 'ring-2 ring-purple-400 ring-opacity-75' : ''}`}>
                      <div className={`p-3 rounded border-l-4 ${
                        animationStep === 4 ? 'bg-purple-200 border-purple-600' : 'bg-purple-100 border-purple-500'
                      }`}>
                        <p className="text-gray-800"><strong>Étape 4:</strong> {currentConversionExample.steps.step4}</p>
                      </div>
                    </div>
                    
                    <div className={`transition-all duration-500 ${
                      animationStep >= 5 ? 'opacity-100' : 'opacity-30'
                    } ${animationStep === 5 ? 'ring-2 ring-red-400 ring-opacity-75' : ''}`}>
                      <div className={`p-3 rounded border-l-4 ${
                        animationStep === 5 ? 'bg-red-200 border-red-600' : 'bg-red-100 border-red-500'
                      }`}>
                        <p className="text-gray-800"><strong>Étape 5:</strong> {currentConversionExample.steps.step5}</p>
                      </div>
                    </div>

                    {animationStep >= 5 && (
                      <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-500">
                        <p className="text-center text-xl font-bold text-gray-800">
                          Résultat : {currentConversionExample.value} {currentConversionExample.fromUnit} = {currentConversionExample.result}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          {/* Section 3: Instruments de mesure */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🔧 Instruments de mesure</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-4">📏 Règle graduée</h3>
                  <ul className="space-y-2 text-blue-700">
                  <li>• Mesure précise en cm et mm</li>
                  <li>• Généralement 20 ou 30 cm</li>
                  <li>• Idéale pour les petites longueurs</li>
                  <li>• Facile à utiliser en classe</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-green-800 mb-4">📐 Mètre ruban</h3>
                  <ul className="space-y-2 text-green-700">
                  <li>• Mesure flexible et rétractable</li>
                  <li>• Plusieurs mètres de longueur</li>
                  <li>• Idéal pour les grandes longueurs</li>
                  <li>• Utilisé en bricolage et couture</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section Problèmes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧩 Problèmes sur les longueurs</h2>
              
              <div className="space-y-6">
                <LengthProblems />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

// Component pour les problèmes de longueurs
function LengthProblems() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const problems = [
    {
      id: 1,
      question: "Marie mesure 1 m 25 cm. Quelle est sa taille en centimètres ?",
      answer: "125",
      unit: "cm",
      explanation: "1 m = 100 cm, donc 1 m 25 cm = 100 cm + 25 cm = 125 cm",
      difficulty: "facile",
      steps: [
        "Je convertis 1 m en cm : 1 m = 100 cm",
        "J'ajoute les 25 cm : 100 cm + 25 cm = 125 cm"
      ]
    },
    {
      id: 2,
      question: "Un terrain fait 250 m de long. Combien cela fait-il en kilomètres ?",
      answer: "0.25",
      unit: "km",
      explanation: "250 m = 250 ÷ 1000 = 0,25 km",
      difficulty: "moyen",
      steps: [
        "Je sais que 1 km = 1000 m",
        "Je divise par 1000 : 250 ÷ 1000 = 0,25 km"
      ]
    },
    {
      id: 3,
      question: "Paul court 3 km 500 m. Quelle distance parcourt-il en mètres ?",
      answer: "3500",
      unit: "m",
      explanation: "3 km = 3000 m, donc 3 km 500 m = 3000 m + 500 m = 3500 m",
      difficulty: "facile",
      steps: [
        "Je convertis 3 km en m : 3 km = 3000 m",
        "J'ajoute les 500 m : 3000 m + 500 m = 3500 m"
      ]
    },
    {
      id: 4,
      question: "Un ruban mesure 75 cm. Combien cela fait-il en millimètres ?",
      answer: "750",
      unit: "mm",
      explanation: "75 cm = 75 × 10 = 750 mm",
      difficulty: "facile",
      steps: [
        "Je sais que 1 cm = 10 mm",
        "Je multiplie par 10 : 75 × 10 = 750 mm"
      ]
    },
    {
      id: 5,
      question: "Une piscine fait 25 m de long. Combien de tours complets de 50 m faut-il pour parcourir 1 km ?",
      answer: "20",
      unit: "tours",
      explanation: "1 km = 1000 m, donc 1000 ÷ 50 = 20 tours",
      difficulty: "difficile",
      steps: [
        "Je convertis 1 km en m : 1 km = 1000 m",
        "Je divise par 50 m : 1000 ÷ 50 = 20 tours"
      ]
    },
    {
      id: 6,
      question: "Un livre fait 2 cm d'épaisseur. Quelle est l'épaisseur en mm ?",
      answer: "20",
      unit: "mm",
      explanation: "2 cm = 2 × 10 = 20 mm",
      difficulty: "facile",
      steps: [
        "Je sais que 1 cm = 10 mm",
        "Je multiplie par 10 : 2 × 10 = 20 mm"
      ]
    },
    {
      id: 7,
      question: "Une corde mesure 1,5 m. Combien cela fait-il en centimètres ?",
      answer: "150",
      unit: "cm",
      explanation: "1,5 m = 1,5 × 100 = 150 cm",
      difficulty: "facile",
      steps: [
        "Je sais que 1 m = 100 cm",
        "Je multiplie par 100 : 1,5 × 100 = 150 cm"
      ]
    },
    {
      id: 8,
      question: "Un parcours fait 2 km 750 m. Combien cela fait-il en mètres ?",
      answer: "2750",
      unit: "m",
      explanation: "2 km = 2000 m, donc 2 km 750 m = 2000 m + 750 m = 2750 m",
      difficulty: "moyen",
      steps: [
        "Je convertis 2 km en m : 2 km = 2000 m",
        "J'ajoute les 750 m : 2000 m + 750 m = 2750 m"
      ]
    },
    {
      id: 9,
      question: "Un stylo mesure 14 cm. Combien cela fait-il en millimètres ?",
      answer: "140",
      unit: "mm",
      explanation: "14 cm = 14 × 10 = 140 mm",
      difficulty: "facile",
      steps: [
        "Je sais que 1 cm = 10 mm",
        "Je multiplie par 10 : 14 × 10 = 140 mm"
      ]
    },
    {
      id: 10,
      question: "Une route fait 3,2 km. Combien cela fait-il en mètres ?",
      answer: "3200",
      unit: "m",
      explanation: "3,2 km = 3,2 × 1000 = 3200 m",
      difficulty: "moyen",
      steps: [
        "Je sais que 1 km = 1000 m",
        "Je multiplie par 1000 : 3,2 × 1000 = 3200 m"
      ]
    },
    {
      id: 11,
      question: "Un clou mesure 35 mm. Combien cela fait-il en centimètres ?",
      answer: "3.5",
      unit: "cm",
      explanation: "35 mm = 35 ÷ 10 = 3,5 cm",
      difficulty: "moyen",
      steps: [
        "Je sais que 10 mm = 1 cm",
        "Je divise par 10 : 35 ÷ 10 = 3,5 cm"
      ]
    },
    {
      id: 12,
      question: "Un terrain fait 500 m de périmètre. Combien faut-il de tours pour parcourir 2 km ?",
      answer: "4",
      unit: "tours",
      explanation: "2 km = 2000 m, donc 2000 ÷ 500 = 4 tours",
      difficulty: "difficile",
      steps: [
        "Je convertis 2 km en m : 2 km = 2000 m",
        "Je divise par 500 m : 2000 ÷ 500 = 4 tours"
      ]
    },
    {
      id: 13,
      question: "Une feuille fait 21 cm de long. Combien cela fait-il en millimètres ?",
      answer: "210",
      unit: "mm",
      explanation: "21 cm = 21 × 10 = 210 mm",
      difficulty: "facile",
      steps: [
        "Je sais que 1 cm = 10 mm",
        "Je multiplie par 10 : 21 × 10 = 210 mm"
      ]
    },
    {
      id: 14,
      question: "Un bus parcourt 15 km en ville. Combien cela fait-il en mètres ?",
      answer: "15000",
      unit: "m",
      explanation: "15 km = 15 × 1000 = 15000 m",
      difficulty: "moyen",
      steps: [
        "Je sais que 1 km = 1000 m",
        "Je multiplie par 1000 : 15 × 1000 = 15000 m"
      ]
    },
    {
      id: 15,
      question: "Une règle mesure 200 mm. Combien cela fait-il en centimètres ?",
      answer: "20",
      unit: "cm",
      explanation: "200 mm = 200 ÷ 10 = 20 cm",
      difficulty: "facile",
      steps: [
        "Je sais que 10 mm = 1 cm",
        "Je divise par 10 : 200 ÷ 10 = 20 cm"
      ]
    },
    {
      id: 16,
      question: "Paul fait 3 tours d'un terrain de 400 m. Quelle distance parcourt-il en km ?",
      answer: "1.2",
      unit: "km",
      explanation: "3 × 400 m = 1200 m = 1200 ÷ 1000 = 1,2 km",
      difficulty: "difficile",
      steps: [
        "Je calcule la distance totale : 3 × 400 m = 1200 m",
        "Je convertis en km : 1200 ÷ 1000 = 1,2 km"
      ]
    },
    {
      id: 17,
      question: "Un cahier fait 24 cm de long. Combien cela fait-il en millimètres ?",
      answer: "240",
      unit: "mm",
      explanation: "24 cm = 24 × 10 = 240 mm",
      difficulty: "facile",
      steps: [
        "Je sais que 1 cm = 10 mm",
        "Je multiplie par 10 : 24 × 10 = 240 mm"
      ]
    },
    {
      id: 18,
      question: "Une ficelle mesure 2,8 m. Combien cela fait-il en centimètres ?",
      answer: "280",
      unit: "cm",
      explanation: "2,8 m = 2,8 × 100 = 280 cm",
      difficulty: "moyen",
      steps: [
        "Je sais que 1 m = 100 cm",
        "Je multiplie par 100 : 2,8 × 100 = 280 cm"
      ]
    },
    {
      id: 19,
      question: "Un serpent mesure 180 cm. Combien cela fait-il en mètres ?",
      answer: "1.8",
      unit: "m",
      explanation: "180 cm = 180 ÷ 100 = 1,8 m",
      difficulty: "moyen",
      steps: [
        "Je sais que 100 cm = 1 m",
        "Je divise par 100 : 180 ÷ 100 = 1,8 m"
      ]
    },
    {
      id: 20,
      question: "Une piste fait 1,5 km. Combien de tours pour parcourir 6 km ?",
      answer: "4",
      unit: "tours",
      explanation: "6 km ÷ 1,5 km = 4 tours",
      difficulty: "difficile",
      steps: [
        "Je divise la distance totale par la longueur d'un tour",
        "6 km ÷ 1,5 km = 4 tours"
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    const correctAnswer = problems[currentProblem].answer;
    if (answer === correctAnswer || parseFloat(answer) === parseFloat(correctAnswer)) {
      setScore(score + 1);
    }
  };

  const nextProblem = () => {
    setCurrentProblem((prev) => (prev + 1) % problems.length);
    setShowAnswer(false);
    setSelectedAnswer('');
    setShowSteps(false);
  };

  const prevProblem = () => {
    setCurrentProblem((prev) => (prev - 1 + problems.length) % problems.length);
    setShowAnswer(false);
    setSelectedAnswer('');
    setShowSteps(false);
  };

  const currentProb = problems[currentProblem];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Problème {currentProblem + 1} / {problems.length}
          </h3>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentProb.difficulty === 'facile' ? 'bg-green-100 text-green-800' :
              currentProb.difficulty === 'moyen' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentProb.difficulty}
            </span>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-500">points</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">{currentProb.question}</h4>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Votre réponse"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              disabled={showAnswer}
            />
            <span className="px-4 py-2 bg-gray-200 rounded-lg font-medium text-gray-800">
              {currentProb.unit}
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            {!showAnswer && (
              <button
                onClick={() => handleAnswer(selectedAnswer)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all"
              >
                Vérifier
              </button>
            )}
            
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-all"
            >
              {showSteps ? 'Masquer les étapes' : 'Voir les étapes'}
            </button>
          </div>

          {showSteps && (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h5 className="font-bold text-green-800 mb-2">📝 Étapes de résolution :</h5>
              <ol className="space-y-1 text-green-700">
                {currentProb.steps.map((step, index) => (
                  <li key={index} className="text-sm">
                    <strong>{index + 1}.</strong> {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {showAnswer && (
            <div className={`p-4 rounded-lg mb-4 ${
              selectedAnswer === currentProb.answer || parseFloat(selectedAnswer) === parseFloat(currentProb.answer)
                ? 'bg-green-100 border border-green-200'
                : 'bg-red-100 border border-red-200'
            }`}>
              <p className="font-bold mb-2 text-gray-800">
                {selectedAnswer === currentProb.answer || parseFloat(selectedAnswer) === parseFloat(currentProb.answer)
                  ? '✅ Bonne réponse !'
                  : '❌ Réponse incorrecte'}
              </p>
              <p className="text-sm mb-2 text-gray-800">
                <strong>Réponse correcte :</strong> {currentProb.answer} {currentProb.unit}
              </p>
              <p className="text-sm text-gray-800">
                <strong>Explication :</strong> {currentProb.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevProblem}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all"
          >
            ← Précédent
          </button>
          <button
            onClick={nextProblem}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
} 