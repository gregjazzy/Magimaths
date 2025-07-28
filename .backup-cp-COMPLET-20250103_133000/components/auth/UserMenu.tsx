'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut, Crown, Settings, Trophy } from 'lucide-react'
import AuthModal from './AuthModal'

export default function UserMenu() {
  const { user, profile, signOut, loading } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    )
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Connexion
        </button>
        
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode="signin"
        />
      </>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user.email?.split('@')[0]}
          </p>
          <div className="flex items-center space-x-1">
            {profile?.plan === 'premium' ? (
              <>
                <Crown className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-amber-600 font-medium">Premium</span>
              </>
            ) : (
              <span className="text-xs text-gray-500">Gratuit</span>
            )}
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {/* User Info */}
            <div className="p-4 border-b border-gray-100">
              <p className="font-medium text-gray-900">{user.email}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-1">
                  {profile?.plan === 'premium' ? (
                    <>
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-amber-600 font-medium">Premium</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Plan Gratuit</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">0 XP</span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {profile?.plan !== 'premium' && (
                <button className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center space-x-2">
                  <Crown className="w-4 h-4" />
                  <span>Passer au Premium</span>
                </button>
              )}
              
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
              
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 