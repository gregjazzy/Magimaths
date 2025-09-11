'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ChapterHeaderProps {
  title: string;
  description: string;
  backLink: string;
  onBack?: () => void;
}

export default function ChapterHeader({ title, description, backLink, onBack }: ChapterHeaderProps) {
  return (
    <div className="mb-8">
      <Link 
        href={backLink} 
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Retour au chapitre</span>
      </Link>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 transition-all duration-300">
          {description}
        </p>
      </div>
    </div>
  );
}
