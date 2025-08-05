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

// Créer un client mock pour éviter les erreurs de build
const createMockClient = () => ({
  from: () => ({
    select: () => ({ data: null, error: new Error('Supabase not configured') }),
    insert: () => ({ data: null, error: new Error('Supabase not configured') }),
    update: () => ({ data: null, error: new Error('Supabase not configured') }),
    delete: () => ({ data: null, error: new Error('Supabase not configured') }),
    eq: () => ({ data: null, error: new Error('Supabase not configured') }),
    not: () => ({ data: null, error: new Error('Supabase not configured') }),
  }),
  rpc: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
})

// Variables d'environnement avec fallbacks pour le build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Export conditionnel selon la disponibilité des variables d'environnement
export const supabase = supabaseUrl && supabaseKey 
  ? createClientComponentClient<Database>()
  : createMockClient() as any

// Pour les API routes - création d'un client côté serveur
export function createClient() {
  // Si les vraies variables d'environnement ne sont pas disponibles, utiliser le mock
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Variables Supabase manquantes - utilisation du client mock')
    return createMockClient() as any
  }
  
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