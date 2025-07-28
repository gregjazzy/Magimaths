'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, ChapterId } from '@/lib/supabase'
import { useAuth } from './AuthContext'

interface ChapterProgress {
  xpEarned: number
  completedSections: string[]
  lastUpdated: string
}

interface ChapterContextType {
  chapterId: ChapterId
  xpEarned: number
  completedSections: string[]
  loading: boolean
  addXP: (amount: number) => Promise<void>
  completeSection: (sectionId: string, xp: number) => Promise<void>
  isCompleted: (sectionId: string) => boolean
  getTotalXP: () => number
}

const ChapterContext = createContext<ChapterContextType | undefined>(undefined)

export function ChapterProvider({ 
  children, 
  chapterId 
}: { 
  children: React.ReactNode
  chapterId: ChapterId 
}) {
  const { user, profile } = useAuth()
  const [xpEarned, setXpEarned] = useState(0)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Clé localStorage pour ce chapitre
  const localStorageKey = `chapter-progress-${chapterId}`

  // Charger la progression au montage
  useEffect(() => {
    loadProgress()
  }, [user, chapterId])

  // Charger la progression (local + Supabase)
  const loadProgress = async () => {
    setLoading(true)
    
    try {
      // 1. Charger depuis localStorage (rapide)
      const localProgress = loadLocalProgress()
      if (localProgress) {
        setXpEarned(localProgress.xpEarned)
        setCompletedSections(localProgress.completedSections)
      }

      // 2. Si connecté, synchroniser avec Supabase
      if (user && profile) {
        const supabaseProgress = await loadSupabaseProgress()
        if (supabaseProgress) {
          // Prendre la version la plus récente
          if (!localProgress || new Date(supabaseProgress.lastUpdated) > new Date(localProgress.lastUpdated)) {
            setXpEarned(supabaseProgress.xpEarned)
            setCompletedSections(supabaseProgress.completedSections)
            saveLocalProgress(supabaseProgress)
          }
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  // Charger depuis localStorage
  const loadLocalProgress = (): ChapterProgress | null => {
    try {
      const saved = localStorage.getItem(localStorageKey)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Error loading local progress:', error)
      return null
    }
  }

  // Sauvegarder dans localStorage
  const saveLocalProgress = (progress: ChapterProgress) => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(progress))
    } catch (error) {
      console.error('Error saving local progress:', error)
    }
  }

  // Charger depuis Supabase
  const loadSupabaseProgress = async (): Promise<ChapterProgress | null> => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('chapter_id', chapterId)
        .single()

      if (error) {
        if (error.code !== 'PGRST116') { // Pas d'erreur si pas trouvé
          console.error('Error loading Supabase progress:', error)
        }
        return null
      }

      return {
        xpEarned: data.xp_earned,
        completedSections: data.completed_sections,
        lastUpdated: data.updated_at
      }
    } catch (error) {
      console.error('Error in loadSupabaseProgress:', error)
      return null
    }
  }

  // Sauvegarder dans Supabase
  const saveSupabaseProgress = async (progress: ChapterProgress) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          chapter_id: chapterId,
          xp_earned: progress.xpEarned,
          completed_sections: progress.completedSections,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving Supabase progress:', error)
      }
    } catch (error) {
      console.error('Error in saveSupabaseProgress:', error)
    }
  }

  // Ajouter des XP
  const addXP = async (amount: number) => {
    const newXP = xpEarned + amount
    setXpEarned(newXP)

    const progress: ChapterProgress = {
      xpEarned: newXP,
      completedSections,
      lastUpdated: new Date().toISOString()
    }

    // Sauvegarder localement
    saveLocalProgress(progress)

    // Sauvegarder sur Supabase si connecté
    if (user && profile) {
      await saveSupabaseProgress(progress)
    }
  }

  // Compléter une section
  const completeSection = async (sectionId: string, xp: number) => {
    if (completedSections.includes(sectionId)) return // Déjà complété

    const newCompletedSections = [...completedSections, sectionId]
    const newXP = xpEarned + xp

    setCompletedSections(newCompletedSections)
    setXpEarned(newXP)

    const progress: ChapterProgress = {
      xpEarned: newXP,
      completedSections: newCompletedSections,
      lastUpdated: new Date().toISOString()
    }

    // Sauvegarder localement
    saveLocalProgress(progress)

    // Sauvegarder sur Supabase si connecté
    if (user && profile) {
      await saveSupabaseProgress(progress)
    }
  }

  // Vérifier si une section est complétée
  const isCompleted = (sectionId: string): boolean => {
    return completedSections.includes(sectionId)
  }

  // Obtenir le total des XP
  const getTotalXP = (): number => {
    return xpEarned
  }

  return (
    <ChapterContext.Provider value={{
      chapterId,
      xpEarned,
      completedSections,
      loading,
      addXP,
      completeSection,
      isCompleted,
      getTotalXP
    }}>
      {children}
    </ChapterContext.Provider>
  )
}

export const useChapter = () => {
  const context = useContext(ChapterContext)
  if (context === undefined) {
    throw new Error('useChapter must be used within a ChapterProvider')
  }
  return context
} 