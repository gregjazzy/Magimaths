import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          plan: 'free' | 'premium'
          subscription_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          plan?: 'free' | 'premium'
          subscription_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          plan?: 'free' | 'premium'
          subscription_end?: string | null
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: number
          user_id: string
          chapter_id: string
          xp_earned: number
          completed_sections: string[]
          updated_at: string
        }
        Insert: {
          user_id: string
          chapter_id: string
          xp_earned?: number
          completed_sections?: string[]
          updated_at?: string
        }
        Update: {
          xp_earned?: number
          completed_sections?: string[]
          updated_at?: string
        }
      }
    }
  }
}

export const supabase = createClientComponentClient<Database>()

// Pour les API routes - création d'un client côté serveur
export function createClient() {
  return createClientComponentClient<Database>()
}

// Configuration d'accès selon les plans
export const ACCESS_CONFIG = {
  free: {
    'equations-second-degre': ['intro', 'forme-canonique'] as string[] // Moitié du premier chapitre
  },
  premium: {
    'equations-second-degre': ['intro', 'forme-canonique', 'variations', 'resolution'] as string[],
    'trigonometrie': ['intro', 'cercle', 'fonctions', 'equations'] as string[],
    'derivees': ['intro', 'calculs', 'applications', 'limites'] as string[],
    'probabilites': ['intro', 'conditionnelles', 'variables', 'lois'] as string[],
    // ... autres chapitres
  }
} as const

export type ChapterId = keyof typeof ACCESS_CONFIG.premium
export type SectionId = string 