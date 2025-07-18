'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function LireNombresCE1Page() {
  const [selectedNumber, setSelectedNumber] = useState('234');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [exerciseResults, setExerciseResults] = useState<boolean[]>([]);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);

  const numbers = [
    { value: '234', label: '234', reading: 'Deux cent trente-quatre' },
    { value: '156', label: '156', reading: 'Cent cinquante-six' },
    { value: '89', label: '89', reading: 'Quatre-vingt-neuf' },
    { value: '345', label: '345', reading: 'Trois cent quarante-cinq' },
    { value: '567', label: '567', reading: 'Cinq cent soixante-sept' },
    { value: '123', label: '123', reading: 'Cent vingt-trois' },
    { value: '789', label: '789', reading: 'Sept cent quatre-vingt-neuf' },
    { value: '456', label: '456', reading: 'Quatre cent cinquante-six' },
    { value: '678', label: '678', reading: 'Six cent soixante-dix-huit' },
    { value: '890', label: '890', reading: 'Huit cent quatre-vingt-dix' },
    { value: '1000', label: '1000', reading: 'Mille' }
  ];

  const exercises = [
    { number: '145', reading: 'Cent quarante-cinq' },
    { number: '267', reading: 'Deux cent soixante-sept' },
    { number: '389', reading: 'Trois cent quatre-vingt-neuf' },
    { number: '512', reading: 'Cinq cent douze' },
    { number: '634', reading: 'Six cent trente-quatre' },
    { number: '758', reading: 'Sept cent cinquante-huit' },
    { number: '823', reading: 'Huit cent vingt-trois' },
    { number: '946', reading: 'Neuf cent quarante-six' },
    { number: '207', reading: 'Deux cent sept' },
    { number: '350', reading: 'Trois cent cinquante' },
    { number: '400', reading: 'Quatre cents' },
    { number: '500', reading: 'Cinq cents' },
    { number: '600', reading: 'Six cents' },
    { number: '700', reading: 'Sept cents' },
    { number: '800', reading: 'Huit cents' },
    { number: '900', reading: 'Neuf cents' },
    { number: '1000', reading: 'Mille' },
    { number: '101', reading: 'Cent un' },
    { number: '202', reading: 'Deux cent deux' },
    { number: '303', reading: 'Trois cent trois' }
  ];

  const formatNumber = (num: string) => {
    return num;
  };

  const speakNumber = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const animateNumber = async () => {
    setIsAnimating(true);
    
    // Nettoyer d'abord le tableau
    const tableElements = {
      unites: document.getElementById('unites-value'),
      dizaines: document.getElementById('dizaines-value'),
      centaines: document.getElementById('centaines-value')
    };

    // Masquer temporairement les chiffres dans le tableau
    Object.values(tableElements).forEach(el => {
      if (el) {
        el.style.opacity = '0';
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Créer l'animation de glissement pour chaque chiffre
    const animateDigit = async (digitIndex: number, targetId: string, delay: number) => {
      const sourceElement = document.getElementById(`source-digit-${digitIndex}`);
      const targetElement = document.getElementById(targetId);
      
      if (!sourceElement || !targetElement) return;

      // Créer un chiffre volant
      const flyingDigit = sourceElement.cloneNode(true) as HTMLElement;
      flyingDigit.id = `flying-digit-${digitIndex}`;
      flyingDigit.style.position = 'absolute';
      flyingDigit.style.zIndex = '1000';
      flyingDigit.style.backgroundColor = '#FEF3C7'; // bg-yellow-100
      flyingDigit.style.transform = 'scale(1.2)';
      flyingDigit.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      
      // Positionner le chiffre volant à la position source
      const sourceRect = sourceElement.getBoundingClientRect();
      const containerRect = document.body.getBoundingClientRect();
      flyingDigit.style.left = `${sourceRect.left - containerRect.left}px`;
      flyingDigit.style.top = `${sourceRect.top - containerRect.top}px`;
      
      document.body.appendChild(flyingDigit);

      // Attendre le délai
      await new Promise(resolve => setTimeout(resolve, delay));

      // Mettre en surbrillance le chiffre source
      sourceElement.classList.add('animate-pulse', 'bg-yellow-200', 'scale-110');

      await new Promise(resolve => setTimeout(resolve, 500));

      // Calculer la position de destination
      const targetRect = targetElement.getBoundingClientRect();
      const deltaX = targetRect.left - sourceRect.left;
      const deltaY = targetRect.top - sourceRect.top;

      // Animer le déplacement
      flyingDigit.style.transition = 'transform 1.5s ease-in-out';
      flyingDigit.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.5)`;

      // Attendre que l'animation soit terminée
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Révéler le chiffre dans le tableau avec animation
      const targetValueElement = document.getElementById(targetId);
      if (targetValueElement) {
        targetValueElement.style.opacity = '1';
        targetValueElement.style.transform = 'scale(1.2)';
        targetValueElement.style.color = '#059669'; // text-green-600
        
        // Mettre en surbrillance la cellule
        const cellId = targetId.replace('-value', '-cell');
        const targetCell = document.getElementById(cellId);
        if (targetCell) {
          targetCell.classList.add('bg-yellow-200', 'animate-pulse');
        }
      }

      // Supprimer le chiffre volant
      document.body.removeChild(flyingDigit);

      // Remettre le chiffre source normal
      sourceElement.classList.remove('animate-pulse', 'bg-yellow-200', 'scale-110');

      await new Promise(resolve => setTimeout(resolve, 800));

      // Remettre les styles normaux
      if (targetValueElement) {
        targetValueElement.style.transform = 'scale(1)';
        targetValueElement.style.color = '#065F46'; // text-green-900
      }
      
      const cellId = targetId.replace('-value', '-cell');
      const targetCell = document.getElementById(cellId);
      if (targetCell) {
        targetCell.classList.remove('bg-yellow-200', 'animate-pulse');
      }
    };

    // Animer dans l'ordre : unités, dizaines, centaines
    const digits = selectedNumber.split('');
    
    // 1. Unités (dernier chiffre)
    await animateDigit(digits.length - 1, 'unites-value', 0);
    
    // 2. Dizaines (avant-dernier chiffre)
    if (digits.length >= 2) {
      await animateDigit(digits.length - 2, 'dizaines-value', 0);
    }
    
    // 3. Centaines (premier chiffre)
    if (digits.length >= 3) {
      await animateDigit(digits.length - 3, 'centaines-value', 0);
    }

    // Remettre l'opacité normale pour tous les chiffres
    Object.values(tableElements).forEach(el => {
      if (el) {
        el.style.opacity = '1';
      }
    });
    
    setIsAnimating(false);
  };

  const checkAnswer = () => {
    const correct = userAnswer.toLowerCase().trim() === exercises[currentExercise].reading.toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      const newResults = [...exerciseResults];
      newResults[currentExercise] = true;
      setExerciseResults(newResults);
    } else {
      const newResults = [...exerciseResults];
      newResults[currentExercise] = false;
      setExerciseResults(newResults);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setExerciseResults([]);
    setScore(0);
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .flying-digit {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/chapitre/ce1-nombres-jusqu-1000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au chapitre</span>
            </Link>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                👁️ Apprendre à lire les nombres
              </h1>
              <p className="text-lg text-gray-600">
                Découvre comment lire tous les nombres jusqu'à 1000 !
              </p>
            </div>
          </div>

          {/* Navigation entre cours et exercices */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setShowExercises(false)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  !showExercises 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📖 Cours
              </button>
              <button
                onClick={() => setShowExercises(true)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  showExercises 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ✏️ Exercices ({score}/{exercises.length})
              </button>
            </div>
          </div>

          {!showExercises ? (
            /* COURS */
            <div className="space-y-8">
              {/* Sélecteur de nombre */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                  🎯 Choisis un nombre à découvrir
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {numbers.map((num) => (
                    <button
                      key={num.value}
                      onClick={() => setSelectedNumber(num.value)}
                      className={`p-4 rounded-lg font-bold text-xl transition-all ${
                        selectedNumber === num.value
                          ? 'bg-green-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Affichage du nombre */}
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <h3 className="text-xl font-bold mb-6 text-gray-900">
                  📊 Regardons le nombre {selectedNumber}
                </h3>
                
                {/* Nombre avec animation */}
                <div className="flex justify-center items-center space-x-2 mb-8">
                  {selectedNumber.split('').map((digit, index) => (
                    <div
                      key={index}
                      id={`digit-${index}`}
                      className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-3xl font-bold text-blue-900 transition-all duration-300"
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                {/* Décomposition avec vrai tableau */}
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-bold mb-4 text-green-800">
                    🧩 Décomposition dans un tableau :
                  </h4>
                  <p className="text-sm text-green-700 mb-4 font-semibold">
                    📝 On commence toujours par placer les unités, puis les dizaines, puis les centaines !
                  </p>
                  
                  {/* Nombre source pour l'animation */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-blue-300">
                      <p className="text-sm text-blue-700 font-semibold mb-2 text-center">Nombre à décomposer :</p>
                      
                      {/* Conteneur pour centrer les chiffres par rapport au bouton */}
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-2 mb-4 justify-center">
                          {selectedNumber.split('').map((digit, index) => (
                            <div
                              key={index}
                              id={`source-digit-${index}`}
                              className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-900 transition-all duration-1000"
                            >
                              {digit}
                            </div>
                          ))}
                        </div>
                        
                        {/* Bouton d'animation */}
                        <button
                          onClick={animateNumber}
                          disabled={isAnimating}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 mb-3"
                        >
                          {isAnimating ? (
                            <>
                              <Pause className="inline w-4 h-4 mr-2" />
                              Placement en cours...
                            </>
                          ) : (
                            <>
                              <Play className="inline w-4 h-4 mr-2" />
                              Voir le placement dans le tableau
                            </>
                          )}
                        </button>
                        
                        {/* Explication pour l'animation */}
                        <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-300">
                          <p className="text-xs text-blue-700 font-semibold text-center">
                            💡 Clique sur le bouton pour voir comment on place les chiffres un par un !
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vrai tableau HTML */}
                  <div className="flex justify-center mb-4">
                    <table className="border-collapse border-2 border-green-600 bg-white rounded-lg overflow-hidden shadow-lg">
                      <thead>
                        <tr className="bg-green-200">
                          <th className="border-2 border-green-600 px-6 py-3 text-green-800 font-bold text-lg">
                            Centaines
                          </th>
                          <th className="border-2 border-green-600 px-6 py-3 text-green-800 font-bold text-lg">
                            Dizaines
                          </th>
                          <th className="border-2 border-green-600 px-6 py-3 text-green-800 font-bold text-lg">
                            Unités
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-2 border-green-600 px-6 py-4 text-center bg-green-100 transition-all duration-300" id="centaines-cell">
                            <div className="text-3xl font-bold text-green-900" id="centaines-value">
                              {selectedNumber.length >= 3 ? selectedNumber[selectedNumber.length - 3] : '0'}
                            </div>
                          </td>
                          <td className="border-2 border-green-600 px-6 py-4 text-center bg-green-100 transition-all duration-300" id="dizaines-cell">
                            <div className="text-3xl font-bold text-green-900" id="dizaines-value">
                              {selectedNumber.length >= 2 ? selectedNumber[selectedNumber.length - 2] : '0'}
                            </div>
                          </td>
                          <td className="border-2 border-green-600 px-6 py-4 text-center bg-green-100 transition-all duration-300" id="unites-cell">
                            <div className="text-3xl font-bold text-green-900" id="unites-value">
                              {selectedNumber[selectedNumber.length - 1]}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Explication du placement */}
                  <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                    <h5 className="font-bold text-green-800 mb-2">
                      📍 Comment placer les chiffres :
                    </h5>
                    <div className="space-y-2 text-sm text-green-700">
                      <p><span className="font-bold text-blue-600">1.</span> On commence par placer le chiffre des <span className="font-bold text-green-800">unités</span> (le dernier chiffre à droite)</p>
                      <p><span className="font-bold text-blue-600">2.</span> Puis on place le chiffre des <span className="font-bold text-green-800">dizaines</span> (au milieu)</p>
                      <p><span className="font-bold text-blue-600">3.</span> Enfin, on place le chiffre des <span className="font-bold text-green-800">centaines</span> (le premier chiffre à gauche)</p>
                    </div>
                  </div>
                </div>

                {/* Lecture du nombre - maintenant à la fin */}
                <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-bold mb-3 text-yellow-800">
                    🗣️ Comment le lire :
                  </h4>
                  <p className="text-2xl font-bold text-yellow-900 mb-4">
                    {numbers.find(n => n.value === selectedNumber)?.reading}
                  </p>
                  <button
                    onClick={() => speakNumber(numbers.find(n => n.value === selectedNumber)?.reading || '')}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
                  >
                    <Volume2 className="inline w-4 h-4 mr-2" />
                    Écouter
                  </button>
                </div>
              </div>

              {/* Conseils */}
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">💡 Astuces pour bien lire</h3>
                <ul className="space-y-2">
                  <li>• Commence toujours par les centaines</li>
                  <li>• Puis les dizaines</li>
                  <li>• Et enfin les unités</li>
                  <li>• N'oublie pas de dire "cent" quand il y en a !</li>
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
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-bold text-blue-600">
                      Score : {score}/{exercises.length}
                    </div>
                    <button
                      onClick={resetAll}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="inline w-4 h-4 mr-2" />
                      Recommencer
                    </button>
                  </div>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <h3 className="text-xl font-bold mb-6 text-gray-900">
                  🤔 Comment lit-on ce nombre ?
                </h3>
                
                <div className="text-6xl font-bold text-blue-600 mb-8">
                  {exercises[currentExercise].number}
                </div>
                
                <div className="max-w-md mx-auto mb-6">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Écris comment tu lis ce nombre..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                  />
                </div>
                
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim()}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    Vérifier
                  </button>
                  <button
                    onClick={resetExercise}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    Effacer
                  </button>
                </div>
                
                {/* Résultat */}
                {isCorrect !== null && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center justify-center space-x-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          <span className="font-bold">Excellent ! C'est la bonne réponse !</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6" />
                          <span className="font-bold">
                            Pas tout à fait... La bonne réponse est : "{exercises[currentExercise].reading}"
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Navigation */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                    disabled={currentExercise === 0}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    ← Précédent
                  </button>
                  <button
                    onClick={nextExercise}
                    disabled={currentExercise === exercises.length - 1}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Suivant →
                  </button>
                </div>
              </div>

              {/* Félicitations */}
              {currentExercise === exercises.length - 1 && isCorrect !== null && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-2xl font-bold mb-2">Bravo !</h3>
                  <p className="text-lg">
                    Tu as terminé tous les exercices ! Tu sais maintenant lire les nombres jusqu'à 1000 !
                  </p>
                  <p className="text-xl font-bold mt-4">
                    Score final : {score}/{exercises.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 