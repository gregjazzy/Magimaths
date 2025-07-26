// 🎵 CONFIGURATION VOCALE OPTIMISÉE FIXE
// Configuration déterminée une fois et utilisée en permanence

export interface VoiceConfiguration {
  // Voix sélectionnée (définie après analyse)
  preferredVoiceName?: string;
  voiceURI?: string;
  
  // Paramètres audio optimisés
  rate: number;
  pitch: number;
  volume: number;
  
  // Métadonnées
  quality: 'auto' | 'premium' | 'standard';
  optimizedFor: 'education' | 'general';
  lastUpdated: string;
}

// 🎯 CONFIGURATION PAR DÉFAUT (à optimiser selon votre système)
export const DEFAULT_VOICE_CONFIG: VoiceConfiguration = {
  // Voix : À définir après analyse de votre système
  preferredVoiceName: undefined, // Sera auto-détectée ou configurée
  voiceURI: undefined,
  
  // Paramètres optimisés pour l'éducation
  rate: 1.1,        // Vitesse légèrement ralentie pour clarté
  pitch: 0.95,      // Ton légèrement grave, plus naturel
  volume: 0.85,     // Volume optimal sans saturation
  
  // Métadonnées
  quality: 'auto',
  optimizedFor: 'education',
  lastUpdated: '2024-01-01'
};

// 🔧 CONFIGURATIONS PRÉDÉFINIES POUR DIFFÉRENTS SYSTÈMES

// macOS - Configuration optimisée avec Thomas
export const MACOS_VOICE_CONFIG: VoiceConfiguration = {
  preferredVoiceName: "Thomas", // Voix masculine française sélectionnée
  rate: 1.1,
  pitch: 0.95,
  volume: 0.85,
  quality: 'premium',
  optimizedFor: 'education',
  lastUpdated: '2024-07-26'
};

// Windows - Configuration optimisée
export const WINDOWS_VOICE_CONFIG: VoiceConfiguration = {
  preferredVoiceName: "Hortense", // Voix française Windows
  rate: 1.1,
  pitch: 1.0,
  volume: 0.8,
  quality: 'standard',
  optimizedFor: 'education',
  lastUpdated: '2024-01-01'
};

// Navigateur - Fallback générique
export const BROWSER_VOICE_CONFIG: VoiceConfiguration = {
  // Pas de voix spécifique, utilise la première française disponible
  rate: 1.1,
  pitch: 0.95,
  volume: 0.85,
  quality: 'auto',
  optimizedFor: 'education',
  lastUpdated: '2024-01-01'
};

// 🎯 FONCTION POUR APPLIQUER UNE CONFIGURATION
export const getOptimizedVoice = (config: VoiceConfiguration): SpeechSynthesisVoice | null => {
  // Vérification côté client uniquement
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }
  
  const voices = speechSynthesis.getVoices();
  
  // 1. Chercher la voix préférée par nom
  if (config.preferredVoiceName) {
    const preferredVoice = voices.find(voice => 
      voice.name.includes(config.preferredVoiceName!) && 
      voice.lang.startsWith('fr')
    );
    if (preferredVoice) {
      console.log(`🎵 Voix configurée trouvée: ${preferredVoice.name}`);
      return preferredVoice;
    }
  }
  
  // 2. Chercher par URI si disponible
  if (config.voiceURI) {
    const uriVoice = voices.find(voice => voice.voiceURI === config.voiceURI);
    if (uriVoice) {
      console.log(`🎵 Voix configurée par URI: ${uriVoice.name}`);
      return uriVoice;
    }
  }
  
  // 3. Fallback : première voix française disponible
  const fallbackVoice = voices.find(voice => voice.lang.startsWith('fr'));
  if (fallbackVoice) {
    console.log(`🔄 Voix fallback utilisée: ${fallbackVoice.name}`);
    return fallbackVoice;
  }
  
  console.warn('⚠️ Aucune voix française trouvée');
  return null;
};

// 🛠️ FONCTION UTILITAIRE : Créer une config depuis une voix
export const createConfigFromVoice = (voice: SpeechSynthesisVoice): VoiceConfiguration => {
  return {
    preferredVoiceName: voice.name,
    voiceURI: voice.voiceURI,
    rate: 1.1,
    pitch: 0.95,
    volume: 0.85,
    quality: voice.localService ? 'premium' : 'standard',
    optimizedFor: 'education',
    lastUpdated: new Date().toISOString().split('T')[0]
  };
};

// 📱 DÉTECTION AUTOMATIQUE DU SYSTÈME
export const getSystemOptimizedConfig = (): VoiceConfiguration => {
  // Vérification côté client uniquement
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    console.log('🌐 Configuration serveur (fallback)');
    return BROWSER_VOICE_CONFIG;
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('mac')) {
    console.log('🍎 Configuration macOS détectée');
    return MACOS_VOICE_CONFIG;
  } else if (userAgent.includes('windows')) {
    console.log('🪟 Configuration Windows détectée');
    return WINDOWS_VOICE_CONFIG;
  } else {
    console.log('🌐 Configuration navigateur générique');
    return BROWSER_VOICE_CONFIG;
  }
};

// 🎯 CONFIGURATION ACTIVE (à utiliser dans l'app)
export const ACTIVE_VOICE_CONFIG: VoiceConfiguration = getSystemOptimizedConfig();

export default {
  DEFAULT_VOICE_CONFIG,
  MACOS_VOICE_CONFIG,
  WINDOWS_VOICE_CONFIG,
  BROWSER_VOICE_CONFIG,
  ACTIVE_VOICE_CONFIG,
  getOptimizedVoice,
  createConfigFromVoice,
  getSystemOptimizedConfig
}; 