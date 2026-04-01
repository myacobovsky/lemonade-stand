// @ts-nocheck
// FILE: app/page.tsx
// Landing page for Lemonade Stand

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../lib/context';

function Logo({ size = 'md' }) {
  const sizes = { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-16 h-16', xl: 'w-20 h-20' };
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
    <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { user, store } = useApp();

  // If logged in with a store, redirect to biz
  useEffect(() => {
    if (user && store) router.push('/biz');
  }, [user, store]);

  return (
    <div className="min-h-screen bg-white">
      {/* Accent bar */}
      <div className="h-1 bg-amber-400" />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-bold text-gray-900 text-lg">Lemonade Stand</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/schools" className="text-sm text-gray-500 hover:text-gray-700 hidden sm:block">Schools</Link>
            <Link href="/shop" className="text-sm text-gray-500 hover:text-gray-700 hidden sm:block">Shop</Link>
            <Link href="/learn" className="text-sm text-gray-500 hover:text-gray-700 hidden sm:block">Learn</Link>
            {user ? (
              <Link href="/biz" className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-full text-sm font-semibold transition-colors">My Store</Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">Log in</Link>
                <Link href="/login" className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-full text-sm font-semibold transition-colors">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-white to-white" />
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #F59E0B 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
          <FadeIn>
            <Logo size="xl" />
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-6 leading-tight tracking-tight">
              You already know your<br />kid is a maker.
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-xl sm:text-2xl text-amber-600 font-semibold mt-4">
              Now they can be a business owner too.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-gray-500 mt-4 text-lg max-w-lg mx-auto">
              They make it. They name it. They price it. They sell it.
            </p>
          </FadeIn>
          <FadeIn delay={400}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login" className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white rounded-full text-lg font-bold transition-all hover:shadow-lg hover:shadow-amber-200 active:scale-95">
                Get Started — Free
              </Link>
              <Link href="/shop" className="px-6 py-4 text-gray-500 hover:text-gray-700 text-sm font-medium">
                Browse kid stores →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============ BRIDGE ============ */}
      <section className="bg-amber-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12 sm:py-16 text-center">
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            Kids create for the same reason they build sandcastles at the beach. For the joy of it. They don't need to be asked.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mt-6">
            Lemonade Stand turns that creative energy into something real. A store they built. A product someone bought. A business they can be proud of.
          </p>
        </div>
      </section>

      {/* ============ WHAT THEY'LL DO ============ */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">Their store. Their rules.</h2>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {[
              {
                num: '1',
                title: 'They pick what to sell.',
                desc: 'Bracelets, baked goods, painted rocks, stickers. Whatever they are already making at the kitchen table.',
                color: 'bg-amber-400',
              },
              {
                num: '2',
                title: 'They build their own shop.',
                desc: 'Name it, design it, make it theirs. Every choice belongs to them.',
                color: 'bg-emerald-400',
              },
              {
                num: '3',
                title: 'They set the price.',
                desc: 'And discover what it costs to make something, what profit feels like, and what happens when they change it.',
                color: 'bg-blue-400',
              },
              {
                num: '4',
                title: 'They open for business.',
                desc: "Real orders from real people who want what your kid made. That first notification is a moment.",
                color: 'bg-purple-400',
              },
            ].map((step) => (
              <div key={step.num} className="bg-gray-50 rounded-2xl p-6 hover:bg-amber-50 transition-colors">
                <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mt-4">{step.title}</h3>
                <p className="text-gray-500 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STANDALONE LINE ============ */}
      <section className="bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-14 text-center">
          <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
            The store is digital. The product is made by hand.<br className="hidden sm:block" /> The customer is real. The lessons last a lifetime.
          </p>
        </div>
      </section>

      {/* ============ WHAT STAYS WITH THEM ============ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">This isn't a class. It's an experience.</h2>

          <div className="mt-12 space-y-6">
            {[
              'The pride of making something someone wanted to buy',
              'The focus that comes from writing about their thing in their words',
              'The math that clicks because it\'s their money, not a classroom worksheet',
              'The confidence to say "I made this and it\'s worth something"',
              'The resilience when something doesn\'t sell, and the spark to try again',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 shrink-0" />
                <p className="text-gray-700 text-lg leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS FOR PARENTS ============ */}
      <section className="bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">They do the work. You get to watch.</h2>

          <div className="grid sm:grid-cols-3 gap-6 mt-12">
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
              <div key={item.step} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mt-4">{item.title}</h3>
                <p className="text-gray-500 mt-2 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-gray-500">
            Total parent time: about 10 minutes. Total kid pride: <span className="text-amber-600 font-semibold">immeasurable</span>.
          </p>
        </div>
      </section>

      {/* ============ SAFETY ============ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
            Built by a parent who asked every<br className="hidden sm:block" /> "what if" you're thinking right now.
          </h2>

          <div className="mt-12 space-y-4">
            {[
              'You own the account. Your child never creates one.',
              'You approve every product before it goes live.',
              'No photos of children. Product photos only.',
              'No messaging between users. No contact from strangers.',
              'No ads. No data sharing. First name only.',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-emerald-50 rounded-xl px-5 py-4">
                <div className="w-5 h-5 rounded bg-emerald-400 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">
              Read our full privacy policy →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHO BUILT THIS ============ */}
      <section className="bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-16 sm:py-20 text-center">
          <Logo size="lg" />
          <p className="text-lg text-gray-700 leading-relaxed mt-6">
            "I built Lemonade Stand because my kids wanted to sell what they made, and there was nowhere safe for them to do it. Not a game. Not a simulation. A real store with real customers. I'm a parent first. This is the tool I wished existed."
          </p>
          <p className="text-amber-600 font-semibold mt-4">Marilyn</p>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Your kid already makes things worth selling.
          </h2>
          <div className="mt-8">
            <Link href="/login" className="inline-block px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white rounded-full text-lg font-bold transition-all hover:shadow-lg hover:shadow-amber-400/20 active:scale-95">
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
            <span className="text-sm text-gray-400">Lemonade Stand</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/schools" className="hover:text-gray-600">Schools</Link>
            <Link href="/shop" className="hover:text-gray-600">Shop</Link>
            <Link href="/learn" className="hover:text-gray-600">Learn</Link>
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
