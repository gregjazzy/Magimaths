'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useChapterContext } from './ChapterLayout';

interface ExerciseCardProps {
  id: string;
  title: string;
  question: string;
  correctAnswer: string;
  explanation?: string;
  hint?: string;
  xp: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  type: 'input' | 'multiple-choice' | 'formula';
  options?: string[];
  placeholder?: string;
}

export default function ExerciseCard({
  id,
  title,
  question,
  correctAnswer,
  explanation,
  hint,
  xp,
  difficulty,
  type,
  options,
  placeholder = "Votre réponse..."
}: ExerciseCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const { completedSections, handleSectionComplete } = useChapterContext();
  const isCompleted = completedSections.includes(id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const normalizeAnswer = (answer: string) => {
    return answer.replace(/\s+/g, '').toLowerCase();
  };

  const validateAnswer = () => {
    const normalized = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    const isAnswerCorrect = normalized === normalizedCorrect;
    
    setIsValidated(true);
    setIsCorrect(isAnswerCorrect);
    setShowSolution(true);
    
    if (isAnswerCorrect && !isCompleted) {
      handleSectionComplete(id, xp);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'formula':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-lg"
              disabled={isValidated}
            />
            <div className="text-sm text-gray-500 mt-2">
              💡 Utilisez la notation mathématique standard (ex: x^2 pour x²)
            </div>
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg"
            disabled={isValidated}
          />
        );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 p-6 ${
      isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isCompleted && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">+{xp} XP</span>
            </div>
          )}
          
          {!isCompleted && (
            <div className="text-sm text-gray-500">
              {xp} XP
            </div>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <div className="text-gray-800 font-medium mb-3">{question}</div>
        
        {/* Hint */}
        {hint && (
          <div className="mb-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showHint ? 'Masquer' : 'Afficher'} l'indice</span>
            </button>
            
            {showHint && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">💡 {hint}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mb-4">
        {renderInput()}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {!isValidated ? (
          <button
            onClick={validateAnswer}
            disabled={!userAnswer.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Valider
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            {isCorrect ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Correct !</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Incorrect</span>
              </div>
            )}
          </div>
        )}
        
        {showSolution && (
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {showSolution ? 'Masquer' : 'Voir'} la solution
          </button>
        )}
      </div>

      {/* Solution */}
      {showSolution && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-800 mb-2">
            ✅ Réponse correcte : <span className="font-mono">{correctAnswer}</span>
          </div>
          
          {explanation && (
            <div className="text-sm text-gray-600">
              <strong>Explication :</strong> {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 