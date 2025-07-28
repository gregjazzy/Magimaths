'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleNavigationProps {
  currentSection: number;
  completedSections: string[];
  xpEarned: number;
}

export default function CollapsibleNavigation({ currentSection, completedSections, xpEarned }: CollapsibleNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: 1, name: "Intro", path: "/chapitre/equations-second-degre" },
    { id: 2, name: "Canonique", path: "/chapitre/equations-second-degre-forme-canonique" },
    { id: 3, name: "Variations", path: "/chapitre/equations-second-degre-variations" },
    { id: 4, name: "Résolution", path: "/chapitre/equations-second-degre-resolution" },
    { id: 5, name: "Techniques", path: "/chapitre/equations-second-degre-techniques-avancees" },
    { id: 6, name: "Inéquations", path: "/chapitre/equations-second-degre-tableaux-signes" },
    { id: 7, name: "Paramètres", path: "/chapitre/equations-second-degre-parametres" },
    { id: 8, name: "Cube", path: "/chapitre/equations-second-degre-equations-cube" },
  ];

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 hover:from-blue-200 hover:via-purple-200 hover:to-pink-200 rounded-3xl transition-all duration-300 mb-3 shadow-xl hover:shadow-2xl transform hover:scale-110 border border-blue-200 hover:border-purple-300"
      >
        <span className="font-bold text-blue-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <span className="text-white text-sm font-bold">🧭</span>
          </div>
          Navigation Magique ✨
        </span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="h-5 w-5 text-blue-600" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50">
              {sections.map((section) => {
                const isCurrent = section.id === currentSection;
                const isCompleted = completedSections.includes(`section-${section.id}`) || completedSections.includes(section.name.toLowerCase());

                return (
                  <Link
                    key={section.id}
                    href={section.path}
                    className={`group flex items-center justify-center px-4 py-3 rounded-2xl font-bold transition-all duration-300 text-center relative transform hover:scale-110 hover:-translate-y-1 ${
                      isCurrent
                        ? "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white shadow-xl"
                        : isCompleted
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl"
                        : "bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 border border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <span className="text-sm">{`${section.id}. ${section.name}`}</span>
                    {isCurrent && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <span className="text-xs">✨</span>
                      </div>
                    )}
                    {isCompleted && !isCurrent && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 