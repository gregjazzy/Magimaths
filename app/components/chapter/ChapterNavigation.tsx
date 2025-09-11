'use client';

interface ChapterNavigationProps {
  showExercises: boolean;
  score: number;
  totalExercises: number;
  onToggle: (showExercises: boolean) => void;
}

export default function ChapterNavigation({ showExercises, score, totalExercises, onToggle }: ChapterNavigationProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-white/50">
        <button
          onClick={() => onToggle(false)}
          className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
            !showExercises 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25' 
              : 'text-gray-600 hover:bg-gray-100/50 hover:text-indigo-600'
          }`}
        >
          <span className="flex items-center space-x-2">
            <span className={`transition-transform duration-300 ${!showExercises ? 'scale-110' : ''}`}>📚</span>
            <span>Cours</span>
          </span>
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
            showExercises 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/25' 
              : 'text-gray-600 hover:bg-gray-100/50 hover:text-purple-600'
          }`}
        >
          <span className="flex items-center space-x-2">
            <span className={`transition-transform duration-300 ${showExercises ? 'scale-110' : ''}`}>✏️</span>
            <span>Exercices</span>
            <span className={`px-2 py-0.5 rounded-full text-sm transition-all duration-300 ${
              showExercises 
                ? 'bg-white/20 text-white' 
                : 'bg-purple-100 text-purple-600'
            }`}>
              {score}/{totalExercises}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
