'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, Clock } from 'lucide-react';
import ExerciseNavigation from '../../../../components/chapter/ExerciseNavigation';

interface Exercise {
  id: number;
  question: string;
  answer: string;
  unit: string;
  explanation: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  type: 'lecture' | 'calcul' | 'conversion' | 'duree';
}

export default function TempsPage() {
  const [activeTab, setActiveTab] = useState<'methode' | 'exercices'>('methode');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [exerciseType, setExerciseType] = useState<'tous' | 'lecture' | 'calcul' | 'conversion' | 'duree'>('tous');
  // États pour l'horloge interactive
  const [clockHours, setClockHours] = useState(12);
  const [clockMinutes, setClockMinutes] = useState(30);
  const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null);
  const [showClockHelp, setShowClockHelp] = useState(false);
  const [clockMode, setClockMode] = useState<'12h' | '24h'>('12h');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [currentConversionExercise, setCurrentConversionExercise] = useState(0);
  const [showConversionAnswer, setShowConversionAnswer] = useState(false);
  const [selectedConversionAnswer, setSelectedConversionAnswer] = useState('');
  const [conversionScore, setConversionScore] = useState(0);
  
  // États pour les exercices de durée et horaires
  const [currentDurationExercise, setCurrentDurationExercise] = useState(0);
  const [showDurationAnswer, setShowDurationAnswer] = useState(false);
  const [currentTimeExercise, setCurrentTimeExercise] = useState(0);
  const [showTimeAnswer, setShowTimeAnswer] = useState(false);
  
  // États pour les réponses saisies
  const [durationHours, setDurationHours] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [timeHours, setTimeHours] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [isDurationCorrect, setIsDurationCorrect] = useState<boolean | null>(null);
  const [isTimeCorrect, setIsTimeCorrect] = useState<boolean | null>(null);

  const exercises: Exercise[] = [
    // Exercices de lecture d'heure
    { id: 1, question: "Il est 14h30. Que dit l'horloge en notation 12h ?", answer: "2h30", unit: "de l'après-midi", explanation: "14h30 = 2h30 de l'après-midi", difficulty: 'facile', type: 'lecture' },
    { id: 2, question: "Il est 9h15. Combien de minutes après 9h ?", answer: "15", unit: "minutes", explanation: "9h15 = 9h + 15 minutes", difficulty: 'facile', type: 'lecture' },
    { id: 3, question: "Il est 20h45. Que dit l'horloge en notation 12h ?", answer: "8h45", unit: "du soir", explanation: "20h45 = 8h45 du soir", difficulty: 'moyen', type: 'lecture' },
    { id: 4, question: "Il est 12h00. Comment dit-on cette heure ?", answer: "midi", unit: "", explanation: "12h00 = midi", difficulty: 'facile', type: 'lecture' },
    { id: 5, question: "Il est 00h00. Comment dit-on cette heure ?", answer: "minuit", unit: "", explanation: "00h00 = minuit", difficulty: 'moyen', type: 'lecture' },
    
    // Exercices de calcul de durées
    { id: 6, question: "De 9h à 11h30, combien de temps s'écoule ?", answer: "2h30", unit: "", explanation: "11h30 - 9h00 = 2h30", difficulty: 'facile', type: 'calcul' },
    { id: 7, question: "De 14h15 à 16h45, combien de temps s'écoule ?", answer: "2h30", unit: "", explanation: "16h45 - 14h15 = 2h30", difficulty: 'moyen', type: 'calcul' },
    { id: 8, question: "De 8h50 à 10h10, combien de temps s'écoule ?", answer: "1h20", unit: "", explanation: "10h10 - 8h50 = 1h20", difficulty: 'moyen', type: 'calcul' },
    { id: 9, question: "De 23h30 à 1h15, combien de temps s'écoule ?", answer: "1h45", unit: "", explanation: "De 23h30 à 00h00 = 30 min, puis de 00h00 à 1h15 = 1h15, total = 1h45", difficulty: 'difficile', type: 'calcul' },
    { id: 10, question: "Un film dure 1h35. Il commence à 20h10. À quelle heure finit-il ?", answer: "21h45", unit: "", explanation: "20h10 + 1h35 = 21h45", difficulty: 'difficile', type: 'calcul' },
    
    // Exercices de conversion (30 exercices)
    { id: 11, question: "Convertir 2 heures en secondes", answer: "7200", unit: "s", explanation: "💡 Pour convertir heures → secondes : on multiplie par 3600. Calcul : 2 h × 3600 s = 7200 s. 📝 Méthode étape par étape : 1 h = 60 min et 1 min = 60 s donc 1 h = 60 × 60 s = 3600 s. Donc 2 h = 2 × 3600 s = 7200 s.", difficulty: 'facile', type: 'conversion' },
    { id: 12, question: "Convertir 180 secondes en minutes", answer: "3", unit: "min", explanation: "💡 Pour convertir secondes → minutes : on divise par 60. Calcul : 180 s ÷ 60 s = 3 min. 📝 Méthode : 60 s = 1 min donc pour trouver combien de minutes dans 180 s, on fait 180 ÷ 60 = 3.", difficulty: 'facile', type: 'conversion' },
    { id: 13, question: "Convertir 3 jours en heures", answer: "72", unit: "h", explanation: "💡 Pour convertir jours → heures : on multiplie par 24. Calcul : 3 jours × 24 h = 72 h. 📝 Méthode : 1 jour = 24 h donc 3 jours = 3 × 24 h = 72 h.", difficulty: 'facile', type: 'conversion' },
    { id: 14, question: "Convertir 5 minutes en secondes", answer: "300", unit: "s", explanation: "💡 Pour convertir minutes → secondes : on multiplie par 60. Calcul : 5 min × 60 s = 300 s. 📝 Méthode : 1 min = 60 s donc 5 min = 5 × 60 s = 300 s.", difficulty: 'facile', type: 'conversion' },
    { id: 15, question: "Convertir 7200 secondes en heures", answer: "2", unit: "h", explanation: "💡 Pour convertir secondes → heures : on divise par 3600. Calcul : 7200 s ÷ 3600 s = 2 h. 📝 Méthode étape par étape : 1 h = 60 min et 1 min = 60 s donc 1 h = 60 × 60 s = 3600 s. Donc 7200 s ÷ 3600 s = 2 h.", difficulty: 'facile', type: 'conversion' },
    { id: 16, question: "Convertir 48 heures en jours", answer: "2", unit: "jours", explanation: "💡 Pour convertir heures → jours : on divise par 24. Calcul : 48 h ÷ 24 h = 2 jours. 📝 Méthode : 1 jour = 24 h donc pour trouver combien de jours dans 48 h, on fait 48 ÷ 24 = 2.", difficulty: 'facile', type: 'conversion' },
    { id: 17, question: "Convertir 1440 minutes en jours", answer: "1", unit: "jour", explanation: "💡 Pour convertir minutes → jours : deux étapes. Étape 1 : minutes → heures (÷60). 1440 min ÷ 60 = 24 h. Étape 2 : heures → jours (÷24). 24 h ÷ 24 = 1 jour. 📝 Méthode alternative : 1 jour = 24 h × 60 min = 1440 min donc 1440 min = 1 jour.", difficulty: 'moyen', type: 'conversion' },
    { id: 18, question: "Convertir 1 semaine en heures", answer: "168", unit: "h", explanation: "💡 Pour convertir semaines → heures : deux étapes. Étape 1 : semaines → jours (×7). 1 semaine × 7 = 7 jours. Étape 2 : jours → heures (×24). 7 jours × 24 h = 168 h. 📝 Méthode directe : 1 semaine = 7 × 24 h = 168 h.", difficulty: 'moyen', type: 'conversion' },
    { id: 19, question: "Convertir 86400 secondes en jours", answer: "1", unit: "jour", explanation: "💡 Pour convertir secondes → jours : deux étapes. Étape 1 : secondes → heures (÷3600). 86400 s ÷ 3600 s = 24 h. Étape 2 : heures → jours (÷24). 24 h ÷ 24 = 1 jour. 📝 Méthode : 1 jour = 24 h = 24 × 3600 s = 86400 s donc 86400 s = 1 jour.", difficulty: 'moyen', type: 'conversion' },
    { id: 20, question: "Convertir 4 heures en minutes", answer: "240", unit: "min", explanation: "💡 Pour convertir heures → minutes : on multiplie par 60. Calcul : 4 h × 60 min = 240 min. 📝 Méthode : 1 h = 60 min donc 4 h = 4 × 60 min = 240 min.", difficulty: 'facile', type: 'conversion' },
    { id: 21, question: "Convertir 600 secondes en minutes", answer: "10", unit: "min", explanation: "💡 Pour convertir secondes → minutes : on divise par 60. Calcul : 600 s ÷ 60 s = 10 min. 📝 Méthode : 1 min = 60 s donc pour trouver combien de minutes dans 600 s, on fait 600 ÷ 60 = 10.", difficulty: 'facile', type: 'conversion' },
    { id: 22, question: "Convertir 2 semaines en jours", answer: "14", unit: "jours", explanation: "💡 Pour convertir semaines → jours : on multiplie par 7. Calcul : 2 semaines × 7 jours = 14 jours. 📝 Méthode : 1 semaine = 7 jours donc 2 semaines = 2 × 7 jours = 14 jours.", difficulty: 'facile', type: 'conversion' },
    { id: 23, question: "Convertir 120 minutes en heures", answer: "2", unit: "h", explanation: "💡 Pour convertir minutes → heures : on divise par 60. Calcul : 120 min ÷ 60 min = 2 h. 📝 Méthode : 1 h = 60 min donc pour trouver combien d'heures dans 120 min, on fait 120 ÷ 60 = 2.", difficulty: 'facile', type: 'conversion' },
    { id: 24, question: "Convertir 1 jour en secondes", answer: "86400", unit: "s", explanation: "💡 Pour convertir jours → secondes : deux étapes. Étape 1 : jours → heures (×24). 1 jour × 24 = 24 h. Étape 2 : heures → secondes (×3600). 24 h × 3600 s = 86400 s. 📝 Méthode directe : 1 jour = 24 h = 24 × 3600 s = 86400 s car 1 h = 60 min × 60 s = 3600 s.", difficulty: 'moyen', type: 'conversion' },
    { id: 25, question: "Convertir 10800 secondes en heures", answer: "3", unit: "h", explanation: "💡 Pour convertir secondes → heures : on divise par 3600. Calcul : 10800 s ÷ 3600 s = 3 h. 📝 Méthode : 1 h = 60 min × 60 s = 3600 s donc 10800 s ÷ 3600 s = 3 h.", difficulty: 'moyen', type: 'conversion' },
    { id: 26, question: "Convertir 720 minutes en heures", answer: "12", unit: "h", explanation: "💡 Pour convertir minutes → heures : on divise par 60. Calcul : 720 min ÷ 60 min = 12 h. 📝 Méthode : 1 h = 60 min donc pour trouver combien d'heures dans 720 min, on fait 720 ÷ 60 = 12.", difficulty: 'moyen', type: 'conversion' },
    { id: 27, question: "Convertir 5 jours en minutes", answer: "7200", unit: "min", explanation: "💡 Pour convertir jours → minutes : deux étapes. Étape 1 : jours → heures (×24). 5 jours × 24 = 120 h. Étape 2 : heures → minutes (×60). 120 h × 60 min = 7200 min. 📝 Méthode directe : 1 jour = 24 × 60 min = 1440 min donc 5 jours = 5 × 1440 min = 7200 min.", difficulty: 'difficile', type: 'conversion' },
    { id: 28, question: "Convertir 900 secondes en minutes", answer: "15", unit: "min", explanation: "💡 Pour convertir secondes → minutes : on divise par 60. Calcul : 900 s ÷ 60 s = 15 min. 📝 Méthode : 1 min = 60 s donc pour trouver combien de minutes dans 900 s, on fait 900 ÷ 60 = 15.", difficulty: 'facile', type: 'conversion' },
    { id: 29, question: "Convertir 6 heures en secondes", answer: "21600", unit: "s", explanation: "💡 Pour convertir heures → secondes : on multiplie par 3600. Calcul : 6 h × 3600 s = 21600 s. 📝 Méthode étape par étape : 1 h = 60 min et 1 min = 60 s donc 1 h = 60 × 60 s = 3600 s. Donc 6 h = 6 × 3600 s = 21600 s.", difficulty: 'moyen', type: 'conversion' },
    { id: 30, question: "Convertir 14 jours en semaines", answer: "2", unit: "semaines", explanation: "💡 Pour convertir jours → semaines : on divise par 7. Calcul : 14 jours ÷ 7 jours = 2 semaines. 📝 Méthode : 1 semaine = 7 jours donc pour trouver combien de semaines dans 14 jours, on fait 14 ÷ 7 = 2.", difficulty: 'facile', type: 'conversion' },
    { id: 31, question: "Convertir 1800 secondes en minutes", answer: "30", unit: "min", explanation: "💡 Pour convertir secondes → minutes : on divise par 60. Calcul : 1800 s ÷ 60 s = 30 min. 📝 Méthode : 1 min = 60 s donc pour trouver combien de minutes dans 1800 s, on fait 1800 ÷ 60 = 30.", difficulty: 'facile', type: 'conversion' },
    { id: 32, question: "Convertir 8 heures en minutes", answer: "480", unit: "min", explanation: "💡 Pour convertir heures → minutes : on multiplie par 60. Calcul : 8 h × 60 min = 480 min. 📝 Méthode : 1 h = 60 min donc 8 h = 8 × 60 min = 480 min.", difficulty: 'facile', type: 'conversion' },
    { id: 33, question: "Convertir 21 jours en semaines", answer: "3", unit: "semaines", explanation: "💡 Pour convertir jours → semaines : on divise par 7. Calcul : 21 jours ÷ 7 jours = 3 semaines. 📝 Méthode : 1 semaine = 7 jours donc pour trouver combien de semaines dans 21 jours, on fait 21 ÷ 7 = 3.", difficulty: 'facile', type: 'conversion' },
    { id: 34, question: "Convertir 3600 secondes en heures", answer: "1", unit: "h", explanation: "💡 Pour convertir secondes → heures : on divise par 3600. Calcul : 3600 s ÷ 3600 s = 1 h. 📝 Méthode : 1 h = 60 min × 60 s = 3600 s donc 3600 s = 1 h exactement.", difficulty: 'facile', type: 'conversion' },
    { id: 35, question: "Convertir 10 minutes en secondes", answer: "600", unit: "s", explanation: "💡 Pour convertir minutes → secondes : on multiplie par 60. Calcul : 10 min × 60 s = 600 s. 📝 Méthode : 1 min = 60 s donc 10 min = 10 × 60 s = 600 s.", difficulty: 'facile', type: 'conversion' },
    { id: 36, question: "Convertir 96 heures en jours", answer: "4", unit: "jours", explanation: "💡 Pour convertir heures → jours : on divise par 24. Calcul : 96 h ÷ 24 h = 4 jours. 📝 Méthode : 1 jour = 24 h donc pour trouver combien de jours dans 96 h, on fait 96 ÷ 24 = 4.", difficulty: 'moyen', type: 'conversion' },
    { id: 37, question: "Convertir 2880 minutes en jours", answer: "2", unit: "jours", explanation: "💡 Pour convertir minutes → jours : deux étapes. Étape 1 : minutes → heures (÷60). 2880 min ÷ 60 = 48 h. Étape 2 : heures → jours (÷24). 48 h ÷ 24 = 2 jours. 📝 Méthode directe : 1 jour = 24 × 60 min = 1440 min donc 2880 min ÷ 1440 min = 2 jours.", difficulty: 'difficile', type: 'conversion' },
    { id: 38, question: "Convertir 3 semaines en heures", answer: "504", unit: "h", explanation: "💡 Pour convertir semaines → heures : deux étapes. Étape 1 : semaines → jours (×7). 3 semaines × 7 = 21 jours. Étape 2 : jours → heures (×24). 21 jours × 24 h = 504 h. 📝 Méthode directe : 1 semaine = 7 × 24 h = 168 h donc 3 semaines = 3 × 168 h = 504 h.", difficulty: 'difficile', type: 'conversion' },
    { id: 39, question: "Convertir 300 secondes en minutes", answer: "5", unit: "min", explanation: "💡 Pour convertir secondes → minutes : on divise par 60. Calcul : 300 s ÷ 60 s = 5 min. 📝 Méthode : 1 min = 60 s donc pour trouver combien de minutes dans 300 s, on fait 300 ÷ 60 = 5.", difficulty: 'facile', type: 'conversion' },
    { id: 40, question: "Convertir 12 heures en secondes", answer: "43200", unit: "s", explanation: "💡 Pour convertir heures → secondes : on multiplie par 3600. Calcul : 12 h × 3600 s = 43200 s. 📝 Méthode étape par étape : 1 h = 60 min et 1 min = 60 s donc 1 h = 60 × 60 s = 3600 s. Donc 12 h = 12 × 3600 s = 43200 s.", difficulty: 'moyen', type: 'conversion' },
    
    // Exercices de durée
    { id: 41, question: "Combien de temps dure un match de foot ?", answer: "90", unit: "minutes", explanation: "Un match de football dure 90 minutes", difficulty: 'facile', type: 'duree' },
    { id: 42, question: "Combien de temps dure une récréation ?", answer: "15", unit: "minutes", explanation: "Une récréation dure environ 15 minutes", difficulty: 'facile', type: 'duree' },
    { id: 43, question: "Combien de temps dure un cours ?", answer: "45", unit: "minutes", explanation: "Un cours dure généralement 45 minutes", difficulty: 'moyen', type: 'duree' },
    { id: 44, question: "Combien de temps dure une nuit de sommeil ?", answer: "8", unit: "heures", explanation: "Une nuit de sommeil dure environ 8 heures", difficulty: 'moyen', type: 'duree' },
    { id: 45, question: "Combien de temps dure une journée d'école ?", answer: "6", unit: "heures", explanation: "Une journée d'école dure environ 6 heures", difficulty: 'difficile', type: 'duree' }
  ];

  // Exercices de calcul de durée (20 exercices)
  const durationExercises = [
    { id: 1, question: "De 9h15 à 11h30", answer: "2h15", explanation: "9h15 → 10h00 (45min) + 1h00 + 10h00 → 11h00 (1h) + 11h00 → 11h30 (30min) = 2h15" },
    { id: 2, question: "De 14h45 à 16h20", answer: "1h35", explanation: "14h45 → 15h00 (15min) + 15h00 → 16h00 (1h) + 16h00 → 16h20 (20min) = 1h35" },
    { id: 3, question: "De 8h00 à 12h45", answer: "4h45", explanation: "8h00 → 12h00 (4h) + 12h00 → 12h45 (45min) = 4h45" },
    { id: 4, question: "De 15h25 à 17h10", answer: "1h45", explanation: "15h25 → 16h00 (35min) + 16h00 → 17h00 (1h) + 17h00 → 17h10 (10min) = 1h45" },
    { id: 5, question: "De 7h30 à 9h00", answer: "1h30", explanation: "7h30 → 8h00 (30min) + 8h00 → 9h00 (1h) = 1h30" },
    { id: 6, question: "De 13h15 à 15h45", answer: "2h30", explanation: "13h15 → 14h00 (45min) + 14h00 → 15h00 (1h) + 15h00 → 15h45 (45min) = 2h30" },
    { id: 7, question: "De 10h40 à 12h25", answer: "1h45", explanation: "10h40 → 11h00 (20min) + 11h00 → 12h00 (1h) + 12h00 → 12h25 (25min) = 1h45" },
    { id: 8, question: "De 16h05 à 18h50", answer: "2h45", explanation: "16h05 → 17h00 (55min) + 17h00 → 18h00 (1h) + 18h00 → 18h50 (50min) = 2h45" },
    { id: 9, question: "De 6h20 à 8h10", answer: "1h50", explanation: "6h20 → 7h00 (40min) + 7h00 → 8h00 (1h) + 8h00 → 8h10 (10min) = 1h50" },
    { id: 10, question: "De 11h55 à 14h30", answer: "2h35", explanation: "11h55 → 12h00 (5min) + 12h00 → 14h00 (2h) + 14h00 → 14h30 (30min) = 2h35" },
    { id: 11, question: "De 9h35 à 11h20", answer: "1h45", explanation: "9h35 → 10h00 (25min) + 10h00 → 11h00 (1h) + 11h00 → 11h20 (20min) = 1h45" },
    { id: 12, question: "De 14h10 à 16h40", answer: "2h30", explanation: "14h10 → 15h00 (50min) + 15h00 → 16h00 (1h) + 16h00 → 16h40 (40min) = 2h30" },
    { id: 13, question: "De 8h45 à 10h15", answer: "1h30", explanation: "8h45 → 9h00 (15min) + 9h00 → 10h00 (1h) + 10h00 → 10h15 (15min) = 1h30" },
    { id: 14, question: "De 12h20 à 15h05", answer: "2h45", explanation: "12h20 → 13h00 (40min) + 13h00 → 15h00 (2h) + 15h00 → 15h05 (5min) = 2h45" },
    { id: 15, question: "De 17h30 à 19h45", answer: "2h15", explanation: "17h30 → 18h00 (30min) + 18h00 → 19h00 (1h) + 19h00 → 19h45 (45min) = 2h15" },
    { id: 16, question: "De 7h15 à 9h35", answer: "2h20", explanation: "7h15 → 8h00 (45min) + 8h00 → 9h00 (1h) + 9h00 → 9h35 (35min) = 2h20" },
    { id: 17, question: "De 13h40 à 15h25", answer: "1h45", explanation: "13h40 → 14h00 (20min) + 14h00 → 15h00 (1h) + 15h00 → 15h25 (25min) = 1h45" },
    { id: 18, question: "De 10h10 à 12h55", answer: "2h45", explanation: "10h10 → 11h00 (50min) + 11h00 → 12h00 (1h) + 12h00 → 12h55 (55min) = 2h45" },
    { id: 19, question: "De 16h25 à 18h10", answer: "1h45", explanation: "16h25 → 17h00 (35min) + 17h00 → 18h00 (1h) + 18h00 → 18h10 (10min) = 1h45" },
    { id: 20, question: "De 8h50 à 11h35", answer: "2h45", explanation: "8h50 → 9h00 (10min) + 9h00 → 11h00 (2h) + 11h00 → 11h35 (35min) = 2h45" }
  ];

  // Exercices de calcul d'horaire (20 exercices)
  const timeExercises = [
    { id: 1, question: "Début 10h30 + durée 2h15", answer: "12h45", explanation: "10h30 → 11h00 (30min) + 11h00 → 12h00 (1h) + 12h00 → 12h45 (45min)" },
    { id: 2, question: "Fin 16h20 - durée 1h35", answer: "14h45", explanation: "16h20 → 16h00 (20min) - 16h00 → 15h00 (1h) - 15h00 → 14h45 (15min)" },
    { id: 3, question: "Début 21h40 + durée 3h35", answer: "1h15", explanation: "21h40 → 22h00 (20min) + 22h00 → 00h00 (2h) + 00h00 → 1h15 (1h15)" },
    { id: 4, question: "Fin 9h05 - durée 45min", answer: "8h20", explanation: "9h05 → 9h00 (5min) - 9h00 → 8h20 (40min)" },
    { id: 5, question: "Début 14h25 + durée 1h50", answer: "16h15", explanation: "14h25 → 15h00 (35min) + 15h00 → 16h00 (1h) + 16h00 → 16h15 (15min)" },
    { id: 6, question: "Fin 18h30 - durée 2h45", answer: "15h45", explanation: "18h30 → 18h00 (30min) - 18h00 → 16h00 (2h) - 16h00 → 15h45 (15min)" },
    { id: 7, question: "Début 7h15 + durée 3h20", answer: "10h35", explanation: "7h15 → 8h00 (45min) + 8h00 → 10h00 (2h) + 10h00 → 10h35 (35min)" },
    { id: 8, question: "Fin 13h40 - durée 1h25", answer: "12h15", explanation: "13h40 → 13h00 (40min) - 13h00 → 12h15 (45min)" },
    { id: 9, question: "Début 19h50 + durée 2h30", answer: "22h20", explanation: "19h50 → 20h00 (10min) + 20h00 → 22h00 (2h) + 22h00 → 22h20 (20min)" },
    { id: 10, question: "Fin 11h25 - durée 55min", answer: "10h30", explanation: "11h25 → 11h00 (25min) - 11h00 → 10h30 (30min)" },
    { id: 11, question: "Début 8h35 + durée 4h15", answer: "12h50", explanation: "8h35 → 9h00 (25min) + 9h00 → 12h00 (3h) + 12h00 → 12h50 (50min)" },
    { id: 12, question: "Fin 20h10 - durée 3h25", answer: "16h45", explanation: "20h10 → 20h00 (10min) - 20h00 → 17h00 (3h) - 17h00 → 16h45 (15min)" },
    { id: 13, question: "Début 15h20 + durée 1h40", answer: "17h00", explanation: "15h20 → 16h00 (40min) + 16h00 → 17h00 (1h)" },
    { id: 14, question: "Fin 14h15 - durée 2h50", answer: "11h25", explanation: "14h15 → 14h00 (15min) - 14h00 → 12h00 (2h) - 12h00 → 11h25 (35min)" },
    { id: 15, question: "Début 22h45 + durée 1h30", answer: "0h15", explanation: "22h45 → 23h00 (15min) + 23h00 → 00h00 (1h) + 00h00 → 00h15 (15min)" },
    { id: 16, question: "Fin 17h05 - durée 4h20", answer: "12h45", explanation: "17h05 → 17h00 (5min) - 17h00 → 13h00 (4h) - 13h00 → 12h45 (15min)" },
    { id: 17, question: "Début 6h40 + durée 2h25", answer: "9h05", explanation: "6h40 → 7h00 (20min) + 7h00 → 9h00 (2h) + 9h00 → 9h05 (5min)" },
    { id: 18, question: "Fin 12h30 - durée 1h15", answer: "11h15", explanation: "12h30 → 12h00 (30min) - 12h00 → 11h15 (45min)" },
    { id: 19, question: "Début 16h55 + durée 3h10", answer: "20h05", explanation: "16h55 → 17h00 (5min) + 17h00 → 20h00 (3h) + 20h00 → 20h05 (5min)" },
    { id: 20, question: "Fin 9h45 - durée 2h35", answer: "7h10", explanation: "9h45 → 9h00 (45min) - 9h00 → 7h35 (1h25) - 7h35 → 7h10 (25min)" }
  ];

  const filteredExercises = exerciseType === 'tous' 
    ? exercises 
    : exercises.filter(ex => ex.type === exerciseType);

  const currentEx = filteredExercises[currentExercise];

  useEffect(() => {
    if (currentExercise >= filteredExercises.length) {
      setCurrentExercise(0);
    }
  }, [exerciseType, currentExercise, filteredExercises.length]);

  useEffect(() => {
    // Initialiser la date côté client uniquement
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Gérer le mouseUp global pour arrêter le dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(null);
    };
    
    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    if (answer === currentEx.answer || answer.includes(currentEx.answer)) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    setCurrentExercise((prev) => (prev + 1) % filteredExercises.length);
    setShowAnswer(false);
    setSelectedAnswer('');
  };

  const prevExercise = () => {
    setCurrentExercise((prev) => (prev - 1 + filteredExercises.length) % filteredExercises.length);
    setShowAnswer(false);
    setSelectedAnswer('');
  };

  // Fonctions pour les exercices de conversion
  const conversionExercises = exercises.filter(ex => ex.type === 'conversion');
  const currentConversionEx = conversionExercises[currentConversionExercise];

  const handleConversionAnswer = (answer: string) => {
    setSelectedConversionAnswer(answer);
    setShowConversionAnswer(true);
    if (answer === currentConversionEx.answer || answer.includes(currentConversionEx.answer)) {
      setConversionScore(conversionScore + 1);
    }
  };

  const nextConversionExercise = () => {
    setCurrentConversionExercise((prev) => (prev + 1) % conversionExercises.length);
    setShowConversionAnswer(false);
    setSelectedConversionAnswer('');
  };

  const prevConversionExercise = () => {
    setCurrentConversionExercise((prev) => (prev - 1 + conversionExercises.length) % conversionExercises.length);
    setShowConversionAnswer(false);
    setSelectedConversionAnswer('');
  };

  // Fonctions pour les exercices de durée
  const nextDurationExercise = () => {
    setCurrentDurationExercise((prev) => (prev + 1) % durationExercises.length);
    setShowDurationAnswer(false);
    setDurationHours('');
    setDurationMinutes('');
    setIsDurationCorrect(null);
  };

  const prevDurationExercise = () => {
    setCurrentDurationExercise((prev) => (prev - 1 + durationExercises.length) % durationExercises.length);
    setShowDurationAnswer(false);
    setDurationHours('');
    setDurationMinutes('');
    setIsDurationCorrect(null);
  };

  // Fonctions pour les exercices d'horaire
  const nextTimeExercise = () => {
    setCurrentTimeExercise((prev) => (prev + 1) % timeExercises.length);
    setShowTimeAnswer(false);
    setTimeHours('');
    setTimeMinutes('');
    setIsTimeCorrect(null);
  };

  const prevTimeExercise = () => {
    setCurrentTimeExercise((prev) => (prev - 1 + timeExercises.length) % timeExercises.length);
    setShowTimeAnswer(false);
    setTimeHours('');
    setTimeMinutes('');
    setIsTimeCorrect(null);
  };

  // Fonction pour vérifier la réponse de durée
  const checkDurationAnswer = () => {
    const currentEx = durationExercises[currentDurationExercise];
    const correctAnswer = currentEx.answer;
    
    // Parse la réponse correcte (format "2h15" ou "1h30")
    const match = correctAnswer.match(/(\d+)h(\d+)/);
    if (!match) return;
    
    const correctHours = parseInt(match[1]);
    const correctMinutes = parseInt(match[2]);
    
    const userHours = parseInt(durationHours) || 0;
    const userMinutes = parseInt(durationMinutes) || 0;
    
    const isCorrect = userHours === correctHours && userMinutes === correctMinutes;
    setIsDurationCorrect(isCorrect);
    setShowDurationAnswer(true);
  };

  // Fonction pour vérifier la réponse d'horaire
  const checkTimeAnswer = () => {
    const currentEx = timeExercises[currentTimeExercise];
    const correctAnswer = currentEx.answer;
    
    // Parse la réponse correcte (format "12h45" ou "0h15")
    const match = correctAnswer.match(/(\d+)h(\d+)/);
    if (!match) return;
    
    const correctHours = parseInt(match[1]);
    const correctMinutes = parseInt(match[2]);
    
    const userHours = parseInt(timeHours) || 0;
    const userMinutes = parseInt(timeMinutes) || 0;
    
    // Gérer les cas spéciaux (0h15 = 00h15, 24h00 = 0h00)
    const normalizedUserHours = userHours % 24;
    const normalizedCorrectHours = correctHours % 24;
    
    const isCorrect = normalizedUserHours === normalizedCorrectHours && userMinutes === correctMinutes;
    setIsTimeCorrect(isCorrect);
    setShowTimeAnswer(true);
  };

  // Fonctions pour l'horloge interactive
  const getAngle = (value: number, max: number) => {
    return ((value % max) / max) * 360 - 90;
  };

  const getHourAngle = () => {
    const hour = clockHours % 12;
    return getAngle(hour + clockMinutes / 60, 12);
  };

  const getMinuteAngle = () => {
    return getAngle(clockMinutes, 60);
  };

  const formatDisplayTime = () => {
    if (clockMode === '12h') {
      const displayHour = clockHours === 0 ? 12 : clockHours > 12 ? clockHours - 12 : clockHours;
      const ampm = clockHours < 12 ? 'AM' : 'PM';
      return `${displayHour}h${clockMinutes.toString().padStart(2, '0')} ${ampm}`;
    } else {
      return `${clockHours}h${clockMinutes.toString().padStart(2, '0')}`;
    }
  };

  const getTimeExplanation = () => {
    const hour = clockHours;
    const minute = clockMinutes;
    
         // Messages VRAIMENT rigolos selon l'heure
     if (hour === 0 && minute === 0) return "MINUIT ! 🧛‍♂️ Les vampires font la fête ! Tu devrais dormir... ou pas ? 😴";
     if (hour === 6 && minute === 0) return "6H DU MAT' ! 🐓 COCORICO ! Même les poules sont encore fatiguées ! 😵";
     if (hour === 7 && minute === 0) return "7H ! 🥐 Petit déjeuner au lit ? Tu rêves ! Debout fainéant ! 😆";
     if (hour === 8 && minute === 0) return "8H ! 🏃‍♂️ PANIQUE ! T'es en retard pour l'école ! Cours comme Flash ! ⚡";
     if (hour === 9 && minute === 0) return "9H ! 🧠 Ton cerveau commence à marcher... enfin presque ! 🤪";
     if (hour === 10 && minute === 0) return "10H ! ☕ Pause café pour les grands, pause chocolat pour toi ! 🍫";
     if (hour === 11 && minute === 0) return "11H ! 🕐 Mon ventre commence à gargouiller... Et le tien ? 🤤";
     if (hour === 12 && minute === 0) return "MIDI ! 🍽️ ALERTE ROUGE ! J'ai la dalle ! BOUFFE MAINTENANT ! 🚨";
     if (hour === 12 && minute > 0) return "L'HEURE DU FESTIN ! 🍕🍟🍔 Miam miam ! Qu'est-ce qu'on se met sous la dent ? 😋";
     if (hour === 13 && minute === 0) return "13H ! 😴 Sieste digestive ! Même les lions dorment après manger ! 🦁";
     if (hour === 14 && minute === 0) return "14H ! 📚 Retour au boulot... bof bof ! J'ai envie de rien faire ! 😑";
     if (hour === 15 && minute === 0) return "15H ! 🧁 GOÛTER TIME ! Cookies, gâteaux, tout y passe ! 🍪🧁";
     if (hour === 16 && minute === 0) return "16H ! 🏃‍♀️ LIBERTÉ ! Fini l'école ! Vive les vacances de 2h ! 🎉";
     if (hour === 17 && minute === 0) return "17H ! 🎮 Mode jeu activé ! Prêt pour une bataille épique ? ⚔️";
     if (hour === 18 && minute === 0) return "18H ! 🍝 Mes papilles gustatives préparent le terrain ! 👅";
     if (hour === 19 && minute === 0) return "19H ! 🍽️ À TABLE ! Que le festin commence ! Bon appétit les loups ! 🐺";
     if (hour === 20 && minute === 0) return "20H ! 📺 Netflix and chill ? Ou plutôt Disney et rigolades ! 🎬";
     if (hour === 21 && minute === 0) return "21H ! 🛁 Plouf ! Dans le bain ! Attention aux éclaboussures ! 💦";
     if (hour === 22 && minute === 0) return "22H ! 📖 Histoire du soir ! J'espère qu'elle n'est pas trop effrayante ! 👻";
     if (hour === 23 && minute === 0) return "23H ! 😴 Dodo les petits monstres ! Les anges gardiens arrivent ! 👼";
    
         // Messages généraux par tranche (encore plus drôles)
     if (hour >= 6 && hour < 9) return "LE MATIN ! 🌅 Étirons-nous comme des chats paresseux ! Miaou ! 🐱";
     if (hour >= 9 && hour < 12) return "MATINÉE ! ☀️ Plein d'énergie ! Comme un écureuil qui a bu trop de Red Bull ! 🐿️⚡";
     if (hour >= 12 && hour < 14) return "MIDI ! 🍽️ Temps de se régaler ! Mon estomac joue les tambours ! 🥁";
     if (hour >= 14 && hour < 17) return "APRÈS-MIDI ! 🌞 Activités et découvertes ! Ou sieste... 😴";
     if (hour >= 17 && hour < 19) return "FIN D'APRÈS-MIDI ! 🌅 Mes papilles préparent le terrain pour le dîner ! 👅";
     if (hour >= 19 && hour < 21) return "SOIRÉE ! 🌆 Famille, détente et... Netflix ! 📺";
     if (hour >= 21 && hour < 23) return "SOIR ! 🌙 Préparation au dodo ! Brossage de dents obligatoire ! 🦷";
     return "NUIT PROFONDE ! 🌙 Chut... même les hiboux dorment ! 🦉💤";
  };

  const handleMouseDown = (hand: 'hour' | 'minute') => {
    setIsDragging(hand);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let degrees = (angle * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;
    
    if (isDragging === 'hour') {
      const newHour = Math.round((degrees / 360) * 12);
      if (clockMode === '12h') {
        setClockHours(newHour === 0 ? 12 : newHour);
      } else {
        // En mode 24h, on garde la même logique mais on peut avoir des heures > 12
        const currentHour = clockHours;
        const isAfternoon = currentHour >= 12;
        const baseHour = newHour === 0 ? 12 : newHour;
        setClockHours(isAfternoon ? (baseHour === 12 ? 12 : baseHour + 12) : baseHour);
      }
    } else if (isDragging === 'minute') {
      const newMinute = Math.round((degrees / 360) * 60);
      setClockMinutes(newMinute === 60 ? 0 : newMinute);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <>
      <style>
        {`
        @keyframes clockHandPulse {
          0%, 100% { 
            opacity: 1; 
            filter: brightness(1);
          }
          50% { 
            opacity: 0.7; 
            filter: brightness(1.2);
          }
        }
        `}
      </style>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Particules de fond pour l'effet magique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-40 w-32 h-32 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/chapitre/cm1-grandeurs-mesures" className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors">
              <ArrowLeft size={20} />
              <span>Retour au chapitre</span>
            </Link>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                ⏰
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Temps et durées</h1>
                <p className="text-gray-600 text-lg">
                  Lire l'heure, calculer des durées (h, min, s)
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-bold text-orange-600">{currentTime ? formatTime(currentTime) : '--:--'}</div>
                <div className="text-sm text-gray-500">Heure actuelle</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-white/20 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('methode')}
              className={`flex-1 px-6 py-3 rounded-2xl font-medium transition-all ${
                activeTab === 'methode'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              📖 Méthode
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`flex-1 px-6 py-3 rounded-2xl font-medium transition-all ${
                activeTab === 'exercices'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              ✏️ Exercices ({filteredExercises.length})
            </button>
          </div>
        </div>

        {/* Contenu Méthode */}
        {activeTab === 'methode' && (
          <div className="space-y-8">
            {/* Section 1: Les unités de temps */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">⏰ Les unités de temps</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">Seconde (s)</h3>
                  <p className="text-sm text-red-700">Très courte durée</p>
                  <p className="text-xs text-red-600 mt-1">Ex: clignement des yeux</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-bold text-orange-800 mb-2">Minute (min)</h3>
                  <p className="text-sm text-orange-700">Courte durée</p>
                  <p className="text-xs text-orange-600 mt-1">Ex: se brosser les dents</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-2">Heure (h)</h3>
                  <p className="text-sm text-yellow-700">Durée moyenne</p>
                  <p className="text-xs text-yellow-600 mt-1">Ex: un cours</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">Jour</h3>
                  <p className="text-sm text-green-700">Longue durée</p>
                  <p className="text-xs text-green-600 mt-1">Ex: une journée d'école</p>
                </div>
              </div>


                </div>

            {/* Section 2: Conversions de base */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border border-purple-200 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">🔄 Conversions de base</h2>
              <p className="text-gray-600 text-center mb-8">Toutes les conversions importantes que tu dois connaître !</p>
              
              {/* Conversions principales avec animations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl border-2 border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2 animate-pulse">🕐</div>
                    <h3 className="font-bold text-blue-800 text-lg">1 HEURE</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">1 h</span>
                        <span className="text-blue-800 font-bold text-xl">=</span>
                        <span className="text-blue-700 font-bold text-lg">60 min</span>
                      </div>
                      <div className="text-xs text-blue-600 mt-1">💡 Comme une heure de récré !</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">1 h</span>
                        <span className="text-blue-800 font-bold text-xl">=</span>
                        <span className="text-blue-700 font-bold text-lg">3600 s</span>
                      </div>
                      <div className="text-xs text-blue-600 mt-1">🚀 60 × 60 = 3600 !</div>
                    </div>
              </div>
            </div>

                <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border-2 border-green-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2 animate-pulse">⏱️</div>
                    <h3 className="font-bold text-green-800 text-lg">1 MINUTE</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">1 min</span>
                        <span className="text-green-800 font-bold text-xl">=</span>
                        <span className="text-green-700 font-bold text-lg">60 s</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">⚡ Le temps de se brosser les dents !</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">30 s</span>
                        <span className="text-green-800 font-bold text-xl">=</span>
                        <span className="text-green-700 font-bold text-lg">½ min</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">🎯 Une demi-minute !</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl border-2 border-orange-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2 animate-pulse">🌅</div>
                    <h3 className="font-bold text-orange-800 text-lg">1 JOURNÉE</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-700 font-medium">1 jour</span>
                        <span className="text-orange-800 font-bold text-xl">=</span>
                        <span className="text-orange-700 font-bold text-lg">24 h</span>
                      </div>
                      <div className="text-xs text-orange-600 mt-1">🌍 Une rotation complète de la Terre !</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-700 font-medium">12 h</span>
                        <span className="text-orange-800 font-bold text-xl">=</span>
                        <span className="text-orange-700 font-bold text-lg">½ jour</span>
                      </div>
                      <div className="text-xs text-orange-600 mt-1">🌙 Du matin au soir !</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversions avancées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl border-2 border-purple-300">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">📅</div>
                    <h3 className="font-bold text-purple-800 text-lg">SEMAINES & MOIS</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-700 font-medium">1 semaine</span>
                        <span className="text-purple-800 font-bold text-xl">=</span>
                        <span className="text-purple-700 font-bold">7 jours</span>
                      </div>
                      <div className="text-xs text-purple-600 mt-1">📚 Une semaine d'école !</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-700 font-medium">1 mois</span>
                        <span className="text-purple-800 font-bold text-xl">≈</span>
                        <span className="text-purple-700 font-bold">30 jours</span>
                      </div>
                      <div className="text-xs text-purple-600 mt-1">🗓️ Environ 4 semaines !</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-xl border-2 border-red-300">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🎂</div>
                    <h3 className="font-bold text-red-800 text-lg">ANNÉES</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-red-700 font-medium">1 année</span>
                        <span className="text-red-800 font-bold text-xl">=</span>
                        <span className="text-red-700 font-bold">365 jours</span>
                      </div>
                      <div className="text-xs text-red-600 mt-1">🌟 Une année normale !</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-red-700 font-medium">1 année</span>
                        <span className="text-red-800 font-bold text-xl">=</span>
                        <span className="text-red-700 font-bold">12 mois</span>
                      </div>
                      <div className="text-xs text-red-600 mt-1">📆 Toutes les saisons !</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section mémo rapide */}
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-xl border-2 border-yellow-300">
                <h3 className="font-bold text-yellow-800 mb-4 text-center text-xl">🧠 MÉMO RAPIDE - À connaître par cœur !</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">🕐</div>
                    <div className="font-bold text-yellow-800">1 h = 60 min</div>
                    <div className="text-sm text-yellow-600">L'équivalence de base</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="font-bold text-yellow-800">1 min = 60 s</div>
                    <div className="text-sm text-yellow-600">Facile à retenir</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">🌅</div>
                    <div className="font-bold text-yellow-800">1 jour = 24 h</div>
                    <div className="text-sm text-yellow-600">Jour et nuit</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="font-bold text-yellow-800">1 semaine = 7 jours</div>
                    <div className="text-sm text-yellow-600">Lun-Dim</div>
                  </div>
                </div>
              </div>

              {/* Trucs et astuces */}
              <div className="mt-8 bg-gradient-to-r from-teal-100 to-cyan-100 p-6 rounded-xl border-2 border-teal-300">
                <h3 className="font-bold text-teal-800 mb-4 text-center text-xl">🎯 TRUCS & ASTUCES POUR SE RAPPELER</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🚀</span>
                      <span className="font-bold text-teal-800">Pour les heures en secondes</span>
                    </div>
                    <p className="text-teal-700 text-sm">
                      Souviens-toi : 1 h = 60 min, et 1 min = 60 s<br/>
                      Donc 1 h = 60 × 60 = 3600 s !
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🧮</span>
                      <span className="font-bold text-teal-800">Astuce des multiples</span>
                    </div>
                    <p className="text-teal-700 text-sm">
                      30 minutes = une demi-heure<br/>
                      15 minutes = un quart d'heure<br/>
                      45 minutes = trois quarts d'heure
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">⏰</span>
                      <span className="font-bold text-teal-800">Repères du quotidien</span>
                    </div>
                    <p className="text-teal-700 text-sm">
                      Se brosser les dents = 2-3 min<br/>
                      Prendre une douche = 5-10 min<br/>
                      Regarder un film = 1h30-2h
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎪</span>
                      <span className="font-bold text-teal-800">Moyens mnémotechniques</span>
                    </div>
                    <p className="text-teal-700 text-sm">
                      60 minutes = 60 comme ton âge de grand-père !<br/>
                      24 heures = 24 comme dans "24 heures chrono"<br/>
                      7 jours = 7 comme les 7 nains !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Exercices de conversions interactifs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔄 Exercices de conversions ({conversionExercises.length} exercices)</h2>
              
              {/* Navigation entre exercices de conversion */}
              <ExerciseNavigation
                currentExercise={currentConversionExercise}
                totalExercises={conversionExercises.length}
                onPrevious={prevConversionExercise}
                onNext={nextConversionExercise}
                exerciseTitle={currentConversionEx.question}
              />

              {/* Exercice de conversion actuel */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentConversionEx.difficulty === 'facile' ? 'bg-green-100 text-green-800' :
                        currentConversionEx.difficulty === 'moyen' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {currentConversionEx.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Conversion
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{conversionScore}</div>
                    <div className="text-sm text-gray-500">points</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg mb-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{currentConversionEx.question}</h3>
                  
                  <div className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={selectedConversionAnswer}
                      onChange={(e) => setSelectedConversionAnswer(e.target.value)}
                      placeholder="Votre réponse"
                      className="flex-1 px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500 shadow-sm"
                      disabled={showConversionAnswer}
                    />
                    {currentConversionEx.unit && (
                      <span className="px-4 py-3 bg-purple-100 border-2 border-purple-200 rounded-lg font-medium text-purple-800">
                        {currentConversionEx.unit}
                      </span>
                    )}
                  </div>

                  {!showConversionAnswer && (
                <button
                      onClick={() => handleConversionAnswer(selectedConversionAnswer)}
                      className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition-all"
                >
                      Vérifier
                </button>
                  )}
              </div>

                {showConversionAnswer && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    selectedConversionAnswer === currentConversionEx.answer || selectedConversionAnswer.includes(currentConversionEx.answer)
                      ? 'bg-green-100 border border-green-200'
                      : 'bg-red-100 border border-red-200'
                  }`}>
                    <p className="font-bold mb-2 text-gray-800">
                      {selectedConversionAnswer === currentConversionEx.answer || selectedConversionAnswer.includes(currentConversionEx.answer)
                        ? '✅ Bonne réponse !'
                        : '❌ Réponse incorrecte'}
                    </p>
                    <p className="text-sm text-gray-800">
                      <strong>Réponse correcte :</strong> {currentConversionEx.answer} {currentConversionEx.unit}
                    </p>
                    <p className="text-sm mt-2 text-gray-800">
                      <strong>Explication :</strong> {currentConversionEx.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>



            {/* Section 4: Horloge interactive */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🕐 Horloge interactive</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Horloge SVG */}
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-lg">
                    <svg
                      width="300"
                      height="300"
                      viewBox="0 0 300 300"
                      className="cursor-pointer select-none"
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      {/* Cadran principal */}
                      <circle
                        cx="150"
                        cy="150"
                        r="140"
                        fill="white"
                        stroke="#334155"
                        strokeWidth="4"
                        className="drop-shadow-md"
                      />
                      
                      {/* Chiffres de l'horloge */}
                      {[...Array(12)].map((_, i) => {
                        const angle = (i * 30) - 90;
                        const x = 150 + Math.cos(angle * Math.PI / 180) * 110;
                        const y = 150 + Math.sin(angle * Math.PI / 180) * 110;
                        const number = i === 0 ? 12 : i;
                        return (
                          <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dy="0.3em"
                            fontSize="20"
                            fontWeight="bold"
                            fill="#1f2937"
                          >
                            {number}
                          </text>
                        );
                      })}
                      
                      {/* Graduations */}
                      {[...Array(60)].map((_, i) => {
                        const angle = i * 6 - 90;
                        const innerR = i % 5 === 0 ? 125 : 130;
                        const outerR = 135;
                        const x1 = 150 + Math.cos(angle * Math.PI / 180) * innerR;
                        const y1 = 150 + Math.sin(angle * Math.PI / 180) * innerR;
                        const x2 = 150 + Math.cos(angle * Math.PI / 180) * outerR;
                        const y2 = 150 + Math.sin(angle * Math.PI / 180) * outerR;
                        return (
                          <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#64748b"
                            strokeWidth={i % 5 === 0 ? 2 : 1}
                          />
                        );
                      })}
                      
                      {/* Aiguille des heures */}
                      <line
                        x1="150"
                        y1="150"
                        x2={150 + Math.cos(getHourAngle() * Math.PI / 180) * 70}
                        y2={150 + Math.sin(getHourAngle() * Math.PI / 180) * 70}
                        stroke="#dc2626"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="cursor-pointer hover:stroke-red-700"
                        onMouseDown={() => handleMouseDown('hour')}
                        style={{
                          animation: 'clockHandPulse 3s ease-in-out infinite',
                        }}
                      />
                      
                      {/* Aiguille des minutes */}
                      <line
                        x1="150"
                        y1="150"
                        x2={150 + Math.cos(getMinuteAngle() * Math.PI / 180) * 100}
                        y2={150 + Math.sin(getMinuteAngle() * Math.PI / 180) * 100}
                        stroke="#2563eb"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="cursor-pointer hover:stroke-blue-700"
                        onMouseDown={() => handleMouseDown('minute')}
                        style={{
                          animation: 'clockHandPulse 3s ease-in-out infinite 0.5s',
                        }}
                      />
                      
                      {/* Centre de l'horloge */}
                      <circle
                        cx="150"
                        cy="150"
                        r="8"
                        fill="#1f2937"
                      />
                    </svg>
                  </div>
                  
                  {/* Contrôles */}
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => setClockMode(clockMode === '12h' ? '24h' : '12h')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Mode {clockMode === '12h' ? '24h' : '12h'}
                    </button>
                    <button
                      onClick={() => setShowClockHelp(!showClockHelp)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {showClockHelp ? 'Masquer' : 'Aide'}
                    </button>
                  </div>
                  
                  {/* Message encourageant l'interaction */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 animate-pulse">
                      👆 Bouge les aiguilles pour regarder comment cela fonctionne !
                    </p>
                  </div>
                </div>
                
                {/* Informations et explications */}
                <div className="space-y-6">
                  {/* Affichage de l'heure */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-2">Heure actuelle</h3>
                    <div className="text-4xl font-bold mb-2">{formatDisplayTime()}</div>
                  </div>
                  
                  {/* Message rigolo bien visible */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg border-4 border-yellow-300">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2 animate-bounce">💬 Message de l'horloge</div>
                      <div className="text-lg font-semibold text-yellow-100 bg-black bg-opacity-20 p-3 rounded-lg">
                        {getTimeExplanation()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Aide interactive */}
                  {showClockHelp && (
                    <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                      <h3 className="font-bold text-yellow-800 mb-4">💡 Comment utiliser l'horloge</h3>
                      <ul className="space-y-2 text-yellow-700">
                        <li>🔴 <strong>Aiguille rouge (courte)</strong> : Indique les heures</li>
                        <li>🔵 <strong>Aiguille bleue (longue)</strong> : Indique les minutes</li>
                        <li>🖱️ <strong>Cliquez et glissez</strong> les aiguilles pour changer l'heure</li>
                        <li>⏰ <strong>L'heure se met à jour</strong> automatiquement</li>
                        <li>🌅 <strong>Les explications changent</strong> selon le moment de la journée</li>
                      </ul>
                    </div>
                  )}
                  
                  {/* Explications détaillées */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold text-gray-800 mb-4">📚 Explications</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 font-bold">🔴</span>
                        <div className="text-gray-800">
                          <strong>Aiguille des heures :</strong> Elle fait un tour complet en 12 heures. 
                          Elle pointe vers {clockHours > 12 ? clockHours - 12 : clockHours === 0 ? 12 : clockHours}.
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-blue-500 font-bold">🔵</span>
                        <div className="text-gray-800">
                          <strong>Aiguille des minutes :</strong> Elle fait un tour complet en 60 minutes. 
                          Elle pointe vers {clockMinutes} minutes.
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-purple-500 font-bold">⏰</span>
                        <div className="text-gray-800">
                          <strong>Lecture :</strong> Il est actuellement {formatDisplayTime()}.
                          {clockMode === '12h' && clockHours >= 12 && (
                            <span className="text-gray-600 ml-2">
                              (En format 24h : {clockHours}h{clockMinutes.toString().padStart(2, '0')})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  

                </div>
              </div>
              
              {/* Section exemples rapides sur toute la largeur */}
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 mt-6">
                <h3 className="font-bold text-indigo-800 mb-4 text-center">🎯 Exemples rapides</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => { setClockHours(7); setClockMinutes(30); }}
                    className="px-4 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
                  >
                    7h30 🌅
                  </button>
                  <button
                    onClick={() => { setClockHours(12); setClockMinutes(0); }}
                    className="px-4 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
                  >
                    Midi 🍽️
                  </button>
                  <button
                    onClick={() => { setClockHours(15); setClockMinutes(30); }}
                    className="px-4 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
                  >
                    15h30 🧁
                  </button>
                  <button
                    onClick={() => { setClockHours(19); setClockMinutes(0); }}
                    className="px-4 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
                  >
                    19h00 🍽️
                  </button>
                  <button
                    onClick={() => { setClockHours(21); setClockMinutes(15); }}
                    className="px-4 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
                  >
                    21h15 🛁
                  </button>
                  <button
                    onClick={() => { setClockHours(0); setClockMinutes(0); }}
                    className="px-4 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
                  >
                    Minuit 🌙
                  </button>
                  <button
                    onClick={() => { setClockHours(16); setClockMinutes(45); }}
                    className="px-4 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
                  >
                    16h45 🏃
                  </button>
                  <button
                    onClick={() => { setClockHours(10); setClockMinutes(10); }}
                    className="px-4 py-3 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
                  >
                    10h10 ☕
                  </button>
                </div>
              </div>
            </div>


          </div>
        )}

        {/* Section 5: Calculs d'horaires et durées */}
        {activeTab === 'methode' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow-lg border border-cyan-200 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">🧮 Calculs d'horaires et durées</h2>
              <p className="text-gray-600 text-center mb-8">Apprends à calculer facilement les durées et horaires !</p>
              
              {/* Méthode 1: Calculer une durée entre 2 horaires */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
                <h3 className="text-2xl font-bold text-green-700 mb-4">🕐 Méthode 1: Calculer une durée</h3>
                <p className="text-gray-700 mb-4">Comment calculer le temps écoulé entre deux horaires ?</p>
                
                {/* Exemple concret */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <h4 className="font-bold text-green-800 mb-2">📝 Exemple pratique</h4>
                  <p className="text-green-700">
                    Tu commences tes devoirs à <strong>14h30</strong> et tu les termines à <strong>16h45</strong>. 
                    Combien de temps ont duré tes devoirs ?
                  </p>
                </div>
                
                {/* Méthode étape par étape */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">📚 Méthode FACILE avec ligne de temps</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                        <div>
                          <div className="font-semibold text-green-800">Je dessine ma ligne de temps</div>
                          <div className="text-green-700">Je place 14h30 ──────→ 16h45</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                        <div>
                          <div className="font-semibold text-green-800">Je vais d'abord à l'heure ronde</div>
                          <div className="text-green-700">14h30 → 15h00 = 30 minutes</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                        <div>
                          <div className="font-semibold text-green-800">Je compte les heures entières</div>
                          <div className="text-green-700">15h00 → 16h00 = 1 heure</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                        <div>
                          <div className="font-semibold text-green-800">Je finis avec les minutes restantes</div>
                          <div className="text-green-700">16h00 → 16h45 = 45 minutes</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                        <div>
                          <div className="font-semibold text-green-800">J'additionne tout</div>
                          <div className="text-green-700 font-bold">30 min + 1h + 45 min = 1h 75 min = 2h 15min</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visualisation avec timeline */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">👀 Visualisation</h4>
                    <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600 font-bold">14h30</span>
                          <div className="w-16 h-2 bg-green-200 rounded"></div>
                          <span className="text-green-600 text-sm">30min</span>
                          <div className="w-16 h-2 bg-green-200 rounded"></div>
                          <span className="text-green-600 font-bold">15h00</span>
                          <div className="w-24 h-2 bg-green-300 rounded"></div>
                          <span className="text-green-600 text-sm">1h</span>
                          <div className="w-24 h-2 bg-green-300 rounded"></div>
                          <span className="text-green-600 font-bold">16h00</span>
                          <div className="w-20 h-2 bg-green-200 rounded"></div>
                          <span className="text-green-600 text-sm">45min</span>
                          <div className="w-20 h-2 bg-green-200 rounded"></div>
                          <span className="text-green-600 font-bold">16h45</span>
                        </div>
                        <div className="text-sm text-green-700">
                          Total : 30min + 1h + 45min = 2h15min
                        </div>
                      </div>
                    </div>
                  </div>
                  
                    </div>
                  </div>
                  
              {/* Méthode 2: Trouver un horaire */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
                <h3 className="text-2xl font-bold text-purple-700 mb-4">🕐 Méthode 2: Trouver un horaire</h3>
                <p className="text-gray-700 mb-4">Comment trouver l'heure de fin ou de début ?</p>
                
                {/* Exemple concret */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                  <h4 className="font-bold text-purple-800 mb-2">📝 Exemple pratique</h4>
                  <p className="text-purple-700">
                    Un film commence à <strong>20h15</strong> et dure <strong>1h45</strong>. 
                    À quelle heure se terminera-t-il ?
                  </p>
                    </div>
                
                {/* Méthode étape par étape */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">📚 Méthode FACILE avec chemin des horaires</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                        <div>
                          <div className="font-semibold text-purple-800">Je dessine ma ligne de temps</div>
                          <div className="text-purple-700">20h15 ──────→ ? (+ 1h45)</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                        <div>
                          <div className="font-semibold text-purple-800">Je vais d'abord à l'heure ronde</div>
                          <div className="text-purple-700">20h15 → 21h00 = j'ajoute 45 minutes</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                        <div>
                          <div className="font-semibold text-purple-800">Je calcule ce qu'il me reste</div>
                          <div className="text-purple-700">1h45 - 45min = 1h00 restant</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                        <div>
                          <div className="font-semibold text-purple-800">J'ajoute le temps restant</div>
                          <div className="text-purple-700">21h00 + 1h00 = <strong>22h00</strong></div>
                  </div>
                </div>
              </div>
            </div>

                  {/* Visualisation avec timeline */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-2">👀 Visualisation</h4>
                    <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-purple-600 font-bold">20h15</span>
                          <div className="w-20 h-2 bg-purple-200 rounded"></div>
                          <span className="text-purple-600 text-sm">45min</span>
                          <div className="w-20 h-2 bg-purple-200 rounded"></div>
                          <span className="text-purple-600 font-bold">21h00</span>
                          <div className="w-24 h-2 bg-purple-300 rounded"></div>
                          <span className="text-purple-600 text-sm">1h</span>
                          <div className="w-24 h-2 bg-purple-300 rounded"></div>
                          <span className="text-purple-600 font-bold">22h00</span>
                        </div>
                        <div className="text-sm text-purple-700">
                          Chemin : 20h15 + 45min + 1h = 22h00
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cas particulier */}
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-2">⚠️ Cas particulier: Passage de minuit</h4>
                    <p className="text-orange-700 mb-2">
                      Exemple : Film à 23h30 qui dure 1h45
                    </p>
                    <div className="space-y-2 text-sm text-orange-700">
                      <div>💡 <strong>Méthode du chemin :</strong> Je passe par minuit</div>
                      <div>• 23h30 → 00h00 = j'ajoute 30 minutes</div>
                      <div>• Il me reste : 1h45 - 30min = 1h15</div>
                      <div>• 00h00 + 1h15 = <strong>1h15 (le lendemain)</strong></div>
                    </div>
                  </div>
                </div>
                </div>
                
              {/* Exercices interactifs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">🎯 Exercices interactifs</h3>
                <p className="text-gray-700 mb-6">Entraîne-toi avec ces exercices pratiques ! 20 exercices par série.</p>
                
                {/* Type 1: Calculer une durée */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-blue-800">🕐 Type 1: Calculer une durée</h4>
                    <div className="text-sm text-blue-600">
                      Exercice {currentDurationExercise + 1} sur {durationExercises.length}
                </div>
              </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                    <h5 className="font-semibold text-blue-700 mb-4 text-lg">
                      {durationExercises[currentDurationExercise].question}
                    </h5>
                    
                    {!showDurationAnswer ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <label className="block text-sm font-medium text-blue-800 mb-3">
                            🎯 Saisis ta réponse :
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={durationHours}
                              onChange={(e) => setDurationHours(e.target.value)}
                              placeholder="0"
                              min="0"
                              max="23"
                              className="w-20 px-3 py-2 border border-blue-300 rounded-lg text-center bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-blue-700 font-bold">h</span>
                            <input
                              type="number"
                              value={durationMinutes}
                              onChange={(e) => setDurationMinutes(e.target.value)}
                              placeholder="00"
                              min="0"
                              max="59"
                              className="w-20 px-3 py-2 border border-blue-300 rounded-lg text-center bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-blue-700 font-bold">min</span>
            </div>
          </div>
                        
                        <button
                          onClick={checkDurationAnswer}
                          disabled={durationHours === '' && durationMinutes === ''}
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                        >
                          Vérifier ma réponse
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Réponse de l'utilisateur */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-800 mb-1">
                            📝 Ta réponse: {durationHours || 0}h{(durationMinutes || 0).toString().padStart(2, '0')}
                          </div>
                        </div>
                        
                        {/* Résultat */}
                        <div className={`p-4 rounded-lg border-2 ${
                          isDurationCorrect 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-red-50 border-red-300'
                        }`}>
                          <div className={`font-bold mb-2 ${
                            isDurationCorrect ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {isDurationCorrect ? (
                              <>✅ Bravo ! C'est correct !</>
                            ) : (
                              <>❌ Pas tout à fait... Essaie encore !</>
                            )}
                          </div>
                          
                          <div className={`text-sm ${
                            isDurationCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            <div className="font-semibold mb-1">
                              ✅ Réponse correcte: {durationExercises[currentDurationExercise].answer}
                            </div>
                          </div>
                        </div>
                        
                        {/* Correction détaillée */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="font-bold text-blue-800 mb-2">
                            🔍 Correction détaillée:
                          </div>
                          <div className="text-sm text-blue-700 leading-relaxed">
                            {durationExercises[currentDurationExercise].explanation}
                          </div>
                        </div>
                        
                        {/* Bouton réessayer si incorrect */}
                        {!isDurationCorrect && (
                          <button
                            onClick={() => {
                              setShowDurationAnswer(false);
                              setDurationHours('');
                              setDurationMinutes('');
                              setIsDurationCorrect(null);
                            }}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                          >
                            🔄 Réessayer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={prevDurationExercise}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      ← Précédent
                    </button>
                    <button
                      onClick={nextDurationExercise}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Suivant →
                    </button>
                  </div>
                </div>
                
                {/* Type 2: Trouver un horaire */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-purple-800">🕐 Type 2: Trouver un horaire</h4>
                    <div className="text-sm text-purple-600">
                      Exercice {currentTimeExercise + 1} sur {timeExercises.length}
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                    <h5 className="font-semibold text-purple-700 mb-4 text-lg">
                      {timeExercises[currentTimeExercise].question}
                    </h5>
                    
                    {!showTimeAnswer ? (
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <label className="block text-sm font-medium text-purple-800 mb-3">
                            🎯 Saisis ta réponse :
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={timeHours}
                              onChange={(e) => setTimeHours(e.target.value)}
                              placeholder="0"
                              min="0"
                              max="23"
                              className="w-20 px-3 py-2 border border-purple-300 rounded-lg text-center bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-purple-700 font-bold">h</span>
                            <input
                              type="number"
                              value={timeMinutes}
                              onChange={(e) => setTimeMinutes(e.target.value)}
                              placeholder="00"
                              min="0"
                              max="59"
                              className="w-20 px-3 py-2 border border-purple-300 rounded-lg text-center bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-purple-700 font-bold">min</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={checkTimeAnswer}
                          disabled={timeHours === '' && timeMinutes === ''}
                          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                        >
                          Vérifier ma réponse
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Réponse de l'utilisateur */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-800 mb-1">
                            📝 Ta réponse: {timeHours || 0}h{(timeMinutes || 0).toString().padStart(2, '0')}
                          </div>
                        </div>
                        
                        {/* Résultat */}
                        <div className={`p-4 rounded-lg border-2 ${
                          isTimeCorrect 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-red-50 border-red-300'
                        }`}>
                          <div className={`font-bold mb-2 ${
                            isTimeCorrect ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {isTimeCorrect ? (
                              <>✅ Bravo ! C'est correct !</>
                            ) : (
                              <>❌ Pas tout à fait... Essaie encore !</>
                            )}
                          </div>
                          
                          <div className={`text-sm ${
                            isTimeCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            <div className="font-semibold mb-1">
                              ✅ Réponse correcte: {timeExercises[currentTimeExercise].answer}
                            </div>
                          </div>
                        </div>
                        
                        {/* Correction détaillée */}
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="font-bold text-purple-800 mb-2">
                            🔍 Correction détaillée:
                          </div>
                          <div className="text-sm text-purple-700 leading-relaxed">
                            {timeExercises[currentTimeExercise].explanation}
                          </div>
                        </div>
                        
                        {/* Bouton réessayer si incorrect */}
                        {!isTimeCorrect && (
                          <button
                            onClick={() => {
                              setShowTimeAnswer(false);
                              setTimeHours('');
                              setTimeMinutes('');
                              setIsTimeCorrect(null);
                            }}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                          >
                            🔄 Réessayer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={prevTimeExercise}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      ← Précédent
                    </button>
                    <button
                      onClick={nextTimeExercise}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Suivant →
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Astuces et conseils */}
              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-6 rounded-xl border-2 border-teal-300">
                <h3 className="font-bold text-teal-800 mb-4 text-center text-xl">🎯 ASTUCES DE PRO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🧠</span>
                      <span className="font-bold text-teal-800">Méthode rapide</span>
                    </div>
                    <p className="text-teal-700 text-sm">
                      Pour calculer rapidement, utilise une ligne de temps mentale ou dessine-la sur papier !
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">⚡</span>
                      <span className="font-bold text-teal-800">Vérification</span>
                    </div>
                    <p className="text-teal-700 text-sm">
                      Vérifie toujours ton résultat en refaisant le calcul dans l'autre sens !
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎯</span>
                      <span className="font-bold text-teal-800">Conversion</span>
                    </div>
                    <p className="text-teal-700 text-sm">
                      N'oublie pas : 60 minutes = 1 heure. Convertis toujours les minutes en heures quand c'est nécessaire !
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🌟</span>
                      <span className="font-bold text-teal-800">Entraînement</span>
                    </div>
                    <p className="text-teal-700 text-sm">
                      Plus tu pratiques avec des horaires de la vie quotidienne, plus tu deviendras rapide !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu Exercices */}
        {activeTab === 'exercices' && (
          <div className="space-y-8">
            {/* Filtres */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="font-bold text-gray-800 mb-4">🎯 Filtrer les exercices</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'tous', label: 'Tous', color: 'bg-gray-500' },
                  { id: 'lecture', label: 'Lecture d\'heure', color: 'bg-blue-500' },
                  { id: 'calcul', label: 'Calcul de durée', color: 'bg-green-500' },
                  { id: 'conversion', label: 'Conversions', color: 'bg-orange-500' },
                  { id: 'duree', label: 'Durées courantes', color: 'bg-purple-500' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setExerciseType(type.id as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      exerciseType === type.id ? type.color + ' text-white' : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation entre exercices */}
            <ExerciseNavigation
              currentExercise={currentExercise}
              totalExercises={filteredExercises.length}
              onPrevious={prevExercise}
              onNext={nextExercise}
              exerciseTitle={currentEx.question}
            />

            {/* Exercice actuel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentEx.difficulty === 'facile' ? 'bg-green-100 text-green-800' :
                      currentEx.difficulty === 'moyen' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentEx.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {currentEx.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{score}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{currentEx.question}</h3>
                
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Votre réponse"
                    className="flex-1 px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 shadow-sm"
                    disabled={showAnswer}
                  />
                  {currentEx.unit && (
                    <span className="px-4 py-3 bg-orange-100 border-2 border-orange-200 rounded-lg font-medium text-orange-800">
                      {currentEx.unit}
                    </span>
                  )}
                </div>

                {!showAnswer && (
                  <button
                    onClick={() => handleAnswer(selectedAnswer)}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-all"
                  >
                    Vérifier
                  </button>
                )}
              </div>

              {showAnswer && (
                <div className={`p-4 rounded-lg mb-6 ${
                  selectedAnswer === currentEx.answer || selectedAnswer.includes(currentEx.answer)
                    ? 'bg-green-100 border border-green-200'
                    : 'bg-red-100 border border-red-200'
                }`}>
                  <p className="font-bold mb-2 text-gray-800">
                    {selectedAnswer === currentEx.answer || selectedAnswer.includes(currentEx.answer)
                      ? '✅ Bonne réponse !'
                      : '❌ Réponse incorrecte'}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong>Réponse correcte :</strong> {currentEx.answer} {currentEx.unit}
                  </p>
                  <p className="text-sm mt-2 text-gray-800">
                    <strong>Explication :</strong> {currentEx.explanation}
                  </p>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
} 