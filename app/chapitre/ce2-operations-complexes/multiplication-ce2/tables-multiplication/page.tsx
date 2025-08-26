'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb, Play, Pause } from 'lucide-react';

// Tables de multiplication pour CE2 - Toutes les tables de 1 à 10
const tablesData = {
  table1: {
    name: "Table de 1",
    icon: "1️⃣",
    color: "gray",
    trick: "La plus simple ! Multiplier par 1, c'est garder le même nombre !",
    pattern: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10... Le nombre reste identique !",
    realLifeExample: "1 bonbon × 3 = 3 bonbons, 1 euro × 5 = 5 euros...",
    multiplications: [
      { operation: "1 × 1", result: 1, visual: "🍎", explanation: "1 pomme = 1 pomme" },
      { operation: "1 × 2", result: 2, visual: "🍎🍎", explanation: "1 fois 2 pommes = 2 pommes" },
      { operation: "1 × 3", result: 3, visual: "🍎🍎🍎", explanation: "1 fois 3 pommes = 3 pommes" },
      { operation: "1 × 4", result: 4, visual: "🍎🍎🍎🍎", explanation: "1 fois 4 pommes = 4 pommes" },
      { operation: "1 × 5", result: 5, visual: "🍎🍎🍎🍎🍎", explanation: "1 fois 5 pommes = 5 pommes" },
      { operation: "1 × 6", result: 6, visual: "🍎🍎🍎🍎🍎🍎", explanation: "1 fois 6 pommes = 6 pommes" },
      { operation: "1 × 7", result: 7, visual: "🍎🍎🍎🍎🍎🍎🍎", explanation: "1 fois 7 pommes = 7 pommes" },
      { operation: "1 × 8", result: 8, visual: "🍎🍎🍎🍎🍎🍎🍎🍎", explanation: "1 fois 8 pommes = 8 pommes" },
      { operation: "1 × 9", result: 9, visual: "🍎🍎🍎🍎🍎🍎🍎🍎🍎", explanation: "1 fois 9 pommes = 9 pommes" },
      { operation: "1 × 10", result: 10, visual: "🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎", explanation: "1 fois 10 pommes = 10 pommes" }
    ]
  },
  table2: {
    name: "Table de 2",
    icon: "✌️",
    color: "green",
    trick: "Multiplier par 2, c'est comme doubler ! Tu peux compter de 2 en 2 : 2, 4, 6, 8, 10...",
    pattern: "Tous les résultats sont des nombres pairs (qui finissent par 0, 2, 4, 6, 8)",
    realLifeExample: "2 chaussettes par pied, 2 roues par vélo, 2 yeux par personne...",
    multiplications: [
      { operation: "2 × 1", result: 2, visual: "👟👟", explanation: "1 paire de chaussures = 2 chaussures" },
      { operation: "2 × 2", result: 4, visual: "👟👟 👟👟", explanation: "2 paires = 4 chaussures" },
      { operation: "2 × 3", result: 6, visual: "👟👟 👟👟 👟👟", explanation: "3 paires = 6 chaussures" },
      { operation: "2 × 4", result: 8, visual: "🚲🚲🚲🚲", explanation: "4 vélos = 8 roues (2 roues par vélo)" },
      { operation: "2 × 5", result: 10, visual: "👥👥👥👥👥", explanation: "5 personnes = 10 yeux (2 yeux par personne)" },
      { operation: "2 × 6", result: 12, visual: "🥚🥚🥚🥚🥚🥚", explanation: "6 boîtes de 2 œufs = 12 œufs" },
      { operation: "2 × 7", result: 14, visual: "✋✋✋✋✋✋✋", explanation: "7 mains = 14 doigts (sans les pouces !)" },
      { operation: "2 × 8", result: 16, visual: "🐾🐾🐾🐾🐾🐾🐾🐾", explanation: "8 chats = 16 pattes avant" },
      { operation: "2 × 9", result: 18, visual: "👂👂👂👂👂👂👂👂👂", explanation: "9 personnes = 18 oreilles" },
      { operation: "2 × 10", result: 20, visual: "🦶🦶🦶🦶🦶🦶🦶🦶🦶🦶", explanation: "10 personnes = 20 pieds" }
    ]
  },
  table3: {
    name: "Table de 3",
    icon: "🔺",
    color: "orange",
    trick: "Multiplier par 3, c'est compter de 3 en 3 ! Astuce : la somme des chiffres du résultat est toujours divisible par 3.",
    pattern: "3, 6, 9, 12, 15, 18, 21, 24, 27, 30... Regarde : 1+2=3, 1+5=6, 2+1=3, 2+4=6...",
    realLifeExample: "3 roues sur un tricycle, 3 côtés d'un triangle, 3 repas par jour...",
    multiplications: [
      { operation: "3 × 1", result: 3, visual: "🔺", explanation: "1 triangle = 3 côtés" },
      { operation: "3 × 2", result: 6, visual: "🔺🔺", explanation: "2 triangles = 6 côtés" },
      { operation: "3 × 3", result: 9, visual: "🔺🔺🔺", explanation: "3 triangles = 9 côtés" },
      { operation: "3 × 4", result: 12, visual: "🚲🚲🚲🚲", explanation: "4 tricycles = 12 roues (3 roues par tricycle)" },
      { operation: "3 × 5", result: 15, visual: "🍽️🍽️🍽️🍽️🍽️", explanation: "5 personnes = 15 repas par jour (3 repas chacune)" },
      { operation: "3 × 6", result: 18, visual: "📐📐📐📐📐📐", explanation: "6 équerres = 18 angles droits (3 par équerre)" },
      { operation: "3 × 7", result: 21, visual: "🎪🎪🎪🎪🎪🎪🎪", explanation: "7 cirques = 21 pistes (3 pistes par cirque)" },
      { operation: "3 × 8", result: 24, visual: "📚📚📚📚📚📚📚📚", explanation: "8 livres = 24 chapitres (3 chapitres par livre)" },
      { operation: "3 × 9", result: 27, visual: "🎯🎯🎯🎯🎯🎯🎯🎯🎯", explanation: "9 jeux de fléchettes = 27 zones (3 zones par jeu)" },
      { operation: "3 × 10", result: 30, visual: "🏠🏠🏠🏠🏠🏠🏠🏠🏠🏠", explanation: "10 maisons = 30 étages (3 étages par maison)" }
    ]
  },
  table4: {
    name: "Table de 4",
    icon: "🔲",
    color: "purple",
    trick: "Multiplier par 4, c'est doubler deux fois ! 4 × 6 = (2 × 6) × 2 = 12 × 2 = 24",
    pattern: "Tous les résultats sont pairs : 4, 8, 12, 16, 20, 24, 28, 32, 36, 40...",
    realLifeExample: "4 pattes par chien, 4 roues par voiture, 4 saisons dans l'année...",
    multiplications: [
      { operation: "4 × 1", result: 4, visual: "🔲", explanation: "1 carré = 4 côtés" },
      { operation: "4 × 2", result: 8, visual: "🔲🔲", explanation: "2 carrés = 8 côtés" },
      { operation: "4 × 3", result: 12, visual: "🔲🔲🔲", explanation: "3 carrés = 12 côtés" },
      { operation: "4 × 4", result: 16, visual: "🚗🚗🚗🚗", explanation: "4 voitures = 16 roues (4 roues par voiture)" },
      { operation: "4 × 5", result: 20, visual: "🐕🐕🐕🐕🐕", explanation: "5 chiens = 20 pattes (4 pattes par chien)" },
      { operation: "4 × 6", result: 24, visual: "🏠🏠🏠🏠🏠🏠", explanation: "6 maisons = 24 fenêtres (4 fenêtres par maison)" },
      { operation: "4 × 7", result: 28, visual: "🌸🌸🌸🌸🌸🌸🌸", explanation: "7 fleurs = 28 pétales (4 pétales par fleur)" },
      { operation: "4 × 8", result: 32, visual: "🎲🎲🎲🎲🎲🎲🎲🎲", explanation: "8 dés = 32 faces visibles (4 faces par dé)" },
      { operation: "4 × 9", result: 36, visual: "📱📱📱📱📱📱📱📱📱", explanation: "9 téléphones = 36 coins (4 coins par téléphone)" },
      { operation: "4 × 10", result: 40, visual: "🐾🐾🐾🐾🐾🐾🐾🐾🐾🐾", explanation: "10 chats = 40 pattes (4 pattes par chat)" }
    ]
  },
  table5: {
    name: "Table de 5",
    icon: "🖐️",
    color: "blue",
    trick: "Multiplier par 5, c'est compter avec ses doigts ! Tous les résultats finissent par 5 ou 0.",
    pattern: "Les résultats alternent : 5, 10, 15, 20, 25, 30... Toujours 5 ou 0 à la fin !",
    realLifeExample: "5 doigts par main, 5 centimes dans une pièce, 5 jours d'école par semaine...",
    multiplications: [
      { operation: "5 × 1", result: 5, visual: "🖐️", explanation: "1 main = 5 doigts" },
      { operation: "5 × 2", result: 10, visual: "🖐️🖐️", explanation: "2 mains = 10 doigts" },
      { operation: "5 × 3", result: 15, visual: "🖐️🖐️🖐️", explanation: "3 mains = 15 doigts" },
      { operation: "5 × 4", result: 20, visual: "🖐️🖐️🖐️🖐️", explanation: "4 mains = 20 doigts" },
      { operation: "5 × 5", result: 25, visual: "🪙🪙🪙🪙🪙", explanation: "5 pièces de 5 centimes = 25 centimes" },
      { operation: "5 × 6", result: 30, visual: "⭐⭐⭐⭐⭐⭐", explanation: "6 étoiles à 5 branches = 30 branches" },
      { operation: "5 × 7", result: 35, visual: "📚📚📚📚📚📚📚", explanation: "7 semaines d'école = 35 jours" },
      { operation: "5 × 8", result: 40, visual: "🦶🦶🦶🦶🦶🦶🦶🦶", explanation: "8 pieds = 40 orteils (5 par pied)" },
      { operation: "5 × 9", result: 45, visual: "🌟🌟🌟🌟🌟🌟🌟🌟🌟", explanation: "9 étoiles à 5 branches = 45 branches" },
      { operation: "5 × 10", result: 50, visual: "👥👥👥👥👥👥👥👥👥👥", explanation: "10 personnes = 50 doigts" }
    ]
  },
  table6: {
    name: "Table de 6",
    icon: "🔶",
    color: "teal",
    trick: "Multiplier par 6, c'est multiplier par 3 puis doubler ! 6 × 4 = (3 × 4) × 2 = 12 × 2 = 24",
    pattern: "6, 12, 18, 24, 30, 36, 42, 48, 54, 60... Tous pairs et divisibles par 3 !",
    realLifeExample: "6 faces sur un dé, 6 pattes sur un insecte, 6 cordes sur une guitare...",
    multiplications: [
      { operation: "6 × 1", result: 6, visual: "🎲", explanation: "1 dé = 6 faces" },
      { operation: "6 × 2", result: 12, visual: "🎲🎲", explanation: "2 dés = 12 faces" },
      { operation: "6 × 3", result: 18, visual: "🎲🎲🎲", explanation: "3 dés = 18 faces" },
      { operation: "6 × 4", result: 24, visual: "🐛🐛🐛🐛", explanation: "4 insectes = 24 pattes (6 pattes par insecte)" },
      { operation: "6 × 5", result: 30, visual: "🎸🎸🎸🎸🎸", explanation: "5 guitares = 30 cordes (6 cordes par guitare)" },
      { operation: "6 × 6", result: 36, visual: "📦📦📦📦📦📦", explanation: "6 boîtes de 6 œufs = 36 œufs" },
      { operation: "6 × 7", result: 42, visual: "🌟🌟🌟🌟🌟🌟🌟", explanation: "7 étoiles à 6 branches = 42 branches" },
      { operation: "6 × 8", result: 48, visual: "🏠🏠🏠🏠🏠🏠🏠🏠", explanation: "8 maisons = 48 fenêtres (6 fenêtres par maison)" },
      { operation: "6 × 9", result: 54, visual: "🎯🎯🎯🎯🎯🎯🎯🎯🎯", explanation: "9 cibles = 54 zones (6 zones par cible)" },
      { operation: "6 × 10", result: 60, visual: "⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰", explanation: "10 horloges = 60 minutes par heure" }
    ]
  },
  table7: {
    name: "Table de 7",
    icon: "🔷",
    color: "indigo",
    trick: "Table difficile ! Astuce : 7 × 8 = 56 (cinquante-six), retiens-le bien !",
    pattern: "7, 14, 21, 28, 35, 42, 49, 56, 63, 70... Pas de règle simple, il faut mémoriser !",
    realLifeExample: "7 jours dans une semaine, 7 couleurs de l'arc-en-ciel, 7 notes de musique...",
    multiplications: [
      { operation: "7 × 1", result: 7, visual: "🌈", explanation: "1 arc-en-ciel = 7 couleurs" },
      { operation: "7 × 2", result: 14, visual: "🌈🌈", explanation: "2 arcs-en-ciel = 14 couleurs" },
      { operation: "7 × 3", result: 21, visual: "📅📅📅", explanation: "3 semaines = 21 jours (7 jours par semaine)" },
      { operation: "7 × 4", result: 28, visual: "📅📅📅📅", explanation: "4 semaines = 28 jours" },
      { operation: "7 × 5", result: 35, visual: "🎵🎵🎵🎵🎵", explanation: "5 gammes = 35 notes (7 notes par gamme)" },
      { operation: "7 × 6", result: 42, visual: "🎵🎵🎵🎵🎵🎵", explanation: "6 gammes = 42 notes" },
      { operation: "7 × 7", result: 49, visual: "🎵🎵🎵🎵🎵🎵🎵", explanation: "7 gammes = 49 notes" },
      { operation: "7 × 8", result: 56, visual: "🎵🎵🎵🎵🎵🎵🎵🎵", explanation: "8 gammes = 56 notes (à retenir !)" },
      { operation: "7 × 9", result: 63, visual: "🎵🎵🎵🎵🎵🎵🎵🎵🎵", explanation: "9 gammes = 63 notes" },
      { operation: "7 × 10", result: 70, visual: "🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵", explanation: "10 gammes = 70 notes" }
    ]
  },
  table8: {
    name: "Table de 8",
    icon: "🔸",
    color: "pink",
    trick: "Multiplier par 8, c'est doubler 3 fois ! 8 × 3 = ((3 × 2) × 2) × 2 = 6 × 2 × 2 = 24",
    pattern: "8, 16, 24, 32, 40, 48, 56, 64, 72, 80... Tous pairs et divisibles par 4 !",
    realLifeExample: "8 pattes sur une araignée, 8 tentacules sur une pieuvre, 8 côtés sur un octogone...",
    multiplications: [
      { operation: "8 × 1", result: 8, visual: "🕷️", explanation: "1 araignée = 8 pattes" },
      { operation: "8 × 2", result: 16, visual: "🕷️🕷️", explanation: "2 araignées = 16 pattes" },
      { operation: "8 × 3", result: 24, visual: "🕷️🕷️🕷️", explanation: "3 araignées = 24 pattes" },
      { operation: "8 × 4", result: 32, visual: "🐙🐙🐙🐙", explanation: "4 pieuvres = 32 tentacules (8 par pieuvre)" },
      { operation: "8 × 5", result: 40, visual: "🐙🐙🐙🐙🐙", explanation: "5 pieuvres = 40 tentacules" },
      { operation: "8 × 6", result: 48, visual: "🐙🐙🐙🐙🐙🐙", explanation: "6 pieuvres = 48 tentacules" },
      { operation: "8 × 7", result: 56, visual: "🐙🐙🐙🐙🐙🐙🐙", explanation: "7 pieuvres = 56 tentacules" },
      { operation: "8 × 8", result: 64, visual: "🐙🐙🐙🐙🐙🐙🐙🐙", explanation: "8 pieuvres = 64 tentacules" },
      { operation: "8 × 9", result: 72, visual: "🐙🐙🐙🐙🐙🐙🐙🐙🐙", explanation: "9 pieuvres = 72 tentacules" },
      { operation: "8 × 10", result: 80, visual: "🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙", explanation: "10 pieuvres = 80 tentacules" }
    ]
  },
  table9: {
    name: "Table de 9",
    icon: "🔹",
    color: "cyan",
    trick: "Astuce magique ! La somme des chiffres du résultat fait toujours 9 : 9×2=18 (1+8=9), 9×3=27 (2+7=9)...",
    pattern: "9, 18, 27, 36, 45, 54, 63, 72, 81, 90... Somme des chiffres = 9 !",
    realLifeExample: "9 planètes dans le système solaire (avec Pluton), 9 mois de grossesse...",
    multiplications: [
      { operation: "9 × 1", result: 9, visual: "🪐", explanation: "1 système = 9 planètes" },
      { operation: "9 × 2", result: 18, visual: "🪐🪐", explanation: "2 systèmes = 18 planètes" },
      { operation: "9 × 3", result: 27, visual: "🪐🪐🪐", explanation: "3 systèmes = 27 planètes" },
      { operation: "9 × 4", result: 36, visual: "🪐🪐🪐🪐", explanation: "4 systèmes = 36 planètes" },
      { operation: "9 × 5", result: 45, visual: "🪐🪐🪐🪐🪐", explanation: "5 systèmes = 45 planètes" },
      { operation: "9 × 6", result: 54, visual: "🪐🪐🪐🪐🪐🪐", explanation: "6 systèmes = 54 planètes" },
      { operation: "9 × 7", result: 63, visual: "🪐🪐🪐🪐🪐🪐🪐", explanation: "7 systèmes = 63 planètes" },
      { operation: "9 × 8", result: 72, visual: "🪐🪐🪐🪐🪐🪐🪐🪐", explanation: "8 systèmes = 72 planètes" },
      { operation: "9 × 9", result: 81, visual: "🪐🪐🪐🪐🪐🪐🪐🪐🪐", explanation: "9 systèmes = 81 planètes" },
      { operation: "9 × 10", result: 90, visual: "🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐", explanation: "10 systèmes = 90 planètes" }
    ]
  },
  table10: {
    name: "Table de 10",
    icon: "🔟",
    color: "indigo",
    trick: "La plus facile ! Multiplier par 10, c'est ajouter un zéro à la fin du nombre !",
    pattern: "Tous les résultats finissent par 0 : 10, 20, 30, 40, 50...",
    realLifeExample: "10 doigts, 10 orteils, 10 centimes dans 1 euro, 10 dans une dizaine...",
    multiplications: [
      { operation: "10 × 1", result: 10, visual: "🪙", explanation: "1 pièce de 10 centimes = 10 centimes" },
      { operation: "10 × 2", result: 20, visual: "🪙🪙", explanation: "2 pièces de 10 centimes = 20 centimes" },
      { operation: "10 × 3", result: 30, visual: "🪙🪙🪙", explanation: "3 pièces de 10 centimes = 30 centimes" },
      { operation: "10 × 4", result: 40, visual: "🦶🦶🦶🦶", explanation: "4 personnes = 40 orteils (10 par personne)" },
      { operation: "10 × 5", result: 50, visual: "👥👥👥👥👥", explanation: "5 personnes = 50 doigts (10 par personne)" },
      { operation: "10 × 6", result: 60, visual: "🥚🥚🥚🥚🥚🥚", explanation: "6 boîtes de 10 œufs = 60 œufs" },
      { operation: "10 × 7", result: 70, visual: "📦📦📦📦📦📦📦", explanation: "7 paquets de 10 bonbons = 70 bonbons" },
      { operation: "10 × 8", result: 80, visual: "🖍️🖍️🖍️🖍️🖍️🖍️🖍️🖍️", explanation: "8 boîtes de 10 crayons = 80 crayons" },
      { operation: "10 × 9", result: 90, visual: "🎈🎈🎈🎈🎈🎈🎈🎈🎈", explanation: "9 paquets de 10 ballons = 90 ballons" },
      { operation: "10 × 10", result: 100, visual: "💯", explanation: "10 dizaines = 100 ! Un nombre rond parfait !" }
    ]
  }
};

// Exercices pour chaque table (15 questions variées)
const exercisesData = {
  table1: [
    { question: "1 × 3", answer: 3, context: "1 fois 3 pommes = ? pommes" },
    { question: "1 × 7", answer: 7, context: "1 fois 7 bonbons = ? bonbons" },
    { question: "1 × 5", answer: 5, context: "1 fois 5 euros = ? euros" },
    { question: "1 × 9", answer: 9, context: "1 fois 9 billes = ? billes" },
    { question: "1 × 2", answer: 2, context: "1 fois 2 crayons = ? crayons" },
    { question: "1 × 8", answer: 8, context: "1 fois 8 livres = ? livres" },
    { question: "1 × 4", answer: 4, context: "1 fois 4 chaises = ? chaises" },
    { question: "1 × 6", answer: 6, context: "1 fois 6 tables = ? tables" },
    { question: "1 × 10", answer: 10, context: "1 fois 10 stylos = ? stylos" },
    { question: "1 × 1", answer: 1, context: "1 fois 1 cahier = ? cahier" },
    { question: "3 × 1", answer: 3, context: "3 fois 1 pomme = ? pommes" },
    { question: "5 × 1", answer: 5, context: "5 fois 1 euro = ? euros" },
    { question: "7 × 1", answer: 7, context: "7 fois 1 bonbon = ? bonbons" },
    { question: "9 × 1", answer: 9, context: "9 fois 1 bille = ? billes" },
    { question: "4 × 1", answer: 4, context: "4 fois 1 crayon = ? crayons" }
  ],
  table2: [
    { question: "2 × 3", answer: 6, context: "3 paires de chaussettes = ? chaussettes" },
    { question: "2 × 5", answer: 10, context: "5 vélos = ? roues" },
    { question: "2 × 4", answer: 8, context: "4 personnes = ? yeux" },
    { question: "2 × 7", answer: 14, context: "7 chats = ? oreilles" },
    { question: "2 × 2", answer: 4, context: "2 paires de gants = ? gants" },
    { question: "2 × 6", answer: 12, context: "6 boîtes de 2 œufs = ? œufs" },
    { question: "2 × 8", answer: 16, context: "8 chiens = ? pattes avant" },
    { question: "2 × 1", answer: 2, context: "1 paire de lunettes = ? verres" },
    { question: "2 × 9", answer: 18, context: "9 personnes = ? oreilles" },
    { question: "2 × 10", answer: 20, context: "10 personnes = ? pieds" },
    { question: "4 × 2", answer: 8, context: "4 fois 2 bonbons = ? bonbons" },
    { question: "6 × 2", answer: 12, context: "6 fois 2 billes = ? billes" },
    { question: "3 × 2", answer: 6, context: "3 fois 2 crayons = ? crayons" },
    { question: "8 × 2", answer: 16, context: "8 fois 2 euros = ? euros" },
    { question: "5 × 2", answer: 10, context: "5 fois 2 pommes = ? pommes" }
  ],
  table5: [
    { question: "5 × 2", answer: 10, context: "2 mains = ? doigts" },
    { question: "5 × 4", answer: 20, context: "4 mains = ? doigts" },
    { question: "5 × 3", answer: 15, context: "3 étoiles à 5 branches = ? branches" },
    { question: "5 × 6", answer: 30, context: "6 semaines d'école = ? jours" },
    { question: "5 × 1", answer: 5, context: "1 pièce de 5 centimes = ? centimes" },
    { question: "5 × 8", answer: 40, context: "8 pieds = ? orteils" },
    { question: "5 × 5", answer: 25, context: "5 pièces de 5 centimes = ? centimes" },
    { question: "5 × 7", answer: 35, context: "7 semaines d'école = ? jours" },
    { question: "5 × 9", answer: 45, context: "9 étoiles à 5 branches = ? branches" },
    { question: "5 × 10", answer: 50, context: "10 personnes = ? doigts" },
    { question: "3 × 5", answer: 15, context: "3 fois 5 bonbons = ? bonbons" },
    { question: "6 × 5", answer: 30, context: "6 fois 5 euros = ? euros" },
    { question: "4 × 5", answer: 20, context: "4 fois 5 billes = ? billes" },
    { question: "8 × 5", answer: 40, context: "8 fois 5 centimes = ? centimes" },
    { question: "2 × 5", answer: 10, context: "2 fois 5 crayons = ? crayons" }
  ],
  table3: [
    { question: "3 × 2", answer: 6, context: "2 triangles = ? côtés" },
    { question: "3 × 4", answer: 12, context: "4 tricycles = ? roues" },
    { question: "3 × 3", answer: 9, context: "3 personnes = ? repas par jour" },
    { question: "3 × 6", answer: 18, context: "6 équerres = ? angles droits" },
    { question: "3 × 1", answer: 3, context: "1 trèfle = ? feuilles" },
    { question: "3 × 8", answer: 24, context: "8 livres = ? chapitres" },
    { question: "3 × 5", answer: 15, context: "5 personnes = ? repas par jour" },
    { question: "3 × 7", answer: 21, context: "7 semaines = ? jours" },
    { question: "3 × 9", answer: 27, context: "9 jeux = ? zones" },
    { question: "3 × 10", answer: 30, context: "10 maisons = ? étages" },
    { question: "2 × 3", answer: 6, context: "2 fois 3 bonbons = ? bonbons" },
    { question: "4 × 3", answer: 12, context: "4 fois 3 billes = ? billes" },
    { question: "6 × 3", answer: 18, context: "6 fois 3 crayons = ? crayons" },
    { question: "8 × 3", answer: 24, context: "8 fois 3 euros = ? euros" },
    { question: "5 × 3", answer: 15, context: "5 fois 3 pommes = ? pommes" }
  ],
  table4: [
    { question: "4 × 2", answer: 8, context: "2 carrés = ? côtés" },
    { question: "4 × 5", answer: 20, context: "5 chiens = ? pattes" },
    { question: "4 × 3", answer: 12, context: "3 voitures = ? roues" },
    { question: "4 × 7", answer: 28, context: "7 fleurs = ? pétales" },
    { question: "4 × 1", answer: 4, context: "1 table = ? pieds" },
    { question: "4 × 6", answer: 24, context: "6 maisons = ? fenêtres" },
    { question: "4 × 8", answer: 32, context: "8 dés = ? faces visibles" },
    { question: "4 × 4", answer: 16, context: "4 chaises = ? pieds" },
    { question: "4 × 9", answer: 36, context: "9 téléphones = ? coins" },
    { question: "4 × 10", answer: 40, context: "10 chats = ? pattes" },
    { question: "3 × 4", answer: 12, context: "3 fois 4 bonbons = ? bonbons" },
    { question: "5 × 4", answer: 20, context: "5 fois 4 billes = ? billes" },
    { question: "6 × 4", answer: 24, context: "6 fois 4 crayons = ? crayons" },
    { question: "7 × 4", answer: 28, context: "7 fois 4 euros = ? euros" },
    { question: "2 × 4", answer: 8, context: "2 fois 4 pommes = ? pommes" }
  ],
  table6: [
    { question: "6 × 2", answer: 12, context: "2 dés = ? faces" },
    { question: "6 × 4", answer: 24, context: "4 insectes = ? pattes" },
    { question: "6 × 3", answer: 18, context: "3 guitares = ? cordes" },
    { question: "6 × 6", answer: 36, context: "6 boîtes de 6 œufs = ? œufs" },
    { question: "6 × 1", answer: 6, context: "1 dé = ? faces" },
    { question: "6 × 8", answer: 48, context: "8 maisons = ? fenêtres" },
    { question: "6 × 5", answer: 30, context: "5 guitares = ? cordes" },
    { question: "6 × 7", answer: 42, context: "7 étoiles = ? branches" },
    { question: "6 × 9", answer: 54, context: "9 cibles = ? zones" },
    { question: "6 × 10", answer: 60, context: "10 horloges = ? minutes par heure" },
    { question: "2 × 6", answer: 12, context: "2 fois 6 bonbons = ? bonbons" },
    { question: "4 × 6", answer: 24, context: "4 fois 6 billes = ? billes" },
    { question: "3 × 6", answer: 18, context: "3 fois 6 crayons = ? crayons" },
    { question: "8 × 6", answer: 48, context: "8 fois 6 euros = ? euros" },
    { question: "5 × 6", answer: 30, context: "5 fois 6 pommes = ? pommes" }
  ],
  table7: [
    { question: "7 × 2", answer: 14, context: "2 arcs-en-ciel = ? couleurs" },
    { question: "7 × 4", answer: 28, context: "4 semaines = ? jours" },
    { question: "7 × 3", answer: 21, context: "3 semaines = ? jours" },
    { question: "7 × 6", answer: 42, context: "6 gammes = ? notes" },
    { question: "7 × 1", answer: 7, context: "1 arc-en-ciel = ? couleurs" },
    { question: "7 × 8", answer: 56, context: "8 gammes = ? notes (important !)" },
    { question: "7 × 5", answer: 35, context: "5 gammes = ? notes" },
    { question: "7 × 7", answer: 49, context: "7 gammes = ? notes" },
    { question: "7 × 9", answer: 63, context: "9 gammes = ? notes" },
    { question: "7 × 10", answer: 70, context: "10 gammes = ? notes" },
    { question: "2 × 7", answer: 14, context: "2 fois 7 bonbons = ? bonbons" },
    { question: "4 × 7", answer: 28, context: "4 fois 7 billes = ? billes" },
    { question: "3 × 7", answer: 21, context: "3 fois 7 crayons = ? crayons" },
    { question: "8 × 7", answer: 56, context: "8 fois 7 euros = ? euros" },
    { question: "5 × 7", answer: 35, context: "5 fois 7 pommes = ? pommes" }
  ],
  table8: [
    { question: "8 × 2", answer: 16, context: "2 araignées = ? pattes" },
    { question: "8 × 4", answer: 32, context: "4 pieuvres = ? tentacules" },
    { question: "8 × 3", answer: 24, context: "3 araignées = ? pattes" },
    { question: "8 × 6", answer: 48, context: "6 pieuvres = ? tentacules" },
    { question: "8 × 1", answer: 8, context: "1 araignée = ? pattes" },
    { question: "8 × 8", answer: 64, context: "8 pieuvres = ? tentacules" },
    { question: "8 × 5", answer: 40, context: "5 pieuvres = ? tentacules" },
    { question: "8 × 7", answer: 56, context: "7 pieuvres = ? tentacules" },
    { question: "8 × 9", answer: 72, context: "9 pieuvres = ? tentacules" },
    { question: "8 × 10", answer: 80, context: "10 pieuvres = ? tentacules" },
    { question: "2 × 8", answer: 16, context: "2 fois 8 bonbons = ? bonbons" },
    { question: "4 × 8", answer: 32, context: "4 fois 8 billes = ? billes" },
    { question: "3 × 8", answer: 24, context: "3 fois 8 crayons = ? crayons" },
    { question: "6 × 8", answer: 48, context: "6 fois 8 euros = ? euros" },
    { question: "5 × 8", answer: 40, context: "5 fois 8 pommes = ? pommes" }
  ],
  table9: [
    { question: "9 × 2", answer: 18, context: "2 systèmes = ? planètes" },
    { question: "9 × 4", answer: 36, context: "4 systèmes = ? planètes" },
    { question: "9 × 3", answer: 27, context: "3 systèmes = ? planètes" },
    { question: "9 × 6", answer: 54, context: "6 systèmes = ? planètes" },
    { question: "9 × 1", answer: 9, context: "1 système = ? planètes" },
    { question: "9 × 8", answer: 72, context: "8 systèmes = ? planètes" },
    { question: "9 × 5", answer: 45, context: "5 systèmes = ? planètes" },
    { question: "9 × 7", answer: 63, context: "7 systèmes = ? planètes" },
    { question: "9 × 9", answer: 81, context: "9 systèmes = ? planètes" },
    { question: "9 × 10", answer: 90, context: "10 systèmes = ? planètes" },
    { question: "2 × 9", answer: 18, context: "2 fois 9 bonbons = ? bonbons" },
    { question: "4 × 9", answer: 36, context: "4 fois 9 billes = ? billes" },
    { question: "3 × 9", answer: 27, context: "3 fois 9 crayons = ? crayons" },
    { question: "6 × 9", answer: 54, context: "6 fois 9 euros = ? euros" },
    { question: "5 × 9", answer: 45, context: "5 fois 9 pommes = ? pommes" }
  ],
  table10: [
    { question: "10 × 2", answer: 20, context: "2 pièces de 10 centimes = ? centimes" },
    { question: "10 × 5", answer: 50, context: "5 personnes = ? doigts" },
    { question: "10 × 3", answer: 30, context: "3 pièces de 10 centimes = ? centimes" },
    { question: "10 × 7", answer: 70, context: "7 paquets de 10 bonbons = ? bonbons" },
    { question: "10 × 1", answer: 10, context: "1 paquet de 10 crayons = ? crayons" },
    { question: "10 × 4", answer: 40, context: "4 personnes = ? orteils" },
    { question: "10 × 8", answer: 80, context: "8 boîtes de 10 œufs = ? œufs" },
    { question: "10 × 6", answer: 60, context: "6 boîtes de 10 billes = ? billes" },
    { question: "10 × 9", answer: 90, context: "9 paquets de 10 ballons = ? ballons" },
    { question: "10 × 10", answer: 100, context: "10 dizaines = ? unités" },
    { question: "3 × 10", answer: 30, context: "3 fois 10 euros = ? euros" },
    { question: "5 × 10", answer: 50, context: "5 fois 10 bonbons = ? bonbons" },
    { question: "7 × 10", answer: 70, context: "7 fois 10 centimes = ? centimes" },
    { question: "4 × 10", answer: 40, context: "4 fois 10 billes = ? billes" },
    { question: "6 × 10", answer: 60, context: "6 fois 10 crayons = ? crayons" }
  ]
};

// Fonction pour jouer l'audio
const playAudio = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ('speechSynthesis' in window) {
      // Annuler toute synthèse en cours
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);
      
      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
};

// Fonction d'attente
const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Fonction pour scroller vers un élément
const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
  }
};

// Composant pour l'animation d'une table
function TableAnimation({ 
  tableKey, 
  highlightedElement, 
  audioRef, 
  updateAudioState 
}: { 
  tableKey: keyof typeof tablesData;
  highlightedElement: string | null;
  audioRef: React.MutableRefObject<boolean>;
  updateAudioState: (isPlaying: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const table = tablesData[tableKey];

  const explainTable = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    updateAudioState(true);
    audioRef.current = true;
    
    try {
      // Explication de l'astuce
      await playAudio(table.trick);
      await wait(1000);
      
      // Parcourir chaque multiplication
      for (let i = 0; i < table.multiplications.length; i++) {
        if (!audioRef.current) break;
        
        setCurrentStep(i);
        const mult = table.multiplications[i];
        
        await playAudio(mult.operation);
        await wait(500);
        await playAudio(`égale ${mult.result}`);
        await wait(500);
        await playAudio(mult.explanation);
        await wait(800);
      }
      
      // Pattern final
      if (audioRef.current) {
        await playAudio(table.pattern);
      }
      
    } catch (error) {
      console.error('Erreur audio:', error);
    } finally {
      setIsPlaying(false);
      updateAudioState(false);
      audioRef.current = false;
      setCurrentStep(0);
    }
  };

  const stopExplanation = () => {
    audioRef.current = false;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    updateAudioState(false);
    setCurrentStep(0);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{table.icon}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{table.name}</h2>
        
        {/* Astuce pédagogique */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
          <div className="flex items-center mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="font-bold text-yellow-800">Astuce !</span>
          </div>
          <p className="text-yellow-800 text-sm mb-2">{table.trick}</p>
          <p className="text-yellow-700 text-xs mb-2 italic">{table.pattern}</p>
          {table.realLifeExample && (
            <div className="bg-yellow-50 p-2 rounded mt-2">
              <p className="text-yellow-800 text-xs">
                <span className="font-semibold">🌍 Dans la vraie vie :</span> {table.realLifeExample}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={isPlaying ? stopExplanation : explainTable}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="inline w-5 h-5 mr-2" />
              Arrêter l'explication
            </>
          ) : (
            <>
              <Play className="inline w-5 h-5 mr-2" />
              Écouter l'explication
            </>
          )}
        </button>
      </div>

      {/* Grille des multiplications */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        {table.multiplications.map((mult, index) => (
          <div
            key={index}
            className={`p-2 sm:p-3 rounded-lg border-2 text-center transition-all ${
              currentStep === index && isPlaying
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="font-bold text-gray-800 text-xs sm:text-sm mb-1">
              {mult.operation}
            </div>
            <div className="text-sm sm:text-base mb-1 text-gray-800 font-medium">{mult.visual}</div>
            <div className="text-base sm:text-lg font-bold text-gray-800">
              = {mult.result}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour les exercices d'une table
function TableExercises({ 
  tableKey, 
  onComplete,
  highlightedElement 
}: { 
  tableKey: keyof typeof exercisesData;
  onComplete: (score: number) => void;
  highlightedElement?: string | null;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const exercises = exercisesData[tableKey];
  const currentExercise = exercises[currentQuestion];

  const handleSubmitAnswer = () => {
    if (showResult || userAnswer.trim() === '') return;
    
    const numericAnswer = parseInt(userAnswer.trim());
    const correct = numericAnswer === currentExercise.answer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < exercises.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setShowResult(false);
        setIsCorrect(false);
      } else {
        setIsComplete(true);
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer();
    }
  };

  const resetExercises = () => {
    setCurrentQuestion(0);
    setUserAnswer('');
    setShowResult(false);
    setScore(0);
    setIsComplete(false);
    setIsCorrect(false);
  };

  if (isComplete) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Exercices terminés !
        </h3>
        <div className="text-xl mb-6">
          Score : <span className="font-bold text-blue-600">{score}/{exercises.length}</span>
        </div>
        <button
          onClick={resetExercises}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          <RotateCcw className="inline w-5 h-5 mr-2" />
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} / {exercises.length}
          </span>
          <span className="text-sm text-gray-600">
            Score : {score}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          {currentExercise.question} = ?
        </h3>
        {currentExercise.context && (
          <p className="text-lg text-blue-600 mb-4 italic">
            💡 {currentExercise.context}
          </p>
        )}
      </div>

      <div 
        id="exercise-input"
        className={`flex flex-col items-center space-y-4 ${
          highlightedElement === 'exercise-choices' ? 'ring-4 ring-yellow-400 animate-pulse rounded-xl p-4' : ''
        }`}
      >
        {/* Champ de saisie */}
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={showResult}
            placeholder="?"
            className={`w-24 h-16 text-3xl font-bold text-center border-2 rounded-lg transition-all ${
              showResult
                ? isCorrect
                  ? 'border-green-500 bg-green-100 text-green-800'
                  : 'border-red-500 bg-red-100 text-red-800'
                : 'border-gray-300 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }`}
            autoFocus
          />
          
          <button
            onClick={handleSubmitAnswer}
            disabled={showResult || userAnswer.trim() === ''}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              showResult || userAnswer.trim() === ''
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            Valider
          </button>
        </div>

        {/* Résultat */}
        {showResult && (
          <div className={`flex items-center space-x-2 text-lg font-bold ${
            isCorrect ? 'text-green-600' : 'text-red-600'
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle className="w-6 h-6" />
                <span>Bravo ! C'est correct !</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6" />
                <span>La bonne réponse était {currentExercise.answer}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TablesMultiplicationCE2() {
  const [showExerciseTab, setShowExerciseTab] = useState(false);
  const [selectedTable, setSelectedTable] = useState<keyof typeof tablesData>('table1');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [completionScores, setCompletionScores] = useState<{[key: string]: number}>({});
  const [isPlayingCourseExplanation, setIsPlayingCourseExplanation] = useState(false);
  const [isPlayingExerciseExplanation, setIsPlayingExerciseExplanation] = useState(false);

  // Refs pour gérer l'audio
  const tableAudioRef = useRef(false);

  const updateChildAudioState = (childId: string, isPlaying: boolean) => {
    console.log(`🔊 Child ${childId} audio state:`, isPlaying);
  };

  const handleExerciseComplete = (score: number) => {
    setCompletionScores({
      ...completionScores,
      [selectedTable]: score
    });
  };

  const explainCourseWithSteve = async () => {
    if (isPlayingCourseExplanation) return;
    
    setIsPlayingCourseExplanation(true);
    
    try {
      await playAudio("Salut ! Je suis Steve et je vais t'expliquer comment utiliser cette page !");
      await wait(1000);
      
      scrollToElement('course-tab');
      setHighlightedElement('course-tab');
      await playAudio("Tu es dans l'onglet Cours ! Ici tu peux apprendre les tables de multiplication !");
      await wait(1500);
      
      scrollToElement('table-selection');
      setHighlightedElement('table-selection');
      await playAudio("D'abord, choisis une table de 1 à 10 ! Tu as toutes les tables de multiplication !");
      await wait(1500);
      
      scrollToElement('table-animation');
      setHighlightedElement('table-animation');
      await playAudio("Ensuite, clique sur 'Écouter l'explication' pour apprendre les astuces !");
      await wait(1500);
      
      scrollToElement('exercise-tab');
      setHighlightedElement('exercise-tab');
      await playAudio("Quand tu es prêt, va dans l'onglet Exercices pour t'entraîner !");
      await wait(1000);
      
      setHighlightedElement(null);
      await playAudio("C'est parti ! Amuse-toi bien !");
      
    } catch (error) {
      console.error('Erreur audio:', error);
    } finally {
      setIsPlayingCourseExplanation(false);
      setHighlightedElement(null);
    }
  };

  const explainExercisesWithSteve = async () => {
    if (isPlayingExerciseExplanation) return;
    
    setIsPlayingExerciseExplanation(true);
    
    try {
      await playAudio("Super ! Tu es dans l'onglet Exercices !");
      await wait(1000);
      
      scrollToElement('exercise-table-selection');
      setHighlightedElement('exercise-table-selection');
      await playAudio("Choisis d'abord une table pour t'exercer !");
      await wait(1500);
      
      scrollToElement('exercise-questions');
      setHighlightedElement('exercise-questions');
      await playAudio("Tu auras 15 questions pour chaque table !");
      await wait(1500);
      
      scrollToElement('exercise-input');
      setHighlightedElement('exercise-choices');
      await playAudio("Écris ta réponse dans le champ et appuie sur Entrée ou Valider !");
      await wait(1500);
      
      await playAudio("Si tu as une réponse inexacte, je te donnerai la solution !");
      await wait(1500);
      
      scrollToElement('course-tab');
      setHighlightedElement('course-tab');
      await playAudio("Si tu as besoin d'aide, retourne dans l'onglet Cours !");
      await wait(1000);
      
      setHighlightedElement(null);
      await playAudio("Bonne chance pour tes exercices !");
      
    } catch (error) {
      console.error('Erreur audio:', error);
    } finally {
      setIsPlayingExerciseExplanation(false);
      setHighlightedElement(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce2-operations-complexes/multiplication-ce2" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              <span className="sm:hidden">🔢 Tables de multiplication</span>
              <span className="hidden sm:inline">🔢 Tables de multiplication CE2</span>
            </h1>
            <p className="text-sm sm:text-lg text-gray-600">
              <span className="sm:hidden">Toutes les tables de 1 à 10</span>
              <span className="hidden sm:inline">Apprends toutes les tables de multiplication de 1 à 10 avec des animations !</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            id="course-tab"
            onClick={() => setShowExerciseTab(false)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !showExerciseTab
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            } ${
              highlightedElement === 'course-tab' ? 'ring-4 ring-yellow-400 animate-pulse' : ''
            }`}
          >
            📚 Cours
          </button>
          <button
            id="exercise-tab"
            onClick={() => setShowExerciseTab(true)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExerciseTab
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            } ${
              highlightedElement === 'exercise-tab' ? 'ring-4 ring-yellow-400 animate-pulse' : ''
            }`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExerciseTab ? (
          /* COURS */
          <div>
            {/* Bouton DÉMARRER pour le cours avec personnage Minecraft */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage pour le cours */}
              <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
                isPlayingCourseExplanation
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                    : 'w-12 sm:w-20 h-12 sm:h-20' // Normal size
              }`}>
                <img 
                  src="/image/Minecraftstyle.png" 
                  alt="Personnage Minecraft" 
                  className="w-full h-full object-cover rounded-full"
                />
                
                {isPlayingCourseExplanation && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 11C19 15.4 15.4 19 11 19V21H13V23H11V21H9V23H7V21H9V19C4.6 19 1 15.4 1 11H3C3 14.3 5.7 17 9 17V15C7.3 15 6 13.7 6 12V11H4V9H6V8C6 6.3 7.3 5 9 5V7C8.4 7 8 7.4 8 8V12C8 12.6 8.4 13 9 13V11H11V13C11.6 13 12 12.6 12 12V8C12 7.4 11.6 7 11 7V5C12.7 5 14 6.3 14 8V9H16V11H14V12C14 13.7 12.7 15 11 15V17C14.3 17 17 14.3 17 11H19Z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER pour le cours */}
              <button
                onClick={explainCourseWithSteve}
                disabled={isPlayingCourseExplanation}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-lg transition-all ${
                  isPlayingCourseExplanation
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-xl hover:scale-105'
                } ${!isPlayingCourseExplanation ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {isPlayingCourseExplanation ? 'Le personnage explique...' : 'DÉMARRER LE COURS'}
              </button>
            </div>

            {/* Sélection de table */}
            <div 
              id="table-selection"
              className={`bg-white rounded-xl shadow-lg p-6 mb-6 ${
                highlightedElement === 'table-selection' ? 'ring-4 ring-yellow-400 animate-pulse' : ''
              }`}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Choisis une table à apprendre
              </h2>
              
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
                {Object.entries(tablesData).map(([key, table]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTable(key as keyof typeof tablesData);
                      // Scroll vers l'animation de la table après un petit délai
                      setTimeout(() => {
                        scrollToElement('table-animation');
                      }, 100);
                    }}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      selectedTable === key
                        ? `border-${table.color}-500 bg-${table.color}-50`
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{table.icon}</div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">{table.name}</div>
                    {completionScores[key] && (
                      <div className="text-sm text-green-600 mt-2">
                        ✅ Score : {completionScores[key]} / 15
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation de la table */}
            <div 
              id="table-animation"
              className={`space-y-6 ${
                highlightedElement === 'table-animation' ? 'ring-4 ring-yellow-400 animate-pulse rounded-xl' : ''
              }`}
            >
              <TableAnimation
                tableKey={selectedTable}
                highlightedElement={highlightedElement}
                audioRef={tableAudioRef}
                updateAudioState={(isPlaying) => updateChildAudioState('table', isPlaying)}
              />
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-6">
            {/* Bouton DÉMARRER pour les exercices avec personnage Minecraft */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-2 sm:mb-6">
              {/* Image du personnage pour les exercices */}
              <div className={`relative transition-all duration-500 border-2 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 ${
                isPlayingExerciseExplanation
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                    : 'w-12 sm:w-20 h-12 sm:h-20' // Normal size
              }`}>
                <img 
                  src="/image/Minecraftstyle.png" 
                  alt="Personnage Minecraft" 
                  className="w-full h-full object-cover rounded-full"
                />
                
                {isPlayingExerciseExplanation && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 11C19 15.4 15.4 19 11 19V21H13V23H11V21H9V23H7V21H9V19C4.6 19 1 15.4 1 11H3C3 14.3 5.7 17 9 17V15C7.3 15 6 13.7 6 12V11H4V9H6V8C6 6.3 7.3 5 9 5V7C8.4 7 8 7.4 8 8V12C8 12.6 8.4 13 9 13V11H11V13C11.6 13 12 12.6 12 12V8C12 7.4 11.6 7 11 7V5C12.7 5 14 6.3 14 8V9H16V11H14V12C14 13.7 12.7 15 11 15V17C14.3 17 17 14.3 17 11H19Z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER pour les exercices */}
              <button
                onClick={explainExercisesWithSteve}
                disabled={isPlayingExerciseExplanation}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-lg transition-all ${
                  isPlayingExerciseExplanation
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:scale-105'
                } ${!isPlayingExerciseExplanation ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {isPlayingExerciseExplanation ? 'Le personnage explique...' : 'DÉMARRER LES EXERCICES'}
              </button>
            </div>

            {/* Sélection de table pour exercices */}
            <div 
              id="exercise-table-selection"
              className={`bg-white rounded-xl shadow-lg p-6 mb-6 ${
                highlightedElement === 'exercise-table-selection' ? 'ring-4 ring-yellow-400 animate-pulse' : ''
              }`}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Choisis une table pour t'exercer
              </h2>
              
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
                {Object.entries(tablesData).map(([key, table]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTable(key as keyof typeof tablesData);
                      // Scroll vers les exercices après un petit délai
                      setTimeout(() => {
                        scrollToElement('exercise-questions');
                      }, 100);
                    }}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      selectedTable === key
                        ? `border-${table.color}-500 bg-${table.color}-50`
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{table.icon}</div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">{table.name}</div>
                    {completionScores[key] && (
                      <div className="text-sm text-green-600 mt-2">
                        ✅ Score : {completionScores[key]} / 15
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div 
              id="exercise-questions"
              className={highlightedElement === 'exercise-questions' ? 'ring-4 ring-yellow-400 animate-pulse rounded-xl' : ''}
            >
              <TableExercises
                tableKey={selectedTable}
                onComplete={handleExerciseComplete}
                highlightedElement={highlightedElement}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
