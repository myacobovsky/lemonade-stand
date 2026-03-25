// @ts-nocheck
// FILE: app/schools/[slug]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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

export default function SchoolPage() {
  const params = useParams();
  const slug = params?.slug;
  const router = useRouter();

  const [school, setSchool] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    loadSchool();
  }, [slug]);

  async function loadSchool() {
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (schoolError || !schoolData) {
      setLoading(false);
      return;
    }

    setSchool(schoolData);

    const storedKey = `school_access_${schoolData.id}`;
    const storedPassword = typeof window !== 'undefined' ? localStorage.getItem(storedKey) : null;

    if (storedPassword === schoolData.password) {
      setAuthenticated(true);
      await loadStores(schoolData.id);
    }

    setLoading(false);
  }

  async function loadStores(schoolId) {
    const { data: storeData } = await supabase
      .from('stores')
      .select('*, store_themes(*)')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: true });

    if (storeData) {
      const storesWithCounts = await Promise.all(
        storeData.map(async (store) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('store_id', store.id)
            .or('status.eq.approved,status.is.null');
          return { ...store, productCount: count || 0 };
        })
      );
      setStores(storesWithCounts);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!school) return;

    if (password === school.password) {
      const storedKey = `school_access_${school.id}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem(storedKey, password);
      }
      setAuthenticated(true);
      setError('');
      await loadStores(school.id);
    } else {
      setError('That password is not correct. Check with your club leader.');
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" />
          <p className="mt-4 text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // School not found
  if (!school) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold text-gray-800 mt-6">School not found</h1>
          <p className="text-gray-500 mt-2 text-sm">
            We could not find a school club at this address. Double check the link you were given.
          </p>
          <Link href="/" className="inline-block mt-6 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-full font-semibold transition-colors text-sm">
            Go to Lemonade Stand
          </Link>
        </div>
      </div>
    );
  }

  // Password gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        {/* Lemon accent bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-amber-400 z-50" />

        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">{school.name}</h1>
            <div className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
              Business Club
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="bg-amber-50 rounded-xl p-4 mb-5">
              <p className="text-sm text-gray-600 text-center">
                This is a private marketplace for {school.name} families.
                Enter the password shared by your club leader.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Club password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-lg text-center"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-full font-semibold transition-colors"
              >
                Enter Marketplace
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-gray-300">
            Powered by <Link href="/" className="text-amber-400 hover:text-amber-500">Lemonade Stand</Link>
          </p>
        </div>
      </div>
    );
  }

  // Authenticated — marketplace
  const getStoreAccent = (theme) => {
    const colors = {
      blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', badge: 'text-blue-600' },
      green: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', badge: 'text-emerald-600' },
      pink: { bg: 'bg-pink-50', icon: 'bg-pink-100 text-pink-600', badge: 'text-pink-600' },
      purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', badge: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', badge: 'text-orange-600' },
    };
    return colors[theme?.color] || { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', badge: 'text-amber-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Lemon accent bar */}
      <div className="h-1 bg-amber-400" />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="font-bold text-gray-800 text-sm leading-tight">{school.name}</h1>
              <p className="text-xs text-gray-400">Business Club Marketplace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
              Private
            </div>
            <Link href="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600">
              <Logo size="sm" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {school.name} Marketplace
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Browse and buy from our Business Club members
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
              {stores.length} {stores.length === 1 ? 'store' : 'stores'}
            </span>
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">
              {school.name} families only
            </span>
          </div>
        </div>
      </div>

      {/* Store Grid */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {stores.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🏗️
            </div>
            <h3 className="text-lg font-bold text-gray-800">Stores are coming soon!</h3>
            <p className="text-gray-500 mt-1 text-sm max-w-sm mx-auto">
              Club members are building their stores. Check back soon to see what they are selling.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => {
              const theme = store.store_themes?.[0] || store.store_themes;
              const sticker = theme?.sticker || '🍋';
              const accent = getStoreAccent(theme);

              return (
                <Link
                  key={store.id}
                  href={`/store/${store.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all group"
                >
                  <div className="text-center">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mx-auto overflow-hidden ${accent.icon}`}>
                      {theme?.banner_image_url ? (
                        <img src={theme.banner_image_url} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        sticker
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 mt-3 group-hover:text-amber-600 transition-colors">
                      {store.store_name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                      by {store.kid_name}
                    </p>
                    {store.productCount > 0 && (
                      <p className="text-xs text-gray-300 mt-2">
                        {store.productCount} {store.productCount === 1 ? 'product' : 'products'}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-xs text-gray-400">Lemonade Stand</span>
          </div>
          <Link href="/privacy" className="text-xs text-gray-300 hover:text-gray-500">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
