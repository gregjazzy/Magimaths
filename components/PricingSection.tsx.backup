'use client';

import { motion } from 'framer-motion';
import { Check, Crown, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

export default function PricingSection() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Découverte',
      description: 'Parfait pour commencer',
      price: 0,
      period: 'Gratuit',
      icon: Zap,
      features: [
        'Accès au premier chapitre',
        '5 exercices interactifs',
        'Progression basique',
        'Support communautaire'
      ],
      buttonText: 'Commencer gratuitement',
      isPopular: false,
      color: 'border-gray-200'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Le plus populaire',
      price: 9.99,
      period: 'par mois',
      icon: Crown,
      features: [
        'Accès à tous les chapitres',
        'Exercices illimités',
        'Suivi détaillé des progrès',
        'Corrections personnalisées',
        'Graphiques interactifs',
        'Support prioritaire',
        'Certificats de réussite'
      ],
      buttonText: 'Choisir Premium',
      isPopular: true,
      color: 'border-primary-500 ring-2 ring-primary-500'
    },
    {
      id: 'lifetime',
      name: 'Accès à vie',
      description: 'Le meilleur rapport qualité-prix',
      price: 99.99,
      period: 'paiement unique',
      icon: Crown,
      features: [
        'Tous les avantages Premium',
        'Accès à vie garanti',
        'Futures mises à jour incluses',
        'Nouveaux chapitres gratuits',
        'Priorité sur les nouvelles fonctionnalités',
        'Support VIP',
        'Groupe privé d\'étudiants'
      ],
      buttonText: 'Accès à vie',
      isPopular: false,
      color: 'border-amber-400'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      // Ouvrir le modal d'inscription si pas connecté
      setShowAuthModal(true);
    } else {
      // Rediriger vers le système de paiement selon le plan
      if (planId === 'free') {
        window.location.href = '#chapitres';
      } else {
        // TODO: Intégrer système de paiement (Stripe, etc.)
        alert(`Redirection vers le paiement pour le plan ${planId}`);
      }
    }
  };

  return (
    <>
      <section id="tarifs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choisissez votre <span className="gradient-text">formule</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Commencez gratuitement et débloquez tout le potentiel de l&apos;apprentissage interactif
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl border-2 ${plan.color} p-8 ${
                  plan.isPopular ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      🔥 Le plus populaire
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* En-tête */}
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <div className={`p-3 rounded-lg ${
                        plan.isPopular 
                          ? 'bg-gradient-to-r from-primary-500 to-purple-600' 
                          : 'bg-gray-100'
                      }`}>
                        <plan.icon className={`h-8 w-8 ${
                          plan.isPopular ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* Prix */}
                  <div className="text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{plan.period}</p>
                    </div>
                  </div>

                  {/* Fonctionnalités */}
                  <div className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <div className={`p-1 rounded-full ${
                            plan.isPopular ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            <Check className={`h-4 w-4 ${
                              plan.isPopular ? 'text-primary-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bouton */}
                  <div className="pt-4">
                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                        plan.isPopular
                          ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:from-primary-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Garantie et informations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16 space-y-4"
          >
            <div className="flex justify-center items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Satisfaction garantie</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Annulation à tout moment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Support 7j/7</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Tous les paiements sont sécurisés par Stripe. 
              Vos données personnelles sont protégées selon le RGPD.
            </p>
          </motion.div>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </>
  );
} 