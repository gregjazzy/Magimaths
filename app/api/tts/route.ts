import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'shimmer', speed = 1.0, language = 'fr' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Texte requis' }, { status: 400 });
    }

    // Vérifier si on a une clé API OpenAI
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.log('Pas de clé OpenAI, utilisation de ElevenLabs en fallback');
      
      // Fallback vers ElevenLabs (gratuit avec limites)
      const elevenLabsResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || 'demo', // Mode démo sans clé
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        }),
      });

      if (elevenLabsResponse.ok) {
        const audioBuffer = await elevenLabsResponse.arrayBuffer();
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000', // Cache 1 an
          },
        });
      }

      // Si ElevenLabs échoue aussi, retourner erreur
      return NextResponse.json({ error: 'Services TTS indisponibles' }, { status: 503 });
    }

    // Utiliser OpenAI TTS si clé disponible
    const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd', // Modèle haute qualité
        input: text,
        voice: voice, // shimmer, alloy, echo, fable, onyx, nova
        speed: speed,
        response_format: 'mp3'
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error('Erreur OpenAI TTS:', error);
      return NextResponse.json({ error: 'Erreur OpenAI' }, { status: openaiResponse.status });
    }

    const audioBuffer = await openaiResponse.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache 1 an pour économiser les appels API
      },
    });

  } catch (error) {
    console.error('Erreur API TTS:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 