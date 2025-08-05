'use client';

import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { testVoiceCompatibility } from '@/lib/audioManager';

// 🧪 COMPOSANT DE TEST AUDIO
export function AudioTestComponent() {
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [testing, setTesting] = useState(false);

  const handleAudioTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const result = await testVoiceCompatibility();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: "❌ Erreur lors du test audio"
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <Volume2 className="w-5 h-5 text-blue-500" />
        <h3 className="font-medium text-gray-900">Test Audio</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        Testez si l'audio fonctionne dans votre navigateur :
      </p>
      
      <button
        onClick={handleAudioTest}
        disabled={testing}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          testing 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {testing ? '🔄 Test en cours...' : '🧪 Tester l\'audio'}
      </button>
      
      {testResult && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          testResult.success 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {testResult.message}
          {!testResult.success && (
            <div className="mt-2 text-xs">
              💡 <strong>Solutions :</strong><br/>
              • Utilisez Chrome ou Edge<br/>
              • Le texte s'affichera à l'écran<br/>
              • Vérifiez le volume de votre appareil
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AudioTestComponent;