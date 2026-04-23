// @ts-nocheck
// FILE: app/schools/[slug]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { NavBar } from '../../components';

// ====================== DESIGN TOKENS ======================
const C = {
  cream: '#FEF3C7',
  creamWarm: '#FEF0B8',
  creamCool: '#FDF8E1',
  cardBg: '#FFFBEB',
  ink: '#1C1917',
  inkMuted: '#57534E',
  inkFaint: '#78716C',
  inkGhost: '#A8A29E',
  border: '#1C19171F',
  borderFaint: '#1C191714',
  amberAccent: '#D97706',
  amberBtn: '#FCD34D',
};
const font = {
  sans: "'Poppins', sans-serif",
};

// ====================== KID-THEMED TILE ======================
// When a store doesn't have a banner image uploaded, we still want to show
// the kid's chosen identity — their picked sticker (emoji) and theme color.
// This component renders exactly that: tinted background from theme.color,
// large sticker from theme.sticker, falling back to a lemon if unset.
function KidThemedTile({ themeColor = 'amber', sticker = '🍋' }) {
  const tileColor = {
    amber:  '#FEF3C7',
    blue:   '#DBEAFE',
    green:  '#D1FAE5',
    pink:   '#FCE7F3',
    purple: '#EDE9FE',
    orange: '#FFEDD5',
  }[themeColor] || '#FEF3C7';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: tileColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '64px',
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      {sticker}
    </div>
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

  useEffect(() => {
    if (!slug) return;
    loadSchool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // ====================== LOAD + AUTH CHECK ======================
  // 1. Look up the school by slug
  // 2. Check localStorage for stored password
  // 3. If missing or wrong: redirect to /schools so user goes through unified gate
  // 4. If correct: load stores for this school and render
  async function loadSchool() {
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (schoolError || !schoolData) {
      // School genuinely doesn't exist — show a real not-found state below.
      setLoading(false);
      return;
    }

    setSchool(schoolData);

    // Check access via localStorage. If missing/invalid, bounce to /schools
    // so the user goes through the unified (code + password) form. This keeps
    // the "one gate" UX — the [slug] page never shows its own password form.
    let hasAccess = false;
    try {
      const storedPassword = localStorage.getItem(`school_access_${schoolData.id}`);
      hasAccess = storedPassword === schoolData.password;
    } catch {
      hasAccess = false;
    }

    if (!hasAccess) {
      router.replace('/schools');
      return;
    }

    setAuthenticated(true);
    await loadStores(schoolData.id);
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

  // ====================== LOADING STATE ======================
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: C.cream, fontFamily: font.sans }}
      >
        <p style={{ color: C.inkFaint, fontSize: '14px' }}>Loading…</p>
      </div>
    );
  }

  // ====================== SCHOOL NOT FOUND ======================
  if (!school) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
      >
        <NavBar active="" />
        <main className="max-w-md mx-auto px-4 sm:px-8 pt-20 pb-16 text-center">
          <p
            className="text-xs uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: C.amberAccent }}
          >
            404
          </p>
          <h1
            className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02]"
            style={{ fontWeight: 800, color: C.ink }}
          >
            School <span style={{ color: C.amberAccent }}>not found.</span>
          </h1>
          <p
            className="mt-4 text-base leading-relaxed"
            style={{ color: C.inkMuted }}
          >
            We couldn't find a school club at this address. Double-check the link you were given.
          </p>
          <div className="mt-8">
            <Link
              href="/schools"
              className="inline-block px-6 py-3 transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: C.amberBtn,
                color: C.ink,
                border: `1.5px solid ${C.ink}`,
                boxShadow: `3px 3px 0 ${C.ink}`,
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              ← Back to schools
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ====================== AUTHENTICATED — MARKETPLACE ======================

  // While the redirect is in-flight for unauthenticated users, render nothing
  // to avoid a flash of protected content.
  if (!authenticated) return null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      <NavBar active="schools" />

      {/* ============ HERO ============ */}
      <section className="px-4 sm:px-8 pt-12 sm:pt-16 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: C.amberAccent }}
          >
            Private marketplace
          </p>
          <h1
            className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02]"
            style={{ fontWeight: 800, color: C.ink }}
          >
            {school.name}{' '}
            <span style={{ color: C.amberAccent }}>marketplace.</span>
          </h1>
          <p
            className="mt-4 text-base leading-relaxed max-w-md mx-auto"
            style={{ color: C.inkMuted }}
          >
            Browse and buy from our Business Club members.
          </p>

          {/* Status pills */}
          <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#065F46',
                backgroundColor: '#D1FAE5',
                border: '1px solid #10B98122',
                padding: '4px 12px',
                borderRadius: '999px',
              }}
            >
              {stores.length} {stores.length === 1 ? 'store' : 'stores'}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#92400E',
                backgroundColor: '#FEF3C7',
                border: '1px solid #F59E0B22',
                padding: '4px 12px',
                borderRadius: '999px',
              }}
            >
              {school.name} families only
            </span>
          </div>
        </div>
      </section>

      {/* ============ STORE GRID ============ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        {stores.length === 0 ? (
          /* Empty state — stores not created yet */
          <div
            className="text-center py-16 mt-6 mx-auto"
            style={{
              maxWidth: '520px',
              padding: '40px 28px',
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: '20px',
              boxShadow: `2px 2px 0 ${C.ink}12`,
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.25em] font-bold mb-3"
              style={{ color: C.amberAccent }}
            >
              Coming soon
            </p>
            <h3
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: C.ink,
                margin: '0 0 8px',
                letterSpacing: '-0.01em',
              }}
            >
              Stores are being built.
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: C.inkMuted,
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              Club members are designing their stores. Check back soon to see what they are selling.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => {
              const theme = store.store_themes?.[0] || store.store_themes;
              return (
                <Link
                  key={store.id}
                  href={`/store/${store.id}`}
                  className="block transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: C.cardBg,
                    border: `1px solid ${C.border}`,
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: `2px 2px 0 ${C.ink}12`,
                    textDecoration: 'none',
                  }}
                >
                  {/* Banner / avatar tile */}
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      backgroundColor: C.cream,
                    }}
                  >
                    {theme?.banner_image_url ? (
                      <img
                        src={theme.banner_image_url}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <KidThemedTile
                        themeColor={theme?.color}
                        sticker={theme?.sticker}
                      />
                    )}
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '16px 18px' }}>
                    <h3
                      style={{
                        fontSize: '17px',
                        fontWeight: 800,
                        color: C.ink,
                        margin: '0 0 4px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {store.store_name}
                    </h3>
                    <p
                      style={{
                        fontSize: '13px',
                        color: C.inkMuted,
                        margin: '0 0 8px',
                      }}
                    >
                      by {store.kid_name}
                    </p>
                    {store.productCount > 0 && (
                      <p
                        style={{
                          fontSize: '11px',
                          color: C.inkFaint,
                          margin: 0,
                          fontWeight: 500,
                        }}
                      >
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
    </div>
  );
}
