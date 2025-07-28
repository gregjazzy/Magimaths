'use client'

import { ReactNode, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ChapterId, SectionId } from '@/lib/supabase'
import { Lock, Crown, Star } from 'lucide-react'
import AuthModal from './AuthModal'

interface AccessGuardProps {
  children: ReactNode
  chapterId: ChapterId
  sectionId: SectionId
  fallback?: ReactNode
}

export default function AccessGuard({ 
  children, 
  chapterId, 
  sectionId, 
  fallback 
}: AccessGuardProps) {
  const { user, hasAccessToSection, isFreemium } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Si l'utilisateur a accès, afficher le contenu
  if (hasAccessToSection(chapterId, sectionId)) {
    return <>{children}</>
  }

  // Si un fallback personnalisé est fourni
  if (fallback) {
    return <>{fallback}</>
  }

  // Messages selon l'état utilisateur
  const renderAccessMessage = () => {
    if (!user) {
      return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Connexion requise
          </h3>
          <p className="text-gray-600 mb-6">
            Connectez-vous pour accéder à cette section et sauvegarder votre progression.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Se connecter
          </button>
        </div>
      )
    }

    if (isFreemium) {
      return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Contenu Premium
          </h3>
          <p className="text-gray-600 mb-4">
            Cette section est réservée aux utilisateurs Premium.
          </p>
          
          {/* Avantages Premium */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-amber-100">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500 mr-2" />
              Avantages Premium
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✅ Accès aux 15 chapitres complets</li>
              <li>✅ Toutes les sections et exercices</li>
              <li>✅ Progression sauvegardée dans le cloud</li>
              <li>✅ Contenu mis à jour régulièrement</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium">
              Passer au Premium - 9,99€/mois
            </button>
            <p className="text-xs text-gray-500">
              Annulable à tout moment • Essai gratuit 7 jours
            </p>
          </div>
        </div>
      )
    }

    // Cas par défaut (ne devrait pas arriver)
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Accès restreint
        </h3>
        <p className="text-gray-500">
          Vous n'avez pas accès à cette section.
        </p>
      </div>
    )
  }

  return (
    <>
      {renderAccessMessage()}
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signin"
      />
    </>
  )
} 