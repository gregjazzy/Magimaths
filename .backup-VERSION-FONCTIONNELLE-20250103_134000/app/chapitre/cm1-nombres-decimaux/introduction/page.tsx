'use client';


import Link from 'next/link';
import { ArrowLeft, BookOpen, Calculator, Lightbulb } from 'lucide-react';

export default function IntroductionNombresDecimaux() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cm1-nombres-decimaux" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📚 Introduction aux nombres décimaux
            </h1>
            <p className="text-lg text-gray-600">
              Découvre ce que sont les nombres décimaux et d'où ils viennent !
            </p>
          </div>
        </div>

        {/* Définition */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Qu'est-ce qu'un nombre décimal ?</h2>
          </div>
          
                               <div className="bg-cyan-50 rounded-lg p-6 mb-6">
            <p className="text-lg text-cyan-800 font-semibold mb-4">
              Un nombre décimal se compose de trois parties :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">Partie entière</div>
                <div className="text-lg text-gray-600">Avant la virgule</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">Virgule</div>
                <div className="text-lg text-gray-600">Sépare les deux parties</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">Partie décimale</div>
                <div className="text-lg text-gray-600">Après la virgule</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-cyan-800 mb-3 text-center">📖 Exemple : 12,75</h4>
              <div className="flex justify-center items-center space-x-2">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">12</div>
                  <div className="text-sm text-green-600 font-bold">partie entière</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600">,</div>
                  <div className="text-sm text-red-600 font-bold">virgule</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">75</div>
                  <div className="text-sm text-blue-600 font-bold">partie décimale</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <p className="text-lg text-blue-800 font-semibold mb-4">
              Un nombre décimal est souvent le résultat d'une division ou d'une fraction !
            </p>
            <p className="text-blue-700">
              Quand on divise un nombre par un autre, on obtient parfois un nombre décimal avec une virgule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4">💡 Exemple simple</h3>
              <div className="space-y-2">
                <p className="text-green-700">Si j'ai 1 pizza pour 2 personnes :</p>
                <div className="text-2xl font-bold text-green-600 text-center">
                  1 ÷ 2 = 0,5
                </div>
                <p className="text-green-700 text-center">Chaque personne a 0,5 pizza</p>
              </div>
            </div>

                         <div className="bg-purple-50 rounded-lg p-6">
               <h3 className="text-xl font-bold text-purple-800 mb-4">🎯 En fraction</h3>
               <div className="space-y-2">
                 <p className="text-purple-700">C'est la même chose qu'une fraction :</p>
                 <div className="text-2xl font-bold text-purple-600 text-center">
                   <div className="flex items-center justify-center space-x-4">
                     <div className="flex flex-col items-center">
                       <span className="text-2xl">1</span>
                       <hr className="w-6 border-2 border-purple-600" />
                       <span className="text-2xl">2</span>
                     </div>
                     <span className="text-2xl">=</span>
                     <span className="text-2xl">0,5</span>
                   </div>
                 </div>
                 <p className="text-purple-700 text-center">Un demi = zéro virgule cinq</p>
               </div>
             </div>
          </div>
        </div>

        {/* Fractions usuelles */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <Calculator className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Fractions usuelles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fractions simples */}
                         <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
               <h3 className="text-xl font-bold text-orange-800 mb-4">🔢 Fractions simples</h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between bg-white rounded-lg p-3">
                   <div className="text-2xl font-bold text-orange-600">
                     <div className="flex flex-col items-center">
                       <span>1</span>
                       <hr className="w-6 border-2 border-orange-600" />
                       <span>2</span>
                     </div>
                   </div>
                   <div className="text-xl text-gray-600">=</div>
                   <div className="text-2xl font-bold text-orange-600">0,5</div>
                 </div>
                 <div className="flex items-center justify-between bg-white rounded-lg p-3">
                   <div className="text-2xl font-bold text-orange-600">
                     <div className="flex flex-col items-center">
                       <span>1</span>
                       <hr className="w-6 border-2 border-orange-600" />
                       <span>4</span>
                     </div>
                   </div>
                   <div className="text-xl text-gray-600">=</div>
                   <div className="text-2xl font-bold text-orange-600">0,25</div>
                 </div>
                 <div className="flex items-center justify-between bg-white rounded-lg p-3">
                   <div className="text-2xl font-bold text-orange-600">
                     <div className="flex flex-col items-center">
                       <span>3</span>
                       <hr className="w-6 border-2 border-orange-600" />
                       <span>4</span>
                     </div>
                   </div>
                   <div className="text-xl text-gray-600">=</div>
                   <div className="text-2xl font-bold text-orange-600">0,75</div>
                 </div>
               </div>
             </div>

            {/* Fractions avec 10 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">🔟 Fractions avec 10</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">
                    <div className="flex flex-col items-center">
                      <span>1</span>
                      <hr className="w-6 border-black" />
                      <span>10</span>
                    </div>
                  </div>
                  <div className="text-xl text-gray-600">=</div>
                  <div className="text-2xl font-bold text-blue-600">0,1</div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">
                    <div className="flex flex-col items-center">
                      <span>3</span>
                      <hr className="w-6 border-black" />
                      <span>10</span>
                    </div>
                  </div>
                  <div className="text-xl text-gray-600">=</div>
                  <div className="text-2xl font-bold text-blue-600">0,3</div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">
                    <div className="flex flex-col items-center">
                      <span>7</span>
                      <hr className="w-6 border-black" />
                      <span>10</span>
                    </div>
                  </div>
                  <div className="text-xl text-gray-600">=</div>
                  <div className="text-2xl font-bold text-blue-600">0,7</div>
                </div>
              </div>
            </div>

            {/* Fractions avec 100 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4">💯 Fractions avec 100</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    <div className="flex flex-col items-center">
                      <span>1</span>
                      <hr className="w-8 border-black" />
                      <span>100</span>
                    </div>
                  </div>
                  <div className="text-xl text-gray-600">=</div>
                  <div className="text-2xl font-bold text-green-600">0,01</div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    <div className="flex flex-col items-center">
                      <span>25</span>
                      <hr className="w-8 border-black" />
                      <span>100</span>
                    </div>
                  </div>
                  <div className="text-xl text-gray-600">=</div>
                  <div className="text-2xl font-bold text-green-600">0,25</div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    <div className="flex flex-col items-center">
                      <span>50</span>
                      <hr className="w-8 border-black" />
                      <span>100</span>
                    </div>
                  </div>
                  <div className="text-xl text-gray-600">=</div>
                  <div className="text-2xl font-bold text-green-600">0,50</div>
                </div>
              </div>
            </div>

            {/* Fractions particulières */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4">⭐ Fractions particulières</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">
                    <div className="flex flex-col items-center">
                      <span>1</span>
                      <hr className="w-6 border-black" />
                      <span>3</span>
                    </div>
                  </div>
                  <div className="text-xl text-gray-600">=</div>
                  <div className="text-2xl font-bold text-purple-600">0,333...</div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">
                    <div className="flex flex-col items-center">
                      <span>2</span>
                      <hr className="w-6 border-black" />
                      <span>3</span>
                    </div>
                  </div>
                  <div className="text-xl text-gray-600">=</div>
                  <div className="text-2xl font-bold text-purple-600">0,666...</div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">
                    <div className="flex flex-col items-center">
                      <span>1</span>
                      <hr className="w-6 border-black" />
                      <span>5</span>
                    </div>
                  </div>
                  <div className="text-xl text-gray-600">=</div>
                  <div className="text-2xl font-bold text-purple-600">0,2</div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Conseils */}
        <div className="bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">💡 Points importants à retenir</h3>
          </div>
          <ul className="space-y-2 text-lg">
            <li>• Un nombre décimal vient souvent d'une division</li>
            <li>• La virgule sépare la partie entière des décimales</li>
            <li>• 
              <div className="flex items-center">
                <span className="mr-2">¼, ½, ¾ sont des fractions très courantes</span>
              </div>
            </li>
            <li>• 1/10 = 0,1 (un dixième)</li>
            <li>• 1/100 = 0,01 (un centième)</li>
            <li>• Certaines fractions donnent des décimaux infinis (1/3 = 0,333...)</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 