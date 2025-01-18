'use client';

import React, { useState } from 'react';
import { Moon, Stars, Loader2 } from 'lucide-react';

const ZODIAC_SIGNS = [
  'Ariete', 'Toro', 'Gemelli', 'Cancro', 
  'Leone', 'Vergine', 'Bilancia', 'Scorpione',
  'Sagittario', 'Capricorno', 'Acquario', 'Pesci'
];

export default function Home() {
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');
  const [compatibility, setCompatibility] = useState('');
  const [loading, setLoading] = useState(false);

  const getCompatibility = async () => {
    console.log('Signs:', sign1, sign2); // Debug log
    if (!sign1 || !sign2) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sign1, sign2 })
      });

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      console.log('MSG Response:', data.content[0].text); // Debug log
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Claude API returns response in messages[0].content
      console.log('MSG Response:', data.content[0].text); // Debug log
      if (data.content[0] && data.content[0].text) {
        setCompatibility(data.content[0].text);
      } else {
        throw new Error('Risposta API non valida');
      }
    } catch (error) {
      console.error('Error:', error);
      setCompatibility('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-indigo-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Stars className="text-yellow-300" size={32} />
          <h1 className="text-3xl font-bold text-center">Compatibilità Astrologica</h1>
          <Moon className="text-yellow-300" size={32} />
        </div>

        <div className="bg-indigo-900 rounded-lg p-6 shadow-xl mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2">Primo Segno</label>
              <select 
                value={sign1}
                onChange={(e) => setSign1(e.target.value)}
                className="w-full p-2 rounded bg-indigo-800 border border-indigo-600"
              >
                <option value="">Seleziona...</option>
                {ZODIAC_SIGNS.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Secondo Segno</label>
              <select
                value={sign2}
                onChange={(e) => setSign2(e.target.value)}
                className="w-full p-2 rounded bg-indigo-800 border border-indigo-600"
              >
                <option value="">Seleziona...</option>
                {ZODIAC_SIGNS.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={getCompatibility}
            disabled={!sign1 || !sign2 || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 
                     disabled:cursor-not-allowed py-2 px-4 rounded-lg transition-colors
                     flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analisi in corso...
              </>
            ) : (
              'Analizza Compatibilità'
            )}
          </button>
        </div>

        {compatibility && (
          <div className="bg-indigo-900 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300">
              {sign1} + {sign2}
            </h2>
            <div className="prose prose-invert">
              {compatibility}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}