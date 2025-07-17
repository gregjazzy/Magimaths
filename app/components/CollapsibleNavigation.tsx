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
        className="w-full flex items-center justify-between px-4 py-2 bg-white/50 hover:bg-white/80 rounded-lg transition-colors mb-2"
      >
        <span className="font-medium text-gray-700">Navigation</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sections.map((section) => {
                const isCurrent = section.id === currentSection;
                const isCompleted = completedSections.includes(`section-${section.id}`) || completedSections.includes(section.name.toLowerCase());

                return (
                  <Link
                    key={section.id}
                    href={section.path}
                    className={`flex items-center justify-center px-3 py-2 ${
                      isCurrent
                        ? "bg-blue-500 text-white"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    } rounded-lg font-medium transition-colors text-center relative`}
                  >
                    <span className="text-sm">{`${section.id}. ${section.name}`}</span>
                    {isCurrent && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
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