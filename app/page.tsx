// @ts-nocheck
// FILE: app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../lib/context';

function Logo({ size = 'md' }) {
  const sizes = { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-16 h-16', xl: 'w-48 h-48' };
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
}

function FadeIn({ children, className = '', delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
}

// ====================== DESIGN TOKENS ======================
// Warm Editorial system — commit to these, do not freestyle
const C = {
  bg: '#FAF7F2',          // primary cream background
  bg2: '#F3EDE3',         // deeper cream for highlighted sections
  bgDark: '#1C1917',      // warm near-black (sparingly)
  text: '#1C1917',        // primary text
  textMuted: '#57534E',   // secondary text (stone-600)
  textFaint: '#A8A29E',   // muted text (stone-400)
  accent: '#D97706',      // deep amber for text/accents (amber-700)
  accentBtn: '#FCD34D',   // bright amber for buttons (amber-300)
  accentBtnHover: '#F59E0B', // button hover
  border: '#E7E2D7',      // subtle warm border
};

const font = {
  display: "'Fraunces', Georgia, serif",
  body: "'Poppins', sans-serif",
  brand: "'DynaPuff', cursive", // ONLY for the string "Lemonade Stand"
};

export default function LandingPage() {
  const router = useRouter();
  const { user, store } = useApp();

  useEffect(() => {
    if (user && store) router.push('/biz');
  }, [user, store]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, fontFamily: font.body, color: C.text }}>

      {/* ============ NAV ============ */}
      {/* Removed the amber accent bar — too 2015. Let the page breathe */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: `${C.bg}E6`, borderColor: C.border }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="font-bold text-lg" style={{ fontFamily: font.brand, color: C.text }}>Lemonade Stand</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/schools" className="text-sm hidden sm:block transition-colors hover:text-stone-900" style={{ color: C.textMuted }}>Schools</Link>
            <Link href="/shop" className="text-sm hidden sm:block transition-colors hover:text-stone-900" style={{ color: C.textMuted }}>Shop</Link>
            <Link href="/learn" className="text-sm hidden sm:block transition-colors hover:text-stone-900" style={{ color: C.textMuted }}>Learn</Link>
            {user ? (
              <Link href="/biz" className="px-5 py-2 rounded-lg text-sm font-semibold transition-all" style={{ backgroundColor: C.accentBtn, color: C.text }}>My Store</Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm transition-colors hover:text-stone-900" style={{ color: C.textMuted }}>Log in</Link>
                <Link href="/login?mode=signup" className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-md" style={{ backgroundColor: C.accentBtn, color: C.text }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      {/* One cream tone, generous padding, giant serif headline */}
      <section className="relative overflow-hidden" style={{ backgroundColor: C.bg }}>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-16 sm:pt-28 pb-20 sm:pb-32">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

            {/* Left: Copy */}
            <div className="flex-1 text-center md:text-left order-2 md:order-1">
              <FadeIn delay={100}>
                <h1 className="leading-[1.02] tracking-[-0.02em]" style={{ fontFamily: font.display, fontWeight: 500, color: C.text }}>
                  <span className="block text-[40px] sm:text-[56px] md:text-[68px]">Your kid already</span>
                  <span className="block text-[40px] sm:text-[56px] md:text-[68px]">makes things.</span>
                  <span className="block text-[40px] sm:text-[56px] md:text-[68px] italic" style={{ color: C.accent }}>Now they'll sell them.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={200}>
                <p className="text-lg sm:text-xl mt-6 max-w-lg mx-auto md:mx-0 leading-relaxed" style={{ color: C.textMuted }}>
                  <span className="font-bold" style={{ fontFamily: font.brand, color: C.accent }}>Lemonade Stand</span> is where kids learn business by running one.
                </p>
              </FadeIn>

              <FadeIn delay={300}>
                <div className="mt-10 flex flex-col sm:flex-row items-center md:items-start gap-3">
                  <Link href="/login?mode=signup" className="px-8 py-4 rounded-lg text-base font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0" style={{ backgroundColor: C.accentBtn, color: C.text }}>
                    Get Started — Free
                  </Link>
                  <Link href="/shop" className="px-6 py-4 text-sm font-medium transition-colors" style={{ color: C.textMuted }}>
                    Browse kid stores →
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Right: Hero illustration */}
            <FadeIn delay={200} className="flex-1 order-1 md:order-2">
              <img
                src="/hero-mascot-phone.png"
                alt="Lemonade Stand mascot holding up a smartphone showing a kid's online store"
                className="w-full max-w-md md:max-w-none mx-auto"
                style={{ mixBlendMode: 'multiply' }}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============ 1-2-3 HOW IT WORKS ============ */}
      {/* Slightly deeper cream — creates gentle rhythm without heavy color blocks */}
      <section style={{ backgroundColor: C.bg2 }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-24 sm:py-32">

          <div className="text-center mb-16 sm:mb-20">
            <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: C.accent, fontFamily: font.body, fontWeight: 600 }}>
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.1] max-w-2xl mx-auto" style={{ fontFamily: font.display, fontWeight: 500, color: C.text }}>
              From zero to their first sale <span className="italic" style={{ color: C.accent }}>in three steps.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {[
              {
                num: '01',
                title: 'Sign up together',
                desc: 'Three minutes, one parent account. You stay in control the whole way.',
              },
              {
                num: '02',
                title: 'They build their store',
                desc: 'Name it, design it, add products they already love making.',
              },
              {
                num: '03',
                title: 'You approve, they open',
                desc: 'Nothing goes live without your OK. Then real customers show up.',
              },
            ].map((step, i) => (
              <FadeIn key={i} delay={100 + i * 120}>
                <div className="text-center md:text-left">
                  {/* Serif number as the hero — very editorial */}
                  <div className="mb-5 leading-none" style={{ fontFamily: font.display, fontWeight: 400, fontSize: '48px', color: C.accent, fontStyle: 'italic' }}>
                    {step.num}
                  </div>
                  <h3 className="text-xl sm:text-2xl mb-3 tracking-[-0.01em]" style={{ fontFamily: font.display, fontWeight: 500, color: C.text }}>
                    {step.title}
                  </h3>
                  <p className="text-[15px] sm:text-base leading-relaxed max-w-xs mx-auto md:mx-0" style={{ color: C.textMuted }}>
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT THEY'LL DO ============ */}
      {/* Leaving this section visually un-modernized for Session 2 */}
      <section style={{ backgroundColor: C.bg }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 sm:py-32">
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] text-center leading-[1.1]" style={{ fontFamily: font.display, fontWeight: 500, color: C.text }}>
            Their store. <span className="italic" style={{ color: C.accent }}>Their rules.</span>
          </h2>

          <div className="mt-16">
            {[
              {
                title: 'They pick what to sell.',
                desc: 'Bracelets, baked goods, painted rocks, stickers. Whatever they already enjoy making.',
                color: '#92400E',
                bg: '#FEF3C7',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="12" fill="#FCD34D" stroke="#92400E" strokeWidth="1.5"/>
                    <path d="M10 16 L14 12 L18 18 L22 14" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="16" r="2" fill="#92400E"/>
                    <circle cx="22" cy="14" r="2" fill="#92400E"/>
                  </svg>
                ),
              },
              {
                title: 'They build their own shop.',
                desc: 'Name it, design it, push it live. Every action belongs to them.',
                color: '#065F46',
                bg: '#D1FAE5',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="10" width="20" height="14" rx="2" fill="#6EE7B7" stroke="#065F46" strokeWidth="1.5"/>
                    <rect x="10" y="14" width="5" height="3" rx="1" fill="#065F46"/>
                    <rect x="17" y="14" width="5" height="3" rx="1" fill="#065F46"/>
                    <rect x="10" y="19" width="12" height="2" rx="1" fill="#065F46" opacity="0.3"/>
                    <path d="M13 10 L13 7 L19 7 L19 10" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                title: 'They learn the economics.',
                desc: 'And discover what it costs to make something, what profit feels like, and how to make business decisions strategically.',
                color: '#1E40AF',
                bg: '#DBEAFE',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="10" fill="#93C5FD" stroke="#1E40AF" strokeWidth="1.5"/>
                    <text x="16" y="21" textAnchor="middle" fontFamily="'Poppins', sans-serif" fontSize="14" fontWeight="700" fill="#1E40AF">$</text>
                  </svg>
                ),
              },
              {
                title: 'They open for business.',
                desc: "Real orders from real people who want what they made and come back for more!",
                color: '#5B21B6',
                bg: '#EDE9FE',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="7" y="8" width="18" height="16" rx="2" fill="#C4B5FD" stroke="#5B21B6" strokeWidth="1.5"/>
                    <path d="M12 16 L15 19 L21 13" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="22" cy="8" r="4" fill="#F87171" stroke="#5B21B6" strokeWidth="1.5"/>
                    <text x="22" y="10.5" textAnchor="middle" fontFamily="'Poppins', sans-serif" fontSize="7" fontWeight="700" fill="white">1</text>
                  </svg>
                ),
              },
            ].map((step, i, arr) => (
              <div key={i}>
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: step.bg }}>
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl tracking-[-0.01em]" style={{ fontFamily: font.display, fontWeight: 500, color: C.text }}>{step.title}</h3>
                    <p className="mt-1 leading-relaxed text-[15px]" style={{ color: C.textMuted }}>{step.desc}</p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="ml-8 h-8 border-l-2 border-dashed" style={{ borderColor: C.border }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT STAYS WITH THEM ============ */}
      <section style={{ backgroundColor: C.bg2 }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 sm:py-32">
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] text-center leading-[1.1]" style={{ fontFamily: font.display, fontWeight: 500, color: C.text }}>
            Experience is the <span className="italic" style={{ color: C.accent }}>best teacher.</span>
          </h2>

          <div className="mt-16 space-y-6">
            {[
              'Pride in creating something of value and putting it out into the world',
              'Their first real lessons in earning money and being self-sufficient',
              'Hands-on digital experience designing and running a real website for their business',
              "The grit to stick with something that can't be finished in one sitting",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-2 h-2 rounded-full mt-3 shrink-0 transition-transform group-hover:scale-150" style={{ backgroundColor: C.accent }} />
                <p className="text-lg sm:text-xl leading-[1.7]" style={{ color: C.text }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SAFETY ============ */}
      {/* Session 2: modernize this dark block into a lighter authority treatment */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #FBBF24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-8 py-20 sm:py-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] text-center leading-[1.1] text-white" style={{ fontFamily: font.display, fontWeight: 500 }}>
            Built by a parent who asked every<br className="hidden sm:block" /> <span className="italic" style={{ color: '#FBBF24' }}>safety question</span> you're thinking right now.
          </h2>

          <div className="mt-14 space-y-4">
            {[
              { text: 'You own the account and have total control over what they see and who they talk to.' },
              { text: 'You approve every product before it goes live.' },
              { text: 'Never any photos of children. We only allow product photos to be posted.' },
              { text: 'No messaging between users. All customer messages go to the parent portal.' },
              { text: 'First name only. No personal details like birthdays, last names, or addresses are ever collected.' },
              { text: "No ads. No data sharing. We don't advertise to kids or share family data with anyone." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/[0.06] border border-white/[0.08] rounded-xl px-5 py-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="9" stroke="#FBBF24" strokeWidth="1.5"/>
                  <path d="M8 12l3 3 5-5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-gray-300 text-[15px] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/privacy" className="text-sm transition-colors" style={{ color: '#FBBF2499' }}>
              Read our full privacy policy →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ BRIDGE (MOVED HERE — emotional setup before ask) ============ */}
      <section style={{ backgroundColor: C.bg }}>
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-24 sm:py-32 text-center">
          <p className="text-xl sm:text-2xl leading-[1.6] tracking-[-0.01em]" style={{ fontFamily: font.display, fontWeight: 400, color: C.text }}>
            Every kid who set up a card table with a lemonade pitcher and a hand-drawn sign learned something no classroom could teach.
          </p>
          <p className="text-xl sm:text-2xl leading-[1.6] mt-6 tracking-[-0.01em]" style={{ fontFamily: font.display, fontWeight: 400, fontStyle: 'italic', color: C.accent }}>
            We're bringing that same scrappiness online.
          </p>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      {/* Session 2: lighten/modernize this too */}
      <section style={{ backgroundColor: C.bg2 }}>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-8 py-24 sm:py-32 text-center">
          <div className="flex justify-center mb-8"><Logo size="xl" /></div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.1]" style={{ fontFamily: font.display, fontWeight: 500, color: C.text }}>
            Your kid already makes<br className="hidden sm:block" /> <span className="italic" style={{ color: C.accent }}>things worth selling.</span>
          </h2>
          <div className="mt-10">
            <Link href="/login?mode=signup" className="inline-block px-8 py-4 rounded-lg text-base font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0" style={{ backgroundColor: C.accentBtn, color: C.text }}>
              Get Started — Free
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ backgroundColor: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-sm" style={{ fontFamily: font.brand, color: C.textMuted }}>Lemonade Stand</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: C.textMuted }}>
            <Link href="/schools" className="transition-colors hover:text-stone-900">Schools</Link>
            <Link href="/shop" className="transition-colors hover:text-stone-900">Shop</Link>
            <Link href="/learn" className="transition-colors hover:text-stone-900">Learn</Link>
            <Link href="/privacy" className="transition-colors hover:text-stone-900">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
