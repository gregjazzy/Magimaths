import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Fonction pour convertir le texte parlé en expression mathématique
const convertSpeechToMath = (speech: string): string => {
  let result = speech.toLowerCase();
  
  // 🎤 ÉTAPE 1: Corrections d'erreurs de reconnaissance vocale courantes
  const voiceCorrections: { [key: string]: string } = {
    // Corrections pour "moins" souvent entendu comme "moi"
    'moi': 'moins',
    'moi ns': 'moins', 
    'moin': 'moins',
    'moyen': 'moins',
    'moin s': 'moins',
    
    // Corrections pour "deux" souvent entendu comme "de"
    'de x': 'deux x',
    'de y': 'deux y',
    'de a': 'deux a',
    'de b': 'deux b',
    'de t': 'deux t',
    'de fois': 'deux fois',
    'de plus': 'deux plus',
    'de moins': 'deux moins',
    'de carré': 'deux carré',
    'de cube': 'deux cube',
    
    // Autres corrections phonétiques courantes
    'x 2': 'x carré',
    'x deux': 'x carré',
    'x 3': 'x cube',
    'x trois': 'x cube',
    'ikse': 'x',
    'ix': 'x',
    'time': 'fois',
    'multiplie': 'fois',
  };
  
  // Appliquer les corrections de reconnaissance vocale d'abord
  for (const [incorrect, correct] of Object.entries(voiceCorrections)) {
    const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
    result = result.replace(regex, correct);
  }
  
  // 🎤 ÉTAPE 2: Post-traitement intelligent pour erreurs contextuelles
  // Si "moi" apparaît entre des nombres/variables, c'est probablement "moins"
  result = result.replace(/([0-9]|x|y|a|b|t|\))(\s+)moi(\s+)([0-9]|x|y|a|b|t|\()/gi, '$1$2moins$3$4');
  
  // Si "de" apparaît au début d'une expression ou après une opération, c'est probablement "deux"
  result = result.replace(/(^|[+\-*/=()]\s*)de(\s+)([x|y|a|b|t])/gi, '$1deux$2$3');
  // Si "de" apparaît avant une opération mathématique, c'est probablement "deux"  
  result = result.replace(/(\s+)de(\s+)(plus|moins|fois|carré|cube|[+\-*/])/gi, '$1deux$2$3');
  // Si "de" est isolé entre des espaces dans un contexte mathématique
  result = result.replace(/(\s+)de(\s+)/gi, ' deux ');
  
  // Remplacements pour les expressions mathématiques
  const replacements: { [key: string]: string } = {
    // Nombres (avec variantes phonétiques)
    'zéro': '0', 'un': '1', 'deux': '2', 'trois': '3', 'quatre': '4', 
    'cinq': '5', 'six': '6', 'sept': '7', 'huit': '8', 'neuf': '9', 'dix': '10',
    // Variantes pour "deux"
    'de': '2', 'de ': '2',
    
    // Opérations (avec variantes phonétiques)
    'plus': '+', 'moins': '-', 'fois': '*', 'multiplié par': '*', 
    'divisé par': '/', 'égal': '=', 'égale': '=',
    // Variantes pour "moins"
    'moin': '-', 'moin s': '-', 'moins s': '-',
    
    // Variables courantes
    'x': 'x', 'y': 'y', 'a': 'a', 'b': 'b', 't': 't',
    'iksse': 'x', 'ixe': 'x', 'ics': 'x', 'ix': 'x', 'ikse': 'x',
    
    // Parenthèses
    'parenthèse ouvrante': '(', 'parenthèse fermante': ')',
    'ouvre parenthèse': '(', 'ferme parenthèse': ')',
    'parenthèse ouverte': '(', 'parenthèse fermée': ')',
    
    // Puissances
    'au carré': '²', 'carré': '²', 'puissance deux': '²',
    'au cube': '³', 'cube': '³', 'puissance trois': '³',
    
    // Fractions
    'sur': '/', 'demi': '1/2', 'tiers': '1/3', 'quart': '1/4',
    
    // Virgule décimale
    'virgule': ',', 'point': '.',
  };
  
  // Appliquer les remplacements
  for (const [speech, math] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${speech}\\b`, 'gi');
    result = result.replace(regex, math);
  }
  
  // 🎤 ÉTAPE 3: Post-traitement final pour les erreurs résiduelles
  // Si on trouve encore "moi" dans un contexte clairement mathématique, le remplacer par "-"
  result = result.replace(/([+*/=()]|^|\s)moi([+*/=()]|$|\s)/gi, '$1-$2');
  
  // Si on trouve encore "de" dans un contexte clairement mathématique, le remplacer par "deux"
  result = result.replace(/(^|\s)de(\s|$)/gi, '$1deux$2');
  // Dernière correction pour "de" suivi directement d'une variable
  result = result.replace(/\bde([xyz])\b/gi, 'deux$1');
  
  // Nettoyer les espaces multiples
  result = result.replace(/\s+/g, ' ').trim();
  
  // Enlever les espaces autour des opérateurs
  result = result.replace(/\s*([+\-*/=()²³])\s*/g, '$1');
  
  return result;
};

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    // Vérifier la compatibilité du navigateur
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      // Configuration
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'fr-FR';
      recognition.maxAlternatives = 1;
      
      // Gestionnaires d'événements
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0];
        const rawTranscript = speechResult.transcript;
        const mathTranscript = convertSpeechToMath(rawTranscript);
        
        setTranscript(mathTranscript);
        setConfidence(speechResult.confidence);
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        setError(`Erreur de reconnaissance vocale: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
      setError('La reconnaissance vocale n\'est pas supportée par ce navigateur');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError(null);
      setTranscript('');
      recognitionRef.current.start();
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };
  
  const resetTranscript = () => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  };
  
  return {
    isListening,
    transcript,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}; 