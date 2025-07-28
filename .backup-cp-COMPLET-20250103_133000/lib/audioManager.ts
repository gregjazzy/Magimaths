// �� GESTIONNAIRE AUDIO SIMPLIFIÉ AVEC CONFIGURATION FIXE
// Utilise une configuration vocale pré-optimisée au lieu d'analyser à chaque fois

import { ACTIVE_VOICE_CONFIG, getOptimizedVoice } from './voiceConfig';

interface AudioManagerState {
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  shouldStop: boolean;
  userHasInteracted: boolean;
  configuredVoice: SpeechSynthesisVoice | null;
}

// État global du gestionnaire audio
const audioState: AudioManagerState = {
  currentAudio: null,
  isPlaying: false,
  shouldStop: false,
  userHasInteracted: false,
  configuredVoice: null
};

// 🎯 INITIALISATION SIMPLE DE LA VOIX CONFIGURÉE
const initializeConfiguredVoice = (): void => {
  // Vérification côté client uniquement
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  
  // Attendre que les voix soient chargées
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.addEventListener('voiceschanged', () => {
      audioState.configuredVoice = getOptimizedVoice(ACTIVE_VOICE_CONFIG);
      if (audioState.configuredVoice) {
        console.log(`🎵 VOIX CONFIGURÉE PRÊTE: ${audioState.configuredVoice.name}`);
      }
    });
  } else {
    audioState.configuredVoice = getOptimizedVoice(ACTIVE_VOICE_CONFIG);
  }
};

// Auto-initialisation
initializeConfiguredVoice();

// 🎵 FONCTION PRINCIPALE HYBRIDE : Audio Premium OU Web Speech API Configuré
export const playAudio = (section: string, chapter: string, audioKey: string, fallbackText?: string, rate: number = 1.1): Promise<void> => {
  return new Promise(async (resolve) => {
    // 🛑 Arrêter tout audio en cours
    stopAllAudio();
    
    // 🔒 Vérifier le signal d'arrêt
    if (audioState.shouldStop) {
      console.log("🛑 ARRÊT : Signal d'arrêt détecté");
      resolve();
      return;
    }
    
    // 📁 Construire le chemin du fichier audio
    const audioPath = `/audio/${section}/${chapter}/${audioKey}.mp3`;
    
    // 🎯 STRATÉGIE 1 : Essayer le fichier audio pré-généré
    try {
      const audioExists = await checkAudioExists(audioPath);
      
      if (audioExists) {
        console.log(`🎵 AUDIO PREMIUM : ${audioPath}`);
        return playPreGeneratedAudio(audioPath, resolve);
      }
    } catch (error) {
      console.log(`📁 Fichier audio non trouvé : ${audioPath}`);
    }
    
    // 🎯 STRATÉGIE 2 : Fallback sur Web Speech API avec configuration fixe
    if (fallbackText) {
      console.log(`🔄 FALLBACK WEB SPEECH CONFIGURÉ : ${fallbackText.substring(0, 30)}...`);
      return playConfiguredWebSpeechAudio(fallbackText, rate, resolve);
    }
    
    console.log("❌ Aucune source audio disponible");
    resolve();
  });
};

// 🔍 VÉRIFIER L'EXISTENCE D'UN FICHIER AUDIO
const checkAudioExists = (audioPath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve(true);
    audio.onerror = () => resolve(false);
    audio.src = audioPath;
    // Timeout pour éviter d'attendre indéfiniment
    setTimeout(() => resolve(false), 1000);
  });
};

// 🎵 LECTURE FICHIER AUDIO PRÉ-GÉNÉRÉ
const playPreGeneratedAudio = (audioPath: string, resolve: () => void): void => {
  const audio = new Audio(audioPath);
  audio.volume = ACTIVE_VOICE_CONFIG.volume;
  audio.playbackRate = 1.0; // Vitesse déjà optimisée dans la génération
  
  // 📝 Mettre à jour l'état
  audioState.currentAudio = audio;
  audioState.isPlaying = true;
  
  // 🎯 Event Listeners
  audio.onended = () => {
    console.log(`✅ AUDIO PREMIUM TERMINÉ : ${audioPath}`);
    audioState.isPlaying = false;
    audioState.currentAudio = null;
    resolve();
  };
  
  audio.onerror = (error) => {
    console.error(`❌ ERREUR AUDIO PREMIUM : ${audioPath}`, error);
    audioState.isPlaying = false;
    audioState.currentAudio = null;
    resolve();
  };
  
  // 🚀 Démarrer la lecture
  audio.play().catch((error) => {
    console.error(`❌ ERREUR LECTURE PREMIUM : ${audioPath}`, error);
    audioState.isPlaying = false;
    audioState.currentAudio = null;
    resolve();
  });
};

// 🔄 LECTURE WEB SPEECH API AVEC CONFIGURATION FIXE (FALLBACK)
const playConfiguredWebSpeechAudio = (text: string, customRate: number, resolve: () => void): void => {
  // 🔒 Vérification côté client uniquement
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.log("🚫 BLOQUÉ : speechSynthesis non disponible");
    resolve();
    return;
  }
  
  // 🔒 Protection : Empêcher les vocaux sans interaction utilisateur
  if (!audioState.userHasInteracted) {
    console.log("🚫 BLOQUÉ : Tentative de vocal sans interaction");
    resolve();
    return;
  }
  
  // 🔥 Arrêt systématique des vocaux précédents
  speechSynthesis.cancel();
  setTimeout(() => speechSynthesis.cancel(), 10);
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // 🎯 UTILISER LA VOIX CONFIGURÉE
  if (audioState.configuredVoice) {
    utterance.voice = audioState.configuredVoice;
    console.log(`🎵 Utilisation voix configurée: ${audioState.configuredVoice.name}`);
  } else {
    console.log("⚠️ Voix par défaut utilisée (configuration en cours...)");
  }
  
  // 🎛️ PARAMÈTRES FIXES OPTIMISÉS
  utterance.lang = 'fr-FR';
  utterance.rate = customRate * (ACTIVE_VOICE_CONFIG.rate / 1.1); // Ajustement proportionnel
  utterance.pitch = ACTIVE_VOICE_CONFIG.pitch;
  utterance.volume = ACTIVE_VOICE_CONFIG.volume;
  
  utterance.onend = () => {
    console.log("✅ WEB SPEECH CONFIGURÉ TERMINÉ :", text.substring(0, 30) + "...");
    audioState.isPlaying = false;
    resolve();
  };
  
  utterance.onerror = () => {
    console.log("❌ ERREUR WEB SPEECH CONFIGURÉ :", text.substring(0, 30) + "...");
    audioState.isPlaying = false;
    resolve();
  };
  
  console.log("🔄 DÉMARRAGE WEB SPEECH CONFIGURÉ :", text.substring(0, 30) + "...");
  audioState.isPlaying = true;
  speechSynthesis.speak(utterance);
};

// 🛑 FONCTION D'ARRÊT ULTRA-AGRESSIVE HYBRIDE
export const stopAllAudio = (): void => {
  console.log("🛑 ARRÊT ULTRA-AGRESSIF de tous les audios");
  
  // 🎵 Arrêter l'audio HTML en cours
  if (audioState.currentAudio) {
    audioState.currentAudio.pause();
    audioState.currentAudio.currentTime = 0;
    audioState.currentAudio = null;
  }
  
  // 🔄 Arrêter Web Speech API (côté client uniquement)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
    setTimeout(() => speechSynthesis.cancel(), 10);
    setTimeout(() => speechSynthesis.cancel(), 50);
    setTimeout(() => speechSynthesis.cancel(), 100);
  }
  
  // 🔄 Réinitialiser l'état
  audioState.isPlaying = false;
  audioState.shouldStop = true;
  
  // 🕐 Réinitialiser le signal d'arrêt après un délai
  setTimeout(() => {
    audioState.shouldStop = false;
  }, 500);
};

// 👆 MARQUER L'INTERACTION UTILISATEUR
export const markUserInteraction = (): void => {
  audioState.userHasInteracted = true;
  console.log("👆 Interaction utilisateur détectée");
  
  // Forcer la configuration de la voix si pas encore fait
  if (!audioState.configuredVoice) {
    setTimeout(() => {
      audioState.configuredVoice = getOptimizedVoice(ACTIVE_VOICE_CONFIG);
    }, 100);
  }
};

// 🔧 FONCTIONS DE DIAGNOSTIC SIMPLIFIÉES
export const showCurrentConfig = (): void => {
  console.log('🎵 CONFIGURATION VOCALE ACTIVE');
  console.log('='.repeat(40));
  console.log('📊 Système détecté:', navigator.userAgent.includes('Mac') ? 'macOS' : 'Autre');
  console.log('🎤 Voix préférée:', ACTIVE_VOICE_CONFIG.preferredVoiceName || 'Auto');
  console.log('🎛️ Paramètres:');
  console.log(`   Rate: ${ACTIVE_VOICE_CONFIG.rate}`);
  console.log(`   Pitch: ${ACTIVE_VOICE_CONFIG.pitch}`);
  console.log(`   Volume: ${ACTIVE_VOICE_CONFIG.volume}`);
  
  if (audioState.configuredVoice) {
    console.log('✅ Voix active:', audioState.configuredVoice.name);
  } else {
    console.log('⚠️ Voix en cours de configuration...');
  }
};

// 🎭 FONCTIONS D'ALIAS POUR COMPATIBILITÉ
export const playVocal = (section: string, chapter: string, audioKey: string, fallbackText?: string, rate: number = 1.1): Promise<void> => {
  return playAudio(section, chapter, audioKey, fallbackText, rate);
};

export const stopAllVocals = stopAllAudio;

// 📊 FONCTION UTILITAIRE : État du gestionnaire
export const getAudioState = (): AudioManagerState => {
  return { ...audioState };
};

// 🎯 FONCTIONS SPÉCIALISÉES PAR SECTION

// 🔢 CP-NOMBRES-JUSQU-20
export const playCP20Audio = (chapter: string, audioKey: string, fallbackText?: string): Promise<void> => {
  return playAudio('cp-nombres-jusqu-20', chapter, audioKey, fallbackText);
};

// ➕ CP-ADDITIONS-SIMPLES
export const playCPAdditionsAudio = (chapter: string, audioKey: string, fallbackText?: string): Promise<void> => {
  return playAudio('cp-additions-simples', chapter, audioKey, fallbackText);
};

// ➖ CP-SOUSTRACTIONS-SIMPLES
export const playCPSoustractionsAudio = (chapter: string, audioKey: string, fallbackText?: string): Promise<void> => {
  return playAudio('cp-soustractions-simples', chapter, audioKey, fallbackText);
};

// 🎵 MAPPING DES AUDIOS DISPONIBLES (pour validation)
export const AVAILABLE_AUDIOS = {
  'cp-nombres-jusqu-20': {
    'reconnaissance': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro', 'exercise-instruction'],
    'comptage': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro', 'exercise-instruction'],
    'ecriture': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro', 'exercise-instruction'],
    'dizaines-unites': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro'],
    'doubles-moities': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro'],
    'ordonner-comparer': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro'],
    'decompositions': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro'],
    'complements-10': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro']
  },
  'cp-additions-simples': {
    'sens-addition': ['course-intro', 'course-explanation', 'course-practice', 'course-final', 'exercise-intro'],
    'additions-jusqu-20': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro'],
    'problemes': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro']
  },
  'cp-soustractions-simples': {
    'sens-soustraction': ['course-intro', 'course-explanation', 'course-practice', 'course-final', 'exercise-intro'],
    'soustractions-20': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro'],
    'techniques': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro'],
    'problemes': ['course-intro', 'course-explanation', 'course-practice', 'exercise-intro']
  }
} as const;

// 🎯 FONCTION DE VALIDATION
export const isAudioAvailable = (section: string, chapter: string, audioKey: string): boolean => {
  const sectionAudios = AVAILABLE_AUDIOS[section as keyof typeof AVAILABLE_AUDIOS];
  if (!sectionAudios) return false;
  
  const chapterAudios = sectionAudios[chapter as keyof typeof sectionAudios] as readonly string[] | undefined;
  if (!chapterAudios) return false;
  
  return (chapterAudios as readonly string[]).includes(audioKey);
};

export default {
  playAudio,
  stopAllAudio,
  playVocal,
  stopAllVocals,
  getAudioState,
  markUserInteraction,
  showCurrentConfig,
  playCP20Audio,
  playCPAdditionsAudio,
  playCPSoustractionsAudio,
  isAudioAvailable
}; 