// @ts-nocheck
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../lib/context';

// Route mapping
const routes = {
  'landing': '/',
  'setup': '/setup',
  'parent-dashboard': '/dashboard',
  'kid-editor': '/editor',
  'storefront': '/store',
  'savings-jar': '/savings',
  'marketplace': '/shop',
  'learn': '/learn',
  'kid-biz': '/biz',
  'login': '/login',
};

// --- Logo Component (Lemon Character) ---
export const Logo = ({ size = 'md' }) => {
  const sizes = { sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-10 h-10' };
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizes[size]}>
      <circle cx="16" cy="16" r="15" fill="#FEF3C7"/>
      <ellipse cx="16" cy="17" rx="11" ry="9" fill="#FCD34D" stroke="#292524" strokeWidth="2"/>
      <circle cx="12" cy="16" r="2" fill="#292524"/>
      <circle cx="20" cy="16" r="2" fill="#292524"/>
      <circle cx="11" cy="15" r="0.75" fill="white"/>
      <circle cx="19" cy="15" r="0.75" fill="white"/>
      <path d="M12 20 Q16 24 20 20" stroke="#292524" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M16 8 Q20 4 22 8 Q20 10 16 8" fill="#10B981" stroke="#292524" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="9" cy="19" r="1.5" fill="#FBBF24"/>
      <circle cx="23" cy="19" r="1.5" fill="#FBBF24"/>
    </svg>
  );
};

// --- Lemon Lightbulb ---
const LemonBulb = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="16" cy="16" r="15" fill="#FEF3C7"/>
    <g stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
      <line x1="16" y1="1.5" x2="16" y2="3.5"/><line x1="5" y1="5" x2="6.5" y2="6.5"/>
      <line x1="27" y1="5" x2="25.5" y2="6.5"/><line x1="1.5" y1="15" x2="3.5" y2="15"/>
      <line x1="28.5" y1="15" x2="30.5" y2="15"/>
    </g>
    <ellipse cx="16" cy="15" rx="10" ry="8.5" fill="#FCD34D" stroke="#292524" strokeWidth="2"/>
    <rect x="11" y="23" width="10" height="3" rx="1" fill="#D1D5DB" stroke="#292524" strokeWidth="1.5"/>
    <line x1="11.5" y1="24.5" x2="20.5" y2="24.5" stroke="#9CA3AF" strokeWidth="0.75"/>
    <rect x="13.5" y="26" width="5" height="2" rx="0.75" fill="#9CA3AF" stroke="#292524" strokeWidth="1.5"/>
    <circle cx="12.5" cy="14" r="2" fill="#292524"/><circle cx="19.5" cy="14" r="2" fill="#292524"/>
    <circle cx="11.5" cy="13" r="0.75" fill="white"/><circle cx="18.5" cy="13" r="0.75" fill="white"/>
    <path d="M12.5 18 Q16 21.5 19.5 18" stroke="#292524" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="8.5" cy="17" r="1.5" fill="#FBBF24"/><circle cx="23.5" cy="17" r="1.5" fill="#FBBF24"/>
    <path d="M16 6.5 Q20 2.5 22 6.5 Q20 8.5 16 6.5" fill="#10B981" stroke="#292524" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// --- LearnTip ---
export const LearnTip = ({ title, color = 'amber', children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = { amber: 'bg-amber-50 border-amber-200 text-amber-800', green: 'bg-emerald-50 border-emerald-200 text-emerald-800', blue: 'bg-blue-50 border-blue-200 text-blue-800', purple: 'bg-purple-50 border-purple-200 text-purple-800' };
  return (
    <div className="relative inline-block">
      <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center" title="Learn about this!">
        <LemonBulb />
      </button>
      {isOpen && (
        <div className={`absolute z-50 right-0 top-12 w-72 sm:w-80 p-4 rounded-xl border-2 shadow-lg ${colors[color]}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><LemonBulb className="w-5 h-5" /><div className="font-bold text-sm">{title}</div></div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl leading-none rounded-full hover:bg-gray-100">&times;</button>
          </div>
          <div className="text-sm space-y-2">{children}</div>
        </div>
      )}
    </div>
  );
};

// --- NavBar ---
export const NavBar = ({ active }) => {
  const pathname = usePathname();
  const { user, signOut, store, stores, switchStore } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  // If store belongs to a school, Shop links to the school marketplace instead of public shop
  const shopHref = store?.school_id ? `/schools/${store.school_slug || 'ps150'}` : '/shop';

  const tabs = store ? [
    { id: 'biz', href: '/biz', label: 'My Biz', icon: '🏪' },
    { id: 'editor', href: '/editor', label: 'Editor', icon: '🎨' },
    { id: 'shop', href: shopHref, label: 'Shop', icon: '🛒' },
    { id: 'learn', href: '/learn', label: 'Learn', icon: '📚' },
    { id: 'schools', href: '/schools', label: 'Schools', icon: '🏫' },
    { id: 'dashboard', href: '/dashboard', label: 'Parent', icon: '🔒' },
  ] : [
    { id: 'shop', href: '/shop', label: 'Shop', icon: '🛒' },
    { id: 'learn', href: '/learn', label: 'Learn', icon: '📚' },
    { id: 'schools', href: '/schools', label: 'Schools', icon: '🏫' },
  ];

  const currentTab = active || pathname?.replace('/', '') || '';

  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3 relative">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-bold text-gray-900" style={{ fontFamily: "'DynaPuff', cursive" }}>Lemonade Stand</span>
          </Link>
          {stores.length > 1 && (
            <select
              value={store?.id || ''}
              onChange={(e) => switchStore(e.target.value)}
              className="ml-2 text-sm bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-amber-400"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.store_name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <nav className="hidden sm:flex gap-1 text-sm">
            {tabs.map((tab) => (
              <Link key={tab.id} href={tab.href} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${currentTab === tab.id ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-gray-50 text-gray-500'}`}>
                <span className="text-base">{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </Link>
            ))}
          </nav>
          {user && (
            <button onClick={signOut} className="hidden sm:block text-xs text-gray-400 hover:text-gray-600 ml-2">Log out</button>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-gray-50 active:bg-gray-100">
            {menuOpen ? <span className="text-gray-600 text-2xl leading-none">&times;</span> : <><div className="w-5 h-0.5 bg-gray-600 rounded-full" /><div className="w-5 h-0.5 bg-gray-600 rounded-full" /><div className="w-5 h-0.5 bg-gray-600 rounded-full" /></>}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="max-w-4xl mx-auto py-2 px-4">
            {tabs.map((tab) => (
              <Link key={tab.id} href={tab.href} onClick={() => setMenuOpen(false)} className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all active:scale-95 ${currentTab === tab.id ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="text-xl">{tab.icon}</span>
                <span className="text-base">{tab.label}</span>
              </Link>
            ))}
            {user && (
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 rounded-lg">Log out</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// --- Confetti ---
export const Confetti = () => {
  const pieces = Array.from({ length: 30 }, (_, i) => ({ id: i, left: Math.random() * 100, delay: Math.random() * 2, duration: 2 + Math.random() * 2, color: ['#FCD34D', '#34D399', '#F472B6', '#60A5FA', '#A78BFA', '#FB923C'][Math.floor(Math.random() * 6)], size: 6 + Math.random() * 8 }));
  return (<div className="fixed inset-0 pointer-events-none z-50">{pieces.map((p) => (<div key={p.id} className="absolute rounded-sm" style={{ left: `${p.left}%`, top: '-20px', width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards` }} />))}</div>);
};

// --- Pattern Helpers ---
export const stickerSets = {
  popular: ['🌈', '⭐', '🦄', '🚀', '🎸', '🌸', '🔥', '💎', '🎨', '🍋', '🌟', '🎁', '🏆', '❤️', '🎉'],
  faces: ['😎', '🤩', '😍', '🤗', '🤓', '👻', '🤖', '👽', '😸', '🤠', '🥸', '😉', '🥳', '😊', '🙂'],
  animals: ['🐶', '🐱', '🦋', '🐬', '🦄', '🐻', '🦁', '🐧', '🦅', '🐢', '🐍', '🐝', '🐳', '🦜', '🐾'],
  food: ['🍔', '🍕', '🍪', '🍰', '🍦', '🍉', '🍓', '🥭', '🍩', '🎂', '🧁', '🍿', '🍭', '🍋', '🥫'],
  nature: ['🌻', '🌱', '🌈', '☀️', '🌙', '⚡', '🌊', '🌸', '🌺', '🍀', '🌴', '🌎', '🌋', '❄️', '🌹'],
  sports: ['⚽', '🏀', '🎾', '🏈', '⚾', '🥊', '🏄', '🚴', '🎿', '🎯', '🎳', '🏓', '🥌', '🛹', '🏆'],
  sparkles: ['✨', '💫', '🌟', '🚨', '🎆', '🎇', '🎈', '🎀', '💎', '👑', '🔔', '🎵', '🎶', '🎰', '🔮'],
};

const emojiPatterns = {
  hearts: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="10" y="28" font-size="16" opacity="0.12">❤️</text></svg>'),
  stars: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="10" y="28" font-size="16" opacity="0.12">⭐</text></svg>'),
  smileys: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="10" y="28" font-size="16" opacity="0.12">😊</text></svg>'),
  spirals: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="10" y="28" font-size="16" opacity="0.12">🌀</text></svg>'),
  poop: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="10" y="28" font-size="16" opacity="0.12">💩</text></svg>'),
};

export const getPatternStyle = (pattern) => {
  if (!pattern || pattern === 'none') return {};
  if (pattern === 'stripes') return { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #00000006 5px, #00000006 10px)' };
  if (pattern === 'confetti') return { backgroundImage: 'radial-gradient(circle, #FCD34D 1.5px, transparent 1.5px), radial-gradient(circle, #F472B6 1.5px, transparent 1.5px), radial-gradient(circle, #60A5FA 1.5px, transparent 1.5px)', backgroundSize: '24px 24px, 36px 36px, 30px 30px', backgroundPosition: '0 0, 12px 18px, 6px 6px' };
  if (emojiPatterns[pattern]) return { backgroundImage: `url("${emojiPatterns[pattern]}")`, backgroundSize: '40px 40px' };
  return {};
};

export const getCardClasses = (style, inStock, color) => {
  const base = inStock === false ? 'opacity-60' : '';
  const hover = inStock === false ? '' : 'hover:shadow-md';
  const borderColor = color === 'blue' ? 'border-blue-400' : color === 'green' ? 'border-emerald-400' : color === 'pink' ? 'border-pink-400' : color === 'purple' ? 'border-purple-400' : color === 'orange' ? 'border-orange-400' : 'border-amber-400';
  if (style === 'flat') return `bg-gray-50 rounded-none overflow-hidden transition-shadow ${base} ${hover}`;
  if (style === 'bordered') return `bg-white rounded-lg border-2 ${borderColor} overflow-hidden transition-shadow ${base} ${hover}`;
  if (style === 'polaroid') return `bg-white rounded-sm shadow-lg p-2 pb-4 transition-shadow ${base} ${hover}`;
  return `bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-shadow ${base} ${hover}`;
};

export const fontOptions = [
  { name: 'Poppins', value: 'Poppins', family: "'Poppins', sans-serif" },
  { name: 'Montserrat', value: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Pacifico', value: 'Pacifico', family: "'Pacifico', cursive" },
  { name: 'Sour Gummy', value: 'Sour Gummy', family: "'Sour Gummy', cursive" },
  { name: 'DynaPuff', value: 'DynaPuff', family: "'DynaPuff', cursive" },
  { name: 'Delius', value: 'Delius', family: "'Delius', cursive" },
  { name: 'Emilys Candy', value: 'Emilys Candy', family: "'Emilys Candy', cursive" },
  { name: 'Unica One', value: 'Unica One', family: "'Unica One', sans-serif" },
  { name: 'Ultra', value: 'Ultra', family: "'Ultra', serif" },
  { name: 'Quantico', value: 'Quantico', family: "'Quantico', sans-serif" },
];

// --- Parent Gate (COPPA compliance) ---
export const ParentGate = ({ children, onCancel }) => {
  const [passed, setPassed] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [challenge] = useState(() => {
    const a = Math.floor(Math.random() * 4) + 6; // 6-9
    const b = Math.floor(Math.random() * 4) + 6; // 6-9
    return { a, b, answer: a * b };
  });

  if (passed) return children;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-sm text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Parent Area</h2>
        <p className="text-sm text-gray-500 mb-6">To keep kids safe, please solve this to continue.</p>
        <div className="bg-gray-50 rounded-xl p-5 mb-4">
          <div className="text-2xl font-bold text-gray-800 mb-3">What is {challenge.a} × {challenge.b}?</div>
          <input
            type="number"
            inputMode="numeric"
            value={answer}
            onChange={(e) => { setAnswer(e.target.value); setError(false); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && parseInt(answer) === challenge.answer) setPassed(true);
              else if (e.key === 'Enter') setError(true);
            }}
            className={`w-32 mx-auto text-center text-2xl font-bold py-3 rounded-xl border-2 focus:outline-none ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-amber-400'
            }`}
            placeholder="?"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">Not quite. Try again.</p>}
        </div>
        <button
          onClick={() => {
            if (parseInt(answer) === challenge.answer) setPassed(true);
            else setError(true);
          }}
          className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
        >
          Continue
        </button>
        {onCancel && (
          <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600">Go back</button>
        )}
      </div>
    </div>
  );
};
