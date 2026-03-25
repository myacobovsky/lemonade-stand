// @ts-nocheck
// FILE: app/schools/[slug]/page.tsx
// 
// This is the password-gated school marketplace page.
// URL: /schools/ps150 (or any school slug)
//
// Flow:
// 1. Load school info by slug
// 2. Check if user has already entered the password (stored in localStorage)
// 3. If not, show password gate
// 4. If yes, show all stores belonging to this school
//
// Add this file to your project at: app/schools/[slug]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Reuse your existing Logo component if available, otherwise inline it
function Logo({ size = 'md' }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-lg' : size === 'lg' ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-2xl';
  return (
    <div className={`${sz} bg-amber-100 rounded-full flex items-center justify-center`}>
      <span role="img" aria-label="lemon">🍋</span>
    </div>
  );
}

export default function SchoolPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [school, setSchool] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Load school info
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
      return; // School not found — will show 404-style message
    }

    setSchool(schoolData);

    // Check if user already has access (password stored in localStorage)
    const storedKey = `school_access_${schoolData.id}`;
    const storedPassword = typeof window !== 'undefined' ? localStorage.getItem(storedKey) : null;

    if (storedPassword === schoolData.password) {
      setAuthenticated(true);
      await loadStores(schoolData.id);
    }

    setLoading(false);
  }

  async function loadStores(schoolId) {
    // Load all stores for this school, along with their themes and approved product counts
    const { data: storeData } = await supabase
      .from('stores')
      .select('*, store_themes(*)')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: true });

    if (storeData) {
      // Load product counts for each store
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
      // Store access in localStorage
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" />
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // School not found
  if (!school) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold text-gray-800 mt-6">School not found</h1>
          <p className="text-gray-500 mt-2">
            We could not find a school club at this address. Double check the link you were given.
          </p>
          <Link href="/" className="inline-block mt-6 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-xl font-medium transition-colors">
            Go to Lemonade Stand
          </Link>
        </div>
      </div>
    );
  }

  // Password gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">{school.name}</h1>
          {school.description && (
            <p className="text-gray-500 mt-1 text-sm">{school.description}</p>
          )}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl">
            <p className="text-sm text-gray-600">
              This is a private marketplace for {school.name} families. 
              Enter the password your club leader shared with you.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter club password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-center text-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-xl font-semibold transition-colors"
            >
              Enter
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-400">
            Powered by <Link href="/" className="text-amber-500 hover:underline">Lemonade Stand</Link>
          </p>
        </div>
      </div>
    );
  }

  // Authenticated — show school marketplace
  const getStoreColor = (theme) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-emerald-100 text-emerald-700',
      pink: 'bg-pink-100 text-pink-700',
      purple: 'bg-purple-100 text-purple-700',
      orange: 'bg-orange-100 text-orange-700',
    };
    return colors[theme?.color] || 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="font-bold text-gray-800 text-sm">{school.name}</h1>
              <p className="text-xs text-gray-400">Business Club Marketplace</p>
            </div>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            Lemonade Stand
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {school.name} Marketplace
          </h2>
          <p className="text-gray-500 mt-1">
            Browse stores from our Business Club members
          </p>
          <div className="inline-block mt-3 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
            Private — {school.name} families only
          </div>
        </div>
      </div>

      {/* Store Grid */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {stores.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🏗️</p>
            <h3 className="text-lg font-bold text-gray-800">Stores are coming soon!</h3>
            <p className="text-gray-500 mt-1">
              Club members are building their stores. Check back soon to see what they are selling.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => {
              const theme = store.store_themes?.[0] || store.store_themes;
              const sticker = theme?.sticker || '🍋';
              const colorClass = getStoreColor(theme);

              return (
                <Link
                  key={store.id}
                  href={`/store/${store.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto ${colorClass}`}>
                      {theme?.bannerImage ? (
                        <img src={theme.bannerImage} alt="" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        sticker
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 mt-3">
                      {store.store_name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                      by {store.kid_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {store.productCount} {store.productCount === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
