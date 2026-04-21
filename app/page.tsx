// @ts-nocheck
// FILE: app/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
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

// ScrollReveal — fades in + slides up when the element enters the viewport. One-shot, mobile-safe.
function ScrollReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) { setVisible(true); return; }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setVisible(true), delay);
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
      }}
    >
      {children}
    </div>
  );
}

// Small squiggle accent used under key words
function SquiggleUnderline({ children }) {
  return (
    <span style={{ display: 'inline-block', position: 'relative' }}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 8"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '-0.15em',
          width: '100%',
          height: '0.35em',
        }}
      >
        <path d="M2 5 Q 15 1 30 4 T 60 4 T 90 4 T 118 4" stroke="#D97706" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

// ====================== DESIGN TOKENS ======================
const C = {
  cream: '#FEF3C7',          // primary brand cream (hero background)
  creamWarm: '#FEF0B8',      // slightly warmer for section variation
  creamCool: '#FDF8E1',      // slightly cooler for section variation
  creamDeep: '#F3E7A1',      // deeper highlight
  ink: '#1C1917',            // text + borders
  inkMuted: '#57534E',       // muted text
  inkFaint: '#78716C',       // faint text
  cardBg: '#FFFBEB',         // card fill, slight lift
  cardBorder: '#1C191722',   // 13% opacity ink
  amberBtn: '#FCD34D',       // button fill
  amberBtnHover: '#F59E0B',  // button hover
  amberAccent: '#D97706',    // accent color (deep amber)
};

const font = {
  sans: "'Poppins', sans-serif",
  brand: "'DynaPuff', cursive", // ONLY for literal string "Lemonade Stand"
};

// ====================== PRODUCT RAIL ======================
// Horizontal auto-scrolling marquee of product categories.
// Pauses on hover. Uses CSS animation for performance.
// Swap in real kid stores later by editing the PRODUCTS array.

const PRODUCTS = [
  { img: '/product-bracelets.png',    cat: 'Jewelry',     title: 'Bracelets',        desc: 'Beaded, friendship, custom orders.', price: 'From $3' },
  { img: '/product-baked-goods.png',  cat: 'Treats',      title: 'Baked goods',      desc: 'Cookies, brownies, banana bread.',   price: 'From $5' },
  { img: '/product-stickers.png',     cat: 'Art',         title: 'Stickers',         desc: 'Hand-drawn, printed packs of 5.',    price: 'From $2' },
  { img: '/product-cards.png',        cat: 'Paper',       title: 'Greeting cards',   desc: 'Handmade for any occasion.',         price: 'From $4' },
  { img: '/product-lemonade.png',     cat: 'Drinks',      title: 'Lemonade',         desc: 'Classic + seasonal flavors.',        price: 'From $2' },
  { img: '/product-slime.png',        cat: 'Toys',        title: 'Slime',            desc: 'Custom colors, charms, scents.',     price: 'From $4' },
  { img: '/product-herbs.png',        cat: 'Garden',      title: 'Fresh herbs',      desc: 'Basil, mint, rosemary bundles.',     price: 'From $5' },
  { img: '/product-bedazzled.png',    cat: 'Fashion',     title: 'Bedazzled items',  desc: 'Hats, bags, jackets with sparkle.',  price: 'From $6' },
];

function ProductRail() {
  // Duplicate the product list so the marquee can loop seamlessly.
  const loop = [...PRODUCTS, ...PRODUCTS];

  return (
    <section style={{ backgroundColor: '#FEF0B8' }} className="py-14 sm:py-20 overflow-hidden">
      {/* Inline keyframe styles — one-off, kept here for portability */}
      <style>{`
        @keyframes ls-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ls-marquee-track {
          animation: ls-marquee 60s linear infinite;
        }
        .ls-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-marquee-track { animation: none; }
        }
      `}</style>

      <div className="text-center mb-8 sm:mb-12 px-4">
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3" style={{ color: '#D97706' }}>
          Real kids, real businesses
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] max-w-3xl mx-auto" style={{ fontWeight: 800, color: '#1C1917' }}>
          Built for what <span style={{ color: '#D97706' }}>kids actually make.</span>
        </h2>
      </div>

      {/* Track wrapper: edge fade via overlay divs (mask-image breaks animation on iOS Safari) */}
      <div className="relative w-full overflow-hidden">
        {/* Left fade overlay */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10"
          style={{
            width: '8%',
            background: 'linear-gradient(to right, #FEF0B8 0%, rgba(254, 240, 184, 0) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Right fade overlay */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10"
          style={{
            width: '8%',
            background: 'linear-gradient(to left, #FEF0B8 0%, rgba(254, 240, 184, 0) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="ls-marquee-track inline-flex gap-4 sm:gap-5 pl-4" style={{ willChange: 'transform' }}>
          {loop.map((p, i) => (
            <div
              key={i}
              className="shrink-0"
              style={{
                width: '240px',
                backgroundColor: '#FFFBEB',
                border: '1px solid #1C19171F',
                borderRadius: '20px',
                boxShadow: '2px 2px 0 #1C191712',
                padding: '14px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  backgroundColor: '#FEF3C7',
                }}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div className="px-1">
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', marginBottom: '4px' }}>
                  {p.cat}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C1917', margin: '0 0 6px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#57534E', lineHeight: 1.45, margin: '0 0 10px' }}>
                  {p.desc}
                </p>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#D97706' }}>
                  {p.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { user, store } = useApp();

  useEffect(() => {
    if (user && store) router.push('/biz');
  }, [user, store]);

  // Shared button styles
  const btnPrimary = {
    backgroundColor: C.amberBtn,
    color: C.ink,
    border: `1.5px solid ${C.ink}`,
    boxShadow: `3px 3px 0 ${C.ink}`,
    borderRadius: '12px',
    fontWeight: 700,
    transition: 'all 0.15s ease',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}>

      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${C.cream}EE`, borderBottom: `1px solid ${C.ink}14` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="font-bold text-lg" style={{ fontFamily: font.brand, color: C.ink }}>Lemonade Stand</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/schools" className="text-sm hidden sm:block transition-colors hover:opacity-70" style={{ color: C.inkFaint }}>Schools</Link>
            <Link href="/shop" className="text-sm hidden sm:block transition-colors hover:opacity-70" style={{ color: C.inkFaint }}>Shop</Link>
            <Link href="/learn" className="text-sm hidden sm:block transition-colors hover:opacity-70" style={{ color: C.inkFaint }}>Learn</Link>
            {user ? (
              <Link href="/biz" className="px-5 py-2 text-sm transition-all hover:-translate-y-0.5 active:translate-y-0" style={btnPrimary}>
                My Store
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm transition-colors hover:opacity-70" style={{ color: C.inkFaint }}>Log in</Link>
                <Link
                  href="/login?mode=signup"
                  className="px-5 py-2 text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={btnPrimary}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      {/* Sticky mascot: grid where the right column sticks within the hero section height */}
      <section className="relative" style={{ backgroundColor: C.cream }}>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-14 sm:pb-24">
          <div className="flex flex-col md:grid md:grid-cols-2 items-center gap-8 md:gap-12">

            {/* Copy */}
            <div className="text-center md:text-left order-2 md:order-1">
              <h1 className="tracking-[-0.025em] leading-[1.02]" style={{ fontWeight: 800, color: C.ink }}>
                <span className="block text-[36px] sm:text-[48px] md:text-[60px]">Your kid already makes things.</span>
                <span className="block text-[36px] sm:text-[48px] md:text-[60px] mt-1">
                  Now they'll <span style={{ color: C.amberAccent }}>sell them.</span>
                </span>
              </h1>

              <p className="mt-6 max-w-lg mx-auto md:mx-0 leading-relaxed text-base sm:text-lg" style={{ color: C.inkMuted }}>
                <span className="font-bold" style={{ fontFamily: font.brand, color: C.amberAccent }}>Lemonade Stand</span> is where kids learn business by running one.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3">
                <Link
                  href="/login?mode=signup"
                  className="px-8 py-4 text-base transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={{ ...btnPrimary, boxShadow: `4px 4px 0 ${C.ink}`, fontSize: '17px' }}
                >
                  Get Started — Free
                </Link>
                <Link href="/shop" className="px-4 py-4 text-sm font-medium transition-colors hover:opacity-70" style={{ color: C.inkMuted }}>
                  Browse kid stores →
                </Link>
              </div>
            </div>

            {/* Mascot column */}
            <div className="order-1 md:order-2 w-full">
              <img
                src="/hero-mascot-phone.png"
                alt="Lemonade Stand mascot holding up a smartphone showing a kid's online store"
                className="w-full max-w-md md:max-w-none mx-auto"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT MARQUEE RAIL ============ */}
      <ProductRail />

      {/* ============ 1-2-3 HOW IT WORKS ============ */}
      {/* Cooler cream — rail above uses warmer, so the contrast separates them */}
      <section style={{ backgroundColor: C.creamCool }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20 sm:py-28">

          <ScrollReveal>
            <div className="text-center mb-14 sm:mb-16">
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3" style={{ color: C.amberAccent }}>
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] max-w-3xl mx-auto" style={{ fontWeight: 800, color: C.ink }}>
                From zero to their first sale <span style={{ color: C.amberAccent }}>in three steps.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                num: '1',
                title: 'Sign up together',
                desc: 'Three minutes, one parent account. You stay in control the whole way.',
              },
              {
                num: '2',
                title: 'They build their store',
                desc: 'Name it, design it, add products they already love making.',
              },
              {
                num: '3',
                title: 'You approve, they open',
                desc: 'Nothing goes live without your OK. Then real customers show up.',
              },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 120}>
                <div
                  className="p-6 sm:p-7 h-full"
                  style={{
                    backgroundColor: C.cardBg,
                    border: `1px solid ${C.cardBorder}`,
                    borderRadius: '20px',
                    boxShadow: `2px 2px 0 ${C.ink}14`,
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center mb-5"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: C.amberBtn,
                      border: `1.5px solid ${C.ink}`,
                      fontWeight: 800,
                      fontSize: '18px',
                      color: C.ink,
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-xl sm:text-[22px] mb-2 tracking-[-0.01em]" style={{ fontWeight: 800, color: C.ink }}>
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: C.inkMuted }}>
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BRIDGE ============ */}
      <section style={{ backgroundColor: C.creamCool }}>
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-20 sm:py-28 text-center">
          <ScrollReveal>
            <p className="text-lg sm:text-xl leading-[1.7]" style={{ color: C.ink }}>
              Every kid who set up a card table with a lemonade pitcher and a hand-drawn sign learned something no classroom could teach. We're bringing that same scrappiness and pride online.
            </p>
            <p className="text-lg sm:text-xl leading-[1.7] mt-6" style={{ color: C.ink }}>
              <span className="font-bold" style={{ fontFamily: font.brand, color: C.amberAccent }}>Lemonade Stand</span> is for a generation that finds joy in creating real products and knows that today's commerce happens on a screen.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ WHAT THEY'LL DO ============ */}
      <section style={{ backgroundColor: C.cream }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-center tracking-[-0.02em] leading-[1.05]" style={{ fontWeight: 800, color: C.ink }}>
              Their store. <span style={{ color: C.amberAccent }}>Their rules.</span>
            </h2>
          </ScrollReveal>

          <div className="mt-14">
            {[
              {
                title: 'They pick what to sell.',
                desc: 'Bracelets, baked goods, painted rocks, stickers. Whatever they already enjoy making.',
                bg: '#FEF3C7',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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
                bg: '#D1FAE5',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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
                bg: '#DBEAFE',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="10" fill="#93C5FD" stroke="#1E40AF" strokeWidth="1.5"/>
                    <text x="16" y="21" textAnchor="middle" fontFamily="'Poppins', sans-serif" fontSize="14" fontWeight="700" fill="#1E40AF">$</text>
                  </svg>
                ),
              },
              {
                title: 'They open for business.',
                desc: "Real orders from real people who want what they made and come back for more!",
                bg: '#EDE9FE',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <rect x="7" y="8" width="18" height="16" rx="2" fill="#C4B5FD" stroke="#5B21B6" strokeWidth="1.5"/>
                    <path d="M12 16 L15 19 L21 13" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="22" cy="8" r="4" fill="#F87171" stroke="#5B21B6" strokeWidth="1.5"/>
                    <text x="22" y="10.5" textAnchor="middle" fontFamily="'Poppins', sans-serif" fontSize="7" fontWeight="700" fill="white">1</text>
                  </svg>
                ),
              },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="flex items-start gap-5 py-5" style={i < 3 ? { borderBottom: `1px dashed ${C.ink}22` } : {}}>
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      backgroundColor: step.bg,
                      border: `1px solid ${C.ink}18`,
                    }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg sm:text-xl tracking-[-0.01em]" style={{ fontWeight: 700, color: C.ink }}>{step.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-[15px]" style={{ color: C.inkMuted }}>{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCE IS THE BEST TEACHER ============ */}
      <section style={{ backgroundColor: C.creamCool }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-center tracking-[-0.02em] leading-[1.05]" style={{ fontWeight: 800, color: C.ink }}>
              Experience is the <span style={{ color: C.amberAccent }}>best teacher.</span>
            </h2>
          </ScrollReveal>

          <div className="mt-14 space-y-5">
            {[
              'Pride in creating something of value and putting it out into the world',
              'Their first real lessons in earning money and being self-sufficient',
              'Hands-on digital experience designing and running a real website for their business',
              "The grit to stick with something that can't be finished in one sitting",
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-3" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.amberAccent }} />
                  <p className="text-lg sm:text-xl leading-[1.7]" style={{ color: C.ink }}>{item}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SAFETY ============ */}
      {/* The one dark section — kept as requested for contrast */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1C1917' }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle, #FBBF24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-center tracking-[-0.02em] leading-[1.05] text-white" style={{ fontWeight: 800 }}>
              Built by a parent who asked every<br className="hidden sm:block" />{' '}
              <span style={{ color: '#FBBF24' }}>safety question</span> you're thinking right now.
            </h2>
          </ScrollReveal>

          <div className="mt-14 space-y-3">
            {[
              'You own the account and have total control over what they see and who they talk to.',
              'You approve every product before it goes live.',
              'Never any photos of children. We only allow product photos to be posted.',
              'No messaging between users. All customer messages go to the parent portal.',
              'First name only. No personal details like birthdays, last names, or addresses are ever collected.',
              "No ads. No data sharing. We don't advertise to kids or share family data with anyone.",
            ].map((text, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="flex items-start gap-4 rounded-xl px-5 py-4" style={{ backgroundColor: '#FFFFFF0A', border: '1px solid #FFFFFF14' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="9" stroke="#FBBF24" strokeWidth="1.5"/>
                    <path d="M8 12l3 3 5-5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[15px] leading-relaxed text-gray-200">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/privacy" className="text-sm transition-colors hover:text-yellow-400" style={{ color: '#FBBF24CC' }}>
              Read our full privacy policy →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section style={{ backgroundColor: C.creamWarm }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 sm:py-28 text-center">
          <ScrollReveal>
            <div className="flex justify-center mb-8"><Logo size="xl" /></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05]" style={{ fontWeight: 800, color: C.ink }}>
              Your kid already makes<br className="hidden sm:block" />{' '}
              <span style={{ color: C.amberAccent }}>things worth selling.</span>
            </h2>
            <div className="mt-10">
              <Link
                href="/login?mode=signup"
                className="inline-block px-8 py-4 transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{ ...btnPrimary, boxShadow: `4px 4px 0 ${C.ink}`, fontSize: '17px' }}
              >
                Get Started — Free
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ backgroundColor: C.cream, borderTop: `1px solid ${C.ink}14` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-sm" style={{ fontFamily: font.brand, color: C.inkMuted }}>Lemonade Stand</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: C.inkFaint }}>
            <Link href="/schools" className="transition-colors hover:opacity-70">Schools</Link>
            <Link href="/shop" className="transition-colors hover:opacity-70">Shop</Link>
            <Link href="/learn" className="transition-colors hover:opacity-70">Learn</Link>
            <Link href="/privacy" className="transition-colors hover:opacity-70">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
