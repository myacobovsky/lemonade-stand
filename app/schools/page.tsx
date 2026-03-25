// @ts-nocheck
// FILE: app/schools/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function Logo({ size = 'md' }) {
  const sizes = { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-14 h-14' };
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

export default function SchoolsLandingPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = code.trim().toLowerCase();
    if (!trimmed) return;

    setChecking(true);
    setError('');

    const { data } = await supabase
      .from('schools')
      .select('slug')
      .eq('slug', trimmed)
      .eq('is_active', true)
      .single();

    setChecking(false);

    if (data) {
      router.push(`/schools/${data.slug}`);
    } else {
      setError('No club found with that code. Check with your club leader and try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Accent bar */}
      <div className="h-1 bg-amber-400" />

      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-semibold text-gray-900">Lemonade Stand</span>
          </Link>
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            Back to home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-sm mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">School Clubs</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter your school's club code to access your private marketplace.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Club code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                placeholder="e.g. ps150"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-lg text-center"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!code.trim() || checking}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-full font-semibold transition-colors"
            >
              {checking ? 'Looking up...' : 'Go to my school'}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-amber-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500">
            Your club leader will share your school's code during the first club session.
            If you do not have a code yet, check with your club leader.
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Interested in bringing Lemonade Stand to your school?
          </p>
          <a href="mailto:myacobovsky@gmail.com" className="text-xs text-amber-500 hover:text-amber-600 font-medium">
            Get in touch
          </a>
        </div>
      </main>
    </div>
  );
}
