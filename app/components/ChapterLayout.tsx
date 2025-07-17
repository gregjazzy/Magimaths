'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, BookOpen, Target } from 'lucide-react';
import Link from 'next/link';

interface ChapterSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
  xpReward: number;
}

interface ChapterNavigation {
  previous: { href: string; text: string };
  next: { href: string; text: string };
}

interface ChapterLayoutProps {
  title: string;
  description: string;
  sections: ChapterSection[];
  navigation: ChapterNavigation;
}

export default function ChapterLayout({ title, description, sections, navigation }: ChapterLayoutProps) {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const handleSectionComplete = (sectionId: string, xp: number) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
      setXpEarned(prev => prev + xp);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Particules de fond pour l'effet magique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-40 w-32 h-32 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header avec navigation */}
      <div className="max-w-4xl mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <Link href={navigation.previous.href} className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          
          {/* XP Display */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl border border-white/20">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-gray-900">{xpEarned} XP</span>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl border border-white/20">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-gray-900">
                  {completedSections.length}/{sections.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Title */}
      <div className="max-w-4xl mx-auto px-6 pb-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-lg text-gray-600">{description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        {sections.map((section, index) => (
          <section key={section.id} className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-3xl hover:scale-105 overflow-hidden">
            {/* Effet de fond magique */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Particules flottantes */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-6 shadow-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {section.icon}
                  </div>
                  <span className="font-bold text-blue-800 text-lg">Section {index + 1}</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">{section.title}</h2>
            </div>
            
            {section.content}
            
            <div className="text-center mt-8">
              <button
                onClick={() => handleSectionComplete(section.id, section.xpReward)}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-110 shadow-lg ${
                  completedSections.includes(section.id)
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-200'
                }`}
              >
                  {completedSections.includes(section.id) ? (
                    <span className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Terminé ! +{section.xpReward} XP
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Terminer +{section.xpReward} XP
                    </span>
                  )}
              </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <Link 
            href={navigation.previous.href}
            className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{navigation.previous.text}</span>
          </Link>
          
          <Link 
            href={navigation.next.href}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <span>{navigation.next.text}</span>
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
} 