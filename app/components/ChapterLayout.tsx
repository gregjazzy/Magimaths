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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header avec navigation */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href={navigation.previous.href} className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          
          {/* XP Display */}
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-gray-900">{xpEarned} XP</span>
              </div>
            </div>
            
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
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
        {sections.map((section) => (
          <section key={section.id} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
                <span className="text-2xl">{section.icon}</span>
                <span className="font-semibold text-blue-800">Section</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
            </div>
            
            {section.content}
            
            <div className="text-center mt-8">
              <button
                onClick={() => handleSectionComplete(section.id, section.xpReward)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  completedSections.includes(section.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {completedSections.includes(section.id) ? `✓ Terminé ! +${section.xpReward} XP` : `Terminer +${section.xpReward} XP`}
              </button>
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