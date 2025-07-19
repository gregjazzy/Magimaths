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
  
  // Remplacements pour les expressions mathématiques
  const replacements: { [key: string]: string } = {
    // Nombres
    'zéro': '0', 'un': '1', 'deux': '2', 'trois': '3', 'quatre': '4', 
    'cinq': '5', 'six': '6', 'sept': '7', 'huit': '8', 'neuf': '9', 'dix': '10',
    
    // Opérations
    'plus': '+', 'moins': '-', 'fois': '*', 'multiplié par': '*', 
    'divisé par': '/', 'égal': '=', 'égale': '=',
    
    // Variables courantes
    'x': 'x', 'y': 'y', 'a': 'a', 'b': 'b', 't': 't',
    'iksse': 'x', 'ixe': 'x', 'ics': 'x',
    
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