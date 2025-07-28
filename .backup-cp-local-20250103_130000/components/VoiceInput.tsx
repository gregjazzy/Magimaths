'use client';

import React, { useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from '../lib/useSpeechRecognition';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  className?: string;
  placeholder?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  className = '',
  placeholder = 'Parlez votre réponse...'
}) => {
  const {
    isListening,
    transcript,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Envoyer le transcript quand il change
  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!isSupported) {
    return null; // Ne pas afficher le bouton si non supporté
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Bouton microphone */}
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
        }`}
        title={isListening ? 'Cliquez pour arrêter l\'écoute' : 'Cliquez pour parler'}
      >
        {isListening ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Indicateur d'état */}
      <div className="flex flex-col">
        {isListening && (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-red-600 font-medium">Écoute...</span>
          </div>
        )}
        
        {transcript && (
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              Reconnu: "{transcript}"
            </span>
            {confidence > 0 && (
              <span className="text-xs text-gray-500">
                ({Math.round(confidence * 100)}%)
              </span>
            )}
            <button
              onClick={resetTranscript}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Effacer
            </button>
          </div>
        )}
        
        {error && (
          <div className="text-sm text-red-600 max-w-xs">
            {error}
          </div>
        )}
      </div>

      {/* Instructions pour l'utilisateur */}
      {!isListening && !transcript && (
        <div className="text-sm text-gray-500">
          <Volume2 className="w-4 h-4 inline mr-1" />
          {placeholder}
        </div>
      )}
    </div>
  );
}; 