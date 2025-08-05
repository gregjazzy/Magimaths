'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'

// Types simplifiés pour éviter les erreurs de dépendance
interface UserProfile {
  user_id: string
  plan: 'free' | 'premium'
  subscription_end: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  hasAccessToChapter: (chapterId: string) => boolean
  hasAccessToSection: (chapterId: string, sectionId: string) => boolean
  isFreemium: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabaseError, setSupabaseError] = useState(false)

  // Vérifier la session au chargement
  useEffect(() => {
    const getSession = async () => {
      try {
        // Dynamically import supabase only when needed
        const { supabase } = await import('@/lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.warn('Supabase not configured, running in dev mode:', error)
        setSupabaseError(true)
        // En mode dev sans Supabase, on simule un utilisateur libre
        setProfile({
          user_id: 'dev-user',
          plan: 'free',
          subscription_end: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
      
      setLoading(false)
    }

    getSession()

    // Écouter les changements d'auth seulement si Supabase est configuré
    if (!supabaseError) {
      const setupAuthListener = async () => {
        try {
          const { supabase } = await import('@/lib/supabase')
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: any, session: any) => {
              setUser(session?.user ?? null)
              
              if (session?.user) {
                await fetchUserProfile(session.user.id)
              } else {
                setProfile(null)
              }
              
              setLoading(false)
            }
          )

          return () => subscription.unsubscribe()
        } catch (error) {
          console.warn('Auth listener setup failed:', error)
        }
      }

      setupAuthListener()
    }
  }, [supabaseError])

  // Récupérer le profil utilisateur
  const fetchUserProfile = async (userId: string) => {
    if (supabaseError) return
    
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        // Si le profil n'existe pas, le créer
        if (error.code === 'PGRST116') {
          await createUserProfile(userId)
        } else {
          console.error('Error fetching profile:', error)
        }
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  // Créer un profil utilisateur (plan free par défaut)
  const createUserProfile = async (userId: string) => {
    if (supabaseError) return
    
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          plan: 'free'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  // Connexion
  const signIn = async (email: string, password: string) => {
    if (supabaseError) {
      return { error: { message: 'Supabase not configured' } }
    }
    
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Inscription
  const signUp = async (email: string, password: string) => {
    if (supabaseError) {
      return { error: { message: 'Supabase not configured' } }
    }
    
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.auth.signUp({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Déconnexion
  const signOut = async () => {
    if (supabaseError) return
    
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Configuration d'accès locale pour le mode dev
  const DEV_ACCESS_CONFIG = {
    free: {
      'equations-second-degre': ['intro', 'forme-canonique'],
      'exponentielle': ['cours', 'simplifications', 'graph']
    },
    premium: {
      'equations-second-degre': ['intro', 'forme-canonique', 'variations', 'resolution'],
      'exponentielle': ['cours', 'simplifications', 'graph', 'exercices', 'difficiles', 'demonstrations']
    }
  }

  // Vérifier l'accès à un chapitre
  const hasAccessToChapter = (chapterId: string): boolean => {
    if (!profile) return true // En mode dev, on donne accès
    
    const userPlan = profile.plan
    
    // Premium : accès à tout
    if (userPlan === 'premium') return true
    
    // Free : accès limité
    return ['equations-second-degre', 'exponentielle'].includes(chapterId)
  }

  // Vérifier l'accès à une section
  const hasAccessToSection = (chapterId: string, sectionId: string): boolean => {
    if (!profile) return true // En mode dev, on donne accès
    
    const userPlan = profile.plan
    const config = DEV_ACCESS_CONFIG
    
    // Premium : accès à tout
    if (userPlan === 'premium') {
      return config.premium[chapterId as keyof typeof config.premium]?.includes(sectionId) ?? false
    }
    
    // Free : accès limité
    const freeAccess = config.free[chapterId as keyof typeof config.free]
    return freeAccess?.includes(sectionId) ?? false
  }

  const isFreemium = profile?.plan === 'free'

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      hasAccessToChapter,
      hasAccessToSection,
      isFreemium
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 