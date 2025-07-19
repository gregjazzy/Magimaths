// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: SubscriptionType;
  progress: UserProgress;
  xp: UserXP;
  createdAt: Date;
  lastLogin: Date;
}

export type SubscriptionType = 'free' | 'premium' | 'lifetime';

export interface UserProgress {
  completedChapters: string[];
  completedExercises: string[];
  totalTimeSpent: number; // en minutes
  currentStreak: number; // jours consécutifs
  scores: { [chapterId: string]: number };
}

// Types pour le système XP (simple)
export interface UserXP {
  total: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
}

// Types pour les niveaux de classe
export type ClassLevel = 'CE1' | 'CE2' | 'CM1' | 'CM2' | '6eme' | '5eme' | '4eme' | '3eme' | '2nde' | '1ere' | 'terminale';

// Types pour les chapitres et cours
export interface Chapter {
  id: string;
  title: string;
  description: string;
  classLevel: ClassLevel;
  category: ChapterCategory;
  difficulty: DifficultyLevel;
  estimatedTime: number; // en minutes
  prerequisites: string[];
  color: string;
  icon: string;
  lessons: Lesson[];
  exercises: Exercise[];
  isLocked: boolean;
  order: number;
  verified?: boolean;
  parentChapter?: string; // Pour organiser les sous-chapitres
}

export type ChapterCategory = 'algebra' | 'analysis' | 'geometry' | 'probability' | 'numeracy' | 'measurement' | 'statistics' | 'programming' | 'data' | 'functions';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Lesson {
  id: string;
  title: string;
  content: LessonContent[];
  duration: number;
  isCompleted: boolean;
  chapterId: string;
}

export interface LessonContent {
  type: 'text' | 'formula' | 'graph' | 'interactive' | 'video';
  content: string;
  metadata?: {
    graphType?: 'function' | 'geometry';
    formula?: string;
    interactiveType?: 'calculator' | 'graph_plotter' | 'quiz';
  };
}

// Types pour les exercices
export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  points: number;
  timeLimit?: number; // en minutes
  questions: Question[];
  hints: string[];
  solution: Solution;
  chapterId: string;
  tags: string[];
}

export type ExerciseType = 'multiple_choice' | 'open_answer' | 'true_false' | 'calculation' | 'graph_analysis';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // pour les QCM
  correctAnswer: string | number | boolean;
  explanation: string;
  points: number;
}

export type QuestionType = 'multiple_choice' | 'numeric' | 'text' | 'boolean';

export interface Solution {
  steps: SolutionStep[];
  finalAnswer: string;
  explanation: string;
}

export interface SolutionStep {
  description: string;
  formula?: string;
  calculation?: string;
}

// Types pour les résultats et évaluations
export interface ExerciseResult {
  exerciseId: string;
  userId: string;
  score: number;
  totalPoints: number;
  timeSpent: number;
  answers: UserAnswer[];
  completedAt: Date;
  hintsUsed: number;
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string | number | boolean;
  isCorrect: boolean;
  timeSpent: number;
}

// Types pour le paiement
export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'EUR';
  interval: 'month' | 'year' | 'lifetime';
  features: string[];
  isPopular?: boolean;
  stripePriceId?: string;
}

export interface PaymentSession {
  sessionId: string;
  userId: string;
  planId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  createdAt: Date;
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
} 