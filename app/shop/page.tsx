// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar, Logo } from '../components';
import { useApp } from '../../lib/context';
import { supabase } from '../../lib/supabase';

// ====================== DESIGN TOKENS ======================
// Kept in-file to match homepage — if we later want a shared tokens file, easy lift.
const C = {
  cream: '#FEF3C7',
  creamWarm: '#FEF0B8',
  creamCool: '#FDF8E1',
  cardBg: '#FFFBEB',
  cardBorder: '#1C191722',
  ink: '#1C1917',
  inkMuted: '#57534E',
  inkFaint: '#78716C',
  amberBtn: '#FCD34D',
  amberAccent: '#D97706',
};
const font = {
  sans: "'Poppins', sans-serif",
  brand: "'DynaPuff', cursive",
};

export default function ShopPage() {
  const router = useRouter();
  const { store: storeData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [realStores, setRealStores] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');

  // ---------- DATA FETCH: unchanged from previous version ----------
  useEffect(() => {
    async function fetchStores() {
      const { data: storesData } = await supabase
        .from('stores')
        .select('*')
        .or('public_listing.eq.true,public_listing.is.null');
      const { data: themesData } = await supabase.from('store_themes').select('*');
      const { data: productsData } = await supabase
        .from('products')
        .select('id, store_id, status');
      if (storesData) {
        const enriched = storesData.map((s) => {
          const theme = (themesData || []).find((t) => t.store_id === s.id);
          const productCount = (productsData || []).filter(
            (p) => p.store_id === s.id && (p.status === 'approved' || !p.status)
          ).length;
          return { ...s, _theme: theme, _productCount: productCount };
        });
        setRealStores(enriched);
      }
    }
    fetchStores();
  }, []);

  // ---------- NEIGHBORHOODS: emojis removed, same IDs ----------
  const neighborhoods = [
    { id: 'all', label: 'All areas' },
    { id: 'tribeca', label: 'Tribeca' },
    { id: 'fidi', label: 'FiDi' },
    { id: 'bpc', label: 'Battery Park City' },
  ];

  // ---------- STORE LIST: unchanged mapping, just removed 'rating' field usage ----------
  const dbStores = realStores.map((s) => ({
    id: s.id,
    name: s.store_name,
    owner: s.kid_name,
    neighborhood: 'tribeca', // preserved default from existing code
    sticker: s._theme?.sticker || '🏪',
    bannerUrl: s._theme?.banner_image_url || null,
    color: s._theme?.color || 'amber',
    productCount: s._productCount || 0,
    description: s.bio || `${s.kid_name}'s store!`,
    isUserStore: storeData?.id === s.id,
    isReal: true,
  }));

  const allStores = dbStores;

  const filteredStores = allStores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNeighborhood =
      selectedNeighborhood === 'all' || store.neighborhood === selectedNeighborhood;
    return matchesSearch && matchesNeighborhood;
  });

  const noStoresAtAll = allStores.length === 0;

  // ---------- BUTTON STYLE (matches homepage) ----------
  const btnPrimary = {
    backgroundColor: C.amberBtn,
    color: C.ink,
    border: `1.5px solid ${C.ink}`,
    boxShadow: `3px 3px 0 ${C.ink}`,
    borderRadius: '12px',
    fontWeight: 700,
    transition: 'all 0.15s ease',
  };

  // Avatar tile background — soft tint based on the kid's theme color, but
  // subdued so the kid's own logo/banner is what pops.
  const avatarTintFor = (color) => {
    switch (color) {
      case 'blue':   return '#DBEAFE';
      case 'green':  return '#D1FAE5';
      case 'pink':   return '#FCE7F3';
      case 'purple': return '#EDE9FE';
      case 'orange': return '#FED7AA';
      case 'amber':
      default:       return '#FEF3C7';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}>
      <NavBar active="marketplace" />

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-10">

        {/* ============ PAGE HEADER ============ */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3" style={{ color: C.amberAccent }}>
            Shop local
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl tracking-[-0.025em] leading-[1.02] max-w-3xl mx-auto"
            style={{ fontWeight: 800, color: C.ink }}
          >
            Kid-run shops, <span style={{ color: C.amberAccent }}>right in your neighborhood.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: C.inkMuted }}>
            Every store is run by a kid in NYC. Real products, real young entrepreneurs.
          </p>
        </div>

        {/* ============ SEARCH ============ */}
        <div className="mb-4 max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stores..."
            className="w-full px-5 py-3.5 text-[15px] focus:outline-none transition-colors"
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.cardBorder}`,
              borderRadius: '12px',
              color: C.ink,
              fontFamily: font.sans,
            }}
            onFocus={(e) => (e.target.style.borderColor = C.ink)}
            onBlur={(e) => (e.target.style.borderColor = C.cardBorder)}
          />
        </div>

        {/* ============ NEIGHBORHOOD FILTER ============ */}
        <div className="flex gap-2.5 mb-6 overflow-x-auto pb-2 justify-center flex-wrap">
          {neighborhoods.map((n) => {
            const active = selectedNeighborhood === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setSelectedNeighborhood(n.id)}
                className="px-4 py-2.5 text-sm whitespace-nowrap transition-colors"
                style={{
                  borderRadius: '999px',
                  fontWeight: 600,
                  backgroundColor: active ? C.ink : C.cardBg,
                  color: active ? C.cream : C.inkMuted,
                  border: active ? `1px solid ${C.ink}` : `1px solid ${C.cardBorder}`,
                }}
              >
                {n.label}
              </button>
            );
          })}
        </div>

        {/* ============ RESULTS COUNT ============ */}
        {!noStoresAtAll && (
          <p className="text-center text-sm mb-6 font-medium" style={{ color: C.inkFaint }}>
            Showing {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* ============ STORE GRID ============ */}
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredStores.map((store) => (
            <button
              key={store.id}
              onClick={() => router.push('/store/' + (store.id || store.owner.toLowerCase()))}
              className="text-left w-full transition-all hover:-translate-x-px hover:-translate-y-px"
              style={{
                backgroundColor: C.cardBg,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: '18px',
                padding: '20px',
                boxShadow: `2px 2px 0 ${C.ink}12`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `3px 3px 0 ${C.ink}20`)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `2px 2px 0 ${C.ink}12`)}
            >
              <div className="flex gap-4 items-start">
                {/* Avatar — uses kid's uploaded banner or their chosen sticker, tinted by their theme color */}
                <div
                  className="flex items-center justify-center shrink-0 overflow-hidden"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: avatarTintFor(store.color),
                    border: `1px solid ${C.ink}14`,
                    fontSize: '26px',
                  }}
                >
                  {store.bannerUrl ? (
                    <img src={store.bannerUrl} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{store.sticker}</span>
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3
                      className="truncate"
                      style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: C.ink,
                        letterSpacing: '-0.01em',
                        margin: 0,
                      }}
                    >
                      {store.name}
                    </h3>
                    {store.isUserStore && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: C.amberAccent,
                          backgroundColor: C.cream,
                          border: `1px solid ${C.ink}14`,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          flexShrink: 0,
                        }}
                      >
                        Your store
                      </span>
                    )}
                  </div>
                  <p className="mb-2" style={{ fontSize: '12px', color: C.inkFaint, fontWeight: 500 }}>
                    by {store.owner}
                    {store.productCount > 0
                      ? ` · ${store.productCount} product${store.productCount !== 1 ? 's' : ''}`
                      : ''}
                  </p>
                  <p
                    className="line-clamp-2"
                    style={{ fontSize: '13px', color: C.inkMuted, lineHeight: 1.5, margin: 0 }}
                  >
                    {store.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ============ EMPTY STATE A — No stores exist anywhere yet ============ */}
        {noStoresAtAll && (
          <div className="text-center py-16 px-4">
            <div className="flex justify-center mb-6"><Logo size="lg" /></div>
            <h3
              className="text-2xl sm:text-3xl mb-3 tracking-[-0.02em]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              We're just getting started.
            </h3>
            <p className="mb-7 max-w-md mx-auto leading-relaxed text-base" style={{ color: C.inkMuted }}>
              The first wave of kid entrepreneurs is setting up their shops right now. Check back soon — or be one of them.
            </p>
            <Link
              href="/login?mode=signup"
              className="inline-block px-7 py-3.5 transition-all hover:-translate-y-0.5"
              style={{ ...btnPrimary, fontSize: '16px' }}
            >
              Start your own store →
            </Link>
          </div>
        )}

        {/* ============ EMPTY STATE B — Filters matched nothing ============ */}
        {!noStoresAtAll && filteredStores.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl mb-2" style={{ fontWeight: 800, color: C.ink }}>
              No stores match that.
            </h3>
            <p className="mb-5 text-sm" style={{ color: C.inkMuted }}>
              Try a different search or neighborhood.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedNeighborhood('all');
              }}
              className="px-5 py-2.5 text-sm transition-colors"
              style={{
                backgroundColor: C.cardBg,
                color: C.ink,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: '10px',
                fontWeight: 600,
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* ============ BOTTOM SIGNUP BAND ============ */}
      {/* Only shown when at least one store exists — empty-state A already has its own CTA */}
      {!noStoresAtAll && (
        <section style={{ backgroundColor: C.creamCool, borderTop: `1px solid ${C.ink}0F` }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-20 text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3" style={{ color: C.amberAccent }}>
              Get in on this
            </p>
            <h3
              className="text-2xl sm:text-3xl md:text-4xl tracking-[-0.02em] leading-[1.1] max-w-xl mx-auto mb-6"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Want your kid's store <span style={{ color: C.amberAccent }}>right here?</span>
            </h3>
            <Link
              href="/login?mode=signup"
              className="inline-block px-7 py-3.5 transition-all hover:-translate-y-0.5"
              style={{ ...btnPrimary, fontSize: '16px' }}
            >
              Get Started — Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
