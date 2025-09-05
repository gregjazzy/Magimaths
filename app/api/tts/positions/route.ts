import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient();

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const [response] = await client.synthesizeSpeech({
      input: { text: "Le nuage est au-dessus du garçon" },
      voice: { languageCode: 'fr-FR', name: 'fr-FR-Wavenet-A' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    return new NextResponse(response.audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return new NextResponse('Error generating speech', { status: 500 });
  }
}
