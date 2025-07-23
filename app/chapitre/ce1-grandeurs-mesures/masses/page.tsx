'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Scale, Eye, Play, Trophy } from 'lucide-react';

// Composant Balance Interactive CSS
const InteractiveScale = () => {
  const [leftPlatform, setLeftPlatform] = useState<Array<{id: string, name: string, mass: number, color: string, type: 'object' | 'weight'}>>([]);
  const [rightPlatform, setRightPlatform] = useState<Array<{id: string, name: string, mass: number, color: string, type: 'object' | 'weight'}>>([]);
  const [selectedItem, setSelectedItem] = useState<{id: string, name: string, mass: number, color: string, type: 'object' | 'weight'} | null>(null);
  const [isBalanced, setIsBalanced] = useState(false);
  const [balanceAngle, setBalanceAngle] = useState(0);

  // Objets disponibles à peser
  const availableObjects = [
    { id: 'apple', name: '🍎 Pomme', mass: 100, color: 'bg-red-100 border-red-300', type: 'object' as const },
    { id: 'book', name: '📚 Livre', mass: 300, color: 'bg-blue-100 border-blue-300', type: 'object' as const },
    { id: 'pen', name: '✏️ Stylo', mass: 20, color: 'bg-gray-100 border-gray-300', type: 'object' as const },
    { id: 'phone', name: '📱 Téléphone', mass: 150, color: 'bg-green-100 border-green-300', type: 'object' as const }
  ];

  // Poids de balance réalistes
  const availableWeights = [
    { id: 'weight-10g', name: '10g', mass: 10, color: 'bg-gradient-to-b from-gray-200 to-gray-400 border-gray-500', type: 'weight' as const },
    { id: 'weight-20g', name: '20g', mass: 20, color: 'bg-gradient-to-b from-gray-300 to-gray-500 border-gray-600', type: 'weight' as const },
    { id: 'weight-50g', name: '50g', mass: 50, color: 'bg-gradient-to-b from-yellow-200 to-yellow-400 border-yellow-600', type: 'weight' as const },
    { id: 'weight-100g', name: '100g', mass: 100, color: 'bg-gradient-to-b from-orange-300 to-orange-500 border-orange-600', type: 'weight' as const },
    { id: 'weight-200g', name: '200g', mass: 200, color: 'bg-gradient-to-b from-red-300 to-red-500 border-red-600', type: 'weight' as const },
    { id: 'weight-500g', name: '500g', mass: 500, color: 'bg-gradient-to-b from-purple-300 to-purple-500 border-purple-600', type: 'weight' as const },
    { id: 'weight-1000g', name: '1kg', mass: 1000, color: 'bg-gradient-to-b from-indigo-400 to-indigo-600 border-indigo-700', type: 'weight' as const }
  ];

  // Calculer les masses totales
  const leftMass = leftPlatform.reduce((sum, item) => sum + item.mass, 0);
  const rightMass = rightPlatform.reduce((sum, item) => sum + item.mass, 0);

  // Mettre à jour l'équilibre et l'angle
  useEffect(() => {
    const difference = leftMass - rightMass;
    const maxAngle = 20;
    // CORRECTION : Inverser la logique pour que le côté lourd descende
    const angle = Math.max(-maxAngle, Math.min(maxAngle, -difference / 100));
    setBalanceAngle(angle);
    setIsBalanced(Math.abs(difference) <= 10);
  }, [leftMass, rightMass]);

  const addToLeft = () => {
    if (selectedItem) {
      const newItem = { ...selectedItem, id: `${selectedItem.id}-${Date.now()}` };
      setLeftPlatform(prev => [...prev, newItem]);
      setSelectedItem(null);
    }
  };

  const addToRight = () => {
    if (selectedItem) {
      const newItem = { ...selectedItem, id: `${selectedItem.id}-${Date.now()}` };
      setRightPlatform(prev => [...prev, newItem]);
      setSelectedItem(null);
    }
  };

  const removeFromLeft = (id: string) => {
    setLeftPlatform(prev => prev.filter(item => item.id !== id));
  };

  const removeFromRight = (id: string) => {
    setRightPlatform(prev => prev.filter(item => item.id !== id));
  };

  const resetBalance = () => {
    setLeftPlatform([]);
    setRightPlatform([]);
    setSelectedItem(null);
    setIsBalanced(false);
    setBalanceAngle(0);
  };

  // Fonction pour formater les masses
  const formatMass = (mass: number) => {
    if (mass >= 1000) {
      const kg = mass / 1000;
      if (kg % 1 === 0) {
        return `${kg}kg`;
      } else {
        return `${kg}kg`;
      }
    }
    return `${mass}g`;
  };

  // Rendu d'un poids 3D CSS - Version mobile optimisée et plus petite
  const renderWeight3D = (weight: any, isOnPlatform = false) => {
    const baseSize = isOnPlatform ? 'w-4 h-6 sm:w-5 sm:h-8' : 'w-6 h-8 sm:w-8 sm:h-12';
    return (
      <div className={`flex flex-col items-center ${isOnPlatform ? 'scale-75 sm:scale-75' : ''}`}>
        {/* Poignée */}
        <div className="w-1.5 h-1 sm:w-2 sm:h-1 bg-gray-400 rounded-full border border-gray-600 mb-0.5"></div>
        {/* Corps principal du poids */}
        <div className={`${weight.color} ${baseSize} rounded-lg border-2 shadow-lg relative overflow-hidden`}>
          {/* Effet de relief */}
          <div className="absolute inset-1 bg-gradient-to-br from-white to-transparent opacity-30 rounded"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black opacity-20"></div>
        </div>
        {/* Base */}
        <div className={`${weight.color} w-6 h-1 sm:w-8 sm:h-1 rounded-b-lg border-2 border-t-0 shadow-md ${isOnPlatform ? 'w-4 sm:w-5' : ''}`}></div>
        {isOnPlatform && (
          <div className="text-xs font-bold text-gray-700 mt-0.5">{weight.name}</div>
        )}
      </div>
    );
  };

  // Rendu d'un objet 3D CSS - Version mobile optimisée
  const renderObject3D = (item: any, isOnPlatform = false) => {
    const scale = isOnPlatform ? 'scale-75 sm:scale-75' : '';
    
    switch (item.id.split('-')[0]) {
      case 'apple':
        return (
          <div className={`flex flex-col items-center ${scale}`}>
            <div className="w-6 h-8 sm:w-8 sm:h-10 bg-gradient-to-br from-red-300 to-red-600 rounded-full border-2 border-red-700 shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-1 h-2 sm:w-2 sm:h-3 bg-green-500 rounded-full"></div>
              <div className="absolute inset-1 bg-gradient-to-br from-red-200 to-transparent opacity-50 rounded-full"></div>
            </div>
            {isOnPlatform && <div className="text-xs font-bold text-gray-700 mt-1">🍎</div>}
          </div>
        );
      case 'book':
        return (
          <div className={`flex flex-col items-center ${scale}`}>
            <div className="w-8 h-6 sm:w-12 sm:h-8 bg-gradient-to-br from-blue-300 to-blue-600 border-2 border-blue-700 shadow-lg relative">
              <div className="absolute inset-1 bg-gradient-to-br from-blue-200 to-transparent opacity-50"></div>
              <div className="absolute left-1 top-1 bottom-1 w-0.5 bg-blue-800"></div>
            </div>
            {isOnPlatform && <div className="text-xs font-bold text-gray-700 mt-1">📚</div>}
          </div>
        );
      case 'pen':
        return (
          <div className={`flex flex-col items-center ${scale}`}>
            <div className="w-1 h-8 sm:w-1 sm:h-12 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full border border-gray-700 shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 sm:w-2 sm:h-2 bg-black rounded-full"></div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-4 bg-blue-500 rounded"></div>
            </div>
            {isOnPlatform && <div className="text-xs font-bold text-gray-700 mt-1">✏️</div>}
          </div>
        );
      case 'phone':
        return (
          <div className={`flex flex-col items-center ${scale}`}>
            <div className="w-4 h-8 sm:w-6 sm:h-12 bg-gradient-to-br from-green-300 to-green-600 rounded-lg border-2 border-green-700 shadow-lg relative">
              <div className="absolute inset-1 bg-gradient-to-br from-green-200 to-transparent opacity-50 rounded"></div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 sm:w-3 sm:h-1 bg-black rounded-full"></div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-gray-800 rounded"></div>
            </div>
            {isOnPlatform && <div className="text-xs font-bold text-gray-700 mt-1">📱</div>}
          </div>
        );
      default:
        return <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-400 rounded"></div>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-3 sm:p-6 shadow-lg relative">
      <h3 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
        ⚖️ Balance Interactive Réaliste
      </h3>
      
      {/* Sélection d'objets et poids - Mobile First */}
      <div className="mb-6 sm:mb-8">
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h4 className="font-bold text-green-800 mb-3 sm:mb-4 text-center text-sm sm:text-base">🎯 Objets à peser</h4>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {availableObjects.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`${item.color} p-2 sm:p-4 rounded-lg border-2 cursor-pointer hover:scale-105 active:scale-95 transition-transform text-center font-medium shadow-md min-h-[60px] sm:min-h-[80px] touch-manipulation ${
                    selectedItem?.id === item.id ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  <div className="mb-1 sm:mb-2 flex justify-center">
                    {renderObject3D(item)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700">{item.name.split(' ').slice(1).join(' ')}</div>
                  <div className="text-xs text-gray-600 font-bold">{formatMass(item.mass)}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-green-800 mb-3 sm:mb-4 text-center text-sm sm:text-base">⚖️ Poids de balance</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {availableWeights.map((weight) => (
                <button
                  key={weight.id}
                  onClick={() => setSelectedItem(weight)}
                  className={`cursor-pointer hover:scale-105 active:scale-95 transition-transform text-center p-2 sm:p-3 bg-white rounded-lg shadow-md border border-gray-200 min-h-[60px] sm:min-h-[80px] touch-manipulation ${
                    selectedItem?.id === weight.id ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  <div className="mb-1 sm:mb-2 flex justify-center">
                    {renderWeight3D(weight)}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800">{weight.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Boutons d'ajout - Mobile optimisés */}
        {selectedItem && (
          <div className="mt-4 sm:mt-6 text-center">
            <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 border-2 border-green-400">
              <p className="font-bold text-green-800 mb-2 text-sm sm:text-base">Objet sélectionné : {selectedItem.name}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                <button
                  onClick={addToLeft}
                  className="bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-600 active:scale-95 transition-all min-h-[44px] touch-manipulation text-sm sm:text-base"
                >
                  ➕ Ajouter à gauche
                </button>
                <button
                  onClick={addToRight}
                  className="bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-purple-600 active:scale-95 transition-all min-h-[44px] touch-manipulation text-sm sm:text-base"
                >
                  ➕ Ajouter à droite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Balance Perspective 3D CSS - Mobile Adaptée */}
      <div className="relative mb-8 sm:mb-12 bg-gradient-to-b from-sky-50 to-sky-150 rounded-xl p-4 sm:p-8 overflow-hidden" style={{ perspective: '800px' }}>
        
        {/* Base de la balance */}
        <div className="flex justify-center mb-1">
          <div className="w-20 h-4 sm:w-32 sm:h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-xl" style={{ transform: 'rotateX(45deg)' }}></div>
        </div>
        
        {/* Support vertical - Collé à la base */}
        <div className="flex justify-center mb-2 sm:mb-4">
          <div className="w-3 h-16 sm:w-6 sm:h-24 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full shadow-lg relative">
            {/* Point d'appui central - Plus haut sur le support */}
            <div className="absolute top-12 sm:top-18 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-4 sm:h-4 bg-red-500 rounded-full border border-red-700 sm:border-2 shadow-md"></div>
          </div>
        </div>
        
        {/* Fléau principal qui pivote - Collé au support */}
        <div className="flex justify-center relative -mt-1" style={{ transformStyle: 'preserve-3d' }}>
          <div 
            className="w-72 h-2 sm:w-96 sm:h-4 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full shadow-lg origin-center transition-transform duration-700 relative"
            style={{ 
              transform: `rotateZ(${balanceAngle}deg) rotateX(10deg)`,
              transformStyle: 'preserve-3d' 
            }}
          >
            {/* Graduations */}
            <div className="absolute top-0 left-1/4 w-0.5 h-1 sm:w-1 sm:h-2 bg-gray-700 rounded"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-1.5 sm:w-1 sm:h-3 bg-red-600 rounded"></div>
            <div className="absolute top-0 right-1/4 w-0.5 h-1 sm:w-1 sm:h-2 bg-gray-700 rounded"></div>
          </div>
        </div>
        
        {/* Chaînes de suspension - Attachées directement au fléau */}
        <div className="flex justify-between absolute top-14 sm:top-20 left-1/2 transform -translate-x-1/2 w-72 sm:w-96">
          {/* Chaînes gauche */}
          <div 
            className="flex gap-0.5 sm:gap-1 origin-top transition-transform duration-700"
            style={{ transform: `translateX(-140px) sm:translateX(-180px) rotate(${balanceAngle}deg)` }}
          >
            <div className="w-0.5 h-10 sm:h-16 bg-gray-600 shadow-sm"></div>
            <div className="w-0.5 h-10 sm:h-16 bg-gray-600 shadow-sm"></div>
            <div className="w-0.5 h-10 sm:h-16 bg-gray-600 shadow-sm"></div>
          </div>
          
          {/* Chaînes droite */}
          <div 
            className="flex gap-0.5 sm:gap-1 origin-top transition-transform duration-700"
            style={{ transform: `translateX(140px) sm:translateX(180px) rotate(${-balanceAngle}deg)` }}
          >
            <div className="w-0.5 h-10 sm:h-16 bg-gray-600 shadow-sm"></div>
            <div className="w-0.5 h-10 sm:h-16 bg-gray-600 shadow-sm"></div>
            <div className="w-0.5 h-10 sm:h-16 bg-gray-600 shadow-sm"></div>
          </div>
        </div>
        
        {/* Plateaux avec perspective - Collés aux chaînes */}
        <div className="flex justify-between absolute top-24 sm:top-36 left-1/2 transform -translate-x-1/2 w-72 sm:w-96">
          {/* Plateau gauche */}
          <div 
            className="transition-transform duration-700"
            style={{ 
              transform: `translateX(-140px) sm:translateX(-180px) translateY(${balanceAngle * 2}px) sm:translateY(${balanceAngle * 3}px) rotateX(60deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-300 border-2 sm:border-4 border-gray-400 rounded-full shadow-xl relative overflow-visible flex flex-wrap items-center justify-center p-1 sm:p-2">
              {/* Effet de profondeur */}
              <div className="absolute inset-0.5 sm:inset-1 border border-gray-300 sm:border-2 rounded-full"></div>
              <div className="absolute inset-1 sm:inset-2 bg-gradient-to-br from-white to-gray-100 rounded-full opacity-60"></div>
              
              {/* Attaches des chaînes au plateau */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-600"></div>
              <div className="absolute -top-1 left-1/3 w-1 h-2 bg-gray-600"></div>
              <div className="absolute -top-1 right-1/3 w-1 h-2 bg-gray-600"></div>
              
              {/* Objets sur le plateau */}
              {leftPlatform.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => removeFromLeft(item.id)}
                  className="cursor-pointer hover:scale-110 active:scale-95 transition-transform m-0.5 sm:m-1 z-10 touch-manipulation"
                  title="Cliquer pour enlever"
                  style={{ transform: 'rotateX(-60deg)' }}
                >
                  {item.type === 'weight' ? 
                    renderWeight3D(item, true) : 
                    renderObject3D(item, true)
                  }
                </div>
              ))}
            </div>
          </div>
          
          {/* Plateau droit */}
          <div 
            className="transition-transform duration-700"
            style={{ 
              transform: `translateX(140px) sm:translateX(180px) translateY(${-balanceAngle * 2}px) sm:translateY(${-balanceAngle * 3}px) rotateX(60deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-300 border-2 sm:border-4 border-gray-400 rounded-full shadow-xl relative overflow-visible flex flex-wrap items-center justify-center p-1 sm:p-2">
              {/* Effet de profondeur */}
              <div className="absolute inset-0.5 sm:inset-1 border border-gray-300 sm:border-2 rounded-full"></div>
              <div className="absolute inset-1 sm:inset-2 bg-gradient-to-br from-white to-gray-100 rounded-full opacity-60"></div>
              
              {/* Attaches des chaînes au plateau */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-600"></div>
              <div className="absolute -top-1 left-1/3 w-1 h-2 bg-gray-600"></div>
              <div className="absolute -top-1 right-1/3 w-1 h-2 bg-gray-600"></div>
              
              {/* Objets sur le plateau */}
              {rightPlatform.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => removeFromRight(item.id)}
                  className="cursor-pointer hover:scale-110 active:scale-95 transition-transform m-0.5 sm:m-1 z-10 touch-manipulation"
                  title="Cliquer pour enlever"
                  style={{ transform: 'rotateX(-60deg)' }}
                >
                  {item.type === 'weight' ? 
                    renderWeight3D(item, true) : 
                    renderObject3D(item, true)
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Ombre de la balance */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-40 sm:w-60 h-2 bg-black opacity-10 rounded-full blur-sm"></div>
      </div>
      
      {/* Affichage des masses - Mobile optimisé */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8 px-2 sm:px-8">
        <div className="text-center">
          <div className="font-bold text-green-700 text-base sm:text-lg">Plateau gauche</div>
          <div className="text-xl sm:text-2xl font-bold text-green-800 bg-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md border-2 border-green-300">{formatMass(leftMass)}</div>
        </div>
        
        <div className="text-center">
          <div className="font-bold text-green-700 text-base sm:text-lg">Plateau droit</div>
          <div className="text-xl sm:text-2xl font-bold text-green-800 bg-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md border-2 border-green-300">{formatMass(rightMass)}</div>
        </div>
      </div>

      {/* État de la balance - Mobile optimisé */}
      <div className="text-center mb-6 sm:mb-8 px-2">
        {isBalanced ? (
          <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 sm:p-6 relative">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎉</div>
            <div className="font-bold text-green-800 text-lg sm:text-xl">ÉQUILIBRE PARFAIT !</div>
            <div className="text-green-700 text-sm sm:text-lg">Les deux plateaux ont la même masse !</div>
            <div className="absolute top-1 right-2 sm:top-2 sm:right-4 text-lg sm:text-2xl animate-bounce">🎊</div>
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-lg sm:text-2xl animate-pulse">✨</div>
          </div>
        ) : (
          <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-4 sm:p-6">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⚖️</div>
            <div className="font-bold text-blue-800 text-base sm:text-xl">
              {leftMass > rightMass ? 'Le plateau gauche est plus lourd' : 
               rightMass > leftMass ? 'Le plateau droit est plus lourd' : 
               'Balance vide - Commence à peser !'}
            </div>
            <div className="text-blue-700 text-sm sm:text-lg">
              {leftMass !== rightMass && `Différence : ${formatMass(Math.abs(leftMass - rightMass))}`}
            </div>
          </div>
        )}
      </div>

      {/* Instructions et bouton reset - Mobile optimisé */}
      <div className="text-center px-2">
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-md">
          <h4 className="font-bold text-gray-800 mb-2 sm:mb-3 text-base sm:text-lg">📋 Instructions :</h4>
          <div className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2">
            <p>• 🖱️ Clique sur un objet ou poids pour le sélectionner</p>
            <p>• ➕ Utilise les boutons pour l'ajouter à un plateau</p>
            <p>• 👆 Clique sur un élément sur la balance pour l'enlever</p>
            <p>• ⚖️ Observe la balance bouger en temps réel !</p>
            <p>• 🎯 Trouve l'équilibre parfait !</p>
          </div>
        </div>
        
        <button
          onClick={resetBalance}
          className="bg-green-500 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-xl font-bold hover:bg-green-600 active:scale-95 transition-all shadow-lg min-h-[44px] touch-manipulation text-sm sm:text-base"
        >
          🔄 Recommencer
        </button>
      </div>
    </div>
  );
};

export default function MassesPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const exercises = [
    {
      id: 1,
      type: 'qcm',
      question: 'Quelle est la masse d\'une pomme ?',
      options: ['10 g', '100 g', '1 kg', '10 kg'],
      correctAnswer: '100 g',
      explanation: 'Une pomme pèse environ 100 grammes.',
      visual: 'apple'
    },
    {
      id: 2,
      type: 'qcm',
      question: 'Quel objet est le plus lourd ?',
      options: ['Une plume', 'Un livre', 'Une voiture', 'Une feuille'],
      correctAnswer: 'Une voiture',
      explanation: 'Une voiture est beaucoup plus lourde que les autres objets.',
      visual: 'balance'
    },
    {
      id: 3,
      type: 'qcm',
      question: 'Combien y a-t-il de grammes dans 1 kilogramme ?',
      options: ['10 g', '100 g', '500 g', '1000 g'],
      correctAnswer: '1000 g',
      explanation: '1 kilogramme = 1000 grammes.',
      visual: 'conversion'
    },
    {
      id: 4,
      type: 'qcm',
      question: 'Pour peser de la farine, j\'utilise :',
      options: ['mes mains', 'une balance', 'une règle', 'mes yeux'],
      correctAnswer: 'une balance',
      explanation: 'Une balance permet de mesurer la masse précisément.',
      visual: 'flour'
    },
    {
      id: 5,
      type: 'qcm',
      question: 'Quelle est la masse la plus lourde ?',
      options: ['500 g', '1 kg', '800 g', '900 g'],
      correctAnswer: '1 kg',
      explanation: '1 kg = 1000 g, c\'est donc le plus lourd.',
      visual: 'comparison'
    },
    {
      id: 6,
      type: 'qcm',
      question: 'Un sac de 2 kg et un sac de 500 g pèsent ensemble :',
      options: ['2 kg 500 g', '1 kg 500 g', '3 kg', '2500 g'],
      correctAnswer: '2 kg 500 g',
      explanation: '2 kg + 500 g = 2 kg 500 g (ou 2500 g).',
      visual: 'addition'
    }
  ];

  const saveProgress = (finalScore: number) => {
    const sectionId = 'masses';
    const baseXP = 15;
    const percentage = (finalScore / exercises.length) * 100;
    let earnedXP = Math.round((percentage / 100) * baseXP);
    if (percentage === 100) earnedXP = baseXP + 2;

    const existingProgress = JSON.parse(localStorage.getItem('ce1-grandeurs-mesures-progress') || '[]');
    const existingIndex = existingProgress.findIndex((p: any) => p.sectionId === sectionId);
    
    const newProgress = {
      sectionId,
      completed: percentage >= 50,
      score: finalScore,
      maxScore: exercises.length,
      completedAt: new Date().toISOString(),
      attempts: existingIndex >= 0 ? existingProgress[existingIndex].attempts + 1 : 1,
      xpEarned: earnedXP
    };

    if (existingIndex >= 0) {
      existingProgress[existingIndex] = newProgress;
    } else {
      existingProgress.push(newProgress);
    }

    localStorage.setItem('ce1-grandeurs-mesures-progress', JSON.stringify(existingProgress));
  };

  const checkAnswer = () => {
    const correct = selectedAnswer === exercises[currentExercise]?.correctAnswer;
    setIsCorrect(correct);
    
    let newScore = score;
    if (correct && !answeredCorrectly.has(currentExercise)) {
      newScore = score + 1;
      setScore(newScore);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setSelectedAnswer('');
          setIsCorrect(null);
        } else {
          setFinalScore(newScore);
          saveProgress(newScore);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      saveProgress(score);
      setShowCompletionModal(true);
    }
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setSelectedAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  const renderVisual = (visual: string) => {
    switch (visual) {
      case 'apple':
        return (
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-red-400 rounded-full relative">
              <div className="w-2 h-4 bg-green-500 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
            </div>
          </div>
        );
      case 'balance':
        return (
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-2 bg-gray-600"></div>
              <div className="w-8 h-8 bg-gray-400 rounded-full absolute left-0 top-2"></div>
              <div className="w-8 h-8 bg-gray-400 rounded-full absolute right-0 top-2"></div>
            </div>
          </div>
        );
      case 'flour':
        return (
          <div className="flex justify-center mb-4">
            <div className="w-12 h-16 bg-yellow-100 border-2 border-yellow-400 rounded">
              <div className="w-full h-8 bg-white mt-8 rounded-b"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex justify-center mb-4">
            <Scale className="w-16 h-16 text-green-500" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "⚖️ Expert des masses !", 
                  message: "Tu maîtrises parfaitement les mesures de masse !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "📊 Très bon travail !", 
                  message: "Tu comprends bien les masses !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 50) return { 
                  title: "⚖️ En bonne voie !", 
                  message: "Continue à t'entraîner avec les masses !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "Les masses demandent plus d'entraînement.", 
                  color: "text-gray-600",
                  bgColor: "bg-gray-50" 
                };
              };
              const result = getMessage();
              return (
                <div className={`${result.bgColor} rounded-2xl p-6`}>
                  <div className="text-6xl mb-4">{percentage >= 70 ? "🎉" : percentage >= 50 ? "😊" : "📚"}</div>
                  <h3 className={`text-2xl font-bold mb-3 ${result.color}`}>{result.title}</h3>
                  <p className={`text-lg mb-4 ${result.color}`}>{result.message}</p>
                  <p className={`text-xl font-bold mb-6 ${result.color}`}>
                    Score final : {finalScore}/{exercises.length} ({percentage}%)
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowCompletionModal(false)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => {
                        setShowCompletionModal(false);
                        resetAll();
                      }}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
                    >
                      Recommencer
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-grandeurs-mesures" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour aux grandeurs et mesures</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              ⚖️ Masses
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Apprends à estimer, comparer et peser les masses !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-6 sm:mb-8 px-4">
          <div className="bg-white rounded-lg p-1 shadow-md w-full sm:w-auto">
            <div className="grid grid-cols-2 sm:flex gap-1">
              <button
                onClick={() => setShowExercises(false)}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  !showExercises 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📖 Cours
              </button>
              <button
                onClick={() => setShowExercises(true)}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  showExercises 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ✏️ Exercices ({score}/{exercises.length})
              </button>
            </div>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ⚖️ Qu'est-ce qu'une masse ?
              </h2>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-lg text-green-900 text-center mb-4">
                  La masse, c'est le poids d'un objet !
                </p>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    Plus un objet est lourd, plus sa masse est grande !
                  </div>
                </div>
              </div>
            </div>

            {/* Les unités de masse */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                ⚖️ Les unités de masse
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-3 text-center">📏 Le gramme (g)</h4>
                  <div className="text-center mb-3">
                    <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-2"></div>
                    <p className="text-blue-700 text-sm">1 gramme</p>
                  </div>
                  <ul className="space-y-2 text-blue-600 text-sm">
                    <li>• Une pièce de monnaie</li>
                    <li>• Un bonbon</li>
                    <li>• Une plume</li>
                    <li>• Objets très légers</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-3 text-center">📏 Le kilogramme (kg)</h4>
                  <div className="text-center mb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded mx-auto mb-2"></div>
                    <p className="text-purple-700 text-sm">1 kg = 1000 g</p>
                  </div>
                  <ul className="space-y-2 text-purple-600 text-sm">
                    <li>• Un litre d'eau</li>
                    <li>• Un gros livre</li>
                    <li>• Un chat</li>
                    <li>• Objets lourds</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Balance Interactive */}
            <InteractiveScale />

            {/* Comment peser */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🔧 Comment bien peser ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-3">⚖️ Avec une balance</h4>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Place l'objet sur le plateau</li>
                    <li>• Lis le nombre affiché</li>
                    <li>• Vérifie l'unité (g ou kg)</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-3">👁️ En estimant</h4>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Soulève l'objet</li>
                    <li>• Compare avec des objets connus</li>
                    <li>• Estime puis vérifie</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-3">🔄 En comparant</h4>
                  <ul className="space-y-2 text-red-700">
                    <li>• Plus lourd / plus léger</li>
                    <li>• Même masse</li>
                    <li>• Range du plus léger au plus lourd</li>
                  </ul>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-bold text-pink-800 mb-3">🎯 Repères utiles</h4>
                  <ul className="space-y-2 text-pink-700">
                    <li>• 1 pièce ≈ 5 g</li>
                    <li>• 1 pomme ≈ 100 g</li>
                    <li>• 1 litre d'eau = 1 kg</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Vocabulaire */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💬 Vocabulaire important</h3>
              <ul className="space-y-2">
                <li>• ⚖️ Lourd ↔ Léger</li>
                <li>• 📊 1 kilogramme = 1000 grammes</li>
                <li>• 🎯 Pour convertir : compte par 1000</li>
                <li>• 🏆 La balance est l'outil pour peser</li>
                <li>• 🤲 Entraîne-toi à soulever et comparer !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              {/* Visuel */}
              {renderVisual(exercises[currentExercise]?.visual)}
              
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                {exercises[currentExercise]?.question}
              </h3>
              
              {/* Options de réponse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {exercises[currentExercise]?.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(option)}
                    disabled={isCorrect !== null}
                    className={`p-4 rounded-lg border-2 font-medium transition-all touch-manipulation min-h-[60px] ${
                      selectedAnswer === option
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    } ${isCorrect !== null ? 'opacity-60' : 'hover:scale-105 active:scale-95'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {/* Bouton Vérifier */}
              {isCorrect === null && selectedAnswer && (
                <div className="text-center mb-6">
                  <button
                    onClick={checkAnswer}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors text-lg touch-manipulation min-h-[44px]"
                  >
                    ✅ Vérifier
                  </button>
                </div>
              )}
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">Excellent ! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">Pas encore ! La bonne réponse est : {exercises[currentExercise]?.correctAnswer}</span>
                      </>
                    )}
                  </div>
                  <p className="text-center">{exercises[currentExercise]?.explanation}</p>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gray-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                >
                  ← Précédent
                </button>
                <button
                  onClick={() => {
                    if (selectedAnswer && isCorrect === null) {
                      checkAnswer();
                    } else {
                      nextExercise();
                    }
                  }}
                  disabled={!selectedAnswer && isCorrect === null}
                  className="bg-green-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                >
                  {selectedAnswer && isCorrect === null ? '✅ Vérifier' : 'Suivant →'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 