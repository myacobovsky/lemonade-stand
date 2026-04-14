// @ts-nocheck
// SLOGAN GENERATOR COMPONENT
// Drop this into the editor page or import as a component
// Requires: store name, category from context

'use client';

import { useState } from 'react';

const BLOCKED_WORDS = [
  'stupid', 'dumb', 'hate', 'kill', 'die', 'dead', 'ugly', 'fat', 'idiot',
  'shut up', 'loser', 'suck', 'damn', 'hell', 'crap', 'butt', 'poop',
  'sex', 'nude', 'naked', 'drug', 'alcohol', 'beer', 'wine', 'weed',
  'gun', 'weapon', 'bomb', 'fight', 'blood', 'violent', 'bully',
];

function containsBlockedContent(text) {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some(word => lower.includes(word));
}

const VIBES = [
  { label: 'Fun', emoji: '🎉', value: 'fun and playful' },
  { label: 'Bold', emoji: '🔥', value: 'bold and confident' },
  { label: 'Sweet', emoji: '🌸', value: 'sweet and friendly' },
  { label: 'Creative', emoji: '🎨', value: 'creative and artsy' },
  { label: 'Pro', emoji: '💼', value: 'professional and polished' },
];

export default function SloganGenerator({ storeName, category, currentSlogan, onSelectSlogan }) {
  const [isOpen, setIsOpen] = useState(false);
  const [vibe, setVibe] = useState(null);
  const [customDetail, setCustomDetail] = useState('');
  const [slogans, setSlogans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  async function generateSlogans() {
    // Input moderation
    if (containsBlockedContent(customDetail) || containsBlockedContent(storeName || '')) {
      setError("Let's keep it appropriate! Try different words.");
      return;
    }

    setLoading(true);
    setError('');
    setSlogans([]);
    setSelected(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: `You generate short, catchy store slogans for a children's e-commerce platform called Lemonade Stand. The stores are run by kids ages 6-13 who sell handmade products.

Rules:
- Each slogan must be under 8 words
- All output must be appropriate for ages 6-13
- Never include violence, inappropriate language, mature themes, or sarcasm
- Keep slogans positive, encouraging, and business-focused
- Make them fun and memorable
- Do not use quotation marks around the slogans
- Return ONLY a JSON array of 5 strings, nothing else. No markdown, no backticks, no explanation.

Example output:
["Made with love, sold with pride", "Small hands, big dreams", "Fresh ideas, handmade quality", "Created by kids, loved by everyone", "Where creativity meets hustle"]`,
          messages: [
            {
              role: 'user',
              content: `Generate 5 slogans for a kid's store called "${storeName || 'My Shop'}". They sell ${category || 'handmade products'}. The vibe should be ${vibe?.value || 'fun and playful'}.${customDetail ? ` Extra detail: ${customDetail}` : ''}`
            }
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || '';

      // Parse the JSON array
      try {
        const parsed = JSON.parse(text.trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Final output moderation
          const safe = parsed.filter(s => !containsBlockedContent(s));
          if (safe.length > 0) {
            setSlogans(safe);
          } else {
            setError('Something went wrong. Try again!');
          }
        } else {
          setError('Something went wrong. Try again!');
        }
      } catch {
        // Try to extract slogans from non-JSON response
        const lines = text.split('\n').filter(l => l.trim().length > 3 && l.trim().length < 60);
        const cleaned = lines.map(l => l.replace(/^[\d\.\-\*"]+\s*/, '').replace(/["]+$/g, '').trim()).filter(l => l.length > 3);
        if (cleaned.length > 0) {
          const safe = cleaned.filter(s => !containsBlockedContent(s));
          setSlogans(safe.slice(0, 5));
        } else {
          setError('Something went wrong. Try again!');
        }
      }
    } catch (err) {
      console.error('Slogan generation error:', err);
      setError('Could not generate slogans right now. Try again later!');
    }

    setLoading(false);
  }

  function handleSelect(slogan) {
    setSelected(slogan);
    onSelectSlogan(slogan);
  }

  if (!isOpen) {
    return (
      <div className="mt-3">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-sm font-semibold transition-colors active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          Generate a Store Slogan with AI
        </button>
        {currentSlogan && (
          <p className="text-xs text-gray-400 mt-1.5 text-center">Current: "{currentSlogan}"</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 bg-purple-50 rounded-2xl p-5 border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <h3 className="font-bold text-purple-800 text-sm">AI Slogan Generator</h3>
        </div>
        <button
          onClick={() => { setIsOpen(false); setSlogans([]); setError(''); }}
          className="w-8 h-8 flex items-center justify-center text-purple-400 hover:text-purple-600 text-xl rounded-full hover:bg-purple-100"
        >
          &times;
        </button>
      </div>

      {/* Vibe picker */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-purple-700 mb-2">Pick a vibe for your slogan</label>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => (
            <button
              key={v.label}
              onClick={() => setVibe(v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                vibe?.label === v.label
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-700 border border-purple-200 hover:border-purple-400'
              }`}
            >
              <span>{v.emoji}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional detail */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-purple-700 mb-1.5">Anything else the AI should know? <span className="text-purple-400 font-normal">(optional)</span></label>
        <input
          type="text"
          value={customDetail}
          onChange={(e) => { setCustomDetail(e.target.value); setError(''); }}
          placeholder="e.g. I use recycled materials, my products are colorful"
          maxLength={100}
          className="w-full px-3 py-2.5 rounded-xl border border-purple-200 focus:border-purple-400 focus:outline-none text-sm bg-white"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={generateSlogans}
        disabled={!vibe || loading}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
          !vibe || loading
            ? 'bg-gray-200 text-gray-400'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75"/>
            </svg>
            Brainstorming...
          </span>
        ) : slogans.length > 0 ? 'Try Again' : 'Generate Slogans'}
      </button>

      {error && (
        <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
      )}

      {/* Results */}
      {slogans.length > 0 && (
        <div className="mt-4 space-y-2">
          <label className="block text-xs font-medium text-purple-700 mb-1">Pick your favorite</label>
          {slogans.map((slogan, i) => (
            <button
              key={i}
              onClick={() => handleSelect(slogan)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all active:scale-[0.98] ${
                selected === slogan
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-white border border-purple-200 text-gray-700 hover:border-purple-400'
              }`}
            >
              "{slogan}"
            </button>
          ))}
        </div>
      )}

      {selected && (
        <p className="text-xs text-purple-500 mt-3 text-center">
          Slogan saved! You can see it on your store.
        </p>
      )}
    </div>
  );
}

