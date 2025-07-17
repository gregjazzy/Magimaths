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

export default function ContenancesPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  // Exemples de conversion avec la méthode du tableau
  const conversionExamples: ConversionExample[] = [
    {
      id: 1,
      value: "2,5",
      fromUnit: "L",
      toUnit: "mL",
      result: "2500 mL",
      steps: {
        step1: "Je place dans la colonne L le chiffre des unités (2, dernier chiffre avant la virgule) avec la virgule, puis 5 dans la colonne dL",
        step2: "Je complète avec des 0 jusqu'à la colonne mL",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mL",
        step5: "Je lis le résultat : 2500 mL"
      }
    },
    {
      id: 2,
      value: "3500",
      fromUnit: "mL",
      toUnit: "L",
      result: "3,5 L",
      steps: {
        step1: "Je place dans la colonne mL le chiffre des unités (0), puis je répartis : 0 dans cL, 5 dans dL, 3 dans L",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne L",
        step5: "Je lis le résultat : 3,5 L"
      }
    },
    {
      id: 3,
      value: "1,8",
      fromUnit: "hL",
      toUnit: "cL",
      result: "18000 cL",
      steps: {
        step1: "Je place dans la colonne hL le chiffre des unités (1, dernier chiffre avant la virgule) avec la virgule, puis 8 dans la colonne daL",
        step2: "Je complète avec des 0 jusqu'à la colonne cL",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cL",
        step5: "Je lis le résultat : 18000 cL"
      }
    },
    {
      id: 4,
      value: "450",
      fromUnit: "cL",
      toUnit: "dL",
      result: "45 dL",
      steps: {
        step1: "Je place dans la colonne cL le chiffre des unités (0), puis je répartis : 5 dans dL, 4 dans L",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne dL",
        step5: "Je lis le résultat : 45 dL"
      }
    },
    {
      id: 5,
      value: "0,75",
      fromUnit: "L",
      toUnit: "cL",
      result: "75 cL",
      steps: {
        step1: "Je place dans la colonne L le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 7 dans la colonne dL, 5 dans la colonne cL",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cL",
        step5: "Je lis le résultat : 75 cL"
      }
    },
    {
      id: 6,
      value: "2,5",
      fromUnit: "daL",
      toUnit: "L",
      result: "25 L",
      steps: {
        step1: "Je place dans la colonne daL le chiffre des unités (2, dernier chiffre avant la virgule) avec la virgule, puis 5 dans la colonne L",
        step2: "Je complète avec des 0 jusqu'à la colonne L",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne L",
        step5: "Je lis le résultat : 25 L"
      }
    },
    {
      id: 7,
      value: "3,6",
      fromUnit: "hL",
      toUnit: "L",
      result: "360 L",
      steps: {
        step1: "Je place dans la colonne hL le chiffre des unités (3, dernier chiffre avant la virgule) avec la virgule, puis 6 dans la colonne daL",
        step2: "Je complète avec des 0 jusqu'à la colonne L",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne L",
        step5: "Je lis le résultat : 360 L"
      }
    },
    {
      id: 8,
      value: "680",
      fromUnit: "cL",
      toUnit: "L",
      result: "6,8 L",
      steps: {
        step1: "Je place dans la colonne cL le chiffre des unités (0), puis je répartis : 8 dans dL, 6 dans L",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne L",
        step5: "Je lis le résultat : 6,8 L"
      }
    },
    {
      id: 9,
      value: "0,45",
      fromUnit: "hL",
      toUnit: "mL",
      result: "45000 mL",
      steps: {
        step1: "Je place dans la colonne hL le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 4 dans daL, 5 dans L",
        step2: "Je complète avec des 0 jusqu'à la colonne mL",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mL",
        step5: "Je lis le résultat : 45000 mL"
      }
    },
    {
      id: 10,
      value: "1250",
      fromUnit: "mL",
      toUnit: "daL",
      result: "0,125 daL",
      steps: {
        step1: "Je place dans la colonne mL le chiffre des unités (0), puis je répartis : 5 dans cL, 2 dans dL, 1 dans L",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne daL",
        step5: "Je lis le résultat : 0,125 daL"
      }
    },
    {
      id: 11,
      value: "7,8",
      fromUnit: "L",
      toUnit: "mL",
      result: "7800 mL",
      steps: {
        step1: "Je place dans la colonne L le chiffre des unités (7, dernier chiffre avant la virgule) avec la virgule, puis 8 dans la colonne dL",
        step2: "Je complète avec des 0 jusqu'à la colonne mL",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mL",
        step5: "Je lis le résultat : 7800 mL"
    }
    },
    {
      id: 12,
      value: "5200",
      fromUnit: "cL",
      toUnit: "hL",
      result: "0,52 hL",
      steps: {
        step1: "Je place dans la colonne cL le chiffre des unités (0), puis je répartis : 0 dans dL, 2 dans L, 5 dans daL",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne hL",
        step5: "Je lis le résultat : 0,52 hL"
      }
    },
    {
      id: 13,
      value: "0,25",
      fromUnit: "hL",
      toUnit: "dL",
      result: "250 dL",
      steps: {
        step1: "Je place dans la colonne hL le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 2 dans daL, 5 dans L",
        step2: "Je complète avec des 0 jusqu'à la colonne dL",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dL",
        step5: "Je lis le résultat : 250 dL"
      }
    },
    {
      id: 14,
      value: "920",
      fromUnit: "mL",
      toUnit: "L",
      result: "0,92 L",
      steps: {
        step1: "Je place dans la colonne mL le chiffre des unités (0), puis je répartis : 2 dans cL, 9 dans dL",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne L",
        step5: "Je lis le résultat : 0,92 L"
      }
    },
    {
      id: 15,
      value: "4,2",
      fromUnit: "daL",
      toUnit: "cL",
      result: "4200 cL",
      steps: {
        step1: "Je place dans la colonne daL le chiffre des unités (4, dernier chiffre avant la virgule) avec la virgule, puis 2 dans la colonne L",
        step2: "Je complète avec des 0 jusqu'à la colonne cL",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cL",
        step5: "Je lis le résultat : 4200 cL"
      }
    },
    {
      id: 16,
      value: "3400",
      fromUnit: "mL",
      toUnit: "daL",
      result: "0,34 daL",
      steps: {
        step1: "Je place dans la colonne mL le chiffre des unités (0), puis je répartis : 0 dans cL, 4 dans dL, 3 dans L",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne daL",
        step5: "Je lis le résultat : 0,34 daL"
      }
    },
    {
      id: 17,
      value: "0,15",
      fromUnit: "hL",
      toUnit: "cL",
      result: "1500 cL",
      steps: {
        step1: "Je place dans la colonne hL le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 1 dans daL, 5 dans L",
        step2: "Je complète avec des 0 jusqu'à la colonne cL",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cL",
        step5: "Je lis le résultat : 1500 cL"
    }
    },
    {
      id: 18,
      value: "650",
      fromUnit: "dL",
      toUnit: "hL",
      result: "0,65 hL",
      steps: {
        step1: "Je place dans la colonne dL le chiffre des unités (0), puis je répartis : 5 dans L, 6 dans daL",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne hL",
        step5: "Je lis le résultat : 0,65 hL"
      }
    },
    {
      id: 19,
      value: "8,75",
      fromUnit: "L",
      toUnit: "cL",
      result: "875 cL",
      steps: {
        step1: "Je place dans la colonne L le chiffre des unités (8, dernier chiffre avant la virgule) avec la virgule, puis 7 dans dL, 5 dans cL",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne cL",
        step5: "Je lis le résultat : 875 cL"
      }
    },
    {
      id: 20,
      value: "2800",
      fromUnit: "cL",
      toUnit: "daL",
      result: "2,8 daL",
      steps: {
        step1: "Je place dans la colonne cL le chiffre des unités (0), puis je répartis : 0 dans dL, 8 dans L, 2 dans daL",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne daL",
        step5: "Je lis le résultat : 2,8 daL"
      }
    },
    {
      id: 21,
      value: "0,6",
      fromUnit: "daL",
      toUnit: "mL",
      result: "6000 mL",
      steps: {
        step1: "Je place dans la colonne daL le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 6 dans la colonne L",
        step2: "Je complète avec des 0 jusqu'à la colonne mL",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne mL",
        step5: "Je lis le résultat : 6000 mL"
      }
    },
    {
      id: 22,
      value: "1650",
      fromUnit: "mL",
      toUnit: "hL",
      result: "0,0165 hL",
      steps: {
        step1: "Je place dans la colonne mL le chiffre des unités (0), puis je répartis : 5 dans cL, 6 dans dL, 1 dans L",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne hL",
        step5: "Je lis le résultat : 0,0165 hL"
      }
    },
    {
      id: 23,
      value: "9,3",
      fromUnit: "dL",
      toUnit: "daL",
      result: "0,93 daL",
      steps: {
        step1: "Je place dans la colonne dL le chiffre des unités (9, dernier chiffre avant la virgule) avec la virgule, puis 3 dans la colonne cL",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne daL",
        step5: "Je lis le résultat : 0,93 daL"
      }
    },
    {
      id: 24,
      value: "1200",
      fromUnit: "dL",
      toUnit: "L",
      result: "120 L",
      steps: {
        step1: "Je place dans la colonne dL le chiffre des unités (0), puis je répartis : 0 dans L, 2 dans daL, 1 dans hL",
        step2: "Tous les chiffres sont déjà placés",
        step3: "Je retire la virgule du départ (pas de virgule ici)",
        step4: "Je place la virgule à droite de la colonne L",
        step5: "Je lis le résultat : 120 L"
      }
    },
    {
      id: 25,
      value: "0,08",
      fromUnit: "hL",
      toUnit: "dL",
      result: "80 dL",
      steps: {
        step1: "Je place dans la colonne hL le chiffre des unités (0, dernier chiffre avant la virgule) avec la virgule, puis 0 dans daL, 8 dans L",
        step2: "Je complète avec des 0 jusqu'à la colonne dL",
        step3: "Je retire la virgule du départ",
        step4: "Je place la virgule à droite de la colonne dL",
        step5: "Je lis le résultat : 80 dL"
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
    const units = ['hL', 'daL', 'L', 'dL', 'cL', 'mL'];
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
        // Nombre décimal comme 2,5 ou 0,75
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
        // Nombre entier comme 3500
        const digits = value.split('').reverse(); // [0, 0, 5, 3] pour 3500
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
    
    // Étape 4: Faire réapparaître la virgule à droite de la colonne d'arrivée (si nécessaire)
    if (animationStep === 4) {
      const toUnitIndex = units.indexOf(toUnit);
      const currentUnitIndex = units.indexOf(unit);
      
      // Vérifier si le résultat final est un nombre décimal OU si le nombre de départ contient une virgule
      const resultIsDecimal = currentConversionExample.result.includes(',');
      const inputHasComma = value.includes(',');
      const shouldShowComma = resultIsDecimal || inputHasComma;
      
      // Si c'est la colonne d'arrivée et qu'on doit afficher la virgule, afficher TOUJOURS la virgule
      if (currentUnitIndex === toUnitIndex && shouldShowComma) {
        // Prendre le contenu normal de cette cellule (étapes 1-3)
        let normalContent = '';
        
        // Récupérer le contenu des étapes précédentes
        if (animationStep >= 1) {
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
        }
        
        // Étape 2: Compléter avec des 0
        if (normalContent === '' && animationStep >= 2) {
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
        
        // FORCER l'affichage de la virgule pour les tests
        if (normalContent !== '') {
          return (
            <span className="relative">
              {normalContent}
              <span className="text-green-600 animate-pulse text-2xl font-bold bg-green-100 px-1 rounded ml-1">
                ,
              </span>
            </span>
          );
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/chapitre/cm1-grandeurs-mesures" className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors">
              <ArrowLeft size={20} />
              <span>Retour au chapitre</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                🥤
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Contenances</h1>
                <p className="text-gray-600 text-lg">
                  Mesurer, comparer et convertir les contenances (mL, cL, dL, L, hL)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu Méthode */}
        {(
          <div className="space-y-8">
            {/* Section 1: Les unités de contenance */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🥤 Les unités de contenance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">Millilitre (mL)</h3>
                  <p className="text-sm text-red-700">Très petites quantités</p>
                  <p className="text-xs text-red-600 mt-1">Ex: cuillère à café</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-bold text-orange-800 mb-2">Centilitre (cL)</h3>
                  <p className="text-sm text-orange-700">Petites quantités</p>
                  <p className="text-xs text-orange-600 mt-1">Ex: verre</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-2">Décilitre (dL)</h3>
                  <p className="text-sm text-yellow-700">Quantités moyennes</p>
                  <p className="text-xs text-yellow-600 mt-1">Ex: tasse</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">Litre (L)</h3>
                  <p className="text-sm text-green-700">Quantités courantes</p>
                  <p className="text-xs text-green-600 mt-1">Ex: bouteille</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h3 className="font-bold text-teal-800 mb-2">Décalitre (daL)</h3>
                  <p className="text-sm text-teal-700">Grandes quantités</p>
                  <p className="text-xs text-teal-600 mt-1">Ex: arrosoir</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">Hectolitre (hL)</h3>
                  <p className="text-sm text-blue-700">Très grandes quantités</p>
                  <p className="text-xs text-blue-600 mt-1">Ex: piscine</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4">🥤 Tableau des conversions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2 text-gray-800">hL</th>
                        <th className="border border-gray-300 p-2 text-gray-800">daL</th>
                        <th className="border border-gray-300 p-2 text-gray-800">L</th>
                        <th className="border border-gray-300 p-2 text-gray-800">dL</th>
                        <th className="border border-gray-300 p-2 text-gray-800">cL</th>
                        <th className="border border-gray-300 p-2 text-gray-800">mL</th>
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
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 2: Tableau interactif des conversions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔄 Tableau interactif des conversions</h2>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">
                    Exemple {currentExample + 1}/6 : Convertir {currentConversionExample.value} {currentConversionExample.fromUnit} en {currentConversionExample.toUnit}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={prevExample}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                    >
                      ← Exemple précédent
                    </button>
                    <button
                      onClick={nextExample}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Exemple suivant →
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center mb-6">
                  <button
                    onClick={startAnimation}
                    disabled={showSteps}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 transition-all"
                  >
                    <Play size={20} className="inline mr-2" />
                    {showSteps ? 'Animation démarrée' : 'Démarrer l\'animation étape par étape'}
                  </button>
                </div>

                {/* Contrôles d'étapes */}
                {showSteps && (
                  <div className="flex justify-center gap-4 mb-6">
                    <button
                      onClick={prevStep}
                      disabled={animationStep === 0}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium"
                    >
                      ← Étape précédente
                    </button>
                    <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                      <span className="text-gray-700 font-medium">Étape {animationStep + 1}/6</span>
                    </div>
                    <button
                      onClick={nextStep}
                      disabled={animationStep === 5}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium"
                    >
                      Étape suivante →
                    </button>
                    <button
                      onClick={resetAnimation}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      <RotateCcw size={16} className="inline mr-2" />
                      Recommencer
                    </button>
                  </div>
                )}

                {/* Tableau de conversion interactif */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse border-2 border-purple-300 bg-white">
                    <thead>
                      <tr className="bg-purple-100">
                        <th className="border-2 border-purple-300 p-4 text-purple-800 font-bold">hL</th>
                        <th className="border-2 border-purple-300 p-4 text-purple-800 font-bold">daL</th>
                        <th className="border-2 border-purple-300 p-4 text-purple-800 font-bold">L</th>
                        <th className="border-2 border-purple-300 p-4 text-purple-800 font-bold">dL</th>
                        <th className="border-2 border-purple-300 p-4 text-purple-800 font-bold">cL</th>
                        <th className="border-2 border-purple-300 p-4 text-purple-800 font-bold">mL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {['hL', 'daL', 'L', 'dL', 'cL', 'mL'].map((unit) => {
                          const isFromUnit = currentConversionExample.fromUnit === unit;
                          const isToUnit = currentConversionExample.toUnit === unit;
                          
                          const content = getContentForUnit(unit);
                          
                          return (
                            <td 
                              key={unit}
                              className={`border-2 border-purple-300 p-4 text-center text-lg font-mono text-gray-800 transition-all duration-300 ${
                                isFromUnit ? 'bg-yellow-200' : 
                                isToUnit ? 'bg-green-200' : 'bg-gray-50'
                              } ${
                                content && content !== '' ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg transform scale-105' : ''
                              }`}
                            >
                              {content}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Étapes de l'animation */}
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

            {/* Section 3: Ustensiles de mesure */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔧 Ustensiles de mesure</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-4">🥄 Cuillères</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• <strong>Cuillère à café</strong> : 5 mL</li>
                    <li>• <strong>Cuillère à soupe</strong> : 15 mL</li>
                    <li>• Utiles pour les petites quantités</li>
                    <li>• Parfaites pour la cuisine</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-4">🥛 Verre doseur</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Graduations précises</li>
                    <li>• Transparent pour bien voir</li>
                    <li>• Différentes tailles disponibles</li>
                    <li>• Idéal pour les recettes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section Problèmes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧩 Problèmes sur les contenances</h2>
              
              <div className="space-y-6">
                <VolumeProblems />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Component pour les problèmes de contenances
function VolumeProblems() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const problems = [
    {
      id: 1,
      question: "Une bouteille contient 1 L 250 mL d'eau. Combien cela fait-il en millilitres ?",
      answer: "1250",
      unit: "mL",
      explanation: "1 L = 1000 mL, donc 1 L 250 mL = 1000 mL + 250 mL = 1250 mL",
      difficulty: "facile",
      steps: [
        "Je convertis 1 L en mL : 1 L = 1000 mL",
        "J'ajoute les 250 mL : 1000 mL + 250 mL = 1250 mL"
      ]
    },
    {
      id: 2,
      question: "Un verre contient 250 mL de jus. Combien cela fait-il en litres ?",
      answer: "0.25",
      unit: "L",
      explanation: "250 mL = 250 ÷ 1000 = 0,25 L",
      difficulty: "moyen",
      steps: [
        "Je sais que 1000 mL = 1 L",
        "Je divise par 1000 : 250 ÷ 1000 = 0,25 L"
      ]
    },
    {
      id: 3,
      question: "Un réservoir contient 3,5 L d'essence. Combien cela fait-il en millilitres ?",
      answer: "3500",
      unit: "mL",
      explanation: "3,5 L = 3,5 × 1000 = 3500 mL",
      difficulty: "facile",
      steps: [
        "Je sais que 1 L = 1000 mL",
        "Je multiplie par 1000 : 3,5 × 1000 = 3500 mL"
      ]
    },
    {
      id: 4,
      question: "Une cuillère à soupe contient 15 mL. Combien cela fait-il en centilitres ?",
      answer: "1.5",
      unit: "cL",
      explanation: "15 mL = 15 ÷ 10 = 1,5 cL",
      difficulty: "moyen",
      steps: [
        "Je sais que 10 mL = 1 cL",
        "Je divise par 10 : 15 ÷ 10 = 1,5 cL"
      ]
    },
    {
      id: 5,
      question: "Un bidon contient 20 L d'eau. Combien peut-on remplir de bouteilles de 50 cL ?",
      answer: "40",
      unit: "bouteilles",
      explanation: "20 L = 2000 cL, donc 2000 ÷ 50 = 40 bouteilles",
      difficulty: "difficile",
              steps: [
          "Je convertis 20 L en cL : 20 L = 2000 cL",
          "Je divise par 50 cL : 2000 ÷ 50 = 40 bouteilles"
        ]
    },
    {
      id: 6,
      question: "Un pot de yaourt contient 125 mL. Combien cela fait-il en litres ?",
      answer: "0.125",
      unit: "L",
      explanation: "125 mL = 125 ÷ 1000 = 0,125 L",
      difficulty: "difficile",
      steps: [
        "Je sais que 1000 mL = 1 L",
        "Je divise par 1000 : 125 ÷ 1000 = 0,125 L"
      ]
    },
    {
      id: 7,
      question: "Une casserole contient 2 L 300 mL de soupe. Combien cela fait-il en millilitres ?",
      answer: "2300",
      unit: "mL",
      explanation: "2 L = 2000 mL, donc 2 L 300 mL = 2000 mL + 300 mL = 2300 mL",
      difficulty: "facile",
      steps: [
        "Je convertis 2 L en mL : 2 L = 2000 mL",
        "J'ajoute les 300 mL : 2000 mL + 300 mL = 2300 mL"
      ]
    },
    {
      id: 8,
      question: "Un aquarium contient 80 L d'eau. Combien cela fait-il en hectolitres ?",
      answer: "0.8",
      unit: "hL",
      explanation: "80 L = 80 ÷ 100 = 0,8 hL",
      difficulty: "difficile",
      steps: [
        "Je sais que 100 L = 1 hL",
        "Je divise par 100 : 80 ÷ 100 = 0,8 hL"
      ]
    },
    {
      id: 9,
      question: "Une canette contient 33 cL de soda. Combien cela fait-il en millilitres ?",
      answer: "330",
      unit: "mL",
      explanation: "33 cL = 33 × 10 = 330 mL",
      difficulty: "facile",
      steps: [
        "Je sais que 1 cL = 10 mL",
        "Je multiplie par 10 : 33 × 10 = 330 mL"
      ]
    },
    {
      id: 10,
      question: "Un seau contient 5 L d'eau. Combien peut-on remplir de verres de 25 cL ?",
      answer: "20",
      unit: "verres",
      explanation: "5 L = 500 cL, donc 500 ÷ 25 = 20 verres",
      difficulty: "difficile",
      steps: [
        "Je convertis 5 L en cL : 5 L = 500 cL",
        "Je divise par 25 cL : 500 ÷ 25 = 20 verres"
      ]
    },
    {
      id: 11,
      question: "Une bouteille de shampoing contient 400 mL. Combien cela fait-il en litres ?",
      answer: "0.4",
      unit: "L",
      explanation: "400 mL = 400 ÷ 1000 = 0,4 L",
      difficulty: "moyen",
      steps: [
        "Je sais que 1000 mL = 1 L",
        "Je divise par 1000 : 400 ÷ 1000 = 0,4 L"
      ]
    },
    {
      id: 12,
      question: "Un bac à eau contient 150 L. Combien cela fait-il en hectolitres ?",
      answer: "1.5",
      unit: "hL",
      explanation: "150 L = 150 ÷ 100 = 1,5 hL",
      difficulty: "moyen",
      steps: [
        "Je sais que 100 L = 1 hL",
        "Je divise par 100 : 150 ÷ 100 = 1,5 hL"
      ]
    },
    {
      id: 13,
      question: "Une tasse contient 20 cL de café. Combien cela fait-il en millilitres ?",
      answer: "200",
      unit: "mL",
      explanation: "20 cL = 20 × 10 = 200 mL",
      difficulty: "facile",
      steps: [
        "Je sais que 1 cL = 10 mL",
        "Je multiplie par 10 : 20 × 10 = 200 mL"
      ]
    },
    {
      id: 14,
      question: "Un flacon contient 50 mL de parfum. Combien cela fait-il en centilitres ?",
      answer: "5",
      unit: "cL",
      explanation: "50 mL = 50 ÷ 10 = 5 cL",
      difficulty: "moyen",
      steps: [
        "Je sais que 10 mL = 1 cL",
        "Je divise par 10 : 50 ÷ 10 = 5 cL"
      ]
    },
    {
      id: 15,
      question: "Une piscine contient 2 hL d'eau. Combien cela fait-il en litres ?",
      answer: "200",
      unit: "L",
      explanation: "2 hL = 2 × 100 = 200 L",
      difficulty: "facile",
      steps: [
        "Je sais que 1 hL = 100 L",
        "Je multiplie par 100 : 2 × 100 = 200 L"
      ]
    },
    {
      id: 16,
      question: "Un verre d'eau contient 15 cL. Combien faut-il de verres pour faire 1,5 L ?",
      answer: "10",
      unit: "verres",
      explanation: "1,5 L = 150 cL, donc 150 ÷ 15 = 10 verres",
      difficulty: "difficile",
      steps: [
        "Je convertis 1,5 L en cL : 1,5 L = 150 cL",
        "Je divise par 15 cL : 150 ÷ 15 = 10 verres"
      ]
    },
    {
      id: 17,
      question: "Un biberon contient 180 mL de lait. Combien cela fait-il en litres ?",
      answer: "0.18",
      unit: "L",
      explanation: "180 mL = 180 ÷ 1000 = 0,18 L",
      difficulty: "difficile",
      steps: [
        "Je sais que 1000 mL = 1 L",
        "Je divise par 1000 : 180 ÷ 1000 = 0,18 L"
      ]
    },
    {
      id: 18,
      question: "Un arrosoir contient 8 L d'eau. Combien cela fait-il en millilitres ?",
      answer: "8000",
      unit: "mL",
      explanation: "8 L = 8 × 1000 = 8000 mL",
      difficulty: "facile",
      steps: [
        "Je sais que 1 L = 1000 mL",
        "Je multiplie par 1000 : 8 × 1000 = 8000 mL"
      ]
    },
    {
      id: 19,
      question: "Une cuillère à café contient 5 mL. Combien faut-il de cuillères pour faire 4 cL ?",
      answer: "8",
      unit: "cuillères",
      explanation: "4 cL = 40 mL, donc 40 ÷ 5 = 8 cuillères",
      difficulty: "difficile",
      steps: [
        "Je convertis 4 cL en mL : 4 cL = 40 mL",
        "Je divise par 5 mL : 40 ÷ 5 = 8 cuillères"
      ]
    },
    {
      id: 20,
      question: "Un thermos contient 75 cL de thé. Combien cela fait-il en litres ?",
      answer: "0.75",
      unit: "L",
      explanation: "75 cL = 75 ÷ 100 = 0,75 L",
      difficulty: "moyen",
      steps: [
        "Je sais que 100 cL = 1 L",
        "Je divise par 100 : 75 ÷ 100 = 0,75 L"
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
              <div className="text-2xl font-bold text-purple-600">{score}</div>
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
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
                className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition-all"
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
            className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition-all"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
} 