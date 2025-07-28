'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Target, PuzzleIcon as Puzzle } from 'lucide-react';

interface Problem {
  id: number;
  title: string;
  question: string;
  answer: string;
  unit: string;
  explanation: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  type: 'proportionnalite' | 'recette' | 'voyage' | 'shopping' | 'construction' | 'longueur' | 'masse' | 'contenance' | 'duree';
  steps: string[];
}

export default function ProblemesPage() {
  const [activeTab, setActiveTab] = useState<'methode' | 'exercices'>('methode');
  const [currentProblem, setCurrentProblem] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [problemType, setProblemType] = useState<'tous' | 'proportionnalite' | 'recette' | 'voyage' | 'shopping' | 'construction' | 'longueur' | 'masse' | 'contenance' | 'duree'>('tous');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const problems: Problem[] = [
    // Problèmes de proportionnalité
    {
      id: 1,
      title: "Recette de gâteau",
      question: "Pour 4 personnes, il faut 200g de farine. Combien faut-il de farine pour 6 personnes ?",
      answer: "300",
      unit: "g",
      explanation: "200g ÷ 4 = 50g par personne, donc 50g × 6 = 300g",
      difficulty: 'facile',
      type: 'recette',
      steps: [
        "Je calcule pour 1 personne : 200g ÷ 4 = 50g",
        "Je calcule pour 6 personnes : 50g × 6 = 300g"
      ]
    },
    {
      id: 2,
      title: "Vitesse de marche",
      question: "Paul marche à 5 km/h. Combien de temps met-il pour parcourir 15 km ?",
      answer: "3",
      unit: "h",
      explanation: "Temps = Distance ÷ Vitesse = 15 km ÷ 5 km/h = 3h",
      difficulty: 'moyen',
      type: 'voyage',
      steps: [
        "Je sais que : temps = distance ÷ vitesse",
        "Je calcule : 15 km ÷ 5 km/h = 3h"
      ]
    },
    {
      id: 3,
      title: "Dosage de sirop",
      question: "Pour 1L d'eau, il faut 50mL de sirop. Combien de sirop pour 2,5L d'eau ?",
      answer: "125",
      unit: "mL",
      explanation: "50mL × 2,5 = 125mL",
      difficulty: 'moyen',
      type: 'proportionnalite',
      steps: [
        "Je vois que j'ai 2,5 fois plus d'eau",
        "Je calcule : 50mL × 2,5 = 125mL"
      ]
    },
    {
      id: 4,
      title: "Prix au kilogramme",
      question: "Les pommes coûtent 3€ le kg. Combien coûtent 1,5 kg de pommes ?",
      answer: "4,5",
      unit: "€",
      explanation: "3€ × 1,5 = 4,5€",
      difficulty: 'facile',
      type: 'shopping',
      steps: [
        "Je multiplie le prix par la quantité",
        "3€ × 1,5 = 4,5€"
      ]
    },
    {
      id: 5,
      title: "Consommation d'essence",
      question: "Une voiture consomme 7L aux 100km. Combien consomme-t-elle sur 350km ?",
      answer: "24,5",
      unit: "L",
      explanation: "7L × (350 ÷ 100) = 7L × 3,5 = 24,5L",
      difficulty: 'difficile',
      type: 'voyage',
      steps: [
        "Je calcule combien de fois 100km dans 350km : 350 ÷ 100 = 3,5",
        "Je calcule la consommation : 7L × 3,5 = 24,5L"
      ]
    },
    {
      id: 6,
      title: "Mélange de peinture",
      question: "Pour faire du vert, je mélange 3 parts de bleu et 2 parts de jaune. Combien de jaune pour 150mL de bleu ?",
      answer: "100",
      unit: "mL",
      explanation: "150mL ÷ 3 = 50mL par part, donc 50mL × 2 = 100mL de jaune",
      difficulty: 'difficile',
      type: 'proportionnalite',
      steps: [
        "Je trouve la valeur d'une part : 150mL ÷ 3 = 50mL",
        "Je calcule 2 parts de jaune : 50mL × 2 = 100mL"
      ]
    },
    {
      id: 7,
      title: "Durée de cuisson",
      question: "Un rôti de 1kg cuit 45min. Combien de temps pour un rôti de 1,5kg ?",
      answer: "67,5",
      unit: "min",
      explanation: "45min × 1,5 = 67,5min",
      difficulty: 'moyen',
      type: 'recette',
      steps: [
        "Je vois que le rôti fait 1,5 fois plus lourd",
        "Je calcule : 45min × 1,5 = 67,5min"
      ]
    },
    {
      id: 8,
      title: "Aire d'un rectangle",
      question: "Un terrain rectangulaire fait 25m sur 15m. Quelle est son aire ?",
      answer: "375",
      unit: "m²",
      explanation: "Aire = longueur × largeur = 25m × 15m = 375m²",
      difficulty: 'facile',
      type: 'construction',
      steps: [
        "Je calcule l'aire : longueur × largeur",
        "25m × 15m = 375m²"
      ]
    },
    {
      id: 9,
      title: "Conversion d'unités",
      question: "Un réservoir contient 2500L. Combien cela fait-il en hectolitres ?",
      answer: "25",
      unit: "hL",
      explanation: "2500L ÷ 100 = 25hL",
      difficulty: 'moyen',
      type: 'construction',
      steps: [
        "Je sais que 1hL = 100L",
        "Je calcule : 2500L ÷ 100 = 25hL"
      ]
    },
    {
      id: 10,
      title: "Problème complexe",
      question: "Marie achète 2,5kg de pommes à 3€/kg et 1,2kg de poires à 4€/kg. Combien paie-t-elle ?",
      answer: "12,3",
      unit: "€",
      explanation: "Pommes : 2,5 × 3 = 7,5€ ; Poires : 1,2 × 4 = 4,8€ ; Total : 7,5 + 4,8 = 12,3€",
      difficulty: 'difficile',
      type: 'shopping',
      steps: [
        "Je calcule le prix des pommes : 2,5kg × 3€ = 7,5€",
        "Je calcule le prix des poires : 1,2kg × 4€ = 4,8€",
        "Je calcule le total : 7,5€ + 4,8€ = 12,3€"
      ]
    },
    
    // Problèmes de longueur inspirés de Pass-Education
    {
      id: 11,
      title: "Trajet école",
      question: "Pour aller à l'école, un enfant parcourt 540 m sur un chemin et 2 km sur une route. Il rentre le midi pour manger à la maison. Quelle distance parcourt-il chaque jour ?",
      answer: "5080",
      unit: "m",
      explanation: "540 m + 2 km = 540 m + 2000 m = 2540 m pour l'aller, donc 2540 m × 2 = 5080 m par jour",
      difficulty: 'moyen',
      type: 'longueur',
      steps: [
        "Je convertis 2 km en mètres : 2 km = 2000 m",
        "Je calcule la distance aller : 540 m + 2000 m = 2540 m",
        "Je calcule la distance quotidienne : 2540 m × 2 = 5080 m"
      ]
    },
    {
      id: 12,
      title: "File de chenilles",
      question: "Les chenilles processionnaires se déplacent en file, accrochées les unes aux autres. Chaque chenille mesure 2 cm 5 mm. Quelle est la longueur d'une file de 50 chenilles ?",
      answer: "125",
      unit: "cm",
      explanation: "2 cm 5 mm = 2,5 cm, donc 2,5 cm × 50 = 125 cm",
      difficulty: 'moyen',
      type: 'longueur',
      steps: [
        "Je convertis 2 cm 5 mm en cm : 2 cm + 5 mm = 2 cm + 0,5 cm = 2,5 cm",
        "Je calcule la longueur totale : 2,5 cm × 50 = 125 cm"
      ]
    },
    {
      id: 13,
      title: "Pile de dictionnaires",
      question: "Un imprimeur stocke des dictionnaires épais de 12 cm en les empilant. Il observe que sa pile dépasse de peu une hauteur de 2 m. Combien de dictionnaires a-t-il empilés ?",
      answer: "16",
      unit: "dictionnaires",
      explanation: "2 m = 200 cm, donc 200 cm ÷ 12 cm = 16,67... soit 16 dictionnaires complets",
      difficulty: 'difficile',
      type: 'longueur',
      steps: [
        "Je convertis 2 m en cm : 2 m = 200 cm",
        "Je calcule le nombre de dictionnaires : 200 cm ÷ 12 cm = 16,67",
        "Je prends la partie entière : 16 dictionnaires"
      ]
    },
    {
      id: 14,
      title: "Vitesse de voiture",
      question: "Une voiture a roulé pendant 4 heures à la même vitesse pour parcourir une distance de 300 km. Quelle a été sa vitesse ?",
      answer: "75",
      unit: "km/h",
      explanation: "Vitesse = Distance ÷ Temps = 300 km ÷ 4 h = 75 km/h",
      difficulty: 'moyen',
      type: 'longueur',
      steps: [
        "Je sais que vitesse = distance ÷ temps",
        "Je calcule : 300 km ÷ 4 h = 75 km/h"
      ]
    },
    {
      id: 15,
      title: "Terrain de sport",
      question: "Un terrain de football mesure 100 m de long et 50 m de large. Quelle est la longueur totale à parcourir pour en faire le tour ?",
      answer: "300",
      unit: "m",
      explanation: "Périmètre = 2 × (longueur + largeur) = 2 × (100 + 50) = 2 × 150 = 300 m",
      difficulty: 'facile',
      type: 'longueur',
      steps: [
        "Je calcule le périmètre : 2 × (longueur + largeur)",
        "Je calcule : 2 × (100 m + 50 m) = 2 × 150 m = 300 m"
      ]
    },
    {
      id: 16,
      title: "Escalier",
      question: "Un escalier a 20 marches. Chaque marche mesure 18 cm de haut. Quelle est la hauteur totale de l'escalier ?",
      answer: "360",
      unit: "cm",
      explanation: "Hauteur totale = 20 × 18 cm = 360 cm",
      difficulty: 'facile',
      type: 'longueur',
      steps: [
        "Je calcule la hauteur totale : nombre de marches × hauteur d'une marche",
        "Je calcule : 20 × 18 cm = 360 cm"
      ]
    },
    {
      id: 17,
      title: "Corde à sauter",
      question: "Marie a une corde de 2,5 m. Elle la coupe en 5 morceaux égaux. Quelle est la longueur de chaque morceau ?",
      answer: "50",
      unit: "cm",
      explanation: "2,5 m = 250 cm, donc 250 cm ÷ 5 = 50 cm par morceau",
      difficulty: 'moyen',
      type: 'longueur',
      steps: [
        "Je convertis 2,5 m en cm : 2,5 m = 250 cm",
        "Je calcule la longueur d'un morceau : 250 cm ÷ 5 = 50 cm"
      ]
    },
    {
      id: 18,
      title: "Parcours vélo",
      question: "Paul fait du vélo. Il parcourt 1,5 km pour aller au parc, puis 800 m dans le parc, puis 1,5 km pour rentrer. Quelle distance totale a-t-il parcourue ?",
      answer: "3800",
      unit: "m",
      explanation: "1,5 km + 800 m + 1,5 km = 1500 m + 800 m + 1500 m = 3800 m",
      difficulty: 'moyen',
      type: 'longueur',
      steps: [
        "Je convertis les km en m : 1,5 km = 1500 m",
        "Je calcule la distance totale : 1500 m + 800 m + 1500 m = 3800 m"
      ]
    },
    
    // Problèmes de masses inspirés des exercices
    {
      id: 19,
      title: "Sucre et farine",
      question: "Marie a acheté 2 kg de sucre et 3 kg de farine. Quelle est la masse totale de ses achats ?",
      answer: "5",
      unit: "kg",
      explanation: "Masse totale = 2 kg + 3 kg = 5 kg",
      difficulty: 'facile',
      type: 'masse',
      steps: [
        "Je additionne les masses : 2 kg + 3 kg",
        "Je calcule : 2 + 3 = 5 kg"
      ]
    },
    {
      id: 20,
      title: "Boîtes de conserve",
      question: "Une boîte de sucre contient 3 étages de 54 morceaux. Chaque morceau pèse 4 g. Quelle est la masse totale de sucre ?",
      answer: "648",
      unit: "g",
      explanation: "Nombre total = 3 × 54 = 162 morceaux, puis 162 × 4 g = 648 g",
      difficulty: 'moyen',
      type: 'masse',
      steps: [
        "Je calcule le nombre total de morceaux : 3 × 54 = 162 morceaux",
        "Je calcule la masse totale : 162 × 4 g = 648 g"
      ]
    },
    {
      id: 21,
      title: "Cartons de lait",
      question: "Comment faire une caisse avec 24 boîtes de conserve pesant chacune 450 g et 16 boîtes pesant chacune 725 g ?",
      answer: "22400",
      unit: "g",
      explanation: "Masse = (24 × 450) + (16 × 725) = 10800 + 11600 = 22400 g",
      difficulty: 'difficile',
      type: 'masse',
      steps: [
        "Je calcule la masse des 24 boîtes : 24 × 450 g = 10800 g",
        "Je calcule la masse des 16 boîtes : 16 × 725 g = 11600 g",
        "Je calcule la masse totale : 10800 g + 11600 g = 22400 g"
      ]
    },
    {
      id: 22,
      title: "Transport de cartons",
      question: "Un transporteur doit livrer 100 cartons pesant chacun 8 kg. Le camion peut transporter 1 tonne au maximum. Combien de voyages faut-il ?",
      answer: "1",
      unit: "voyage",
      explanation: "Masse totale = 100 × 8 kg = 800 kg = 0,8 t < 1 t, donc 1 voyage suffit",
      difficulty: 'difficile',
      type: 'masse',
      steps: [
        "Je calcule la masse totale : 100 × 8 kg = 800 kg",
        "Je convertis en tonnes : 800 kg = 0,8 t",
        "Je compare : 0,8 t < 1 t, donc 1 voyage suffit"
      ]
    },
    {
      id: 23,
      title: "Sacs de pommes de terre",
      question: "Un fermier a récolté 2,5 tonnes de pommes de terre. Il veut les conditionner en sacs de 25 kg. Combien de sacs peut-il remplir ?",
      answer: "100",
      unit: "sacs",
      explanation: "2,5 t = 2500 kg, donc 2500 kg ÷ 25 kg = 100 sacs",
      difficulty: 'moyen',
      type: 'masse',
      steps: [
        "Je convertis en kg : 2,5 t = 2500 kg",
        "Je calcule le nombre de sacs : 2500 kg ÷ 25 kg = 100 sacs"
      ]
    },
    {
      id: 24,
      title: "Poids d'un animal",
      question: "Un éléphant pèse 4,5 tonnes. Combien pèse-t-il en kilogrammes ?",
      answer: "4500",
      unit: "kg",
      explanation: "4,5 t = 4,5 × 1000 = 4500 kg",
      difficulty: 'facile',
      type: 'masse',
      steps: [
        "Je sais que 1 t = 1000 kg",
        "Je calcule : 4,5 × 1000 = 4500 kg"
      ]
    },
    {
      id: 25,
      title: "Recette de gâteau",
      question: "Pour faire un gâteau, il faut 250 g de farine, 200 g de sucre, 100 g de beurre et 3 œufs de 60 g chacun. Quelle est la masse totale des ingrédients ?",
      answer: "730",
      unit: "g",
      explanation: "Masse = 250 + 200 + 100 + (3 × 60) = 250 + 200 + 100 + 180 = 730 g",
      difficulty: 'moyen',
      type: 'masse',
      steps: [
        "Je calcule la masse des œufs : 3 × 60 g = 180 g",
        "Je additionne tout : 250 + 200 + 100 + 180 = 730 g"
      ]
    },
    {
      id: 26,
      title: "Colis postal",
      question: "Un colis contient 8 livres de 350 g chacun et 4 cahiers de 125 g chacun. Quelle est la masse totale du colis ?",
      answer: "3300",
      unit: "g",
      explanation: "Masse = (8 × 350) + (4 × 125) = 2800 + 500 = 3300 g",
      difficulty: 'moyen',
      type: 'masse',
      steps: [
        "Je calcule la masse des livres : 8 × 350 g = 2800 g",
        "Je calcule la masse des cahiers : 4 × 125 g = 500 g",
        "Je calcule la masse totale : 2800 g + 500 g = 3300 g"
      ]
    },
    
    // Problèmes de contenances inspirés des exercices
    {
      id: 27,
      title: "Bouteille de jus de fruits",
      question: "Avec une bouteille de jus de fruits de 1,5 L, Carla a rempli 8 verres identiques. Quelle est en cL la capacité d'un verre ?",
      answer: "18,75",
      unit: "cL",
      explanation: "1,5 L = 150 cL, donc 150 cL ÷ 8 = 18,75 cL par verre",
      difficulty: 'moyen',
      type: 'contenance',
      steps: [
        "Je convertis 1,5 L en cL : 1,5 L = 150 cL",
        "Je calcule la capacité d'un verre : 150 cL ÷ 8 = 18,75 cL"
      ]
    },
    {
      id: 28,
      title: "Camion-citerne",
      question: "Un camion-citerne contenant 8700 litres d'essence vient ravitailler une station-service. On remplit trois cuves de 2853 litres chacune. Quelle quantité reste-t-il dans le camion-citerne ?",
      answer: "141",
      unit: "L",
      explanation: "Quantité livrée = 3 × 2853 = 8559 L, donc reste = 8700 - 8559 = 141 L",
      difficulty: 'difficile',
      type: 'contenance',
      steps: [
        "Je calcule la quantité livrée : 3 × 2853 L = 8559 L",
        "Je calcule ce qui reste : 8700 L - 8559 L = 141 L"
      ]
    },
    {
      id: 29,
      title: "Lait aromatisé",
      question: "Cécile a préparé 3 litres de lait aromatisé pour fabriquer des yaourts. Elle remplit avec ce lait des pots de 160 mL. Combien de pots pourra-t-elle remplir ?",
      answer: "18",
      unit: "pots",
      explanation: "3 L = 3000 mL, donc 3000 mL ÷ 160 mL = 18,75 soit 18 pots complets",
      difficulty: 'moyen',
      type: 'contenance',
      steps: [
        "Je convertis 3 L en mL : 3 L = 3000 mL",
        "Je calcule le nombre de pots : 3000 mL ÷ 160 mL = 18,75",
        "Je prends la partie entière : 18 pots complets"
      ]
    },
    {
      id: 30,
      title: "Production de jus de raisin",
      question: "Grâce à sa petite vigne, M. Meucat a fabriqué 1 hL de jus de raisin. Combien pourra-t-il remplir de bouteilles de 75 cL ?",
      answer: "133",
      unit: "bouteilles",
      explanation: "1 hL = 100 L = 10000 cL, donc 10000 cL ÷ 75 cL = 133,33 soit 133 bouteilles",
      difficulty: 'difficile',
      type: 'contenance',
      steps: [
        "Je convertis 1 hL en cL : 1 hL = 100 L = 10000 cL",
        "Je calcule le nombre de bouteilles : 10000 cL ÷ 75 cL = 133,33",
        "Je prends la partie entière : 133 bouteilles"
      ]
    },
    {
      id: 31,
      title: "Réservoir d'eau",
      question: "Un réservoir d'eau de pluie contient 2,4 hL d'eau. On utilise 150 L pour arroser le jardin. Quelle quantité d'eau reste-t-il en litres ?",
      answer: "90",
      unit: "L",
      explanation: "2,4 hL = 240 L, donc 240 L - 150 L = 90 L",
      difficulty: 'facile',
      type: 'contenance',
      steps: [
        "Je convertis 2,4 hL en L : 2,4 hL = 240 L",
        "Je calcule ce qui reste : 240 L - 150 L = 90 L"
      ]
    },
    {
      id: 32,
      title: "Bidons d'huile",
      question: "Un garage a commandé 5 bidons d'huile de 2 L chacun et 3 bidons de 5 L chacun. Quelle est la quantité totale d'huile commandée ?",
      answer: "25",
      unit: "L",
      explanation: "Quantité = (5 × 2) + (3 × 5) = 10 + 15 = 25 L",
      difficulty: 'facile',
      type: 'contenance',
      steps: [
        "Je calcule la quantité des bidons de 2 L : 5 × 2 L = 10 L",
        "Je calcule la quantité des bidons de 5 L : 3 × 5 L = 15 L",
        "Je calcule la quantité totale : 10 L + 15 L = 25 L"
      ]
    },
    {
      id: 33,
      title: "Piscine gonflable",
      question: "Une piscine gonflable a une capacité de 3,2 m³. Combien faut-il de seaux de 8 L pour la remplir entièrement ?",
      answer: "400",
      unit: "seaux",
      explanation: "3,2 m³ = 3200 L, donc 3200 L ÷ 8 L = 400 seaux",
      difficulty: 'difficile',
      type: 'contenance',
      steps: [
        "Je convertis 3,2 m³ en L : 3,2 m³ = 3200 L",
        "Je calcule le nombre de seaux : 3200 L ÷ 8 L = 400 seaux"
      ]
    },
    {
      id: 34,
      title: "Préparation de sirop",
      question: "Pour faire du sirop, on mélange 1,5 L d'eau avec 0,8 L de concentré de fruit. On verse le tout dans des bouteilles de 25 cL. Combien de bouteilles peut-on remplir ?",
      answer: "9",
      unit: "bouteilles",
      explanation: "Volume total = 1,5 + 0,8 = 2,3 L = 230 cL, donc 230 cL ÷ 25 cL = 9,2 soit 9 bouteilles",
      difficulty: 'moyen',
      type: 'contenance',
      steps: [
        "Je calcule le volume total : 1,5 L + 0,8 L = 2,3 L",
        "Je convertis en cL : 2,3 L = 230 cL",
        "Je calcule le nombre de bouteilles : 230 cL ÷ 25 cL = 9,2 soit 9 bouteilles"
      ]
    },

    // Problèmes de durée
    {
      id: 35,
      title: "Cours de musique",
      question: "Le cours de piano de Léa commence à 16h30 et se termine à 17h45. Combien de temps dure le cours ?",
      answer: "1h15",
      unit: "",
      explanation: "De 16h30 à 17h00 = 30 min, puis de 17h00 à 17h45 = 45 min. Total : 30 + 45 = 75 min = 1h15",
      difficulty: 'facile',
      type: 'duree',
      steps: [
        "Je vais d'abord à l'heure ronde : 16h30 → 17h00 = 30 minutes",
        "J'ajoute le temps restant : 17h00 → 17h45 = 45 minutes",
        "J'additionne : 30 min + 45 min = 75 min = 1h15"
      ]
    },
    {
      id: 36,
      title: "Film au cinéma",
      question: "Un film commence à 20h15 et dure 2h30. À quelle heure se termine-t-il ?",
      answer: "22h45",
      unit: "",
      explanation: "20h15 + 2h30 : 20h15 → 21h00 (45 min) + 1h45 restant = 22h45",
      difficulty: 'facile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 20h15 → 21h00 = 45 minutes ajoutées",
        "Il me reste : 2h30 - 45 min = 1h45 à ajouter",
        "Donc : 21h00 + 1h45 = 22h45"
      ]
    },
    {
      id: 37,
      title: "Trajet en bus",
      question: "Marie prend le bus à 7h45 pour aller à l'école. Le trajet dure 25 minutes. À quelle heure arrive-t-elle ?",
      answer: "8h10",
      unit: "",
      explanation: "7h45 + 25 min : 7h45 → 8h00 (15 min) + 10 min restant = 8h10",
      difficulty: 'facile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 7h45 → 8h00 = 15 minutes",
        "Il me reste : 25 min - 15 min = 10 minutes",
        "Donc : 8h00 + 10 min = 8h10"
      ]
    },
    {
      id: 38,
      title: "Récréation",
      question: "La récréation dure 15 minutes et se termine à 10h30. À quelle heure a-t-elle commencé ?",
      answer: "10h15",
      unit: "",
      explanation: "Si elle se termine à 10h30 et dure 15 min, elle a commencé à 10h30 - 15 min = 10h15",
      difficulty: 'facile',
      type: 'duree',
      steps: [
        "Je dois soustraire 15 minutes à 10h30",
        "10h30 - 15 min = 10h15"
      ]
    },
    {
      id: 39,
      title: "Temps de cuisson",
      question: "Un gâteau doit cuire 1h20. Si je l'enfourne à 14h40, à quelle heure dois-je le sortir ?",
      answer: "16h00",
      unit: "",
      explanation: "14h40 + 1h20 : 14h40 → 15h00 (20 min) + 1h restant = 16h00",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 14h40 → 15h00 = 20 minutes ajoutées",
        "Il me reste : 1h20 - 20 min = 1h à ajouter",
        "Donc : 15h00 + 1h = 16h00"
      ]
    },
    {
      id: 40,
      title: "Émission télévisée",
      question: "Une émission a commencé à 19h25 et s'est terminée à 21h10. Combien de temps a-t-elle duré ?",
      answer: "1h45",
      unit: "",
      explanation: "19h25 → 20h00 (35 min) + 20h00 → 21h00 (1h) + 21h00 → 21h10 (10 min) = 1h45",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 19h25 → 20h00 = 35 minutes",
        "Je compte les heures entières : 20h00 → 21h00 = 1 heure",
        "J'ajoute les minutes finales : 21h00 → 21h10 = 10 minutes",
        "Total : 35 min + 1h + 10 min = 1h45"
      ]
    },
    {
      id: 41,
      title: "Devoirs",
      question: "Tom fait ses devoirs de 18h15 à 19h40. Combien de temps a-t-il travaillé ?",
      answer: "1h25",
      unit: "",
      explanation: "18h15 → 19h00 (45 min) + 19h00 → 19h40 (40 min) = 1h25",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 18h15 → 19h00 = 45 minutes",
        "J'ajoute le temps restant : 19h00 → 19h40 = 40 minutes",
        "Total : 45 min + 40 min = 85 min = 1h25"
      ]
    },
    {
      id: 42,
      title: "Match de football",
      question: "Un match de foot commence à 15h30 et dure 90 minutes. À quelle heure se termine-t-il ?",
      answer: "17h00",
      unit: "",
      explanation: "15h30 + 90 min = 15h30 + 1h30 = 17h00",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je convertis 90 minutes : 90 min = 1h30",
        "J'ajoute à l'heure de début : 15h30 + 1h30 = 17h00"
      ]
    },
    {
      id: 43,
      title: "Voyage en train",
      question: "Un train part à 8h45 et arrive à 11h20. Combien de temps dure le voyage ?",
      answer: "2h35",
      unit: "",
      explanation: "8h45 → 9h00 (15 min) + 9h00 → 11h00 (2h) + 11h00 → 11h20 (20 min) = 2h35",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 8h45 → 9h00 = 15 minutes",
        "Je compte les heures entières : 9h00 → 11h00 = 2 heures",
        "J'ajoute les minutes finales : 11h00 → 11h20 = 20 minutes",
        "Total : 15 min + 2h + 20 min = 2h35"
      ]
    },
    {
      id: 44,
      title: "Cours de natation",
      question: "Le cours de natation dure 45 minutes et se termine à 16h15. À quelle heure a-t-il commencé ?",
      answer: "15h30",
      unit: "",
      explanation: "16h15 - 45 min : 16h15 → 16h00 (15 min) - 30 min restant = 15h30",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 16h15 → 16h00 = 15 minutes soustraites",
        "Il me reste : 45 min - 15 min = 30 minutes à soustraire",
        "Donc : 16h00 - 30 min = 15h30"
      ]
    },
    {
      id: 45,
      title: "Spectacle de danse",
      question: "Un spectacle commence à 20h45 et dure 2h15. À quelle heure se termine-t-il ?",
      answer: "23h00",
      unit: "",
      explanation: "20h45 → 21h00 (15 min) + 2h restant = 23h00",
      difficulty: 'difficile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 20h45 → 21h00 = 15 minutes ajoutées",
        "Il me reste : 2h15 - 15 min = 2h à ajouter",
        "Donc : 21h00 + 2h = 23h00"
      ]
    },
    {
      id: 46,
      title: "Atelier cuisine",
      question: "Un atelier cuisine dure 1h50 et se termine à 12h10. À quelle heure a-t-il commencé ?",
      answer: "10h20",
      unit: "",
      explanation: "12h10 - 1h50 : 12h10 → 12h00 (10 min) - 1h40 restant = 10h20",
      difficulty: 'difficile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 12h10 → 12h00 = 10 minutes soustraites",
        "Il me reste : 1h50 - 10 min = 1h40 à soustraire",
        "Donc : 12h00 - 1h40 = 10h20"
      ]
    },
    {
      id: 47,
      title: "Journée d'école",
      question: "L'école commence à 8h30 et se termine à 16h45. Combien de temps dure la journée d'école ?",
      answer: "8h15",
      unit: "",
      explanation: "8h30 → 9h00 (30 min) + 9h00 → 16h00 (7h) + 16h00 → 16h45 (45 min) = 8h15",
      difficulty: 'difficile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 8h30 → 9h00 = 30 minutes",
        "Je compte les heures entières : 9h00 → 16h00 = 7 heures",
        "J'ajoute les minutes finales : 16h00 → 16h45 = 45 minutes",
        "Total : 30 min + 7h + 45 min = 7h75 min = 8h15"
      ]
    },
    {
      id: 48,
      title: "Sortie au parc",
      question: "Paul part au parc à 14h20 et y reste 2h40. À quelle heure rentre-t-il ?",
      answer: "17h00",
      unit: "",
      explanation: "14h20 → 15h00 (40 min) + 2h restant = 17h00",
      difficulty: 'difficile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 14h20 → 15h00 = 40 minutes ajoutées",
        "Il me reste : 2h40 - 40 min = 2h à ajouter",
        "Donc : 15h00 + 2h = 17h00"
      ]
    },

    // 15 nouveaux problèmes de durées
    {
      id: 49,
      title: "Déjeuner à la cantine",
      question: "Le déjeuner à la cantine commence à 12h00 et se termine à 13h15. Combien de temps dure le déjeuner ?",
      answer: "1h15",
      unit: "",
      explanation: "De 12h00 à 13h15 : 1h15 min",
      difficulty: 'facile',
      type: 'duree',
      steps: [
        "Je calcule la différence : 13h15 - 12h00",
        "Je compte : 1h15 min"
      ]
    },
    {
      id: 50,
      title: "Activité piscine",
      question: "L'activité piscine dure 50 minutes et commence à 14h25. À quelle heure se termine-t-elle ?",
      answer: "15h15",
      unit: "",
      explanation: "14h25 → 15h00 (35 min) + 15 min restant = 15h15",
      difficulty: 'facile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 14h25 → 15h00 = 35 minutes ajoutées",
        "Il me reste : 50 min - 35 min = 15 minutes à ajouter",
        "Donc : 15h00 + 15 min = 15h15"
      ]
    },
    {
      id: 51,
      title: "Pause goûter",
      question: "La pause goûter dure 20 minutes et se termine à 15h35. À quelle heure a-t-elle commencé ?",
      answer: "15h15",
      unit: "",
      explanation: "15h35 - 20 min = 15h15",
      difficulty: 'facile',
      type: 'duree',
      steps: [
        "Je dois soustraire 20 minutes à 15h35",
        "15h35 - 20 min = 15h15"
      ]
    },
    {
      id: 52,
      title: "Entraînement de sport",
      question: "L'entraînement de basket commence à 16h40 et se termine à 18h25. Combien de temps dure l'entraînement ?",
      answer: "1h45",
      unit: "",
      explanation: "16h40 → 17h00 (20 min) + 17h00 → 18h00 (1h) + 18h00 → 18h25 (25 min) = 1h45",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 16h40 → 17h00 = 20 minutes",
        "Je compte les heures entières : 17h00 → 18h00 = 1 heure",
        "J'ajoute les minutes finales : 18h00 → 18h25 = 25 minutes",
        "Total : 20 min + 1h + 25 min = 1h45"
      ]
    },
    {
      id: 53,
      title: "Atelier lecture",
      question: "L'atelier lecture dure 1h30 et se termine à 11h45. À quelle heure a-t-il commencé ?",
      answer: "10h15",
      unit: "",
      explanation: "11h45 - 1h30 : 11h45 → 11h00 (45 min) - 45 min restant = 10h15",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 11h45 → 11h00 = 45 minutes soustraites",
        "Il me reste : 1h30 - 45 min = 45 minutes à soustraire",
        "Donc : 11h00 - 45 min = 10h15"
      ]
    },
    {
      id: 54,
      title: "Visite au musée",
      question: "La visite au musée commence à 9h15 et dure 2h20. À quelle heure se termine-t-elle ?",
      answer: "11h35",
      unit: "",
      explanation: "9h15 → 10h00 (45 min) + 1h35 restant = 11h35",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 9h15 → 10h00 = 45 minutes ajoutées",
        "Il me reste : 2h20 - 45 min = 1h35 à ajouter",
        "Donc : 10h00 + 1h35 = 11h35"
      ]
    },
    {
      id: 55,
      title: "Séance de cinéma",
      question: "Une séance de cinéma dure 2h15 et se termine à 21h30. À quelle heure a-t-elle commencé ?",
      answer: "19h15",
      unit: "",
      explanation: "21h30 - 2h15 : 21h30 → 21h00 (30 min) - 1h45 restant = 19h15",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 21h30 → 21h00 = 30 minutes soustraites",
        "Il me reste : 2h15 - 30 min = 1h45 à soustraire",
        "Donc : 21h00 - 1h45 = 19h15"
      ]
    },
    {
      id: 56,
      title: "Cours de danse",
      question: "Emma prend des cours de danse de 15h20 à 17h05. Combien de temps dure le cours ?",
      answer: "1h45",
      unit: "",
      explanation: "15h20 → 16h00 (40 min) + 16h00 → 17h00 (1h) + 17h00 → 17h05 (5 min) = 1h45",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 15h20 → 16h00 = 40 minutes",
        "Je compte les heures entières : 16h00 → 17h00 = 1 heure",
        "J'ajoute les minutes finales : 17h00 → 17h05 = 5 minutes",
        "Total : 40 min + 1h + 5 min = 1h45"
      ]
    },
    {
      id: 57,
      title: "Trajet bus scolaire",
      question: "Le bus scolaire part à 7h52 et arrive à l'école à 8h37. Combien de temps dure le trajet ?",
      answer: "45min",
      unit: "",
      explanation: "7h52 → 8h00 (8 min) + 8h00 → 8h37 (37 min) = 45 min",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 7h52 → 8h00 = 8 minutes",
        "J'ajoute le temps restant : 8h00 → 8h37 = 37 minutes",
        "Total : 8 min + 37 min = 45 min"
      ]
    },
    {
      id: 58,
      title: "Préparation du repas",
      question: "Maman commence à préparer le repas à 17h45 et termine à 19h20. Combien de temps a pris la préparation ?",
      answer: "1h35",
      unit: "",
      explanation: "17h45 → 18h00 (15 min) + 18h00 → 19h00 (1h) + 19h00 → 19h20 (20 min) = 1h35",
      difficulty: 'moyen',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 17h45 → 18h00 = 15 minutes",
        "Je compte les heures entières : 18h00 → 19h00 = 1 heure",
        "J'ajoute les minutes finales : 19h00 → 19h20 = 20 minutes",
        "Total : 15 min + 1h + 20 min = 1h35"
      ]
    },
    {
      id: 59,
      title: "Sortie vélo",
      question: "Lucas part faire du vélo à 13h25 et rentre à 16h10. Combien de temps a duré sa sortie ?",
      answer: "2h45",
      unit: "",
      explanation: "13h25 → 14h00 (35 min) + 14h00 → 16h00 (2h) + 16h00 → 16h10 (10 min) = 2h45",
      difficulty: 'difficile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 13h25 → 14h00 = 35 minutes",
        "Je compte les heures entières : 14h00 → 16h00 = 2 heures",
        "J'ajoute les minutes finales : 16h00 → 16h10 = 10 minutes",
        "Total : 35 min + 2h + 10 min = 2h45"
      ]
    },
    {
      id: 60,
      title: "Réunion parents-enseignants",
      question: "La réunion dure 3h15 et se termine à 20h45. À quelle heure a-t-elle commencé ?",
      answer: "17h30",
      unit: "",
      explanation: "20h45 - 3h15 : 20h45 → 20h00 (45 min) - 2h30 restant = 17h30",
      difficulty: 'difficile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 20h45 → 20h00 = 45 minutes soustraites",
        "Il me reste : 3h15 - 45 min = 2h30 à soustraire",
        "Donc : 20h00 - 2h30 = 17h30"
      ]
    },
    {
      id: 61,
      title: "Activité arts plastiques",
      question: "L'activité arts plastiques commence à 10h35 et dure 2h50. À quelle heure se termine-t-elle ?",
      answer: "13h25",
      unit: "",
      explanation: "10h35 → 11h00 (25 min) + 2h25 restant = 13h25",
      difficulty: 'difficile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 10h35 → 11h00 = 25 minutes ajoutées",
        "Il me reste : 2h50 - 25 min = 2h25 à ajouter",
        "Donc : 11h00 + 2h25 = 13h25"
      ]
    },
    {
      id: 62,
      title: "Jeu de société",
      question: "Les enfants jouent aux échecs de 14h15 à 16h40. Combien de temps a duré la partie ?",
      answer: "2h25",
      unit: "",
      explanation: "14h15 → 15h00 (45 min) + 15h00 → 16h00 (1h) + 16h00 → 16h40 (40 min) = 2h25",
      difficulty: 'difficile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 14h15 → 15h00 = 45 minutes",
        "Je compte les heures entières : 15h00 → 16h00 = 1 heure",
        "J'ajoute les minutes finales : 16h00 → 16h40 = 40 minutes",
        "Total : 45 min + 1h + 40 min = 2h25"
      ]
    },
    {
      id: 63,
      title: "Festivité d'école",
      question: "La fête de l'école commence à 15h30 et dure 4h25. À quelle heure se termine-t-elle ?",
      answer: "19h55",
      unit: "",
      explanation: "15h30 → 16h00 (30 min) + 3h55 restant = 19h55",
      difficulty: 'difficile',
      type: 'duree',
      steps: [
        "Je vais à l'heure ronde : 15h30 → 16h00 = 30 minutes ajoutées",
        "Il me reste : 4h25 - 30 min = 3h55 à ajouter",
        "Donc : 16h00 + 3h55 = 19h55"
      ]
    }
  ];

  const filteredProblems = problemType === 'tous' 
    ? problems 
    : problems.filter(prob => prob.type === problemType);

  const currentProb = filteredProblems[currentProblem];

  useEffect(() => {
    if (currentProblem >= filteredProblems.length) {
      setCurrentProblem(0);
    }
  }, [problemType, currentProblem, filteredProblems.length]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    if (answer === currentProb.answer || parseFloat(answer) === parseFloat(currentProb.answer)) {
      setScore(score + 1);
    }
  };

  const nextProblem = () => {
    setCurrentProblem((prev) => (prev + 1) % filteredProblems.length);
    setShowAnswer(false);
    setSelectedAnswer('');
    setShowSteps(false);
  };

  const prevProblem = () => {
    setCurrentProblem((prev) => (prev - 1 + filteredProblems.length) % filteredProblems.length);
    setShowAnswer(false);
    setSelectedAnswer('');
    setShowSteps(false);
  };

  const runAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 5) {
          clearInterval(interval);
          setIsAnimating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/chapitre/cm1-grandeurs-mesures" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors">
              <ArrowLeft size={20} />
              <span>Retour au chapitre</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                🧩
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Problèmes</h1>
                <p className="text-gray-600 text-lg">
                  Résoudre des problèmes avec les grandeurs et mesures
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('methode')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'methode'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📖 Méthode
          </button>
          <button
            onClick={() => setActiveTab('exercices')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'exercices'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ✏️ Problèmes ({filteredProblems.length})
          </button>
        </div>

        {/* Contenu Méthode */}
        {activeTab === 'methode' && (
          <div className="space-y-8">
            {/* Section 1: Méthode de résolution */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔍 Méthode de résolution</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-4">📝 Les 4 étapes</h3>
                  <ol className="space-y-2 text-blue-700">
                    <li><strong>1.</strong> Je lis et je comprends</li>
                    <li><strong>2.</strong> Je cherche les données</li>
                    <li><strong>3.</strong> Je calcule</li>
                    <li><strong>4.</strong> Je vérifie le résultat</li>
                  </ol>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-4">🤔 Questions à se poser</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Qu'est-ce que je cherche ?</li>
                    <li>• Quelles sont les données ?</li>
                    <li>• Quelle opération utiliser ?</li>
                    <li>• Le résultat est-il logique ?</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: Animation résolution */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎬 Animation résolution</h2>
              
              <div className="flex justify-center mb-6">
                <button
                  onClick={runAnimation}
                  disabled={isAnimating}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 transition-all"
                >
                  <Play size={20} className="inline mr-2" />
                  {isAnimating ? 'Animation en cours...' : 'Voir l\'animation'}
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4">Exemple: Les pommes coûtent 3€ le kg. Combien coûtent 2,5 kg ?</h3>
                
                <div className="space-y-4">
                    <div className="bg-blue-100 p-3 rounded border-l-4 border-blue-500">
                      <p className="text-gray-800"><strong>1. Je comprends:</strong> Je veux le prix total de 2,5 kg de pommes</p>
                    </div>
                  </div>
                  
                    <div className="bg-green-100 p-3 rounded border-l-4 border-green-500">
                      <p className="text-gray-800"><strong>2. Les données:</strong> Prix = 3€/kg, Quantité = 2,5 kg</p>
                    </div>
                  </div>
                  
                    <div className="bg-orange-100 p-3 rounded border-l-4 border-orange-500">
                      <p className="text-gray-800"><strong>3. Je calcule:</strong> 3€ × 2,5 = 7,5€</p>
                    </div>
                  </div>
                  
                    <div className="bg-purple-100 p-3 rounded border-l-4 border-purple-500">
                      <p className="text-gray-800"><strong>4. Je vérifie:</strong> 7,5€ pour 2,5 kg, c'est logique</p>
                    </div>
                  </div>
                  
                    <div className="bg-emerald-100 p-3 rounded border-l-4 border-emerald-500">
                      <p className="text-gray-800"><strong>Réponse:</strong> 2,5 kg de pommes coûtent 7,5€</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Types de problèmes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Types de problèmes</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-2">👨‍🍳 Recettes</h3>
                    <p className="text-sm text-blue-700">Adapter les quantités selon le nombre de personnes</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-bold text-green-800 mb-2">🛒 Achats</h3>
                    <p className="text-sm text-green-700">Calculer des prix, comparer des offres</p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-bold text-orange-800 mb-2">🚗 Voyages</h3>
                    <p className="text-sm text-orange-700">Calculer des distances, des durées, des consommations</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-bold text-purple-800 mb-2">🏗️ Construction</h3>
                    <p className="text-sm text-purple-700">Calculer des aires, des volumes, des quantités</p>
                  </div>
                  
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h3 className="font-bold text-pink-800 mb-2">⚖️ Proportionnalité</h3>
                    <p className="text-sm text-pink-700">Problèmes de règle de trois, de dosages</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-bold text-indigo-800 mb-2">🔄 Conversions</h3>
                    <p className="text-sm text-indigo-700">Changer d'unités dans un contexte concret</p>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h3 className="font-bold text-teal-800 mb-2">📏 Longueurs</h3>
                    <p className="text-sm text-teal-700">Mesurer, calculer distances, périmètres, hauteurs</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="font-bold text-amber-800 mb-2">⚖️ Masses</h3>
                    <p className="text-sm text-amber-700">Peser, additionner, convertir kg/g/t</p>
                  </div>
                  
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <h3 className="font-bold text-cyan-800 mb-2">🥤 Contenances</h3>
                    <p className="text-sm text-cyan-700">Mesurer, verser, convertir L/cL/mL/hL</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-bold text-red-800 mb-2">⏰ Durées</h3>
                    <p className="text-sm text-red-700">Calculer durées, horaires de début/fin</p>
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
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">🎯 Filtrer les problèmes</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'tous', label: 'Tous', color: 'bg-gray-500' },
                  { id: 'longueur', label: 'Longueurs', color: 'bg-teal-500' },
                  { id: 'masse', label: 'Masses', color: 'bg-amber-500' },
                  { id: 'contenance', label: 'Contenances', color: 'bg-cyan-500' },
                  { id: 'duree', label: 'Durées', color: 'bg-red-500' },
                  { id: 'recette', label: 'Recettes', color: 'bg-blue-500' },
                  { id: 'shopping', label: 'Achats', color: 'bg-green-500' },
                  { id: 'voyage', label: 'Voyages', color: 'bg-orange-500' },
                  { id: 'construction', label: 'Construction', color: 'bg-purple-500' },
                  { id: 'proportionnalite', label: 'Proportionnalité', color: 'bg-pink-500' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setProblemType(type.id as any)}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                      problemType === type.id ? type.color : 'bg-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Problème actuel */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Problème {currentProblem + 1} / {filteredProblems.length}
                  </h2>
                  <h3 className="text-lg font-semibold text-emerald-600 mt-1">
                    {currentProb.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentProb.difficulty === 'facile' ? 'bg-green-100 text-green-800' :
                      currentProb.difficulty === 'moyen' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentProb.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {currentProb.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">{score}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{currentProb.question}</h3>
                
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Votre réponse"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-all"
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
                    <h4 className="font-bold text-blue-800 mb-2">📝 Étapes de résolution :</h4>
                    <ol className="space-y-1 text-blue-700">
                      {currentProb.steps.map((step, index) => (
                        <li key={index} className="text-sm">
                          <strong>{index + 1}.</strong> {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {showAnswer && (
                <div className={`p-4 rounded-lg mb-6 ${
                  selectedAnswer === currentProb.answer || parseFloat(selectedAnswer) === parseFloat(currentProb.answer)
                    ? 'bg-green-100 border border-green-200'
                    : 'bg-red-100 border border-red-200'
                }`}>
                  <p className="font-bold mb-2 text-gray-800">
                    {selectedAnswer === currentProb.answer || parseFloat(selectedAnswer) === parseFloat(currentProb.answer)
                      ? '✅ Bonne réponse !'
                      : '❌ Réponse incorrecte'}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong>Réponse correcte :</strong> {currentProb.answer} {currentProb.unit}
                  </p>
                  <p className="text-sm mt-2 text-gray-800">
                    <strong>Explication :</strong> {currentProb.explanation}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={prevProblem}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  ← Précédent
                </button>
                <button
                  onClick={nextProblem}
                  className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-all"
                >
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 