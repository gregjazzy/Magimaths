'use client';

import { useState } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';

interface ExerciseOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface ExerciseCardProps {
  id: string;
  title: string;
  question: string;
  options: ExerciseOption[];
  xp: number;
  onComplete: (exerciseId: string, xp: number) => void;
  completed: boolean;
}

export default function ExerciseCard({ 
  id, 
  title, 
  question, 
  options, 
  xp, 
  onComplete, 
  completed 
}: ExerciseCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    if (showResult) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setShowResult(true);
    
    const selectedAnswer = options.find(opt => opt.id === selectedOption);
    if (selectedAnswer?.isCorrect) {
      onComplete(id, xp);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  return (
    <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-3xl hover:scale-105 overflow-hidden">
      {/* Effet de fond magique */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Particule magique */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <span className="text-xs font-bold text-white">XP</span>
        </div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-bold text-blue-800">+{xp} XP</span>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">{title}</h3>
          <p className="text-gray-700 text-lg leading-relaxed">{question}</p>
        </div>

        <div className="space-y-3 mb-8">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={showResult}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
              selectedOption === option.id
                ? showResult
                  ? option.isCorrect
                      ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-green-200'
                      : 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-red-200'
                    : 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{option.text}</span>
              {showResult && selectedOption === option.id && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    option.isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {option.isCorrect ? (
                      <Check className="h-5 w-5 text-white" />
                ) : (
                      <X className="h-5 w-5 text-white" />
                    )}
                  </div>
              )}
            </div>
            {showResult && selectedOption === option.id && option.explanation && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border-l-4 border-blue-500">
                {option.explanation}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="text-center">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
              className={`px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-110 shadow-lg ${
              selectedOption
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
              Valider ma réponse ✨
          </button>
        ) : (
          <div className="space-y-4">
            {selectedOption && options.find(opt => opt.id === selectedOption)?.isCorrect ? (
                <div className="text-green-600 font-bold text-lg flex items-center justify-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  Correct ! +{xp} XP
              </div>
            ) : (
                <div className="text-red-600 font-bold text-lg flex items-center justify-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  Incorrect, réessayez !
              </div>
            )}
            <button
              onClick={handleReset}
                className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all transform hover:scale-105"
            >
              Recommencer
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 