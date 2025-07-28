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

export default function MassesPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  // Exemples de conversion avec la méthode du tableau
  const conversionExamples: ConversionExample[] = [
    {
      id: 1,
      value: "2,5",
      fromUnit: "kg",
      toUnit: "g",
      result: "2500 g",
      steps: {
        step1: "Je place dans la colonne kg le chiffre des unités (2, dernier chiffre avant la virgule) avec la virgule, puis 5 dans la colonne hg",
        step2: "Je complète avec des 0 jusqu'à la colonne g",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne g",
        step5: "Je lis le résultat : 2500 g"
      }
    },
    {
      id: 2,
      value: "3500",
      fromUnit: "g",
      toUnit: "kg",
      result: "3,5 kg",
      steps: {
        step1: "Je place dans la colonne g le chiffre des unités (0), puis je répartis : 3 dans kg, 5 dans hg, 0 dans dag",
        step2: "Je complète avec des 0 jusqu'à la colonne kg",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne kg",
        step5: "Je lis le résultat : 3,5 kg"
      }
    },
    {
      id: 3,
      value: "0,8",
      fromUnit: "hg",
      toUnit: "cg",
      result: "8000 cg",
      steps: {
        step1: "Je place dans la colonne hg le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 8 dans la colonne dag",
        step2: "Je complète avec des 0 jusqu'à la colonne cg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cg",
        step5: "Je lis le résultat : 8000 cg"
      }
    },
    {
      id: 4,
      value: "1,2",
      fromUnit: "t",
      toUnit: "hg",
      result: "120 hg",
      steps: {
        step1: "Je place dans la colonne t le chiffre des unités (1, dernier chiffre avant la virgule) avec la virgule, puis 2 dans la colonne kg",
        step2: "Je complète avec des 0 jusqu'à la colonne hg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne hg",
        step5: "Je lis le résultat : 120 hg"
      }
    },
    {
      id: 5,
      value: "750",
      fromUnit: "mg",
      toUnit: "g",
      result: "0,75 g",
      steps: {
        step1: "Je place dans la colonne mg le chiffre des unités (0), puis je répartis : 5 dans cg, 7 dans dg",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne g",
        step5: "Je lis le résultat : 0,75 g"
      }
    },
    {
      id: 6,
      value: "3,5",
      fromUnit: "dag",
      toUnit: "dg",
      result: "350 dg",
      steps: {
        step1: "Je place dans la colonne dag le chiffre des unités (3, dernier chiffre avant la virgule) avec la virgule, puis 5 dans la colonne g",
        step2: "Je complète avec des 0 jusqu'à la colonne dg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dg",
        step5: "Je lis le résultat : 350 dg"
      }
    },
    {
      id: 7,
      value: "1,5",
      fromUnit: "t",
      toUnit: "kg",
      result: "1500 kg",
      steps: {
        step1: "Je place dans la colonne t le chiffre des unités (1, dernier chiffre avant la virgule) avec la virgule, puis 5 dans la colonne kg",
        step2: "Je complète avec des 0 jusqu'à la colonne kg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne kg",
        step5: "Je lis le résultat : 1500 kg"
      }
    },
    {
      id: 8,
      value: "42",
      fromUnit: "hg",
      toUnit: "g",
      result: "4200 g",
      steps: {
        step1: "Je place dans la colonne hg le chiffre des unités (2), puis 4 dans la colonne kg",
        step2: "Je complète avec des 0 jusqu'à la colonne g",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne g",
        step5: "Je lis le résultat : 4200 g"
      }
    },
    {
      id: 9,
      value: "0,6",
      fromUnit: "kg",
      toUnit: "mg",
      result: "600000 mg",
      steps: {
        step1: "Je place dans la colonne kg le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 6 dans la colonne hg",
        step2: "Je complète avec des 0 jusqu'à la colonne mg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mg",
        step5: "Je lis le résultat : 600000 mg"
      }
    },
    {
      id: 10,
      value: "850",
      fromUnit: "dg",
      toUnit: "dag",
      result: "8,5 dag",
      steps: {
        step1: "Je place dans la colonne dg le chiffre des unités (0), puis je répartis : 5 dans g, 8 dans dag",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne dag",
        step5: "Je lis le résultat : 8,5 dag"
      }
    },
    {
      id: 11,
      value: "7,25",
      fromUnit: "kg",
      toUnit: "cg",
      result: "72500 cg",
      steps: {
        step1: "Je place dans la colonne kg le chiffre des unités (7, dernier chiffre avant la virgule) avec la virgule, puis 2 dans hg, 5 dans dag",
        step2: "Je complète avec des 0 jusqu'à la colonne cg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cg",
        step5: "Je lis le résultat : 72500 cg"
      }
    },
    {
      id: 12,
      value: "3600",
      fromUnit: "mg",
      toUnit: "hg",
      result: "0,036 hg",
      steps: {
        step1: "Je place dans la colonne mg le chiffre des unités (0), puis je répartis : 0 dans cg, 6 dans dg, 3 dans g",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne hg",
        step5: "Je lis le résultat : 0,036 hg"
      }
    },
    {
      id: 13,
      value: "0,25",
      fromUnit: "t",
      toUnit: "dg",
      result: "25000 dg",
      steps: {
        step1: "Je place dans la colonne t le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 2 dans kg, 5 dans hg",
        step2: "Je complète avec des 0 jusqu'à la colonne dg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dg",
        step5: "Je lis le résultat : 25000 dg"
      }
    },
    {
      id: 14,
      value: "580",
      fromUnit: "g",
      toUnit: "t",
      result: "0,00058 t",
      steps: {
        step1: "Je place dans la colonne g le chiffre des unités (0), puis je répartis : 8 dans dag, 5 dans hg",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne t",
        step5: "Je lis le résultat : 0,00058 t"
      }
    },
    {
      id: 15,
      value: "4,8",
      fromUnit: "dag",
      toUnit: "mg",
      result: "48000 mg",
      steps: {
        step1: "Je place dans la colonne dag le chiffre des unités (4, dernier chiffre avant la virgule) avec la virgule, puis 8 dans la colonne g",
        step2: "Je complète avec des 0 jusqu'à la colonne mg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mg",
        step5: "Je lis le résultat : 48000 mg"
      }
    },
    {
      id: 16,
      value: "1200",
      fromUnit: "cg",
      toUnit: "kg",
      result: "0,012 kg",
      steps: {
        step1: "Je place dans la colonne cg le chiffre des unités (0), puis je répartis : 0 dans dg, 2 dans g, 1 dans dag",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne kg",
        step5: "Je lis le résultat : 0,012 kg"
      }
    },
    {
      id: 17,
      value: "0,09",
      fromUnit: "hg",
      toUnit: "g",
      result: "9 g",
      steps: {
        step1: "Je place dans la colonne hg le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 0 dans dag, 9 dans g",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne g",
        step5: "Je lis le résultat : 9 g"
      }
    },
    {
      id: 18,
      value: "6250",
      fromUnit: "mg",
      toUnit: "dag",
      result: "0,625 dag",
      steps: {
        step1: "Je place dans la colonne mg le chiffre des unités (0), puis je répartis : 5 dans cg, 2 dans dg, 6 dans g",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne dag",
        step5: "Je lis le résultat : 0,625 dag"
      }
    },
    {
      id: 19,
      value: "3,75",
      fromUnit: "hg",
      toUnit: "dg",
      result: "3750 dg",
      steps: {
        step1: "Je place dans la colonne hg le chiffre des unités (3, dernier chiffre avant la virgule) avec la virgule, puis 7 dans dag, 5 dans g",
        step2: "Je complète avec des 0 jusqu'à la colonne dg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dg",
        step5: "Je lis le résultat : 3750 dg"
      }
    },
    {
      id: 20,
      value: "920",
      fromUnit: "g",
      toUnit: "hg",
      result: "9,2 hg",
      steps: {
        step1: "Je place dans la colonne g le chiffre des unités (0), puis je répartis : 2 dans dag, 9 dans hg",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne hg",
        step5: "Je lis le résultat : 9,2 hg"
      }
    },
    {
      id: 21,
      value: "0,15",
      fromUnit: "t",
      toUnit: "g",
      result: "150 g",
      steps: {
        step1: "Je place dans la colonne t le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 1 dans kg, 5 dans hg",
        step2: "Je complète avec des 0 jusqu'à la colonne g",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne g",
        step5: "Je lis le résultat : 150 g"
      }
    },
    {
      id: 22,
      value: "4750",
      fromUnit: "cg",
      toUnit: "dg",
      result: "47,5 dg",
      steps: {
        step1: "Je place dans la colonne cg le chiffre des unités (0), puis je répartis : 5 dans dg, 7 dans g, 4 dans dag",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne dg",
        step5: "Je lis le résultat : 47,5 dg"
      }
    },
    {
      id: 23,
      value: "8,6",
      fromUnit: "kg",
      toUnit: "dag",
      result: "86 dag",
      steps: {
        step1: "Je place dans la colonne kg le chiffre des unités (8, dernier chiffre avant la virgule) avec la virgule, puis 6 dans la colonne hg",
        step2: "Je complète avec des 0 jusqu'à la colonne dag",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dag",
        step5: "Je lis le résultat : 86 dag"
      }
    },
    {
      id: 24,
      value: "1350",
      fromUnit: "mg",
      toUnit: "cg",
      result: "135 cg",
      steps: {
        step1: "Je place dans la colonne mg le chiffre des unités (0), puis je répartis : 5 dans cg, 3 dans dg, 1 dans g",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne cg",
        step5: "Je lis le résultat : 135 cg"
      }
    },
    {
      id: 25,
      value: "0,045",
      fromUnit: "dag",
      toUnit: "mg",
      result: "450 mg",
      steps: {
        step1: "Je place dans la colonne dag le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 0 dans g, 4 dans dg, 5 dans cg",
        step2: "Je complète avec des 0 jusqu'à la colonne mg",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mg",
        step5: "Je lis le résultat : 450 mg"
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
    const units = ['t', 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'];
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
          // Nombre décimal comme 2,5 ou 0,8
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
        // Nombre entier comme 750
        const digits = value.split('').reverse(); // [0, 5, 7] pour 750
        const digitIndex = currentUnitIndex - fromUnitIndex;
        
        // Pour les nombres entiers, on affiche les chiffres dans toutes les colonnes appropriées
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/chapitre/cm1-grandeurs-mesures" className="flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors">
              <ArrowLeft size={20} />
              <span>Retour au chapitre</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                ⚖️
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Masses</h1>
                <p className="text-gray-600 text-lg">
                  Mesurer, comparer et convertir les masses (mg, g, kg, t)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu Méthode */}
          <div className="space-y-8">
            {/* Section 1: Les unités de masse */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">⚖️ Les unités de masse</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">Milligramme (mg)</h3>
                  <p className="text-sm text-red-700">Très petites masses</p>
                  <p className="text-xs text-red-600 mt-1">Ex: grain de sel</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-bold text-orange-800 mb-2">Centigramme (cg)</h3>
                  <p className="text-sm text-orange-700">Petites masses</p>
                  <p className="text-xs text-orange-600 mt-1">Ex: grain de riz</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-2">Décigramme (dg)</h3>
                  <p className="text-sm text-yellow-700">Petites masses</p>
                  <p className="text-xs text-yellow-600 mt-1">Ex: bonbon</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">Gramme (g)</h3>
                  <p className="text-sm text-green-700">Masses courantes</p>
                  <p className="text-xs text-green-600 mt-1">Ex: pièce de monnaie</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h3 className="font-bold text-teal-800 mb-2">Décagramme (dag)</h3>
                  <p className="text-sm text-teal-700">Masses moyennes</p>
                  <p className="text-xs text-teal-600 mt-1">Ex: sachet de sucre</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">Hectogramme (hg)</h3>
                  <p className="text-sm text-blue-700">Masses moyennes</p>
                  <p className="text-xs text-blue-600 mt-1">Ex: tablette de chocolat</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h3 className="font-bold text-indigo-800 mb-2">Kilogramme (kg)</h3>
                  <p className="text-sm text-indigo-700">Grandes masses</p>
                  <p className="text-xs text-indigo-600 mt-1">Ex: sac de farine</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-2">Tonne (t)</h3>
                  <p className="text-sm text-purple-700">Très grandes masses</p>
                  <p className="text-xs text-purple-600 mt-1">Ex: voiture</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4">⚖️ Tableau des conversions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2 text-gray-800">t</th>
                        <th className="border border-gray-300 p-2 text-gray-800">kg</th>
                        <th className="border border-gray-300 p-2 text-gray-800">hg</th>
                        <th className="border border-gray-300 p-2 text-gray-800">dag</th>
                        <th className="border border-gray-300 p-2 text-gray-800">g</th>
                        <th className="border border-gray-300 p-2 text-gray-800">dg</th>
                        <th className="border border-gray-300 p-2 text-gray-800">cg</th>
                        <th className="border border-gray-300 p-2 text-gray-800">mg</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">1</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">1000</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">10 000</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">100 000</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">1 000 000</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">10 000 000</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">100 000 000</td>
                        <td className="border border-gray-300 p-2 text-center text-gray-800">1 000 000 000</td>
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
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
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
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
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

            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="flex flex-col lg:flex-row gap-4 justify-center">
                    <button
                      onClick={prevStep}
                      disabled={animationStep === 0}
                  className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500 disabled:opacity-50 transition-colors"
                    >
                      ← Étape précédente
                    </button>
                
                <div className="text-center">
                  <span className="text-lg font-bold text-purple-800">
                    Étape {animationStep}/5
                  </span>
                    </div>
                
                    <button
                      onClick={nextStep}
                      disabled={animationStep === 5}
                  className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500 disabled:opacity-50 transition-colors"
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
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">t</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">kg</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">hg</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">dag</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">g</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">dg</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">cg</th>
                      <th className="border border-gray-300 p-3 text-gray-800 min-w-[80px]">mg</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('t')}
                            </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('kg')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('hg')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('dag')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('g')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('dg')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('cg')}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-2xl font-bold text-gray-800 min-h-[60px]">
                        {getContentForUnit('mg')}
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
                  <h3 className="font-bold text-blue-800 mb-4">⚖️ Balance électronique</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Affichage digital précis</li>
                    <li>• Mesure en grammes et kilogrammes</li>
                    <li>• Bouton tare pour remettre à zéro</li>
                    <li>• Idéale pour la cuisine</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-4">⚖️ Balance à fléaux</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Utilise des poids étalon</li>
                    <li>• Principe de l'équilibre</li>
                    <li>• Très précise</li>
                    <li>• Utilisée en pharmacie</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section Problèmes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧩 Problèmes sur les masses</h2>
              
              <div className="space-y-6">
                <MassProblems />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

// Component pour les problèmes de masses
function MassProblems() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const problems = [
    {
      id: 1,
      question: "Un sac de pommes de terre pèse 2 kg 500 g. Combien cela fait-il en grammes ?",
      answer: "2500",
      unit: "g",
      explanation: "2 kg = 2000 g, donc 2 kg 500 g = 2000 g + 500 g = 2500 g",
      difficulty: "facile",
      steps: [
        "Je convertis 2 kg en g : 2 kg = 2000 g",
        "J'ajoute les 500 g : 2000 g + 500 g = 2500 g"
      ]
    },
    {
      id: 2,
      question: "Un bébé pèse 3500 g. Combien cela fait-il en kilogrammes ?",
      answer: "3.5",
      unit: "kg",
      explanation: "3500 g = 3500 ÷ 1000 = 3,5 kg",
      difficulty: "moyen",
      steps: [
        "Je sais que 1000 g = 1 kg",
        "Je divise par 1000 : 3500 ÷ 1000 = 3,5 kg"
      ]
    },
    {
      id: 3,
      question: "Une voiture pèse 1,2 t. Combien cela fait-il en kilogrammes ?",
      answer: "1200",
      unit: "kg",
      explanation: "1,2 t = 1,2 × 1000 = 1200 kg",
      difficulty: "moyen",
      steps: [
        "Je sais que 1 t = 1000 kg",
        "Je multiplie par 1000 : 1,2 × 1000 = 1200 kg"
      ]
    },
    {
      id: 4,
      question: "Un paquet de céréales pèse 375 g. Combien cela fait-il en kilogrammes ?",
      answer: "0.375",
      unit: "kg",
      explanation: "375 g = 375 ÷ 1000 = 0,375 kg",
      difficulty: "difficile",
      steps: [
        "Je sais que 1000 g = 1 kg",
        "Je divise par 1000 : 375 ÷ 1000 = 0,375 kg"
      ]
    },
    {
      id: 5,
      question: "Un camion peut transporter 5 t. Combien cela fait-il en kilogrammes ?",
      answer: "5000",
      unit: "kg",
      explanation: "5 t = 5 × 1000 = 5000 kg",
      difficulty: "facile",
      steps: [
        "Je sais que 1 t = 1000 kg",
        "Je multiplie par 1000 : 5 × 1000 = 5000 kg"
      ]
    },
    {
      id: 6,
      question: "Un chat pèse 3 kg 200 g. Combien cela fait-il en grammes ?",
      answer: "3200",
      unit: "g",
      explanation: "3 kg = 3000 g, donc 3 kg 200 g = 3000 g + 200 g = 3200 g",
      difficulty: "facile",
      steps: [
        "Je convertis 3 kg en g : 3 kg = 3000 g",
        "J'ajoute les 200 g : 3000 g + 200 g = 3200 g"
      ]
    },
    {
      id: 7,
      question: "Une tablette de chocolat pèse 200 g. Combien cela fait-il en kilogrammes ?",
      answer: "0.2",
      unit: "kg",
      explanation: "200 g = 200 ÷ 1000 = 0,2 kg",
      difficulty: "moyen",
      steps: [
        "Je sais que 1000 g = 1 kg",
        "Je divise par 1000 : 200 ÷ 1000 = 0,2 kg"
      ]
    },
    {
      id: 8,
      question: "Un éléphant pèse 4,5 t. Combien cela fait-il en kilogrammes ?",
      answer: "4500",
      unit: "kg",
      explanation: "4,5 t = 4,5 × 1000 = 4500 kg",
      difficulty: "moyen",
      steps: [
        "Je sais que 1 t = 1000 kg",
        "Je multiplie par 1000 : 4,5 × 1000 = 4500 kg"
      ]
    },
    {
      id: 9,
      question: "Un livre pèse 250 g. Combien pèsent 4 livres en kilogrammes ?",
      answer: "1",
      unit: "kg",
      explanation: "4 × 250 g = 1000 g = 1 kg",
      difficulty: "difficile",
      steps: [
        "Je calcule le poids total : 4 × 250 g = 1000 g",
        "Je convertis en kg : 1000 g = 1 kg"
      ]
    },
    {
      id: 10,
      question: "Une pomme pèse 150 g. Combien pèsent 6 pommes en grammes ?",
      answer: "900",
      unit: "g",
      explanation: "6 × 150 g = 900 g",
      difficulty: "facile",
      steps: [
        "Je multiplie le poids d'une pomme par 6",
        "6 × 150 g = 900 g"
      ]
    },
    {
      id: 11,
      question: "Un sac de farine pèse 1,5 kg. Combien cela fait-il en grammes ?",
      answer: "1500",
      unit: "g",
      explanation: "1,5 kg = 1,5 × 1000 = 1500 g",
      difficulty: "facile",
      steps: [
        "Je sais que 1 kg = 1000 g",
        "Je multiplie par 1000 : 1,5 × 1000 = 1500 g"
      ]
    },
    {
      id: 12,
      question: "Un camion vide pèse 2,5 t et transporte 1,8 t de marchandises. Quel est le poids total ?",
      answer: "4.3",
      unit: "t",
      explanation: "2,5 t + 1,8 t = 4,3 t",
      difficulty: "moyen",
      steps: [
        "J'additionne les deux masses",
        "2,5 t + 1,8 t = 4,3 t"
      ]
    },
    {
      id: 13,
      question: "Une orange pèse 180 g. Combien cela fait-il en kilogrammes ?",
      answer: "0.18",
      unit: "kg",
      explanation: "180 g = 180 ÷ 1000 = 0,18 kg",
      difficulty: "difficile",
      steps: [
        "Je sais que 1000 g = 1 kg",
        "Je divise par 1000 : 180 ÷ 1000 = 0,18 kg"
      ]
    },
    {
      id: 14,
      question: "Un chien pèse 15 kg. Combien cela fait-il en grammes ?",
      answer: "15000",
      unit: "g",
      explanation: "15 kg = 15 × 1000 = 15000 g",
      difficulty: "facile",
      steps: [
        "Je sais que 1 kg = 1000 g",
        "Je multiplie par 1000 : 15 × 1000 = 15000 g"
      ]
    },
    {
      id: 15,
      question: "Une boîte de conserve pèse 400 g. Combien pèsent 5 boîtes en kilogrammes ?",
      answer: "2",
      unit: "kg",
      explanation: "5 × 400 g = 2000 g = 2 kg",
      difficulty: "difficile",
      steps: [
        "Je calcule le poids total : 5 × 400 g = 2000 g",
        "Je convertis en kg : 2000 g = 2 kg"
      ]
    },
    {
      id: 16,
      question: "Un cartable pèse 2 kg 300 g. Combien cela fait-il en grammes ?",
      answer: "2300",
      unit: "g",
      explanation: "2 kg = 2000 g, donc 2 kg 300 g = 2000 g + 300 g = 2300 g",
      difficulty: "facile",
      steps: [
        "Je convertis 2 kg en g : 2 kg = 2000 g",
        "J'ajoute les 300 g : 2000 g + 300 g = 2300 g"
      ]
    },
    {
      id: 17,
      question: "Un bus pèse 8,5 t. Combien cela fait-il en kilogrammes ?",
      answer: "8500",
      unit: "kg",
      explanation: "8,5 t = 8,5 × 1000 = 8500 kg",
      difficulty: "moyen",
      steps: [
        "Je sais que 1 t = 1000 kg",
        "Je multiplie par 1000 : 8,5 × 1000 = 8500 kg"
      ]
    },
    {
      id: 18,
      question: "Un yaourt pèse 125 g. Combien pèsent 8 yaourts en kilogrammes ?",
      answer: "1",
      unit: "kg",
      explanation: "8 × 125 g = 1000 g = 1 kg",
      difficulty: "difficile",
      steps: [
        "Je calcule le poids total : 8 × 125 g = 1000 g",
        "Je convertis en kg : 1000 g = 1 kg"
      ]
    },
    {
      id: 19,
      question: "Une souris pèse 25 g. Combien cela fait-il en kilogrammes ?",
      answer: "0.025",
      unit: "kg",
      explanation: "25 g = 25 ÷ 1000 = 0,025 kg",
      difficulty: "difficile",
      steps: [
        "Je sais que 1000 g = 1 kg",
        "Je divise par 1000 : 25 ÷ 1000 = 0,025 kg"
      ]
    },
    {
      id: 20,
      question: "Un sac de riz pèse 5 kg. Combien pèsent 3 sacs en tonnes ?",
      answer: "0.015",
      unit: "t",
      explanation: "3 × 5 kg = 15 kg = 15 ÷ 1000 = 0,015 t",
      difficulty: "difficile",
      steps: [
        "Je calcule le poids total : 3 × 5 kg = 15 kg",
        "Je convertis en t : 15 ÷ 1000 = 0,015 t"
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
              <div className="text-2xl font-bold text-green-600">{score}</div>
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
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
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-all"
              >
                Vérifier
              </button>
            )}
            
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all"
            >
              {showSteps ? 'Masquer les étapes' : 'Voir les étapes'}
            </button>
          </div>

          {showSteps && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h5 className="font-bold text-blue-800 mb-2">📝 Étapes de résolution :</h5>
              <ol className="space-y-1 text-blue-700">
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
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-all"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
} 