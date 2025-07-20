'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb, Play, Eye } from 'lucide-react';
import { VoiceInput } from '../../../components/VoiceInput';

export default function IntroductionEquationsPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [currentCourseSection, setCurrentCourseSection] = useState(0);
  
  // États pour les animations des exemples
  const [currentExample, setCurrentExample] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // États pour les sections d'exercices
  const [currentExerciseSection, setCurrentExerciseSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState([0, 0, 0, 0]); // Score pour chaque section

  const courseContent = [
    {
      id: 'notion',
      title: '1. Notion d\'égalité et d\'équation',
      content: {
        definition: 'Une équation est une égalité dans laquelle figure une ou plusieurs lettres appelées inconnues ou variables.',
        examples: [
          { equation: '2x + 3 = 7', description: 'x est l\'inconnue' },
          { equation: '5y - 1 = 2y + 8', description: 'y est l\'inconnue' },
          { equation: '3t = 15', description: 't est l\'inconnue' }
        ],
        explanation: 'Une équation se compose de deux membres séparés par le signe égal (=). Le premier membre est à gauche du signe égal, le second membre est à droite.'
      }
    },
    {
      id: 'solution',
      title: '2. Solution d\'une équation',
      content: {
        definition: 'Une solution d\'une équation est une valeur de l\'inconnue qui rend l\'égalité vraie.',
        examples: [
          { 
            equation: '2x + 3 = 7', 
            test: 'Si x = 2, on remplace donc x par 2 dans l\'équation : 2×2 + 3 = 4 + 3 = 7 ✓',
            conclusion: 'x = 2 est solution'
          },
          { 
            equation: '2x + 3 = 7', 
            test: 'Si x = 1, on remplace donc x par 1 dans l\'équation : 2×1 + 3 = 2 + 3 = 5 ≠ 7 ✗',
            conclusion: 'x = 1 n\'est pas solution'
          }
        ],
        explanation: 'Pour vérifier qu\'une valeur est solution, on remplace l\'inconnue par cette valeur et on vérifie que l\'égalité est vraie.'
      }
    },
    {
      id: 'resolution',
      title: '3. Résolution d\'équations du premier degré',
      content: {
        definition: 'Résoudre une équation, c\'est trouver toutes ses solutions. Pour cela, on transforme l\'équation en une équation équivalente plus simple.',
        rules: [
          'On peut ajouter ou soustraire le même nombre aux deux membres',
          'On peut multiplier ou diviser les deux membres par le même nombre non nul',
          'Ces transformations donnent des équations équivalentes (même ensemble de solutions)'
        ],
        method: [
          '1. Rassembler les termes avec l\'inconnue d\'un côté',
          '2. Rassembler les termes constants de l\'autre côté', 
          '3. Diviser par le coefficient de l\'inconnue',
          '4. Vérifier la solution trouvée'
        ]
      }
    },
    {
      id: 'exemples',
      title: '4. Exemples détaillés',
      content: {
        examples: [
          {
            id: 'simple-equation',
            equation: '2x + 3 = 7',
            steps: [
              { step: '2x + 3 = 7', explanation: 'Équation de départ' },
              { step: '2x + 3 - 3 = 7 - 3', explanation: 'On soustrait 3 aux deux membres' },
              { step: '2x = 4', explanation: 'Simplification' },
              { step: 'x = 4 ÷ 2', explanation: 'On divise par 2' },
              { step: 'x = 2', explanation: 'Solution' }
            ],
            verification: 'Vérification : 2×2 + 3 = 4 + 3 = 7 ✓'
          },
          {
            id: 'two-sides-equation',
            equation: '5x - 2 = 3x + 4',
            steps: [
              { step: '5x - 2 = 3x + 4', explanation: 'Équation de départ' },
              { step: '5x - 2 - 3x = 3x + 4 - 3x', explanation: 'On soustrait 3x aux deux membres' },
              { step: '2x - 2 = 4', explanation: 'Simplification' },
              { step: '2x - 2 + 2 = 4 + 2', explanation: 'On ajoute 2 aux deux membres' },
              { step: '2x = 6', explanation: 'Simplification' },
              { step: 'x = 3', explanation: 'Solution' }
            ],
            verification: 'Vérification : 5×3 - 2 = 15 - 2 = 13 et 3×3 + 4 = 9 + 4 = 13 ✓'
          },
          {
            id: 'fraction-simple',
            equation: <>
              <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
              </span> + 3 = 7
            </>,
            steps: [
              { 
                step: <>
                  <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
                  </span> + 3 = 7
                </>, 
                explanation: 'Équation de départ avec une fraction' 
              },
              { 
                step: <>
                  <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
                  </span> + 3 - 3 = 7 - 3
                </>, 
                explanation: 'On soustrait 3 aux deux membres' 
              },
              { 
                step: <>
                  <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
                  </span> = 4
                </>, 
                explanation: 'Simplification : il reste x/2 = 4' 
              },
              { 
                step: <>
                  <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
                  </span> × 2 = 4 × 2
                </>, 
                explanation: 'On multiplie les deux membres par 2' 
              },
              { step: 'x = 8', explanation: 'Solution finale' }
            ],
            verification: <>Vérification : <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>8</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span> + 3 = 4 + 3 = 7 ✓</>
          },
          {
            id: 'fraction-multiple',
            equation: <>
              <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span>
              </span> + <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span>
              </span> = 5
            </>,
            steps: [
              { 
                step: <>
                  <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span>
                  </span> + <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span>
                  </span> = 5
                </>, 
                explanation: 'Équation avec deux fractions différentes' 
              },
              { 
                step: <>
                  <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>2x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span>
                  </span> + <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span>
                  </span> = 5
                </>, 
                explanation: 'On met au même dénominateur (multiplier par 2)' 
              },
              { 
                step: <>
                  <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>3x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span>
                  </span> = 5
                </>, 
                explanation: 'On additionne les fractions de même dénominateur' 
              },
              { 
                step: <>
                  <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                    <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
                  </span> = 5
                </>, 
                explanation: 'On simplifie la fraction (diviser par 3)' 
              },
              { step: 'x = 5 × 2', explanation: 'On multiplie les deux membres par 2' },
              { step: 'x = 10', explanation: 'Solution finale' }
            ],
            verification: <>Vérification : <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>10</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> + <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>10</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span></span> = <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>20</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span></span> + <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>10</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span></span> = <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>30</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span></span> = 5 ✓</>
          }
        ]
      }
    }
  ];

  const exerciseSections = [
    {
      id: 'verification',
      title: '1. Vérification de solutions',
      description: 'Remplace la variable par une valeur pour voir si c\'est solution',
      icon: '✅',
      exercises: [
        // Niveau 1-5 : Équations très simples
        {
          question: 'x = 2 est-il solution de l\'équation x + 1 = 3 ?',
          answer: 'oui',
          explanation: '2 + 1 = 3 ✓',
          hint: 'Remplace x par 2 : 2 + 1 = ?'
        },
        {
          question: 'x = 5 est-il solution de l\'équation x - 2 = 3 ?',
          answer: 'oui',
          explanation: '5 - 2 = 3 ✓',
          hint: 'Calcule 5 - 2'
        },
        {
          question: 'y = 4 est-il solution de l\'équation 2y = 8 ?',
          answer: 'oui',
          explanation: '2×4 = 8 ✓',
          hint: 'Calcule 2×4'
        },
        {
          question: 'x = 3 est-il solution de l\'équation x + 4 = 6 ?',
          answer: 'non',
          explanation: '3 + 4 = 7 ≠ 6 ✗',
          hint: 'Calcule 3 + 4'
        },
        {
          question: 't = 6 est-il solution de l\'équation t ÷ 2 = 3 ?',
          answer: 'oui',
          explanation: '6 ÷ 2 = 3 ✓',
          hint: 'Calcule 6 ÷ 2'
        },
        
        // Niveau 6-10 : Équations avec coefficients
        {
      question: 'x = 3 est-il solution de l\'équation 2x + 1 = 7 ?',
      answer: 'oui',
      explanation: '2×3 + 1 = 6 + 1 = 7 ✓',
          hint: 'Calcule 2×3 + 1'
        },
        {
          question: 'y = 4 est-il solution de l\'équation 3y - 2 = 10 ?',
          answer: 'oui',
          explanation: '3×4 - 2 = 12 - 2 = 10 ✓',
          hint: 'Calcule 3×4 - 2'
        },
        {
          question: 'a = 2 est-il solution de l\'équation 4a + 3 = 12 ?',
      answer: 'non',
          explanation: '4×2 + 3 = 8 + 3 = 11 ≠ 12 ✗',
          hint: 'Calcule 4×2 + 3'
        },
        {
          question: 'x = 5 est-il solution de l\'équation 2x - 3 = 7 ?',
          answer: 'oui',
          explanation: '2×5 - 3 = 10 - 3 = 7 ✓',
          hint: 'Calcule 2×5 - 3'
        },
        {
          question: 'n = 3 est-il solution de l\'équation 5n + 1 = 15 ?',
          answer: 'non',
          explanation: '5×3 + 1 = 15 + 1 = 16 ≠ 15 ✗',
          hint: 'Calcule 5×3 + 1'
        },
        
        // Niveau 11-15 : Équations avec fractions et décimaux
        {
          question: 'x = 4 est-il solution de l\'équation x ÷ 2 + 1 = 3 ?',
          answer: 'oui',
          explanation: '4 ÷ 2 + 1 = 2 + 1 = 3 ✓',
          hint: 'Calcule 4 ÷ 2 puis ajoute 1'
        },
        {
          question: <>x = 6 est-il solution de l'équation <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span> = 3 ?</>,
          answer: 'oui',
          explanation: '6/2 = 3 ✓',
          hint: 'Calcule 6 divisé par 2'
        },
        {
          question: <>y = 2 est-il solution de l'équation <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>y</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> + 1 = <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>5</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> ?</>,
          answer: 'oui',
          explanation: '2/3 + 1 = 2/3 + 3/3 = 5/3 ✓',
          hint: 'Transforme 1 en fraction de dénominateur 3'
        },
        {
          question: <>t = 3 est-il solution de l'équation <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>t</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span> + <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>t</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> = <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>5</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span> ?</>,
          answer: 'oui',
          explanation: '3/2 + 3/3 = 3/2 + 1 = 3/2 + 2/2 = 5/2 ✓',
          hint: 'Calcule 3/2 + 3/3, puis met au même dénominateur'
        },
        {
          question: <>x = 9 est-il solution de l'équation <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>2x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> - 1 = 5 ?</>,
          answer: 'oui',
          explanation: '2×9/3 - 1 = 18/3 - 1 = 6 - 1 = 5 ✓',
          hint: 'Calcule 2×9/3 puis soustrais 1'
        },
        
        // Niveau 16-20 : Équations plus complexes
        {
          question: 'x = 2 est-il solution de l\'équation 3x + 2x = 10 ?',
          answer: 'oui',
          explanation: '3×2 + 2×2 = 6 + 4 = 10 ✓',
          hint: 'Calcule 3×2 + 2×2'
        },
        {
          question: 'y = 3 est-il solution de l\'équation 4y - y = 9 ?',
          answer: 'oui',
          explanation: '4×3 - 3 = 12 - 3 = 9 ✓',
          hint: 'Calcule 4×3 - 3'
        },
        {
          question: 'z = 4 est-il solution de l\'équation 2z + 3z - 1 = 19 ?',
          answer: 'oui',
          explanation: '2×4 + 3×4 - 1 = 8 + 12 - 1 = 19 ✓',
          hint: 'Calcule 2×4 + 3×4 - 1'
        },
        {
          question: 'x = 1 est-il solution de l\'équation 5x + 3x - 2 = 6 ?',
          answer: 'oui',
          explanation: '5×1 + 3×1 - 2 = 5 + 3 - 2 = 6 ✓',
          hint: 'Calcule 5×1 + 3×1 - 2'
        },
        {
          question: <>x = 4 est-il solution de l'équation <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>3x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>4</span></span> + <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span> = 5 ?</>,
          answer: 'oui',
          explanation: '3×4/4 + 4/2 = 12/4 + 2 = 3 + 2 = 5 ✓',
          hint: 'Calcule 3×4/4 + 4/2'
        }
      ]
    },
    {
      id: 'resolution',
      title: '2. Résolution d\'équations',
      description: 'Résous des équations de plus en plus complexes',
      icon: '⚡',
      exercises: [
        // Niveau 1-5 : Équations très simples (1 étape)
        {
          question: 'Résous l\'équation : x + 2 = 5',
      answer: '3',
          explanation: 'x + 2 = 5 → x = 5 - 2 → x = 3',
          hint: 'Soustrais 2 des deux côtés'
        },
        {
          question: 'Résous l\'équation : y - 3 = 4',
          answer: '7',
          explanation: 'y - 3 = 4 → y = 4 + 3 → y = 7',
          hint: 'Ajoute 3 des deux côtés'
        },
        {
      question: 'Résous l\'équation : 2x = 10',
      answer: '5',
      explanation: '2x = 10 → x = 10 ÷ 2 → x = 5',
      hint: 'Divise les deux côtés par 2'
    },
    {
          question: <>Résous l'équation : <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span> = 4</>,
          answer: '8',
          explanation: 'x/2 = 4 → x = 4 × 2 → x = 8',
          hint: 'Multiplie les deux côtés par 2'
        },
        {
          question: <>Résous l'équation : <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> = 5</>,
          answer: '15',
          explanation: 'x/3 = 5 → x = 5 × 3 → x = 15',
          hint: 'Multiplie les deux côtés par 3'
        },
        
        // Niveau 6-10 : Équations avec coefficient et terme constant (2 étapes)
        {
          question: 'Résous l\'équation : 2x + 3 = 9',
      answer: '3',
          explanation: '2x + 3 = 9 → 2x = 9 - 3 → 2x = 6 → x = 3',
          hint: 'Soustrais 3, puis divise par 2'
        },
        {
          question: 'Résous l\'équation : 3y - 5 = 7',
          answer: '4',
          explanation: '3y - 5 = 7 → 3y = 7 + 5 → 3y = 12 → y = 4',
          hint: 'Ajoute 5, puis divise par 3'
        },
        {
          question: 'Résous l\'équation : 4t + 1 = 13',
      answer: '3',
          explanation: '4t + 1 = 13 → 4t = 13 - 1 → 4t = 12 → t = 3',
          hint: 'Soustrais 1, puis divise par 4'
        },
        {
          question: <>Résous l'équation : <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span> + 3 = 7</>,
          answer: '8',
          explanation: 'x/2 + 3 = 7 → x/2 = 4 → x = 8',
          hint: 'Soustrais 3, puis multiplie par 2'
        },
        {
          question: <>Résous l'équation : <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>2x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> = 4</>,
          answer: '6',
          explanation: '2x/3 = 4 → 2x = 12 → x = 6',
          hint: 'Multiplie par 3, puis divise par 2'
        },
        
        // Niveau 11-15 : Équations avec inconnue des deux côtés et premiers développements
        {
          question: 'Résous l\'équation : 3x + 2 = x + 8',
          answer: '3',
          explanation: '3x + 2 = x + 8 → 3x - x = 8 - 2 → 2x = 6 → x = 3',
      hint: 'Rassemble les x d\'un côté et les nombres de l\'autre'
    },
    {
          question: 'Résous l\'équation : 2(y + 1) = 8',
          answer: '3',
          explanation: '2(y + 1) = 8 → 2y + 2 = 8 → 2y = 6 → y = 3',
          hint: 'Développe d\'abord : 2(y + 1) = 2y + 2'
        },
        {
          question: 'Résous l\'équation : 3(t - 1) = 12',
          answer: '5',
          explanation: '3(t - 1) = 12 → 3t - 3 = 12 → 3t = 15 → t = 5',
          hint: 'Distribue le 3 : 3(t - 1) = 3t - 3'
        },
        {
          question: <>Résous l'équation : <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span> + <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>4</span></span> = 6</>,
          answer: '8',
          explanation: 'x/2 + x/4 = 6 → 2x/4 + x/4 = 6 → 3x/4 = 6 → x = 8',
          hint: 'Met au même dénominateur : x/2 = 2x/4'
        },
        {
          question: <>Résous l'équation : <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x+1</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> = 2</>,
          answer: '5',
          explanation: '(x+1)/3 = 2 → x+1 = 6 → x = 5',
          hint: 'Multiplie par 3 puis soustrais 1'
        },
        
        // Niveau 16-20 : Équations avec développement (expressions à développer)
        {
          question: 'Résous l\'équation : 2(x + 3) = 14',
      answer: '4',
          explanation: '2(x + 3) = 14 → 2x + 6 = 14 → 2x = 8 → x = 4',
          hint: 'Développe d\'abord : 2(x + 3) = 2x + 6'
        },
        {
          question: 'Résous l\'équation : 3(y - 2) = 15',
          answer: '7',
          explanation: '3(y - 2) = 15 → 3y - 6 = 15 → 3y = 21 → y = 7',
          hint: 'Distribue le 3 : 3(y - 2) = 3y - 6'
        },
        {
          question: 'Résous l\'équation : 4(t + 1) = 2t + 14',
          answer: '5',
          explanation: '4(t + 1) = 2t + 14 → 4t + 4 = 2t + 14 → 2t = 10 → t = 5',
          hint: 'Développe à gauche : 4(t + 1) = 4t + 4'
        },
        {
          question: 'Résous l\'équation : 5(a - 2) = 3(a + 2)',
          answer: '8',
          explanation: '5(a - 2) = 3(a + 2) → 5a - 10 = 3a + 6 → 2a = 16 → a = 8',
          hint: 'Développe des deux côtés : 5(a - 2) et 3(a + 2)'
        },
        {
          question: 'Résous l\'équation : 2(3x - 1) = 4(x + 2)',
          answer: '5',
          explanation: '2(3x - 1) = 4(x + 2) → 6x - 2 = 4x + 8 → 2x = 10 → x = 5',
          hint: 'Développe les deux côtés : 2(3x - 1) et 4(x + 2)'
        }
      ]
    },
    {
      id: 'programmes',
      title: '3. Programmes de calcul',
      description: 'Trouve le nombre de départ d\'un programme de calcul',
      icon: '📐',
      exercises: [
        // Niveau 1-5 : Programmes simples (1 opération)
        {
          question: 'Programme : "Je prends un nombre et j\'ajoute 4. J\'obtiens 9." Quel est ce nombre ?',
          answer: '5',
          explanation: 'Soit x le nombre. x + 4 = 9 → x = 5',
          hint: 'Écris l\'équation : x + 4 = 9'
        },
        {
          question: 'Programme : "Je prends un nombre et je le multiplie par 3. J\'obtiens 12." Quel est ce nombre ?',
          answer: '4',
          explanation: 'Soit x le nombre. 3x = 12 → x = 4',
          hint: 'Écris l\'équation : 3x = 12'
        },
        {
          question: 'Programme : "Je prends un nombre et je soustrais 6. J\'obtiens 2." Quel est ce nombre ?',
          answer: '8',
          explanation: 'Soit x le nombre. x - 6 = 2 → x = 8',
          hint: 'Écris l\'équation : x - 6 = 2'
        },
        {
          question: <>Programme : "Je prends un nombre et je le divise par 3. J'obtiens <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>4</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span>." Quel est ce nombre ?</>,
          answer: '4',
          explanation: 'Soit x le nombre. x/3 = 4/3 → x = 4/3 × 3 → x = 4',
          hint: 'Écris l\'équation : x/3 = 4/3'
        },
        {
          question: <>Programme : "Je prends un nombre et j'ajoute <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>1</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span>. J'obtiens <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>5</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span></span>." Quel est ce nombre ?</>,
          answer: '2',
          explanation: 'Soit x le nombre. x + 1/2 = 5/2 → x = 5/2 - 1/2 → x = 4/2 = 2',
          hint: 'Écris l\'équation : x + 1/2 = 5/2'
        },
        
        // Niveau 6-10 : Programmes avec 2 opérations consécutives
        {
          question: 'Programme : "Je prends un nombre, je le multiplie par 2, puis j\'ajoute 3. J\'obtiens 11." Quel est ce nombre ?',
          answer: '4',
          explanation: 'Soit x le nombre. 2x + 3 = 11 → 2x = 8 → x = 4',
          hint: 'Écris l\'équation : 2x + 3 = 11'
        },
        {
          question: 'Programme : "Je prends un nombre, j\'ajoute 2, puis je multiplie par 3. J\'obtiens 15." Quel est ce nombre ?',
      answer: '3',
          explanation: 'Soit x le nombre. 3(x + 2) = 15 → 3x + 6 = 15 → 3x = 9 → x = 3',
          hint: 'Attention à l\'ordre : (x + 2) × 3 = 15'
        },
        {
          question: 'Programme : "Je prends un nombre, je le multiplie par 4, puis je soustrais 5. J\'obtiens 7." Quel est ce nombre ?',
          answer: '3',
          explanation: 'Soit x le nombre. 4x - 5 = 7 → 4x = 12 → x = 3',
          hint: 'Écris l\'équation : 4x - 5 = 7'
        },
        {
          question: 'Programme : "Je prends un nombre, je soustrais 1, puis je multiplie par 2. J\'obtiens 6." Quel est ce nombre ?',
      answer: '4',
          explanation: 'Soit x le nombre. 2(x - 1) = 6 → 2x - 2 = 6 → 2x = 8 → x = 4',
          hint: 'Écris l\'équation : (x - 1) × 2 = 6'
        },
        {
          question: 'Programme : "Je prends un nombre, je le multiplie par 5, puis j\'ajoute 1. J\'obtiens 16." Quel est ce nombre ?',
          answer: '3',
          explanation: 'Soit x le nombre. 5x + 1 = 16 → 5x = 15 → x = 3',
          hint: 'Écris l\'équation : 5x + 1 = 16'
        },
        
        // Niveau 11-15 : Programmes avec simplification d'expressions (niveau intermédiaire)
        {
          question: 'Programme : "Choisir un nombre, le multiplier par 3, ajouter 5, puis soustraire le nombre de départ. Le résultat est 11." Quel est ce nombre ?',
          answer: '3',
          explanation: 'Soit x le nombre. Expression : 3x + 5 - x = 2x + 5. Équation : 2x + 5 = 11 → 2x = 6 → x = 3',
          hint: 'Simplifie d\'abord l\'expression : 3x + 5 - x = 2x + 5'
        },
        {
          question: 'Programme : "Je prends un nombre, je le multiplie par 4, ajouter 3, puis soustraire le double du nombre de départ. Le résultat est 9." Quel est ce nombre ?',
          answer: '3',
          explanation: 'Soit x le nombre. Expression : 4x + 3 - 2x = 2x + 3. Équation : 2x + 3 = 9 → 2x = 6 → x = 3',
          hint: 'Simplifie : 4x + 3 - 2x = 2x + 3'
        },
        {
          question: 'Programme A : "Multiplier par 5, ajouter 2" et Programme B : "Multiplier par 3, ajouter 8" donnent le même résultat. Quel est ce nombre ?',
          answer: '3',
          explanation: 'Soit x le nombre. Programme A : 5x + 2, Programme B : 3x + 8. Équation : 5x + 2 = 3x + 8 → 2x = 6 → x = 3',
          hint: 'Les deux programmes donnent le même résultat : 5x + 2 = 3x + 8'
        },
        {
          question: <>Programme : "Je prends un nombre, je le multiplie par <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>2</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span>, puis j'ajoute 1. J'obtiens 5." Quel est ce nombre ?</>,
          answer: '6',
          explanation: 'Soit x le nombre. (2/3)x + 1 = 5 → (2/3)x = 4 → x = 4 × 3/2 → x = 6',
          hint: 'Écris l\'équation : (2/3)x + 1 = 5'
        },
        {
          question: 'Programme : "Je prends un nombre, je le multiplie par 6, soustraire 4, puis soustraire le triple du nombre de départ. Le résultat est 8." Quel est ce nombre ?',
          answer: '4',
          explanation: 'Soit x le nombre. Expression : 6x - 4 - 3x = 3x - 4. Équation : 3x - 4 = 8 → 3x = 12 → x = 4',
          hint: 'Simplifie : 6x - 4 - 3x = 3x - 4'
        },
        
        // Niveau 16-20 : Programmes complexes (3 opérations)
        {
          question: 'Programme : "Je prends un nombre, je le multiplie par 2, j\'ajoute 3, puis je divise par 5. J\'obtiens 3." Quel est ce nombre ?',
          answer: '6',
          explanation: 'Soit x le nombre. (2x + 3) ÷ 5 = 3 → 2x + 3 = 15 → 2x = 12 → x = 6',
          hint: 'Écris l\'équation : (2x + 3) ÷ 5 = 3'
        },
        {
          question: 'Programme : "Je prends un nombre, j\'ajoute 1, je multiplie par 3, puis je soustrais 6. J\'obtiens 9." Quel est ce nombre ?',
          answer: '4',
          explanation: 'Soit x le nombre. 3(x + 1) - 6 = 9 → 3x + 3 - 6 = 9 → 3x - 3 = 9 → 3x = 12 → x = 4',
          hint: 'Suis l\'ordre : (x + 1) × 3 - 6 = 9'
        },
        {
          question: 'Programme : "Je prends un nombre, je le multiplie par 4, je soustrais 2, puis je divise par 3. J\'obtiens 6." Quel est ce nombre ?',
      answer: '5',
          explanation: 'Soit x le nombre. (4x - 2) ÷ 3 = 6 → 4x - 2 = 18 → 4x = 20 → x = 5',
          hint: 'Écris l\'équation : (4x - 2) ÷ 3 = 6'
        },
        {
          question: 'Programme : "Je prends un nombre, je soustrais 2, je multiplie par 3, puis j\'ajoute 5. J\'obtiens 14." Quel est ce nombre ?',
          answer: '5',
          explanation: 'Soit x le nombre. 3(x - 2) + 5 = 14 → 3x - 6 + 5 = 14 → 3x - 1 = 14 → 3x = 15 → x = 5',
          hint: 'Suis l\'ordre : (x - 2) × 3 + 5 = 14'
        },
        {
          question: 'Programme : "Je prends un nombre, j\'ajoute 3, je multiplie par 2, puis je soustrais 8. J\'obtiens 10." Quel est ce nombre ?',
      answer: '6',
          explanation: 'Soit x le nombre. 2(x + 3) - 8 = 10 → 2x + 6 - 8 = 10 → 2x - 2 = 10 → 2x = 12 → x = 6',
          hint: 'Suis l\'ordre : (x + 3) × 2 - 8 = 10'
        }
      ]
    },
    {
      id: 'problemes',
      title: '4. Problèmes concrets',
      description: 'Résous des problèmes de la vie quotidienne avec des équations',
      icon: '🧩',
      exercises: [
        // Niveau 1-5 : Problèmes géométriques simples
        {
          question: 'Le périmètre d\'un carré est 16 cm. Quelle est la longueur de son côté ?',
          answer: '4',
          explanation: 'Soit x la longueur du côté. Périmètre = 4x = 16 → x = 4 cm',
      hint: 'Périmètre d\'un carré = 4 × côté'
    },
    {
          question: 'Un rectangle a une largeur de 3 cm et un périmètre de 14 cm. Quelle est sa longueur ?',
          answer: '4',
          explanation: 'Soit x la longueur. Périmètre = 2(3 + x) = 14 → 6 + 2x = 14 → 2x = 8 → x = 4 cm',
          hint: 'Périmètre = 2(largeur + longueur)'
        },
        {
          question: 'L\'aire d\'un carré est 25 cm². Quelle est la longueur de son côté ?',
          answer: '5',
          explanation: 'Soit x la longueur du côté. Aire = x² = 25 → x = 5 cm',
          hint: 'Aire d\'un carré = côté²'
        },
        {
          question: 'Le périmètre d\'un triangle équilatéral est 21 cm. Quelle est la longueur d\'un côté ?',
          answer: '7',
          explanation: 'Soit x la longueur d\'un côté. Périmètre = 3x = 21 → x = 7 cm',
          hint: 'Triangle équilatéral : 3 côtés égaux'
        },
        {
          question: 'Un rectangle a une longueur de 8 cm et un périmètre de 22 cm. Quelle est sa largeur ?',
          answer: '3',
          explanation: 'Soit x la largeur. Périmètre = 2(8 + x) = 22 → 16 + 2x = 22 → 2x = 6 → x = 3 cm',
          hint: 'Périmètre = 2(longueur + largeur)'
        },
        
        // Niveau 6-10 : Problèmes d'âges simples
        {
          question: 'Tom a 12 ans. Dans combien d\'années aura-t-il 20 ans ?',
          answer: '8',
          explanation: 'Soit x le nombre d\'années. 12 + x = 20 → x = 8 ans',
          hint: 'Âge actuel + années = âge futur'
        },
        {
          question: 'Julie a le double de l\'âge de son frère. Son frère a 6 ans. Quel est l\'âge de Julie ?',
          answer: '12',
          explanation: 'Soit x l\'âge de Julie. x = 2 × 6 = 12 ans',
          hint: 'Julie = 2 × âge du frère'
        },
        {
          question: 'Dans 5 ans, Lucas aura 18 ans. Quel est son âge actuel ?',
          answer: '13',
          explanation: 'Soit x l\'âge actuel de Lucas. x + 5 = 18 → x = 13 ans',
          hint: 'Âge actuel + 5 = âge dans 5 ans'
        },
        {
          question: 'Marie a 3 ans de plus que Pierre. Marie a 15 ans. Quel est l\'âge de Pierre ?',
          answer: '12',
          explanation: 'Soit x l\'âge de Pierre. x + 3 = 15 → x = 12 ans',
          hint: 'Pierre + 3 = Marie'
        },
        {
          question: <>Marie a mangé <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>1</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> d'une tablette de chocolat. Il lui reste 8 carreaux. Combien la tablette contenait-elle de carreaux au départ ?</>,
          answer: '12',
          explanation: 'Soit x le nombre total de carreaux. Marie a mangé x/3, il reste 2x/3 = 8 → x = 12 carreaux',
          hint: 'Si elle mange 1/3, il reste 2/3 de la tablette'
        },
        
        // Niveau 11-15 : Problèmes d'âges complexes et quantités
        {
          question: 'Mon père a 23 ans de plus que moi. Dans 15 ans, il aura le triple de l\'âge que j\'ai aujourd\'hui. Quel est mon âge ?',
          answer: '7',
          explanation: 'Soit x mon âge. Mon père a x + 23 ans. Dans 15 ans : x + 23 + 15 = 3x → x + 38 = 3x → 38 = 2x → x = 19 ans',
          hint: 'Dans 15 ans, âge du père = 3 × mon âge actuel'
        },
        {
          question: 'Dans 28 ans, Simon aura le triple de son âge actuel. Quel âge a Simon ?',
          answer: '14',
          explanation: 'Soit x l\'âge actuel de Simon. x + 28 = 3x → 28 = 2x → x = 14 ans',
          hint: 'Âge actuel + 28 = 3 × âge actuel'
        },
        {
          question: 'Aujourd\'hui, Léa est 4 fois plus âgée qu\'il y a 15 ans. Quel est l\'âge de Léa ?',
          answer: '20',
          explanation: 'Soit x l\'âge actuel de Léa. x = 4(x - 15) → x = 4x - 60 → 60 = 3x → x = 20 ans',
          hint: 'Âge actuel = 4 × (âge actuel - 15)'
        },
        {
          question: <>Au goûter, Lise mange <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>1</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>4</span></span> du paquet de gâteaux. Sa sœur mange ensuite <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>2</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>3</span></span> des gâteaux restants. Il reste 5 gâteaux. Combien y en avait-il au départ ?</>,
          answer: '20',
          explanation: 'Soit x le nombre initial. Après Lise : 3x/4. Après la sœur : 3x/4 - (2/3)×(3x/4) = 3x/4 - x/2 = x/4 = 5 → x = 20',
          hint: 'Après Lise : 3/4 restent. Après la sœur : il reste 1/3 de 3/4'
        },
        {
          question: 'Une recette demande 3 doses de sirop pour 5 doses d\'eau. Quelle quantité de sirop faut-il pour 6 litres de boisson ?',
          answer: '2.25',
          explanation: 'Total : 3 + 5 = 8 doses. Sirop = 3/8 du total. Pour 6 L : 6 × 3/8 = 18/8 = 2,25 L',
          hint: 'Sirop représente 3/(3+5) = 3/8 du mélange total'
        },
        
        // Niveau 16-20 : Problèmes très complexes avec nombres consécutifs et forfaits
        {
          question: 'La somme de trois nombres entiers naturels, impairs et consécutifs est égale à 495. Quels sont ces trois nombres ?',
          answer: '163',
          explanation: 'Soit x le premier nombre impair. Les trois sont : x, x+2, x+4. Équation : x + (x+2) + (x+4) = 495 → 3x + 6 = 495 → 3x = 489 → x = 163. Les nombres sont 163, 165, 167',
          hint: 'Trois impairs consécutifs : x, x+2, x+4'
        },
        {
          question: 'La somme de trois entiers consécutifs est égale à 2013. Quels sont ces entiers ?',
          answer: '671',
          explanation: 'Soit x le premier entier. Les trois sont : x, x+1, x+2. Équation : x + (x+1) + (x+2) = 2013 → 3x + 3 = 2013 → 3x = 2010 → x = 670. Les nombres sont 670, 671, 672',
          hint: 'Trois entiers consécutifs : x, x+1, x+2'
        },
        {
          question: <>Tom a dépensé <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>2</span><span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>5</span></span> de son argent de poche pour un livre. Il lui reste 18 €. Combien avait-il au départ ?</>,
          answer: '30',
          explanation: 'Soit x son argent initial. Il a dépensé 2x/5, il reste 3x/5 = 18 → x = 30 €',
          hint: 'S\'il dépense 2/5, il reste 3/5 de son argent'
        },
        {
          question: 'Forfait 1 : 7€/mois + 0,20€/min. Forfait 2 : 0,40€/min. À partir de combien de minutes les forfaits coûtent-ils pareil ?',
          answer: '35',
          explanation: 'Soit x le nombre de minutes. Forfait 1 : 7 + 0,20x. Forfait 2 : 0,40x. Équation : 7 + 0,20x = 0,40x → 7 = 0,20x → x = 35 minutes',
          hint: 'Égalise les deux coûts : 7 + 0,20x = 0,40x'
        },
        {
          question: 'Un rectangle a une longueur qui est le double de sa largeur. Son périmètre est 30 cm. Quelle est sa largeur ?',
      answer: '5',
          explanation: 'Soit x la largeur. Longueur = 2x. Périmètre = 2(x + 2x) = 6x = 30 → x = 5 cm',
          hint: 'Périmètre = 2(largeur + longueur)'
        }
      ]
    }
  ];

  // Obtenir les exercices de la section actuelle
  const getCurrentSectionExercises = () => exerciseSections[currentExerciseSection]?.exercises || [];
  const getCurrentExercise = () => getCurrentSectionExercises()[currentExercise];

  const checkAnswer = () => {
    const currentEx = getCurrentExercise();
    if (!currentEx) return;
    
    let correct = false;
    
    if (currentExerciseSection === 0) { // Section vérification
      correct = userAnswer.toLowerCase().trim() === currentEx.answer.toLowerCase();
    } else {
      correct = userAnswer.trim() === currentEx.answer;
    }
    
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
      // Mettre à jour le score de la section
      const newProgress = [...sectionProgress];
      newProgress[currentExerciseSection]++;
      setSectionProgress(newProgress);
    }
  };

  const nextExercise = () => {
    const sectionExercises = getCurrentSectionExercises();
    if (currentExercise < sectionExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowSolution(false);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowSolution(false);
    }
  };

  const switchSection = (sectionIndex: number) => {
    setCurrentExerciseSection(sectionIndex);
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setShowSolution(false);
  };

  const getTotalExercises = () => {
    return exerciseSections.reduce((total, section) => total + section.exercises.length, 0);
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowSolution(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowSolution(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/4eme" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la 4ème</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Introduction aux équations
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les équations du premier degré et apprends à les résoudre !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('cours')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'cours' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices (Section {currentExerciseSection + 1}/4)
            </button>
          </div>
        </div>

        {activeTab === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Navigation du cours améliorée */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-blue-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                📚 Plan du cours
              </h2>
                <p className="text-gray-600">Découvrez les équations étape par étape</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courseContent.map((section, index) => {
                  const sectionIcons = ['🎯', '✅', '⚡', '🎬'];
                  const sectionColors = [
                    'from-blue-400 to-blue-600',
                    'from-green-400 to-green-600', 
                    'from-purple-400 to-purple-600',
                    'from-orange-400 to-pink-500'
                  ];
                  const isActive = currentCourseSection === index;
                  const isExamples = index === 3;
                  
                  return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentCourseSection(index)}
                        className={`group relative p-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 ${
                          isActive
                            ? 'shadow-2xl scale-105' 
                            : 'shadow-lg hover:shadow-xl'
                        } ${
                          isExamples 
                            ? 'ring-4 ring-orange-300 ring-opacity-50 bg-gradient-to-br from-orange-100 to-pink-100' 
                            : 'bg-white'
                        }`}
                      >
                        {/* Badge spécial pour les exemples */}
                        {isExamples && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            ⭐ NOUVEAU
                          </div>
                        )}
                        
                        {/* Icône petite en coin */}
                        <div className={`absolute top-4 left-4 w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                          isActive || isExamples 
                            ? `bg-gradient-to-br ${sectionColors[index]} text-white shadow-md` 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        } transition-all duration-300`}>
                          {sectionIcons[index]}
                        </div>
                        
                        {/* Contenu principal centré */}
                        <div className="pt-4">
                          {/* Titre de la section */}
                          <div className={`font-bold text-lg mb-2 transition-colors leading-tight ${
                            isActive 
                              ? 'text-blue-700' 
                              : isExamples 
                                ? 'text-orange-700' 
                                : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {section.title}
                          </div>
                          
                          {/* Description courte */}
                          <div className={`text-sm leading-relaxed font-medium ${
                            isActive 
                              ? 'text-blue-600' 
                              : isExamples 
                                ? 'text-orange-600' 
                                : 'text-gray-500'
                          }`}>
                            {index === 0 && "Comprendre les bases"}
                            {index === 1 && "Vérifier les solutions"}
                            {index === 2 && "Méthodes de résolution"}
                            {index === 3 && "🎬 Animations interactives"}
                          </div>
                        </div>
                        
                        {/* Indicateur actif */}
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl"></div>
                        )}
                  </button>
                  );
                })}
              </div>
              
              {/* Indicateur de progression */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  {courseContent.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentCourseSection 
                          ? 'bg-blue-500 scale-125' 
                          : index <= currentCourseSection 
                            ? 'bg-green-400' 
                            : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Contenu du cours */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-blue-600 mb-6">
                {courseContent[currentCourseSection].title}
              </h2>

              {/* Section 1: Notion */}
              {currentCourseSection === 0 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">Définition</h3>
                    <p className="text-blue-900">{courseContent[0].content.definition}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Exemples</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {courseContent[0]?.content?.examples?.map((example, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-2">
                            {example.equation}
                          </div>
                          <div className="text-sm text-gray-600">
                            {'description' in example ? example.description : 
                             'test' in example ? example.test : 
                             'steps' in example ? 'Exemple détaillé' : 
                             'Exemple'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-yellow-800 mb-3">Important</h3>
                    <p className="text-yellow-900">{courseContent[0].content.explanation}</p>
                  </div>
                </div>
              )}

              {/* Section 2: Solution */}
              {currentCourseSection === 1 && (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-3">Définition</h3>
                    <p className="text-green-900">{courseContent[1].content.definition}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Exemples de vérification</h3>
                    <div className="space-y-4">
                      {courseContent[1].content.examples?.map((example, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6">
                          <div className="text-lg font-bold text-purple-600 mb-3">
                            {example.equation}
                          </div>
                          {'test' in example && (
                            <div className="text-gray-700 mb-2">{example.test}</div>
                          )}
                          {'conclusion' in example && (
                            <div className="font-bold text-green-600">{example.conclusion}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-orange-800 mb-3">Méthode</h3>
                    <p className="text-orange-900">{courseContent[1].content.explanation}</p>
                  </div>
                </div>
              )}

              {/* Section 3: Résolution */}
              {currentCourseSection === 2 && (
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-purple-800 mb-3">Définition</h3>
                    <p className="text-purple-900">{courseContent[2].content.definition}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Règles de transformation</h3>
                    <div className="space-y-3">
                      {courseContent[2].content.rules?.map((rule, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="text-gray-800">• {rule}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Méthode générale</h3>
                    <div className="space-y-3">
                      {courseContent[2].content.method?.map((step, index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-4">
                          <div className="text-blue-800 font-semibold">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Exemples avec animations */}
              {currentCourseSection === 3 && (
                <div className="space-y-8">
                  {/* Sélecteur d'exemple */}
                  <div className="flex justify-center gap-4 mb-6">
                  {courseContent[3].content.examples?.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentExample(index);
                          setCurrentStep(0);
                        }}
                        className={`px-4 py-2 rounded-xl font-bold transition-all ${
                          currentExample === index
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Exemple {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* Animation de l'exemple courant */}
                  {courseContent[3].content.examples?.[currentExample] && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        🎯 Résolvons : <span className="text-blue-600">{courseContent[3].content.examples[currentExample].equation}</span>
                      </h3>
                      
                      {/* Contrôles de navigation */}
                      <div className="flex justify-center gap-3 mb-8">
                        <button
                          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                          disabled={currentStep === 0}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Étape précédente
                        </button>
                        <div className="px-4 py-2 bg-white rounded-xl border border-blue-200 font-bold text-blue-600">
                                                     Étape {currentStep + 1} / {(courseContent[3]?.content?.examples?.[currentExample] && 'steps' in courseContent[3].content.examples[currentExample]) ? courseContent[3].content.examples[currentExample].steps?.length || 1 : 1}
                              </div>
                                                 <button
                           onClick={() => setCurrentStep(Math.min((courseContent[3]?.content?.examples?.[currentExample] && 'steps' in courseContent[3].content.examples[currentExample]) ? courseContent[3].content.examples[currentExample].steps?.length - 1 || 0 : 0, currentStep + 1))}
                           disabled={currentStep === ((courseContent[3]?.content?.examples?.[currentExample] && 'steps' in courseContent[3].content.examples[currentExample]) ? courseContent[3].content.examples[currentExample].steps?.length - 1 || 0 : 0)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Étape suivante →
                        </button>
                              </div>

                                             {/* Affichage cumulatif des étapes */}
                       <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                         <div className="space-y-6">
                           {/* Affichage de toutes les étapes jusqu'à l'étape actuelle */}
                                                       {courseContent[3]?.content?.examples?.[currentExample] && 'steps' in courseContent[3].content.examples[currentExample] && 
                             Array.from({ length: currentStep + 1 }, (_, index) => {
                               const currentExampleData = courseContent[3]?.content?.examples?.[currentExample];
                               if (!currentExampleData || !('steps' in currentExampleData)) return null;
                               
                               return (
                              <div key={index} className={`text-center transition-all duration-500 ${index === currentStep ? 'animate-fadeIn' : 'opacity-75'}`}>
                                <div className="text-2xl font-mono text-gray-800 mb-2">
                                  
                                  {/* Étape 0 - Équation de départ */}
                                  {index === 0 && (
                                    <div className="border-l-4 border-blue-500 pl-4">
                                      <div className="text-sm text-blue-600 font-bold mb-1">DÉPART</div>
                                      <div className="flex items-center justify-between">
                                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-3xl">
                                          {currentExampleData.steps[0].step}
                                        </span>
                                        <div className="text-sm text-gray-600 italic ml-4">
                                          📝 Équation de départ
                            </div>
                                      </div>
                        </div>
                      )}

                                  {/* Exemple 1: 2x + 3 = 7 */}
                                  {currentExampleData.id === 'simple-equation' && (
                                   <>
                                                                           {index === 1 && (
                                        <div className="border-l-4 border-red-500 pl-4">
                                          <div className="text-sm text-red-600 font-bold mb-1">ÉTAPE 1 - Soustraction</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span className="px-2 py-1">2x</span>
                                              <span className="mx-2">+</span>
                                              <span className="bg-red-200 px-2 py-1 rounded line-through">3</span>
                                              <span className="bg-red-200 px-1 py-1 rounded text-sm">-3</span>
                                              <span className="mx-2">=</span>
                                              <span>7</span>
                                              <span className="bg-red-200 px-1 py-1 rounded text-sm">-3</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ➖ On soustrait 3 des deux côtés
                                            </div>
                                          </div>
                        </div>
                      )}
                                                                           {index === 2 && (
                                        <div className="border-l-4 border-green-500 pl-4">
                                          <div className="text-sm text-green-600 font-bold mb-1">ÉTAPE 2 - Simplification</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span className="bg-green-200 px-2 py-1 rounded">2x</span>
                                              <span className="mx-2">=</span>
                                              <span className="bg-yellow-200 px-2 py-1 rounded">4</span>
                    </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ✨ Résultat de 7 - 3 = 4
                                            </div>
                                          </div>
                </div>
              )}
                                                                           {index === 3 && (
                                        <div className="border-l-4 border-blue-500 pl-4">
                                          <div className="text-sm text-blue-600 font-bold mb-1">ÉTAPE 3 - Division</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span>x</span>
                                              <span className="mx-2">=</span>
                                              <span className="bg-blue-200 px-2 py-1 rounded">4 ÷ 2</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ➗ On divise par 2 des deux côtés
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                                                           {index === 4 && (
                                        <div className="border-l-4 border-green-500 pl-4">
                                          <div className="text-sm text-green-600 font-bold mb-1">SOLUTION FINALE</div>
                                          <div className="flex items-center justify-between">
                                            <div className={index === currentStep ? 'animate-bounce' : ''}>
                                              <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl text-3xl">
                                                x = 2
                                              </span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              🎉 Résultat final de 4 ÷ 2
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                   </>
                                 )}

                                                                   {/* Exemple 2: 5x - 2 = 3x + 4 */}
                                  {currentExampleData.id === 'two-sides-equation' && (
                                   <>
                                                                           {index === 1 && (
                                        <div className="border-l-4 border-red-500 pl-4">
                                          <div className="text-sm text-red-600 font-bold mb-1">ÉTAPE 1 - Soustraction 3x</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span>5x</span>
                                              <span className="mx-2">-</span>
                                              <span>2</span>
                                              <span className="bg-red-200 px-1 py-1 rounded text-sm">-3x</span>
                                              <span className="mx-2">=</span>
                                              <span className="bg-red-200 px-2 py-1 rounded line-through">3x</span>
                                              <span className="mx-2">+</span>
                                              <span>4</span>
                                              <span className="bg-red-200 px-1 py-1 rounded text-sm">-3x</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ➖ On soustrait 3x des deux côtés
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                                                           {index === 2 && (
                                        <div className="border-l-4 border-green-500 pl-4">
                                          <div className="text-sm text-green-600 font-bold mb-1">ÉTAPE 2 - Simplification</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span className="bg-green-200 px-2 py-1 rounded">2x</span>
                                              <span className="mx-2">-</span>
                                              <span>2</span>
                                              <span className="mx-2">=</span>
                                              <span>4</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ✨ Résultat de 5x - 3x = 2x
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 3 && (
                                        <div className="border-l-4 border-purple-500 pl-4">
                                          <div className="text-sm text-purple-600 font-bold mb-1">ÉTAPE 3 - Addition 2</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span>2x</span>
                                              <span className="bg-red-200 px-2 py-1 rounded line-through">-2</span>
                                              <span className="bg-red-200 px-1 py-1 rounded text-sm">+2</span>
                                              <span className="mx-2">=</span>
                                              <span>4</span>
                                              <span className="bg-red-200 px-1 py-1 rounded text-sm">+2</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ➕ On ajoute 2 des deux côtés
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 4 && (
                                        <div className="border-l-4 border-blue-500 pl-4">
                                          <div className="text-sm text-blue-600 font-bold mb-1">ÉTAPE 4 - Simplification</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <div className="mb-2">
                                                <span className="bg-blue-200 px-2 py-1 rounded">2x</span>
                                                <span className="mx-2">=</span>
                                                <span>6</span>
                                              </div>
                                              <div className="text-center text-lg">↓ On divise par 2 ↓</div>
                                              <div className="mt-2">
                                                <span>x</span>
                                                <span className="mx-2">=</span>
                                                <span className="bg-blue-200 px-2 py-1 rounded">6 ÷ 2</span>
                                              </div>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ➗ Division par 2 des deux côtés
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 5 && (
                                        <div className="border-l-4 border-green-500 pl-4">
                                          <div className="text-sm text-green-600 font-bold mb-1">SOLUTION FINALE</div>
                                          <div className="flex items-center justify-between">
                                            <div className={index === currentStep ? 'animate-bounce' : ''}>
                                              <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl text-3xl">
                                                x = 3
                                              </span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              🎉 Résultat final de 6 ÷ 2
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                   </>
                                 )}

                                  {/* Exemple 3: x/2 + 3 = 7 */}
                                  {(currentExampleData.id === 'fraction-simple') && (
                                   <>
                                     {index === 1 && (
                                        <div className="border-l-4 border-red-500 pl-4">
                                          <div className="text-sm text-red-600 font-bold mb-1">ÉTAPE 1 - Soustraction</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                                                <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
                                              </span>
                                              <span className="mx-2">+</span>
                                              <span className="bg-red-200 px-2 py-1 rounded line-through">3</span>
                                              <span className="bg-red-200 px-1 py-1 rounded text-sm">-3</span>
                                              <span className="mx-2">=</span>
                                              <span>7</span>
                                              <span className="bg-red-200 px-1 py-1 rounded text-sm">-3</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ➖ On soustrait 3 des deux côtés
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 2 && (
                                        <div className="border-l-4 border-green-500 pl-4">
                                          <div className="text-sm text-green-600 font-bold mb-1">ÉTAPE 2 - Simplification</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                                                <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
                                              </span>
                                              <span className="mx-2">=</span>
                                              <span className="bg-green-200 px-2 py-1 rounded">4</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ✨ Résultat de 7 - 3 = 4
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 3 && (
                                        <div className="border-l-4 border-blue-500 pl-4">
                                          <div className="text-sm text-blue-600 font-bold mb-1">ÉTAPE 3 - Multiplication par 2</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                                                <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
                                              </span>
                                              <span className="bg-blue-200 px-1 py-1 rounded text-sm">×2</span>
                                              <span className="mx-2">=</span>
                                              <span>4</span>
                                              <span className="bg-blue-200 px-1 py-1 rounded text-sm">×2</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ✖️ On multiplie par 2 des deux côtés
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 4 && (
                                        <div className="border-l-4 border-green-500 pl-4">
                                          <div className="text-sm text-green-600 font-bold mb-1">SOLUTION FINALE</div>
                                          <div className="flex items-center justify-between">
                                            <div className={index === currentStep ? 'animate-bounce' : ''}>
                                              <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl text-3xl">
                                                x = 8
                                              </span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              🎉 Résultat final de 4 × 2
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                   </>
                                 )}

                                  {/* Exemple 4: x/3 + x/6 = 5 */}
                                  {(currentExampleData.id === 'fraction-multiple') && (
                                   <>
                                     {index === 1 && (
                                        <div className="border-l-4 border-purple-500 pl-4">
                                          <div className="text-sm text-purple-600 font-bold mb-1">ÉTAPE 1 - Même dénominateur</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', color: 'purple'}}>2x</span>
                                                <span style={{display: 'block', borderTop: '1px solid purple', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px', color: 'purple'}}>6</span>
                                              </span>
                                              <span className="mx-2">+</span>
                                              <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2'}}>x</span>
                                                <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span>
                                              </span>
                                              <span className="mx-2">=</span>
                                              <span>5</span>
                                            </div>
                                                                                                                                      <div className="text-sm text-gray-600 italic ml-4">
                                               🔄 <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1'}}>x</span><span style={{display: 'block', borderTop: '1px solid gray', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1', paddingTop: '1px'}}>3</span></span> = <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1'}}>2x</span><span style={{display: 'block', borderTop: '1px solid gray', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1', paddingTop: '1px'}}>6</span></span> (même dénominateur)
                                             </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 2 && (
                                        <div className="border-l-4 border-orange-500 pl-4">
                                          <div className="text-sm text-orange-600 font-bold mb-1">ÉTAPE 2 - Addition des fractions</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', backgroundColor: '#fef3c7', padding: '2px', borderRadius: '4px'}}>3x</span>
                                                <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>6</span>
                                              </span>
                                              <span className="mx-2">=</span>
                                              <span>5</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ➕ <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1'}}>2x</span><span style={{display: 'block', borderTop: '1px solid gray', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1', paddingTop: '1px'}}>6</span></span> + <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1'}}>x</span><span style={{display: 'block', borderTop: '1px solid gray', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1', paddingTop: '1px'}}>6</span></span> = <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1'}}>3x</span><span style={{display: 'block', borderTop: '1px solid gray', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1', paddingTop: '1px'}}>6</span></span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 3 && (
                                        <div className="border-l-4 border-red-500 pl-4">
                                          <div className="text-sm text-red-600 font-bold mb-1">ÉTAPE 3 - Simplification</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                                <span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', backgroundColor: '#fecaca', padding: '2px', borderRadius: '4px'}}>x</span>
                                                <span style={{display: 'block', borderTop: '1px solid black', textAlign: 'center', fontSize: '0.9em', lineHeight: '1.2', paddingTop: '1px'}}>2</span>
                                              </span>
                                              <span className="mx-2">=</span>
                                              <span>5</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ✨ <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1'}}>3x</span><span style={{display: 'block', borderTop: '1px solid gray', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1', paddingTop: '1px'}}>6</span></span> = <span style={{display: 'inline-block', verticalAlign: 'middle'}}><span style={{display: 'block', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1'}}>x</span><span style={{display: 'block', borderTop: '1px solid gray', textAlign: 'center', fontSize: '0.8em', lineHeight: '1.1', paddingTop: '1px'}}>2</span></span> (simplification)
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 4 && (
                                        <div className="border-l-4 border-blue-500 pl-4">
                                          <div className="text-sm text-blue-600 font-bold mb-1">ÉTAPE 4 - Multiplication par 2</div>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span>x</span>
                                              <span className="mx-2">=</span>
                                              <span className="bg-blue-200 px-2 py-1 rounded">5 × 2</span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              ✖️ On multiplie par 2 des deux côtés
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {index === 5 && (
                                        <div className="border-l-4 border-green-500 pl-4">
                                          <div className="text-sm text-green-600 font-bold mb-1">SOLUTION FINALE</div>
                                          <div className="flex items-center justify-between">
                                            <div className={index === currentStep ? 'animate-bounce' : ''}>
                                              <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl text-3xl">
                                                x = 10
                                              </span>
                                            </div>
                                            <div className="text-sm text-gray-600 italic ml-4">
                                              🎉 Résultat final de 5 × 2
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                   </>
                                 )}
                               </div>
                               
                                                                {/* Flèche vers le bas sauf pour la dernière étape */}
                                 {index < currentStep && (
                                   <div className="flex justify-center mt-3 mb-3">
                                     <div className="text-2xl text-gray-400">↓</div>
                                   </div>
                                 )}
                               </div>
                             );
                            })}
                         </div>
                        
                                                 {/* Explication de l'étape */}
                         <div className="bg-blue-100 rounded-xl p-4 text-center">
                           <div className="text-blue-800 font-semibold text-lg">
                             💡 {courseContent[3].content.examples?.[currentExample] && 'steps' in courseContent[3].content.examples[currentExample] ? courseContent[3].content.examples[currentExample].steps[currentStep].explanation : ''}
                           </div>
                         </div>
                       </div>
 
                       {/* Vérification finale */}
                       {'steps' in courseContent[3].content.examples[currentExample] && currentStep === courseContent[3].content.examples[currentExample].steps.length - 1 && 'verification' in courseContent[3].content.examples[currentExample] && (
                         <div className="bg-green-100 rounded-xl p-6 border-l-4 border-green-500 animate-fadeIn">
                           <h4 className="text-green-800 font-bold text-lg mb-2">✅ Vérification</h4>
                           <div className="text-green-700 font-semibold">
                             {courseContent[3].content.examples[currentExample].verification}
                           </div>
                         </div>
                       )}

                      {/* Bouton pour recommencer */}
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setCurrentStep(0)}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                        >
                          🔄 Recommencer l'animation
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Résumé */}
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Points clés à retenir</h3>
              <ul className="space-y-2">
                <li>• Une équation est une égalité avec une inconnue</li>
                <li>• Une solution rend l'égalité vraie</li>
                <li>• On résout en transformant l'équation</li>
                <li>• On peut ajouter/soustraire/multiplier/diviser les deux membres</li>
                <li>• Il faut toujours vérifier la solution trouvée</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Navigation des sections d'exercices */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border border-purple-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  🎯 Sections d'exercices
                </h2>
                <p className="text-gray-600">Progresse à travers 4 types d'exercices</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {exerciseSections.map((section, index) => {
                  const isActive = currentExerciseSection === index;
                  const sectionScore = sectionProgress[index];
                  const sectionTotal = section.exercises.length;
                  const isCompleted = sectionScore === sectionTotal;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => switchSection(index)}
                      className={`group relative p-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 ${
                        isActive
                          ? 'shadow-2xl scale-105 bg-gradient-to-br from-purple-100 to-pink-100 ring-4 ring-purple-300 ring-opacity-50' 
                          : isCompleted
                            ? 'shadow-lg hover:shadow-xl bg-gradient-to-br from-green-100 to-blue-100'
                            : 'shadow-lg hover:shadow-xl bg-white'
                      }`}
                    >
                      {/* Badge de progression */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {sectionScore}/{sectionTotal}
                      </div>
                      
                      {/* Icône de la section */}
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4 mx-auto ${
                        isActive 
                          ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg' 
                          : isCompleted
                            ? 'bg-gradient-to-br from-green-400 to-blue-400 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      } transition-all duration-300`}>
                        {section.icon}
                      </div>
                      
                      {/* Contenu principal */}
                      <div>
                        <div className={`font-bold text-lg mb-2 transition-colors leading-tight ${
                          isActive 
                            ? 'text-purple-700' 
                            : isCompleted
                              ? 'text-green-700'
                              : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {section.title}
                        </div>
                        
                        <div className={`text-sm leading-relaxed font-medium ${
                          isActive 
                            ? 'text-purple-600' 
                            : isCompleted
                              ? 'text-green-600'
                              : 'text-gray-500'
                        }`}>
                          {section.description}
                        </div>
                      </div>
                      
                      {/* Indicateur actif */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-2xl"></div>
                      )}
                      
                      {/* Badge de réussite */}
                      {isCompleted && !isActive && (
                        <div className="absolute top-4 left-4 text-green-500 text-xl">✅</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {exerciseSections[currentExerciseSection]?.icon} {exerciseSections[currentExerciseSection]?.title}
                </h2>
                  <p className="text-gray-600 mt-1">
                    Exercice {currentExercise + 1} sur {getCurrentSectionExercises().length}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-purple-600">
                    Score section : {sectionProgress[currentExerciseSection]}/{getCurrentSectionExercises().length}
                  </div>
                  <button
                    onClick={resetAll}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              {/* Barre de progression de la section */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / getCurrentSectionExercises().length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  currentExerciseSection === 0 ? 'bg-green-100 text-green-800' :
                  currentExerciseSection === 1 ? 'bg-blue-100 text-blue-800' :
                  currentExerciseSection === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {exerciseSections[currentExerciseSection]?.title}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                {getCurrentExercise()?.question}
              </h3>
              
              <div className="max-w-md mx-auto mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={currentExerciseSection === 0 ? 'oui ou non' : 'Ta réponse...'}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg font-bold focus:border-purple-500 focus:outline-none bg-white text-gray-900"
                />
                
                {/* Reconnaissance vocale */}
                <div className="w-full max-w-md border-t border-gray-200 pt-3 mt-3">
                  <VoiceInput
                    onTranscript={(transcript) => setUserAnswer(transcript)}
                    placeholder="Ou dites votre réponse à voix haute..."
                    className="justify-center"
                  />
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  Vérifier
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
                >
                  <Lightbulb className="inline w-4 h-4 mr-2" />
                  Indice
                </button>
                <button
                  onClick={resetExercise}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Effacer
                </button>
              </div>

              {/* Indice */}
              {showSolution && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-yellow-800">
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-bold">{getCurrentExercise()?.hint}</span>
                  </div>
                </div>
              )}
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">Excellent ! C'est la bonne réponse !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <div className="text-center">
                          <div className="font-bold mb-2">
                            Pas tout à fait... La bonne réponse est : {getCurrentExercise()?.answer}
                          </div>
                          <div className="text-sm">
                            {getCurrentExercise()?.explanation}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={previousExercise}
                  disabled={currentExercise === 0}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  ← Précédent
                </button>
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === getCurrentSectionExercises().length - 1}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>

            {/* Félicitations section complète */}
            {currentExercise === getCurrentSectionExercises().length - 1 && isCorrect !== null && (
              <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Section terminée !</h3>
                <p className="text-lg">
                  Tu as terminé la section "{exerciseSections[currentExerciseSection]?.title}" ! 
                </p>
                <p className="text-xl font-bold mt-4">
                  Score section : {sectionProgress[currentExerciseSection]}/{getCurrentSectionExercises().length}
                  {sectionProgress[currentExerciseSection] === getCurrentSectionExercises().length && ' - Parfait ! 🏆'}
                </p>
                {currentExerciseSection < exerciseSections.length - 1 && (
                  <button
                    onClick={() => switchSection(currentExerciseSection + 1)}
                    className="mt-4 bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    Section suivante →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 