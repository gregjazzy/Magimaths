import { useState, useEffect } from 'react';

interface Exercise {
  story: string;
  first: number;
  second: number;
  answer: number;
  visual: string;
}

interface VocalFeedbackProps {
  exercise: Exercise;
  isCorrect: boolean;
}

export const getVocalFeedback = (exercise: Exercise, isCorrect: boolean) => {
  const story = exercise.story.toLowerCase();
  let subject = '';
  let objectType = '';
  
  // Détection du contexte
  if (story.includes('billes')) {
    if (story.includes('julien') && story.includes('ethan')) {
      subject = 'Julien et Ethan ont';
    } else if (story.includes('paul') && story.includes('lucas')) {
      subject = 'Paul et Lucas ont';
    } else {
      subject = 'l\'enfant a';
    }
    objectType = 'billes';
  } else if (story.includes('vaches') && story.includes('moutons')) {
    subject = '';
    objectType = 'animaux';
  } else if (story.includes('pommes')) {
    subject = story.includes('julie') ? 'Julie' : story.includes('maman') ? 'Maman' : 'la personne';
    objectType = 'pommes';
  } else if (story.includes('autocollants')) {
    subject = story.includes('sophie') ? 'Sophie' : 'l\'enfant';
    objectType = 'autocollants';
  } else if (story.includes('livres')) {
    subject = '';
    objectType = 'livres';
  } else {
    // Fallback générique
    subject = '';
    objectType = 'objets';
  }

  if (isCorrect) {
    const encouragements = [
      'Succès débloqué !',
      'Achievement Get !',
      'Mission accomplie !',
      'Objectif atteint !',
      'Quête complétée !',
      'Trésor trouvé !'
    ];
    
    const compliments = [
      'Tu es un vrai champion !',
      'Tes compétences progressent !',
      'Tu maîtrises l\'art du calcul !',
      'Tu es prêt pour le niveau suivant !',
      'Ta stratégie est excellente !',
      'Tu deviens un expert !'
    ];
    
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    const compliment = compliments[Math.floor(Math.random() * compliments.length)];
    
    let baseMessage = '';
    if (subject && objectType) {
      baseMessage = `${subject} ${exercise.answer} ${objectType} !`;
    } else if (objectType) {
      baseMessage = `Il y a exactement ${exercise.answer} ${objectType} !`;
    } else {
      baseMessage = `Tu as trouvé ${exercise.answer} !`;
    }
    
    return `🎉 ${encouragement} ${exercise.visual} ${baseMessage} ${compliment}`;
  } else {
    return `${exercise.visual} ${exercise.first} + ${exercise.second} = ${exercise.answer}`;
  }
};

export const quickVocalCorrection = async (exercise: Exercise, playAudio: (text: string) => Promise<void>) => {
  try {
    // Utiliser les valeurs first et second de l'exercice
    const first = exercise.first;
    const second = exercise.second;
    const result = exercise.answer;

    // Correction avec mise en évidence et vitesse lente
    await playAudio(`${first} plus ${second} égale ${result}`);
    await new Promise(resolve => setTimeout(resolve, 700));
    
    await playAudio(`La bonne réponse est ${result} !`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    console.error('Erreur dans quickVocalCorrection:', error);
  }
};
