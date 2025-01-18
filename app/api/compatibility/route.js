import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API endpoint ready' });
}

export async function POST(request) {
  try {
    const { sign1, sign2 } = await request.json();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Fornisci un'analisi della compatibilità astrologica tra ${sign1} e ${sign2}. 
                   Includi: compatibilità generale, punti di forza della relazione, 
                   potenziali sfide e consigli per migliorare l'armonia.
                   Rispondi in italiano in max 4 paragrafi.`
        }]
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Errore nel processare la richiesta' },
      { status: 500 }
    );
  }
}
