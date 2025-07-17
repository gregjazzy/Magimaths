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
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{question}</p>
      </div>

      <div className="space-y-4 mb-6">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={showResult}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedOption === option.id
                ? showResult
                  ? option.isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.text}</span>
              {showResult && selectedOption === option.id && (
                option.isCorrect ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )
              )}
            </div>
            {showResult && selectedOption === option.id && option.explanation && (
              <div className="mt-2 text-sm text-gray-600">
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
            className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
              selectedOption
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Valider ma réponse
          </button>
        ) : (
          <div className="space-y-4">
            {selectedOption && options.find(opt => opt.id === selectedOption)?.isCorrect ? (
              <div className="text-green-600 font-semibold">
                ✓ Correct ! +{xp} XP
              </div>
            ) : (
              <div className="text-red-600 font-semibold">
                ✗ Incorrect, réessayez !
              </div>
            )}
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-all"
            >
              Recommencer
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 