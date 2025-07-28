'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { useChapterContext } from './ChapterLayout';

interface Formula {
  rule: string;
  example: string;
  description?: string;
}

interface FormulaSectionProps {
  title: string;
  formulas: Formula[];
  sectionId: string;
  xp: number;
  bgColor?: string;
  borderColor?: string;
}

export default function FormulaSection({
  title,
  formulas,
  sectionId,
  xp,
  bgColor = "bg-white",
  borderColor = "border-gray-200"
}: FormulaSectionProps) {
  const [isViewed, setIsViewed] = useState(false);
  const { completedSections, handleSectionComplete } = useChapterContext();
  const isCompleted = completedSections.includes(sectionId);

  const handleView = () => {
    if (!isViewed && !isCompleted) {
      setIsViewed(true);
      handleSectionComplete(sectionId, xp);
    }
  };

  return (
    <section className={`${bgColor} rounded-3xl p-8 shadow-xl border ${borderColor} mb-8`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-800">Formules de référence</span>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          
          {isCompleted && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">+{xp} XP</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4" onClick={handleView}>
        {formulas.map((formula, index) => (
          <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
            <div className="font-mono text-blue-800 font-bold mb-2 text-lg">
              {formula.rule}
            </div>
            <div className="text-sm text-blue-600 mb-1">
              <strong>Exemple :</strong> {formula.example}
            </div>
            {formula.description && (
              <div className="text-xs text-blue-500 italic">
                {formula.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isCompleted && (
        <div className="text-center mt-6">
          <div className="text-sm text-gray-500">
            Consultez les formules pour gagner {xp} XP
          </div>
        </div>
      )}
    </section>
  );
} 