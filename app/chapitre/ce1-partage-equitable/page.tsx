'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Users, Apple, Gift } from 'lucide-react';

export default function CE1PartageEquitablePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // QCM avec des situations visuelles de partage équitable
  const questions = [
    {
      id: 1,
      title: "Partage 12 pommes entre 3 enfants",
      situation: {
        objects: 12,
        objectName: "pommes",
        recipients: 3,
        recipientName: "enfants"
      },
      correctAnswer: 0, // Index de la bonne réponse
      choices: [
        { perRecipient: 4, visual: "4-4-4" }, // Correct
        { perRecipient: 3, visual: "3-3-6" }, // Incorrect
        { perRecipient: 5, visual: "5-5-2" }, // Incorrect
      ]
    },
    {
      id: 2,
      title: "Partage 8 bonbons entre 2 sacs",
      situation: {
        objects: 8,
        objectName: "bonbons",
        recipients: 2,
        recipientName: "sacs"
      },
      correctAnswer: 1,
      choices: [
        { perRecipient: 3, visual: "3-5" }, // Incorrect
        { perRecipient: 4, visual: "4-4" }, // Correct
        { perRecipient: 6, visual: "6-2" }, // Incorrect
      ]
    },
    {
      id: 3,
      title: "Partage 15 cookies entre 5 assiettes",
      situation: {
        objects: 15,
        objectName: "cookies",
        recipients: 5,
        recipientName: "assiettes"
      },
      correctAnswer: 2,
      choices: [
        { perRecipient: 2, visual: "2-2-2-2-7" }, // Incorrect
        { perRecipient: 4, visual: "4-4-4-3-0" }, // Incorrect
        { perRecipient: 3, visual: "3-3-3-3-3" }, // Correct
      ]
    },
    {
      id: 4,
      title: "Partage 10 crayons entre 2 boîtes",
      situation: {
        objects: 10,
        objectName: "crayons",
        recipients: 2,
        recipientName: "boîtes"
      },
      correctAnswer: 1,
      choices: [
        { perRecipient: 6, visual: "6-4" }, // Incorrect
        { perRecipient: 5, visual: "5-5" }, // Correct
        { perRecipient: 3, visual: "3-7" }, // Incorrect
      ]
    },
    {
      id: 5,
      title: "Partage 18 billes entre 3 sacs",
      situation: {
        objects: 18,
        objectName: "billes",
        recipients: 3,
        recipientName: "sacs"
      },
      correctAnswer: 0,
      choices: [
        { perRecipient: 6, visual: "6-6-6" }, // Correct
        { perRecipient: 5, visual: "5-5-8" }, // Incorrect
        { perRecipient: 4, visual: "4-4-10" }, // Incorrect
      ]
    }
  ];

  // Composant pour dessiner des objets visuellement
  const ObjectIcon = ({ type, count, color = "#f59e0b" }: { type: string, count: number, color?: string }) => {
    const items = [];
    const maxPerRow = 6;
    
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / maxPerRow);
      const col = i % maxPerRow;
      
      if (type === "pommes") {
        items.push(
          <div key={i} className="w-6 h-6 bg-red-400 rounded-full relative" style={{
            position: 'absolute',
            left: `${col * 28}px`,
            top: `${row * 28}px`
          }}>
            <div className="w-2 h-3 bg-green-500 rounded-t-full absolute -top-1 left-2"></div>
          </div>
        );
      } else if (type === "bonbons") {
        items.push(
          <div key={i} className="w-6 h-8 bg-pink-400 rounded-lg relative" style={{
            position: 'absolute',
            left: `${col * 28}px`,
            top: `${row * 32}px`
          }}>
            <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-2"></div>
          </div>
        );
      } else if (type === "cookies") {
        items.push(
          <div key={i} className="w-7 h-7 bg-yellow-600 rounded-full relative" style={{
            position: 'absolute',
            left: `${col * 30}px`,
            top: `${row * 30}px`
          }}>
            <div className="w-1 h-1 bg-yellow-800 rounded-full absolute top-2 left-2"></div>
            <div className="w-1 h-1 bg-yellow-800 rounded-full absolute top-3 left-4"></div>
            <div className="w-1 h-1 bg-yellow-800 rounded-full absolute top-4 left-2"></div>
          </div>
        );
      } else if (type === "crayons") {
        items.push(
          <div key={i} className="w-2 h-8 bg-blue-500 rounded-t-full relative" style={{
            position: 'absolute',
            left: `${col * 12}px`,
            top: `${row * 32}px`
          }}>
            <div className="w-2 h-2 bg-gray-700 rounded-full absolute -top-1"></div>
          </div>
        );
      } else if (type === "billes") {
        items.push(
          <div key={i} className="w-5 h-5 bg-purple-400 rounded-full relative" style={{
            position: 'absolute',
            left: `${col * 24}px`,
            top: `${row * 24}px`
          }}>
            <div className="w-2 h-2 bg-purple-200 rounded-full absolute top-1 left-1"></div>
          </div>
        );
      }
    }

    const rows = Math.ceil(count / maxPerRow);
    const containerHeight = rows * (type === "crayons" ? 32 : type === "bonbons" ? 32 : type === "cookies" ? 30 : type === "billes" ? 24 : 28) + 10;

    return (
      <div className="relative inline-block" style={{ 
        width: `${Math.min(count, maxPerRow) * (type === "crayons" ? 12 : type === "billes" ? 24 : type === "cookies" ? 30 : 28)}px`,
        height: `${containerHeight}px`,
        minHeight: '40px'
      }}>
        {items}
      </div>
    );
  };

  // Composant pour dessiner les récipients avec leur contenu
  const RecipientWithContent = ({ type, content, recipientName }: { type: string, content: number, recipientName: string }) => {
    return (
      <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
        {/* Récipient visuel */}
        <div className="mb-2">
          {recipientName === "enfants" && (
            <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-700" />
            </div>
          )}
          {recipientName === "sacs" && (
            <div className="w-12 h-10 bg-brown-400 rounded-b-lg border-2 border-brown-600" style={{backgroundColor: '#8B4513'}}>
              <div className="w-8 h-2 bg-brown-600 mx-auto rounded-t"></div>
            </div>
          )}
          {recipientName === "assiettes" && (
            <div className="w-14 h-3 bg-white border-2 border-gray-400 rounded-full"></div>
          )}
          {recipientName === "boîtes" && (
            <div className="w-12 h-8 bg-gray-400 border-2 border-gray-600"></div>
          )}
        </div>
        
        {/* Contenu */}
        <div className="text-center">
          <ObjectIcon type={type} count={content} />
          <div className="text-sm font-bold text-gray-700 mt-1">{content}</div>
        </div>
      </div>
    );
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect && !answeredQuestions.has(currentQuestion)) {
      setScore(score + 1);
      setAnsweredQuestions(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion);
        return newSet;
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/ce1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au CE1</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Partage Équitable - QCM Visuel
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Choisis la bonne façon de partager équitablement !
            </p>
            <div className="flex justify-center space-x-6">
              <div className="text-lg font-bold text-blue-600">
                Question {currentQuestion + 1} / {questions.length}
              </div>
              <div className="text-lg font-bold text-green-600">
                Score : {score} / {questions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {currentQ.title}
          </h2>
          
          {/* Situation initiale */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-8 text-center">
            <h3 className="text-xl font-bold mb-4 text-yellow-800">
              Situation : {currentQ.situation.objects} {currentQ.situation.objectName} pour {currentQ.situation.recipients} {currentQ.situation.recipientName}
            </h3>
            
            <div className="flex justify-center mb-4">
              <ObjectIcon type={currentQ.situation.objectName} count={currentQ.situation.objects} />
            </div>
            
            <div className="flex justify-center items-center space-x-4">
              <span className="text-lg font-semibold">À partager entre</span>
              <div className="flex space-x-2">
                {Array.from({length: currentQ.situation.recipients}, (_, i) => (
                  <div key={i} className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                    {currentQ.situation.recipientName === "enfants" && <Users className="w-4 h-4 text-blue-700" />}
                    {currentQ.situation.recipientName === "sacs" && <Gift className="w-4 h-4 text-brown-700" />}
                    {currentQ.situation.recipientName === "assiettes" && "🍽️"}
                    {currentQ.situation.recipientName === "boîtes" && "📦"}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Choix de réponses visuels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentQ.choices.map((choice, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQ.correctAnswer;
              const showCorrection = showResult && isSelected;
              
              // Parse le visual pour créer la répartition
              const distribution = choice.visual.split('-').map(num => parseInt(num));
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showResult}
                  className={`p-4 sm:p-6 rounded-xl border-3 transition-all transform hover:scale-105 active:scale-95 touch-manipulation min-h-[100px] ${
                    showCorrection
                      ? isCorrect 
                        ? 'bg-green-100 border-green-500 shadow-lg' 
                        : 'bg-red-100 border-red-500 shadow-lg'
                      : showResult && isCorrect
                        ? 'bg-green-50 border-green-400'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {/* Répartition visuelle */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 mb-3">Répartition {String.fromCharCode(65 + index)}</h4>
                    
                    <div className="flex justify-center space-x-3 flex-wrap">
                      {distribution.map((count, recipientIndex) => (
                        <RecipientWithContent
                          key={recipientIndex}
                          type={currentQ.situation.objectName}
                          content={count}
                          recipientName={currentQ.situation.recipientName}
                        />
                      ))}
                    </div>
                    
                    {/* Indication égalité ou inégalité */}
                    <div className="text-center">
                      {distribution.every(count => count === distribution[0]) ? (
                        <div className="text-green-600 font-bold">✅ Partage équitable</div>
                      ) : (
                        <div className="text-red-600 font-bold">❌ Partage inéquitable</div>
                      )}
                    </div>
                  </div>

                  {/* Feedback après sélection */}
                  {showCorrection && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      {isCorrect ? (
                        <div className="text-green-600 font-bold flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Excellent ! C'est équitable !
                        </div>
                      ) : (
                        <div className="text-red-600 font-bold flex items-center justify-center">
                          <XCircle className="w-5 h-5 mr-2" />
                          Ce n'est pas équitable
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          {showResult && currentQuestion < questions.length - 1 && (
            <button
              onClick={nextQuestion}
              className="bg-blue-500 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px] max-w-sm"
            >
              Question suivante
            </button>
          )}
          
          {currentQuestion === questions.length - 1 && showResult && (
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-xl mb-4">
                <h3 className="text-2xl font-bold mb-2">Quiz terminé ! 🎉</h3>
                <p className="text-xl">Score final : {score} / {questions.length}</p>
                <p className="text-lg mt-2">
                  {score === questions.length ? "Parfait ! Tu maîtrises le partage équitable !" :
                   score >= questions.length * 0.8 ? "Très bien ! Encore un petit effort !" :
                   score >= questions.length * 0.6 ? "C'est bien, continue à t'entraîner !" :
                   "N'hésite pas à recommencer pour progresser !"}
                </p>
              </div>
              
              <button
                onClick={resetQuiz}
                className="bg-purple-500 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px] max-w-sm"
              >
                <RotateCcw className="inline w-5 h-5 mr-2" />
                Recommencer le quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 