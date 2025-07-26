const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs').promises;
const path = require('path');

// Configuration Google Cloud TTS
const client = new textToSpeech.TextToSpeechClient();

// 🎵 CONFIGURATION VOCALE PREMIUM
const VOICE_CONFIG = {
  languageCode: 'fr-FR',
  name: 'fr-FR-Wavenet-A',  // Voix premium féminine
  ssmlGender: 'FEMALE'
};

const AUDIO_CONFIG = {
  audioEncoding: 'MP3',
  speakingRate: 1.2,  // Vitesse optimisée pour l'apprentissage
  pitch: 0.0,
  volumeGainDb: 0.0
};

// 📝 MAPPING COMPLET DES TEXTES VOCAUX
const VOCAL_TEXTS = {
  // 🔢 CP-NOMBRES-JUSQU-20
  'cp-nombres-jusqu-20': {
    'reconnaissance': {
      'course-intro': "Salut ! Aujourd'hui, nous allons apprendre à reconnaître les nombres de 0 à 20 !",
      'course-explanation': "Regarde bien chaque nombre ! Tu dois observer sa forme et mémoriser comment il s'écrit !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour t'entraîner à reconnaître tous ces nombres !",
      'exercise-intro': "Super ! Tu es dans les exercices de reconnaissance des nombres !",
      'exercise-instruction': "Pour chaque question, regarde bien le nombre et choisis la bonne réponse. Allez, c'est parti !"
    },
    'comptage': {
      'course-intro': "Salut ! Aujourd'hui, nous allons apprendre à compter de 0 à 20 !",
      'course-explanation': "Compter, c'est dire les nombres dans l'ordre ! Écoute bien : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour t'entraîner à compter !",
      'exercise-intro': "Super ! Tu es dans les exercices de comptage !",
      'exercise-instruction': "Pour chaque question, compte bien et choisis la bonne réponse. N'oublie pas l'ordre des nombres !"
    },
    'ecriture': {
      'course-intro': "Salut ! Aujourd'hui, nous allons apprendre à écrire les nombres de 0 à 20 !",
      'course-explanation': "Chaque nombre a sa propre forme ! Il faut bien tracer chaque trait pour qu'on puisse le reconnaître !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour t'entraîner à écrire les nombres !",
      'exercise-intro': "Super ! Tu es dans les exercices d'écriture des nombres !",
      'exercise-instruction': "Pour chaque exercice, écris le nombre demandé en suivant bien le modèle !"
    },
    'dizaines-unites': {
      'course-intro': "Salut ! Aujourd'hui, nous allons découvrir les dizaines et les unités !",
      'course-explanation': "Dans un nombre comme 15, il y a 1 dizaine et 5 unités ! La dizaine, c'est un groupe de 10, et les unités, ce sont les nombres tout seuls !",
      'course-practice': "Regarde bien les exemples et clique sur l'onglet Exercices pour t'entraîner !",
      'exercise-intro': "Tu vas découvrir comment décomposer les nombres en dizaines et unités !"
    },
    'doubles-moities': {
      'course-intro': "Salut ! Aujourd'hui, nous allons découvrir les doubles et les moitiés !",
      'course-explanation': "Un double, c'est quand on ajoute un nombre à lui-même ! Et une moitié, c'est quand on partage en deux parts égales !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour t'entraîner !",
      'exercise-intro': "Tu vas apprendre à calculer les doubles et à trouver les moitiés ! C'est parti !"
    },
    'ordonner-comparer': {
      'course-intro': "Salut ! Aujourd'hui, nous allons apprendre à ordonner et comparer les nombres !",
      'course-explanation': "Comparer, c'est dire quel nombre est plus grand ou plus petit ! Ordonner, c'est ranger les nombres du plus petit au plus grand !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour t'entraîner !",
      'exercise-intro': "Tu vas apprendre à comparer et ordonner les nombres de 0 à 20 ! Allez-y !"
    },
    'decompositions': {
      'course-intro': "Salut ! Aujourd'hui, nous allons découvrir les décompositions additives !",
      'course-explanation': "Décomposer un nombre, c'est le séparer en plusieurs morceaux qui, additionnés, donnent le nombre de départ !",
      'course-practice': "Regarde bien les exemples et choisis un nombre à décomposer !",
      'exercise-intro': "Tu vas apprendre toutes les façons de décomposer les nombres !"
    },
    'complements-10': {
      'course-intro': "Salut ! Aujourd'hui, nous allons découvrir les compléments à 10 !",
      'course-explanation': "Un complément à 10, c'est le nombre qu'il faut ajouter pour arriver à 10 ! Par exemple, 7 + 3 = 10, donc 3 est le complément de 7 !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour t'entraîner !",
      'exercise-intro': "Tu vas maîtriser tous les compléments à 10 ! C'est très utile pour calculer vite !"
    }
  },

  // ➕ CP-ADDITIONS-SIMPLES  
  'cp-additions-simples': {
    'sens-addition': {
      'course-intro': "Salut ! Aujourd'hui, nous allons découvrir le sens de l'addition !",
      'course-explanation': "Additionner, c'est ajouter, réunir des objets ensemble ! C'est le contraire de soustraire !",
      'course-practice': "Tu peux essayer avec des objets, des nombres, ou des situations de la vie quotidienne !",
      'course-final': "Maintenant, clique sur l'onglet Exercices pour t'entraîner à comprendre l'addition !",
      'exercise-intro': "Super ! Tu es dans les exercices sur le sens de l'addition ! Tu vas découvrir 15 exercices variés pour bien comprendre ce que veut dire additionner !"
    },
    'additions-jusqu-20': {
      'course-intro': "Salut ! Aujourd'hui, nous allons maîtriser les additions jusqu'à 20 !",
      'course-explanation': "Il y a plusieurs stratégies pour additionner : compter sur ses doigts, ajouter un par un, ou utiliser les doubles !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour devenir un champion des additions !",
      'exercise-intro': "Super ! Tu es dans les exercices d'additions jusqu'à 20 ! Tu vas résoudre 15 additions variées !"
    },
    'problemes': {
      'course-intro': "Salut ! Aujourd'hui, nous allons résoudre des problèmes d'addition !",
      'course-explanation': "Un problème d'addition, c'est une histoire où il faut ajouter des choses ensemble pour trouver la réponse !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour résoudre plein de problèmes !",
      'exercise-intro': "Super ! Tu es dans les exercices de problèmes d'addition ! Tu vas résoudre 18 problèmes de la vie quotidienne !"
    }
  },

  // ➖ CP-SOUSTRACTIONS-SIMPLES
  'cp-soustractions-simples': {
    'sens-soustraction': {
      'course-intro': "Salut ! Aujourd'hui, nous allons découvrir le sens de la soustraction !",
      'course-explanation': "Soustraire, c'est enlever, retirer des objets ! C'est le contraire d'additionner !",
      'course-practice': "Tu peux essayer avec des objets, des nombres, ou des situations de la vie quotidienne !",
      'course-final': "Maintenant, clique sur l'onglet Exercices pour t'entraîner à comprendre la soustraction !",
      'exercise-intro': "Super ! Tu es dans les exercices sur le sens de la soustraction ! Tu vas découvrir 18 exercices variés !"
    },
    'soustractions-20': {
      'course-intro': "Salut ! Aujourd'hui, nous allons maîtriser les soustractions jusqu'à 20 !",
      'course-explanation': "Il y a 4 stratégies super efficaces : compter à rebours, décomposition, passer par 10, ou utiliser les doubles !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour devenir un champion des soustractions !",
      'exercise-intro': "Super ! Tu es dans les exercices de soustractions jusqu'à 20 ! Tu vas résoudre 20 soustractions variées !"
    },
    'techniques': {
      'course-intro': "Salut ! Aujourd'hui, nous allons découvrir les techniques avancées de soustraction !",
      'course-explanation': "Il existe plein d'astuces pour soustraire plus facilement : la ligne numérique, les bonds, la décomposition !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour maîtriser toutes ces techniques !",
      'exercise-intro': "Super ! Tu es dans les exercices de techniques de calcul ! Tu vas devenir un expert !"
    },
    'problemes': {
      'course-intro': "Salut ! Aujourd'hui, nous allons résoudre des problèmes de soustraction !",
      'course-explanation': "Un problème de soustraction, c'est une histoire où il faut enlever des choses pour trouver la réponse !",
      'course-practice': "Maintenant, clique sur l'onglet Exercices pour résoudre plein de problèmes !",
      'exercise-intro': "Super ! Tu es dans les exercices de problèmes de soustraction ! Tu vas résoudre 20 problèmes de la vie quotidienne !"
    }
  }
};

// 🎵 FONCTION DE GÉNÉRATION AUDIO
async function generateAudio(text, outputPath) {
  try {
    console.log(`🎵 Génération: ${outputPath}`);
    
    const request = {
      input: { text: text },
      voice: VOICE_CONFIG,
      audioConfig: AUDIO_CONFIG,
    };

    const [response] = await client.synthesizeSpeech(request);
    await fs.writeFile(outputPath, response.audioContent, 'binary');
    
    console.log(`✅ Généré: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur pour ${outputPath}:`, error.message);
    return false;
  }
}

// 🚀 GÉNÉRATION COMPLÈTE
async function generateAllAudio() {
  console.log('🚀 DÉMARRAGE GÉNÉRATION AUDIO GOOGLE TTS');
  console.log(`🎤 Voix: ${VOICE_CONFIG.name} (Vitesse: ${AUDIO_CONFIG.speakingRate}x)`);
  
  let totalFiles = 0;
  let successCount = 0;
  let characterCount = 0;

  for (const [section, chapters] of Object.entries(VOCAL_TEXTS)) {
    // Créer le dossier de section
    const sectionDir = path.join('public', 'audio', section);
    await fs.mkdir(sectionDir, { recursive: true });

    for (const [chapter, texts] of Object.entries(chapters)) {
      // Créer le dossier de chapitre
      const chapterDir = path.join(sectionDir, chapter);
      await fs.mkdir(chapterDir, { recursive: true });

      for (const [key, text] of Object.entries(texts)) {
        const outputPath = path.join(chapterDir, `${key}.mp3`);
        
        // Compter les caractères
        characterCount += text.length;
        totalFiles++;

        // Générer l'audio
        const success = await generateAudio(text, outputPath);
        if (success) successCount++;
        
        // Petit délai pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  console.log('\n🎉 GÉNÉRATION TERMINÉE !');
  console.log(`📊 Fichiers générés: ${successCount}/${totalFiles}`);
  console.log(`📝 Caractères totaux: ${characterCount.toLocaleString()}`);
  console.log(`💰 Coût estimé: GRATUIT (sous les 1M caractères/mois)`);
  
  if (characterCount > 1000000) {
    console.warn('⚠️ ATTENTION: Dépassement du tier gratuit !');
  }
}

// 🏃‍♂️ EXÉCUTION
if (require.main === module) {
  generateAllAudio().catch(console.error);
}

module.exports = { generateAllAudio, VOCAL_TEXTS }; 