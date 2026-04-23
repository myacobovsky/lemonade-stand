// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
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
  const { user, signOut, store, stores, switchStore, products, orders } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  // Separate state for the logged-out mobile menu so it doesn't collide with
  // the logged-in menu state above.
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);

  // If store belongs to a school, Shop links to the school marketplace instead of public shop
  const shopHref = store?.school_id ? `/schools/${store.school_slug || 'ps150'}` : '/shop';

  // Count items needing parent attention
  const pendingProducts = (products || []).filter(p => p.status === 'pending_review').length;
  const pendingOrders = (orders || []).filter(o => o.status === 'pending' || o.status === 'new').length;
  const parentBadgeCount = pendingProducts + pendingOrders;

  // Close mobile menus when the route changes (user tapped a link)
  useEffect(() => {
    setPublicMenuOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Close on Escape key — standard accessibility affordance
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setPublicMenuOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // ============================================================
  // LOGGED-OUT VIEW: Clean text nav matching the landing page
  // Visitors need to see Log in / Get Started CTAs on every page
  //
  // Mobile (<sm): hamburger menu (Get Started moves inside the panel)
  // Desktop (≥sm): full horizontal nav (unchanged behavior)
  // ============================================================
  if (!user) {
    const publicLinks = [
      { href: '/schools', label: 'Schools', key: 'schools' },
      { href: '/shop',    label: 'Shop',    key: 'shop' },
      { href: '/learn',   label: 'Learn',   key: 'learn' },
    ];
    const activeKey = active || '';

    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'DynaPuff', cursive" }}>Lemonade Stand</span>
          </Link>

          {/* Desktop nav (≥sm) — unchanged behavior from the original */}
          <div className="hidden sm:flex items-center gap-5">
            {publicLinks.map(l => (
              <Link
                key={l.key}
                href={l.href}
                className={`text-sm transition-colors ${
                  activeKey === l.key
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Log in</Link>
              <Link
                href="/login?mode=signup"
                className="px-5 py-2 text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: '#FCD34D',
                  color: '#1C1917',
                  border: '1.5px solid #1C1917',
                  boxShadow: '2px 2px 0 #1C1917',
                }}
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile hamburger trigger (shown only below sm) */}
          <button
            type="button"
            onClick={() => setPublicMenuOpen(v => !v)}
            aria-label={publicMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={publicMenuOpen}
            className="sm:hidden w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded-xl transition-colors active:bg-gray-100"
          >
            {publicMenuOpen ? (
              <span
                style={{
                  fontSize: '26px',
                  lineHeight: 1,
                  color: '#1C1917',
                  fontWeight: 700,
                }}
              >×</span>
            ) : (
              <>
                <div style={{ width: '22px', height: '2.5px', backgroundColor: '#1C1917', borderRadius: '2px' }} />
                <div style={{ width: '22px', height: '2.5px', backgroundColor: '#1C1917', borderRadius: '2px' }} />
                <div style={{ width: '22px', height: '2.5px', backgroundColor: '#1C1917', borderRadius: '2px' }} />
              </>
            )}
          </button>
        </div>

        {/*
          Mobile menu panel.
          Drops down below the sticky header when the hamburger is open.
          Links are large + tappable. "Get Started" moves inside as the
          prominent final CTA (per product direction).
        */}
        {publicMenuOpen && (
          <>
            {/* Backdrop tap-to-close layer */}
            <div
              className="sm:hidden fixed inset-0 bg-black/20 z-40"
              style={{ top: '64px' }}
              onClick={() => setPublicMenuOpen(false)}
              aria-hidden="true"
            />

            <div
              className="sm:hidden absolute top-full left-0 right-0 border-b z-50"
              style={{
                backgroundColor: '#FEF3C7',
                borderBottomColor: '#1C191714',
                boxShadow: '0 4px 16px #1C19171A',
              }}
            >
              <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-1.5">
                {publicLinks.map(l => {
                  const isActive = activeKey === l.key;
                  return (
                    <Link
                      key={l.key}
                      href={l.href}
                      onClick={() => setPublicMenuOpen(false)}
                      className="px-4 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                      style={{
                        backgroundColor: isActive ? '#FFFBEB' : 'transparent',
                        border: isActive ? '1px solid #1C191720' : '1px solid transparent',
                        color: '#1C1917',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '16px',
                        letterSpacing: '-0.005em',
                      }}
                    >
                      {l.label}
                    </Link>
                  );
                })}

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#1C191714', margin: '8px 4px' }} />

                {/* Log in — secondary style (text link) */}
                <Link
                  href="/login"
                  onClick={() => setPublicMenuOpen(false)}
                  className="px-4 py-3 transition-colors"
                  style={{
                    color: '#57534E',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  Log in
                </Link>

                {/* Get Started — primary chunky CTA, matches site aesthetic */}
                <Link
                  href="/login?mode=signup"
                  onClick={() => setPublicMenuOpen(false)}
                  className="mt-2 mx-1 px-5 py-3.5 text-center transition-all active:translate-y-0.5"
                  style={{
                    backgroundColor: '#FCD34D',
                    color: '#1C1917',
                    border: '1.5px solid #1C1917',
                    boxShadow: '3px 3px 0 #1C1917',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '15px',
                    letterSpacing: '-0.005em',
                  }}
                >
                  Get Started — Free
                </Link>
              </div>
            </div>
          </>
        )}
      </header>
    );
  }

  // ============================================================
  // LOGGED-IN VIEW: App-style nav with pill navigation
  // Cream background matching the rest of the site.
  // Active tab = chunky cream pill with offset shadow (matches button/card
  // aesthetic across the site). Inactive tabs = muted text that hover-lifts.
  // No emojis — typography carries scannability.
  // ============================================================
  const tabs = store ? [
    { id: 'biz',       href: '/biz',       label: 'My Biz',  badge: 0 },
    { id: 'editor',    href: '/editor',    label: 'Editor',  badge: 0 },
    { id: 'shop',      href: shopHref,     label: 'Shop',    badge: 0 },
    { id: 'learn',     href: '/learn',     label: 'Learn',   badge: 0 },
    { id: 'schools',   href: '/schools',   label: 'Schools', badge: 0 },
    { id: 'dashboard', href: '/dashboard', label: 'Parent',  badge: parentBadgeCount },
  ] : [
    { id: 'shop',    href: '/shop',    label: 'Shop',    badge: 0 },
    { id: 'learn',   href: '/learn',   label: 'Learn',   badge: 0 },
    { id: 'schools', href: '/schools', label: 'Schools', badge: 0 },
  ];

  const currentTab = active || pathname?.replace('/', '') || '';

  // Shared style tokens for this nav
  const navStyles = {
    cream: '#FEF3C7',
    cardBg: '#FFFBEB',
    ink: '#1C1917',
    inkMuted: '#57534E',
    inkFaint: '#78716C',
    inkGhost: '#A8A29E',
    border: '#1C191720',
    borderFaint: '#1C191714',
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md relative"
      style={{
        backgroundColor: `${navStyles.cream}EE`,
        borderBottom: `1px solid ${navStyles.ink}14`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">

        {/* === Left: brand + store switcher === */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Logo size="sm" />
            <span
              className="font-bold text-lg whitespace-nowrap"
              style={{ fontFamily: "'DynaPuff', cursive", color: navStyles.ink }}
            >
              Lemonade Stand
            </span>
          </Link>
          {stores.length > 1 && (
            <select
              value={store?.id || ''}
              onChange={(e) => switchStore(e.target.value)}
              className="text-sm focus:outline-none transition-colors shrink-0"
              style={{
                backgroundColor: navStyles.cardBg,
                border: `1.5px solid ${navStyles.ink}2B`,
                color: navStyles.ink,
                borderRadius: '10px',
                padding: '6px 10px',
                fontWeight: 700,
                boxShadow: `1px 1px 0 ${navStyles.ink}14`,
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.store_name}</option>
              ))}
            </select>
          )}
        </div>

        {/* === Right: desktop pills + logout, or mobile hamburger === */}
        <div className="flex items-center gap-2">
          <nav className="hidden sm:flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="relative transition-all whitespace-nowrap"
                  style={{
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? navStyles.ink : navStyles.inkMuted,
                    padding: isActive ? '6px 13px' : '7px 14px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? navStyles.cardBg : 'transparent',
                    border: isActive ? `1px solid ${navStyles.border}` : '1px solid transparent',
                    boxShadow: isActive ? `1px 1px 0 ${navStyles.ink}14` : 'none',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = navStyles.cardBg;
                      e.currentTarget.style.color = navStyles.ink;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = navStyles.inkMuted;
                    }
                  }}
                >
                  {tab.label}
                  {tab.badge > 0 && (
                    <span
                      className="absolute animate-pulse"
                      style={{
                        top: '-4px',
                        right: '-4px',
                        backgroundColor: '#DC2626',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 700,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1.5px solid ${navStyles.cream}`,
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={signOut}
            className="hidden sm:block transition-colors"
            style={{
              fontSize: '12px',
              color: navStyles.inkGhost,
              fontWeight: 500,
              padding: '6px 10px',
              marginLeft: '4px',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = navStyles.inkMuted; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = navStyles.inkGhost; }}
          >
            Log out
          </button>

          {/* Mobile hamburger — matches logged-out nav hamburger style */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="sm:hidden w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded-xl transition-colors active:bg-black/5 relative"
          >
            {menuOpen ? (
              <span style={{ fontSize: '26px', lineHeight: 1, color: navStyles.ink, fontWeight: 700 }}>×</span>
            ) : (
              <>
                <div style={{ width: '22px', height: '2.5px', backgroundColor: navStyles.ink, borderRadius: '2px' }} />
                <div style={{ width: '22px', height: '2.5px', backgroundColor: navStyles.ink, borderRadius: '2px' }} />
                <div style={{ width: '22px', height: '2.5px', backgroundColor: navStyles.ink, borderRadius: '2px' }} />
              </>
            )}
            {parentBadgeCount > 0 && !menuOpen && (
              <span
                className="absolute animate-pulse"
                style={{
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1.5px solid ${navStyles.cream}`,
                }}
              >
                {parentBadgeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* === Mobile menu dropdown === */}
      {menuOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 bg-black/20 z-40"
            style={{ top: '64px' }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="sm:hidden absolute top-full left-0 right-0 border-b z-50"
            style={{
              backgroundColor: navStyles.cream,
              borderBottomColor: navStyles.borderFaint,
              boxShadow: `0 4px 16px ${navStyles.ink}1A`,
            }}
          >
            <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-1.5">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                    style={{
                      backgroundColor: isActive ? navStyles.cardBg : 'transparent',
                      border: isActive ? `1px solid ${navStyles.border}` : '1px solid transparent',
                      color: navStyles.ink,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '16px',
                      letterSpacing: '-0.005em',
                      textDecoration: 'none',
                    }}
                  >
                    <span>{tab.label}</span>
                    {tab.badge > 0 && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#991B1B',
                          backgroundColor: '#FEE2E2',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          border: '1px solid #FCA5A5',
                        }}
                      >
                        {tab.badge} {tab.badge === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: navStyles.borderFaint, margin: '8px 4px' }} />

              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="w-full px-4 py-3 text-left transition-colors"
                style={{
                  fontSize: '14px',
                  color: navStyles.inkMuted,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </>
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
