// @ts-nocheck
// FILE: app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../lib/context';

function Logo({ size = 'md' }) {
  const sizes = { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-16 h-16', xl: 'w-24 h-24' };
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

const font = {
  heading: "'Poppins', sans-serif",
  body: "'Poppins', sans-serif",
  accent: "'DynaPuff', cursive",
};

export default function LandingPage() {
  const router = useRouter();
  const { user, store } = useApp();

  useEffect(() => {
    if (user && store) router.push('/biz');
  }, [user, store]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: font.body }}>
      {/* Accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500" />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="font-bold text-gray-900 text-lg" style={{ fontFamily: font.accent }}>Lemonade Stand</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/schools" className="text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:block" style={{ fontFamily: font.body }}>Schools</Link>
            <Link href="/shop" className="text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">Shop</Link>
            <Link href="/learn" className="text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">Learn</Link>
            {user ? (
              <Link href="/biz" className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-full text-sm font-semibold transition-all hover:shadow-md">My Store</Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Log in</Link>
                <Link href="/login" className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-full text-sm font-semibold transition-all hover:shadow-md hover:shadow-amber-200">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-amber-50/30 to-white" />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'radial-gradient(circle, #D97706 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-8 pt-20 sm:pt-28 pb-14 sm:pb-20 text-center">
          <FadeIn className="flex justify-center">
            <Logo size="xl" />
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="mt-8 leading-[1.1] tracking-tight text-gray-900" style={{ fontFamily: font.heading, fontWeight: 700 }}>
              <span className="text-4xl sm:text-5xl lg:text-6xl block">You already know your</span>
              <span className="text-4xl sm:text-5xl lg:text-6xl block mt-1">kid is a <span style={{ fontFamily: font.accent, color: '#D97706' }}>maker</span>.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-xl sm:text-2xl text-gray-800 font-semibold mt-5" style={{ fontFamily: font.heading }}>
              Now they can be a business owner too.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-gray-400 mt-4 text-base sm:text-lg max-w-md mx-auto tracking-wide" style={{ fontFamily: font.body }}>
              They make it. They name it. They price it. They sell it.
            </p>
          </FadeIn>
          <FadeIn delay={400}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login" className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white rounded-full text-lg font-bold transition-all hover:shadow-xl hover:shadow-amber-200/50 active:scale-[0.97]" style={{ fontFamily: font.heading }}>
                Get Started — Free
              </Link>
              <Link href="/shop" className="px-6 py-4 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
                Browse kid stores →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============ BRIDGE ============ */}
      <section className="bg-amber-50/70 border-y border-amber-100/50">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-14 sm:py-20 text-center">
          <p className="text-lg sm:text-xl text-gray-700 leading-[1.8]" style={{ fontFamily: font.body }}>
            Every kid who set up a card table with a lemonade pitcher and a hand-drawn sign learned something no classroom could teach. We're bringing that same <span className="font-bold" style={{ fontFamily: font.accent, color: '#D97706' }}>scrappiness and pride</span> online.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 leading-[1.8] mt-6" style={{ fontFamily: font.body }}>
            <span className="font-bold" style={{ fontFamily: font.accent, color: '#D97706' }}>Lemonade Stand</span> is for a generation that finds joy in creating real products and knows that today's commerce happens on a screen.
          </p>
        </div>
      </section>

      {/* ============ WHAT THEY'LL DO ============ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center tracking-tight" style={{ fontFamily: font.heading }}>
            Their store. Their rules.
          </h2>

          <div className="mt-14">
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
                    <h3 className="font-bold text-lg" style={{ fontFamily: font.accent, color: step.color }}>{step.title}</h3>
                    <p className="text-gray-500 mt-1 leading-relaxed text-[15px]">{step.desc}</p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="ml-8 h-8 border-l-2 border-dashed" style={{ borderColor: '#E5DDD0' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STANDALONE LINE ============ */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #FBBF24 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16 text-center">
          <p className="text-lg sm:text-xl text-white leading-[1.8] tracking-wide" style={{ fontFamily: font.heading, fontWeight: 500 }}>
            The store is digital. The product is made by hand.<br className="hidden sm:block" /> The customer is real. The lessons last a lifetime.
          </p>
        </div>
      </section>

      {/* ============ WHAT STAYS WITH THEM ============ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center tracking-tight" style={{ fontFamily: font.heading }}>
            This isn't a class. It's an experience.
          </h2>

          <div className="mt-14 space-y-5">
            {[
              'The pride of making something someone wanted to buy',
              'The focus that comes from writing about their thing in their words',
              "The math that clicks because it's their money, not a classroom worksheet",
              'The confidence to say "I made this and it\'s worth something"',
              "The resilience when something doesn't sell, and the spark to try again",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-3 shrink-0 group-hover:scale-150 transition-transform" />
                <p className="text-gray-600 text-lg leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS FOR PARENTS ============ */}
      <section className="bg-amber-50/60 border-y border-amber-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-20 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center tracking-tight" style={{ fontFamily: font.heading }}>
            They do the work. You get to watch.
          </h2>

          <div className="grid sm:grid-cols-3 gap-5 mt-14">
            {[
              {
                step: '1',
                title: 'Create an account',
                desc: 'Takes 3 minutes. You own it.',
              },
              {
                step: '2',
                title: 'They build their store',
                desc: 'On their tablet, at the kitchen table, whenever inspiration hits.',
              },
              {
                step: '3',
                title: 'You approve what goes live',
                desc: 'One tap. Nothing is public without your say.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-7 text-center shadow-sm border border-gray-100/80">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <span className="text-white font-bold text-lg" style={{ fontFamily: font.heading }}>{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mt-5 text-[15px]" style={{ fontFamily: font.heading }}>{item.title}</h3>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-gray-500 text-sm">
            Total parent time: about 10 minutes. Total kid pride: <span className="text-amber-600 font-bold">immeasurable</span>.
          </p>
        </div>
      </section>

      {/* ============ SAFETY ============ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center tracking-tight leading-tight" style={{ fontFamily: font.heading }}>
            Built by a parent who asked every<br className="hidden sm:block" /> "what if" you're thinking right now.
          </h2>

          <div className="mt-14 space-y-3">
            {[
              'You own the account. Your child never creates one.',
              'You approve every product before it goes live.',
              'No photos of children. Product photos only.',
              'No messaging between users. No contact from strangers.',
              'No ads. No data sharing. First name only.',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-emerald-50/80 border border-emerald-100/80 rounded-xl px-5 py-4">
                <div className="w-5 h-5 rounded-md bg-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 text-[15px]">{item}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/privacy" className="text-sm text-gray-300 hover:text-gray-500 transition-colors">
              Read our full privacy policy →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle, #FBBF24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-8 py-20 sm:py-24 text-center">
          <div className="flex justify-center"><Logo size="xl" /></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-6 tracking-tight" style={{ fontFamily: font.heading }}>
            Your kid already makes<br className="hidden sm:block" /> things worth selling.
          </h2>
          <div className="mt-8">
            <Link href="/login" className="inline-block px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white rounded-full text-lg font-bold transition-all hover:shadow-xl hover:shadow-amber-400/20 active:scale-[0.97]" style={{ fontFamily: font.heading }}>
              Get Started — Free
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-sm text-gray-300" style={{ fontFamily: font.body }}>Lemonade Stand</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-300">
            <Link href="/schools" className="hover:text-gray-500 transition-colors">Schools</Link>
            <Link href="/shop" className="hover:text-gray-500 transition-colors">Shop</Link>
            <Link href="/learn" className="hover:text-gray-500 transition-colors">Learn</Link>
            <Link href="/privacy" className="hover:text-gray-500 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
