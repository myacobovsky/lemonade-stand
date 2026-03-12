// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from './components';
import { useApp } from '../lib/context';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-5xl mx-auto relative">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="font-semibold text-lg text-gray-900">Lemonade Stand</span>
        </div>
        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => router.push('/shop')} className="text-gray-500 hover:text-gray-700 font-medium px-3 py-2 rounded-lg text-sm transition-colors">Shop</button>
          <button onClick={() => router.push('/learn')} className="text-gray-500 hover:text-gray-700 font-medium px-3 py-2 rounded-lg text-sm transition-colors">Learn</button>
          <button onClick={() => router.push('/login')} className="text-gray-500 hover:text-gray-700 font-medium px-3 py-2 rounded-lg text-sm transition-colors">Log In</button>
          <button onClick={() => router.push('/setup')} className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">Get Started</button>
        </div>
        {/* Mobile */}
        <div className="sm:hidden flex items-center gap-2">
          <button onClick={() => router.push('/setup')} className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">Get Started</button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-50"
          >
            {mobileMenuOpen ? (
              <span className="text-gray-600 text-xl leading-none">&times;</span>
            ) : (
              <>
                <div className="w-5 h-0.5 bg-gray-600 rounded-full" />
                <div className="w-5 h-0.5 bg-gray-600 rounded-full" />
                <div className="w-5 h-0.5 bg-gray-600 rounded-full" />
              </>
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-full right-4 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-2 w-48">
            {[
              { id: 'marketplace', label: 'Shop' },
              { id: 'learn', label: 'Learn' },
              { id: 'setup', label: 'Get Started' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { router.push(item.id === 'marketplace' ? '/shop' : item.id === 'learn' ? '/learn' : '/setup'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 hover:bg-gray-50 text-sm"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Logo size="sm" /> The marketplace built for kids
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
          Where Kids Learn<br />
          <span className="text-amber-500">Real Business</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          A safe, parent-supervised online store where kids sell their creations, manage orders, and watch their savings grow.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
          <button onClick={() => router.push('/setup')} className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-8 py-3.5 rounded-lg text-base transition-colors">
            Start Your Kid&apos;s Store →
          </button>
          <button onClick={() => router.push('/shop')} className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3.5 rounded-lg text-base border border-gray-200 transition-colors">
            Shop Kids' Stores
          </button>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4">
                <svg className="w-20 h-20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M30 85 L55 55 L65 65 L35 95 Z" fill="#F59E0B" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M55 55 L75 30 Q85 20 90 30 Q95 40 85 45 L65 65" fill="#3B82F6" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  <circle cx="28" cy="92" r="4" fill="#292524"/>
  <circle cx="85" cy="70" r="8" fill="#EC4899" stroke="#292524" strokeWidth="2"/>
  <circle cx="95" cy="55" r="5" fill="#10B981" stroke="#292524" strokeWidth="2"/>
  <circle cx="70" cy="80" r="6" fill="#F59E0B" stroke="#292524" strokeWidth="2"/>
  <path d="M40 25 L42 30 L47 32 L42 34 L40 39 L38 34 L33 32 L38 30 Z" fill="#F59E0B" stroke="#292524" strokeWidth="1.5"/>
  <path d="M100 75 L101 78 L104 79 L101 80 L100 83 L99 80 L96 79 L99 78 Z" fill="#EC4899" stroke="#292524" strokeWidth="1"/>
  <path d="M20 75 Q15 70 20 65 Q25 60 30 65" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
</svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kids Create</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Design a storefront, set prices, and list products for sale.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4">
                <svg className="w-20 h-20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">

  <rect x="20" y="45" width="25" height="45" fill="#3B82F6" stroke="#292524" strokeWidth="2.5" rx="2"/>
  <rect x="50" y="35" width="22" height="55" fill="#10B981" stroke="#292524" strokeWidth="2.5" rx="2"/>
  <rect x="77" y="50" width="23" height="40" fill="#F59E0B" stroke="#292524" strokeWidth="2.5" rx="2"/>
  <rect x="25" y="52" width="6" height="8" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="34" y="52" width="6" height="8" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="25" y="65" width="6" height="8" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="34" y="65" width="6" height="8" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="55" y="42" width="5" height="7" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="63" y="42" width="5" height="7" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="55" y="55" width="5" height="7" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="63" y="55" width="5" height="7" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="82" y="57" width="5" height="7" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="91" y="57" width="5" height="7" fill="#FEF3C7" stroke="#292524" strokeWidth="1.5" rx="1"/>
  <rect x="55" y="75" width="12" height="15" fill="#EC4899" stroke="#292524" strokeWidth="2" rx="1"/>
  <circle cx="64" cy="83" r="1.5" fill="#292524"/>
  <path d="M10 90 Q60 88 110 90" stroke="#292524" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 4"/>
  <path d="M85 95 L82 108 L98 108 L95 95 Z" fill="#EC4899" stroke="#292524" strokeWidth="2" strokeLinejoin="round"/>
  <path d="M85 95 Q88 88 91.5 95" stroke="#292524" strokeWidth="2" fill="none" strokeLinecap="round"/>
  <path d="M15 35 C15 30 20 28 23 32 C26 28 31 30 31 35 C31 42 23 48 23 48 C23 48 15 42 15 35" fill="#EC4899" stroke="#292524" strokeWidth="2"/>
</svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Neighbors Shop</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Share the store link with family, friends, and neighbors.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4">
                <svg className="w-20 h-20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">

  <path d="M35 40 L35 95 Q35 102 45 102 L75 102 Q85 102 85 95 L85 40" fill="#DBEAFE" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round"/>
  <rect x="32" y="32" width="56" height="12" fill="#F59E0B" stroke="#292524" strokeWidth="2.5" rx="3"/>
  <ellipse cx="60" cy="38" rx="24" ry="4" fill="#FCD34D"/>
  <ellipse cx="50" cy="85" rx="10" ry="4" fill="#FCD34D" stroke="#292524" strokeWidth="2"/>
  <ellipse cx="70" cy="88" rx="8" ry="3" fill="#FCD34D" stroke="#292524" strokeWidth="2"/>
  <ellipse cx="55" cy="75" rx="9" ry="3.5" fill="#FCD34D" stroke="#292524" strokeWidth="2"/>
  <ellipse cx="65" cy="78" rx="7" ry="3" fill="#FCD34D" stroke="#292524" strokeWidth="2"/>
  <ellipse cx="60" cy="68" rx="8" ry="3" fill="#FCD34D" stroke="#292524" strokeWidth="2"/>
  <ellipse cx="60" cy="20" rx="8" ry="3" fill="#FCD34D" stroke="#292524" strokeWidth="2"/>
  <path d="M60 23 L60 30" stroke="#292524" strokeWidth="1.5" strokeDasharray="2 2"/>
  <path d="M95 50 L97 55 L102 57 L97 59 L95 64 L93 59 L88 57 L93 55 Z" fill="#10B981" stroke="#292524" strokeWidth="1.5"/>
  <path d="M20 60 L21 63 L24 64 L21 65 L20 68 L19 65 L16 64 L19 63 Z" fill="#3B82F6" stroke="#292524" strokeWidth="1"/>
  <path d="M92 90 L100 75 L95 77 L100 65" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  <path d="M97 65 L100 65 L100 70" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  <text x="48" y="88" fontSize="8" fill="#292524" fontWeight="bold">$</text>
  <text x="68" y="80" fontSize="6" fill="#292524" fontWeight="bold">$</text>
</svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Savings Grow</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Track earnings, hit milestones, and learn real money skills.</p>
            </div>
          </div>
        </div>

      </main>

      {/* Parent Trust Section — Full width, visually distinct */}
      <section className="bg-gray-900 text-white py-16 sm:py-20 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-10 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              A note for parents
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Built With Your Peace of Mind First</h2>
            <p className="text-gray-400 max-w-xl mx-auto">We&apos;re parents too. Lemonade Stand was designed from the ground up so kids can learn real skills in a safe, supervised environment.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            <div className="bg-white bg-opacity-5 rounded-2xl p-6 border border-white border-opacity-10">
              <div className="w-12 h-12 bg-amber-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-amber-400" fill="currentColor" stroke="currentColor"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Parent Supervised</h3>
              <p className="text-gray-400 text-sm leading-relaxed">You approve every order and see everything your child does. No kid data is collected or shared. Ever. Just a safe, supervised space to learn.</p>
            </div>
            <div className="bg-white bg-opacity-5 rounded-2xl p-6 border border-white border-opacity-10">
              <div className="w-12 h-12 bg-amber-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Designed for Kids First</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Age-appropriate language, intuitive design, and zero adult complexity. Not a scaled-down adult platform. Built for kids from day one.</p>
            </div>
            <div className="bg-white bg-opacity-5 rounded-2xl p-6 border border-white border-opacity-10">
              <div className="w-12 h-12 bg-amber-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Actually Educational</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Kids learn pricing, profit margins, marketing, and customer service. Real skills, real business.</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/setup')}
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-3.5 rounded-lg text-base transition-colors"
            >
              Start Your Kid&apos;s Store for Free
            </button>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Logo size="sm" />
          <span className="font-semibold text-gray-500">Lemonade Stand</span>
        </div>
        <p>Where kids learn business, one sale at a time.</p>
      </footer>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-4 text-center">
        <div className="flex justify-center gap-4 text-xs text-gray-400">
          <a href="/privacy" className="hover:text-gray-600">Privacy & Data Practices</a>
          <span>·</span>
          <span>© {new Date().getFullYear()} Lemonade Stand</span>
        </div>
      </footer>
    </div>
  );
}
