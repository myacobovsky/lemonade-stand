// @ts-nocheck
// FILE: app/store/[slug]/page.tsx

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Confetti, getPatternStyle, getCardClasses, Logo } from '../../components';
import { supabase } from '../../../lib/supabase';

// ====================== DESIGN TOKENS ======================
// These are the "Bold Playful chrome" tokens — used for nav, cart modal,
// footer, and anywhere the platform identity must come through.
// The kid's theme (color, fonts, stickers) takes over inside the content area.
const C = {
  cream: '#FEF3C7',
  creamWarm: '#FEF0B8',
  cardBg: '#FFFBEB',
  ink: '#1C1917',
  inkMuted: '#57534E',
  inkFaint: '#78716C',
  inkGhost: '#A8A29E',
  border: '#1C19171F',
  borderFaint: '#1C191714',
  borderInput: '#1C19172B',
  amberAccent: '#D97706',
  amberBtn: '#FCD34D',
  success: '#059669',
  successBg: '#D1FAE5',
  danger: '#DC2626',
};

const font = {
  sans: "'Poppins', sans-serif",
};

// ====================== KID COLOR PALETTE MAP ======================
// Maps the kid's color choice to a set of related shades we use across
// the content area: tint (background), accent (buttons/prices), and deep
// (hero name text). Consistent hue family per choice.
function getKidColors(colorKey) {
  const palettes = {
    amber:  { tint: '#FEF3C7', accent: '#F59E0B', accentHover: '#D97706', deep: '#92400E', accentContrast: '#1C1917' },
    blue:   { tint: '#EFF6FF', accent: '#3B82F6', accentHover: '#2563EB', deep: '#1E3A8A', accentContrast: '#FFFFFF' },
    green:  { tint: '#ECFDF5', accent: '#10B981', accentHover: '#059669', deep: '#065F46', accentContrast: '#FFFFFF' },
    pink:   { tint: '#FDF2F8', accent: '#EC4899', accentHover: '#DB2777', deep: '#9D174D', accentContrast: '#FFFFFF' },
    purple: { tint: '#F5F3FF', accent: '#8B5CF6', accentHover: '#7C3AED', deep: '#5B21B6', accentContrast: '#FFFFFF' },
    orange: { tint: '#FFF7ED', accent: '#F97316', accentHover: '#EA580C', deep: '#9A3412', accentContrast: '#FFFFFF' },
  };
  return palettes[colorKey] || palettes.amber;
}

// ====================== COMPONENT ======================
export default function PublicStorePage({ params }) {
  const { slug } = use(params);
  const router = useRouter();

  // Store data
  const [storeData, setStoreData] = useState(null);
  const [storeTheme, setStoreTheme] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Cart + checkout state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', contact: '', note: '' });
  const [showConfetti, setShowConfetti] = useState(false);

  // Tab state — Products vs About (only shown when there's a story)
  const [activeTab, setActiveTab] = useState('products');

  // ====================== DATA LOADING ======================
  // Preserves the 3-path slug lookup from the original: UUID first, then
  // kid_name with hyphens converted to spaces, then raw slug as kid_name.
  useEffect(() => {
    async function loadStore() {
      let store = null;

      // Path 1: looks like a UUID (long + dashes)
      if (slug.length > 20 && slug.includes('-')) {
        const { data } = await supabase.from('stores').select('*').eq('id', slug).single();
        if (data) store = data;
      }

      // Path 2: kid_name with slug-style dashes -> spaces
      if (!store) {
        const { data: stores } = await supabase
          .from('stores')
          .select('*')
          .ilike('kid_name', decodeURIComponent(slug).replace(/-/g, ' '));
        if (stores && stores.length > 0) store = stores[0];
      }

      // Path 3: raw slug as kid_name
      if (!store) {
        const { data: stores } = await supabase.from('stores').select('*').ilike('kid_name', slug);
        if (stores && stores.length > 0) store = stores[0];
      }

      if (!store) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setStoreData(store);

      // Load theme
      const { data: theme } = await supabase
        .from('store_themes')
        .select('*')
        .eq('store_id', store.id)
        .single();
      if (theme) setStoreTheme(theme);

      // Load products (filter to approved or legacy null-status)
      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .order('sort_order', { ascending: true });
      if (prods) setProducts(prods.filter((p) => p.status === 'approved' || !p.status));

      setLoading(false);
    }
    loadStore();
  }, [slug]);

  // ====================== DERIVED ======================
  const storeName = storeData?.store_name || 'Store';
  const kidName = storeData?.kid_name || '';
  const storeBio = storeData?.bio || '';
  const aboutStory = storeData?.about_story || '';
  const heroLayout = storeTheme?.hero_layout || 'classic';
  const kidColors = getKidColors(storeTheme?.color);
  const secondaryColors = storeTheme?.secondary_color
    ? getKidColors(storeTheme.secondary_color)
    : null;
  // Color for "Add to cart" button — secondary if kid set one, otherwise main
  const buttonColors = secondaryColors || kidColors;

  // Font families (fall back to Poppins if kid picked something unusual)
  const headerFontFamily = storeTheme?.header_font
    ? `'${storeTheme.header_font}', cursive`
    : "'Poppins', sans-serif";
  const bodyFontFamily = storeTheme?.body_font
    ? `'${storeTheme.body_font}', sans-serif`
    : "'Poppins', sans-serif";
  const cardFontFamily = storeTheme?.card_font
    ? `'${storeTheme.card_font}', sans-serif`
    : "'Poppins', sans-serif";

  // ====================== CART HANDLERS ======================
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!buyerInfo.name || !buyerInfo.contact) return;
    await supabase.from('orders').insert({
      store_id: storeData.id,
      buyer_name: buyerInfo.name,
      buyer_contact: buyerInfo.contact,
      buyer_note: buyerInfo.note,
      items: cart.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      total_amount: cartTotal,
      status: 'pending',
    });
    setOrderSubmitted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // ====================== LOADING ======================
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: C.cream, fontFamily: font.sans }}
      >
        <p style={{ color: C.inkFaint, fontSize: '14px' }}>Loading store…</p>
      </div>
    );
  }

  // ====================== NOT FOUND ======================
  if (notFound) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
      >
        <BoldPlayfulNav cartCount={0} cartTotal={0} onCartClick={() => {}} />
        <main className="max-w-md mx-auto px-4 pt-20 pb-16 text-center">
          <p
            className="text-xs uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: C.amberAccent }}
          >
            404
          </p>
          <h1
            className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02] mb-3"
            style={{ fontWeight: 800 }}
          >
            Store <span style={{ color: C.amberAccent }}>not found.</span>
          </h1>
          <p className="mb-8" style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.6 }}>
            We couldn't find a store at that address. Try browsing all stores instead.
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="inline-block transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: C.amberBtn,
              color: C.ink,
              border: `1.5px solid ${C.ink}`,
              boxShadow: `3px 3px 0 ${C.ink}`,
              borderRadius: '12px',
              padding: '14px 24px',
              fontWeight: 800,
              fontSize: '15px',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            Browse all stores →
          </button>
        </main>
      </div>
    );
  }

  // ====================== ACTIVE STORE RENDER ======================
  const hasAnnouncement = storeTheme?.announcement_on && storeTheme?.announcement;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      {showConfetti && <Confetti />}

      {/* ========== BOLD PLAYFUL NAV (chrome) ========== */}
      <BoldPlayfulNav
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setShowCart(true)}
      />

      {/* ========== ANNOUNCEMENT BAR (optional) ========== */}
      {hasAnnouncement && (
        <div
          style={{
            backgroundColor: C.ink,
            color: C.cream,
            textAlign: 'center',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.005em',
            fontFamily: bodyFontFamily,
          }}
        >
          <span style={{ color: kidColors.accent, fontWeight: 800, marginRight: '6px' }}>
            📣
          </span>
          {storeTheme.announcement}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-10">

        {/* ========== BANNER IMAGE (optional, above hero) ========== */}
        {storeTheme?.banner_image_url && (
          <div
            className="mb-6"
            style={{
              borderRadius: '18px',
              overflow: 'hidden',
              border: `1.5px solid ${C.ink}`,
              boxShadow: `3px 3px 0 ${C.ink}`,
            }}
          >
            <img
              src={storeTheme.banner_image_url}
              alt=""
              style={{
                width: '100%',
                height: 'clamp(120px, 28vw, 220px)',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )}

        {/* ========== HERO (kid's theme — 3 layouts) ========== */}
        <HeroBlock
          heroLayout={heroLayout}
          storeTheme={storeTheme}
          kidColors={kidColors}
          storeName={storeName}
          kidName={kidName}
          storeBio={storeBio}
          headerFontFamily={headerFontFamily}
          bodyFontFamily={bodyFontFamily}
        />

        {/* ========== TABS (Products + About) ========== */}
        <StoreTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          hasAbout={!!aboutStory}
        />

        {activeTab === 'about' && aboutStory ? (
          <AboutContent
            aboutStory={aboutStory}
            kidName={kidName}
            kidColors={kidColors}
            bodyFontFamily={bodyFontFamily}
          />
        ) : (
        <>

        {products.length === 0 ? (
          /* Empty state */
          <div
            className="text-center"
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: '18px',
              padding: '40px 28px',
              boxShadow: `2px 2px 0 ${C.ink}12`,
            }}
          >
            <p
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: C.ink,
                marginBottom: '6px',
              }}
            >
              No products yet.
            </p>
            <p style={{ fontSize: '13px', color: C.inkMuted }}>
              Check back soon — {kidName} is working on it!
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-3 sm:gap-4 ${
              storeTheme?.product_layout === 'list'
                ? 'grid-cols-1'
                : 'grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {products.map((p) => {
              const inCart = cart.find((item) => item.product.id === p.id);
              const isOutOfStock = p.in_stock === false;
              const isList = storeTheme?.product_layout === 'list';
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  kidColors={kidColors}
                  buttonColors={buttonColors}
                  cardFontFamily={cardFontFamily}
                  bodyFontFamily={bodyFontFamily}
                  inCart={inCart}
                  isOutOfStock={isOutOfStock}
                  isList={isList}
                  onAdd={() => addToCart(p)}
                />
              );
            })}
          </div>
        )}
        </>
        )}
      </main>

      {/* ========== FOOTER (chrome) ========== */}
      <footer
        style={{
          borderTop: `1px solid ${C.borderFaint}`,
          padding: '20px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: C.inkFaint,
        }}
      >
        Powered by{' '}
        <Link
          href="/"
          style={{
            color: C.amberAccent,
            fontWeight: 700,
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
        >
          Lemonade Stand
        </Link>{' '}
        · Kids' businesses, parent-supervised
      </footer>

      {/* ========== CART MODAL (pure Bold Playful) ========== */}
      {showCart && (
        <CartModal
          cart={cart}
          cartTotal={cartTotal}
          kidName={kidName}
          orderSubmitted={orderSubmitted}
          buyerInfo={buyerInfo}
          setBuyerInfo={setBuyerInfo}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onPlaceOrder={handlePlaceOrder}
          onDone={() => {
            setShowCart(false);
            setCart([]);
            setOrderSubmitted(false);
            setBuyerInfo({ name: '', contact: '', note: '' });
          }}
        />
      )}
    </div>
  );
}

// =====================================================================
// HERO BLOCK — switches between 3 layouts: classic, horizontal, banner
// =====================================================================
function HeroBlock({ heroLayout, storeTheme, kidColors, storeName, kidName, storeBio, headerFontFamily, bodyFontFamily }) {
  // Shared backdrop pattern (sticker pattern OR explicit pattern)
  const Backdrop = () => (
    <>
      {storeTheme?.sticker_pattern && storeTheme?.sticker && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><text x='12' y='35' font-size='24' opacity='0.08'>${storeTheme.sticker}</text></svg>`
            )}")`,
            backgroundSize: '50px 50px',
          }}
        />
      )}
      {!storeTheme?.sticker_pattern && storeTheme?.pattern && storeTheme.pattern !== 'none' && (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, ...getPatternStyle(storeTheme.pattern) }} />
      )}
    </>
  );

  // Shared trust pill
  const TrustPill = () => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'white',
        border: `1px solid ${C.border}`,
        borderRadius: '999px',
        padding: '5px 12px 5px 10px',
        fontSize: '11px',
        fontWeight: 700,
        color: C.inkMuted,
        letterSpacing: '0.02em',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: C.success,
          borderRadius: '50%',
          display: 'inline-block',
        }}
      />
      Parent-supervised shop
    </div>
  );

  // Shared store name + by + bio block
  const HeroText = ({ centered = true, large = true }) => (
    <>
      <h1
        style={{
          fontFamily: headerFontFamily,
          fontSize: large ? 'clamp(32px, 6vw, 44px)' : 'clamp(24px, 5vw, 34px)',
          fontWeight: 700,
          color: kidColors.deep,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          margin: '0 0 6px',
          textAlign: centered ? 'center' : 'left',
        }}
      >
        {storeName}
      </h1>
      <div
        style={{
          fontSize: '14px',
          color: C.inkMuted,
          fontWeight: 500,
          marginBottom: storeBio ? '12px' : '14px',
          fontFamily: bodyFontFamily,
          textAlign: centered ? 'center' : 'left',
        }}
      >
        by {kidName}
      </div>
      {storeBio && (
        <p
          style={{
            fontSize: '14px',
            color: C.inkMuted,
            fontStyle: 'italic',
            maxWidth: '380px',
            margin: centered ? '0 auto 16px' : '0 0 16px',
            lineHeight: 1.5,
            fontFamily: bodyFontFamily,
            textAlign: centered ? 'center' : 'left',
          }}
        >
          "{storeBio}"
        </p>
      )}
    </>
  );

  // ====== LAYOUT: BANNER ======
  // If banner photo set, photo dominates; name overlaid on bottom-left.
  // Falls back to classic if no banner.
  if (heroLayout === 'banner' && storeTheme?.banner_image_url) {
    return (
      <section
        className="mb-8 relative overflow-hidden"
        style={{
          border: `1.5px solid ${C.ink}`,
          borderRadius: '20px',
          boxShadow: `3px 3px 0 ${C.ink}`,
          minHeight: '280px',
          backgroundImage: `url(${storeTheme.banner_image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark gradient overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0) 100%)',
          }}
        />
        {/* Content overlay — bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px 24px',
            color: 'white',
          }}
        >
          {/* Sticker (small, top of overlay) */}
          {storeTheme?.sticker && (
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '8px' }}>
              {storeTheme.sticker}
            </div>
          )}
          <h1
            style={{
              fontFamily: headerFontFamily,
              fontSize: 'clamp(28px, 5vw, 38px)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: '0 0 4px',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {storeName}
          </h1>
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 500,
              marginBottom: storeBio ? '8px' : '10px',
              fontFamily: bodyFontFamily,
            }}
          >
            by {kidName}
          </div>
          {storeBio && (
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.92)',
                fontStyle: 'italic',
                maxWidth: '380px',
                margin: '0 0 12px',
                lineHeight: 1.5,
                fontFamily: bodyFontFamily,
              }}
            >
              "{storeBio}"
            </p>
          )}
          <TrustPill />
        </div>
      </section>
    );
  }

  // ====== LAYOUT: HORIZONTAL ======
  // Sticker on left, name/bio on right.
  if (heroLayout === 'horizontal') {
    return (
      <section
        className="mb-8 relative overflow-hidden"
        style={{
          backgroundColor: kidColors.tint,
          border: `1.5px solid ${C.ink}`,
          borderRadius: '20px',
          boxShadow: `3px 3px 0 ${C.ink}`,
          padding: '32px 28px',
        }}
      >
        <Backdrop />
        <div
          className="flex items-center gap-6 sm:gap-8"
          style={{ position: 'relative', flexDirection: 'row', flexWrap: 'wrap' }}
        >
          {/* Sticker side */}
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontSize: '72px', lineHeight: 1, marginBottom: '8px' }}>
              {storeTheme?.sticker || '🍋'}
            </div>
            {(storeTheme?.accent_stickers || []).length > 0 && (
              <div className="flex justify-center gap-1.5" style={{ flexWrap: 'wrap' }}>
                {storeTheme.accent_stickers.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '18px',
                      transform: `rotate(${(i - Math.floor(storeTheme.accent_stickers.length / 2)) * 12}deg)`,
                      display: 'inline-block',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Text side */}
          <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <HeroText centered={false} large={true} />
            <TrustPill />
          </div>
        </div>
      </section>
    );
  }

  // ====== LAYOUT: CLASSIC (default) ======
  return (
    <section
      className="mb-8 relative overflow-hidden"
      style={{
        backgroundColor: kidColors.tint,
        border: `1.5px solid ${C.ink}`,
        borderRadius: '20px',
        boxShadow: `3px 3px 0 ${C.ink}`,
        padding: '40px 24px 36px',
        textAlign: 'center',
      }}
    >
      <Backdrop />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: '60px', lineHeight: 1, marginBottom: '12px' }}>
          {storeTheme?.sticker || '🍋'}
        </div>
        {(storeTheme?.accent_stickers || []).length > 0 && (
          <div className="flex justify-center gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
            {storeTheme.accent_stickers.map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: '22px',
                  transform: `rotate(${(i - Math.floor(storeTheme.accent_stickers.length / 2)) * 14}deg)`,
                  display: 'inline-block',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
        <HeroText centered={true} large={true} />
        <TrustPill />
      </div>
    </section>
  );
}

// =====================================================================
// STORE TABS — Products / About switcher (only shows About when story exists)
// =====================================================================
function StoreTabs({ activeTab, onChange, hasAbout }) {
  // If no about story, just render the "Products" label like before
  if (!hasAbout) {
    return (
      <div
        style={{
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.inkFaint,
          fontWeight: 700,
          paddingLeft: '4px',
          marginBottom: '14px',
        }}
      >
        Products
      </div>
    );
  }

  // Two-tab pill switcher
  return (
    <div
      className="flex gap-1 mb-5"
      style={{
        padding: '4px',
        backgroundColor: C.cardBg,
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        boxShadow: `1px 1px 0 ${C.ink}14`,
        width: 'fit-content',
      }}
    >
      {[
        { id: 'products', label: 'Products' },
        { id: 'about',    label: 'About' },
      ].map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="transition-all"
            style={{
              padding: isActive ? '7px 14px' : '8px 15px',
              fontSize: '13px',
              fontWeight: isActive ? 800 : 700,
              color: isActive ? C.ink : C.inkFaint,
              backgroundColor: isActive ? '#FCD34D' : 'transparent',
              border: isActive ? `1px solid ${C.ink}` : '1px solid transparent',
              borderRadius: '8px',
              boxShadow: isActive ? `1px 1px 0 ${C.ink}` : 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// =====================================================================
// ABOUT CONTENT — story panel shown when About tab is active
// =====================================================================
function AboutContent({ aboutStory, kidName, kidColors, bodyFontFamily }) {
  return (
    <div
      style={{
        backgroundColor: kidColors.tint,
        border: `1.5px solid ${C.ink}`,
        borderRadius: '18px',
        padding: '28px 28px 32px',
        boxShadow: `3px 3px 0 ${C.ink}`,
      }}
    >
      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: kidColors.deep,
          fontWeight: 800,
          marginBottom: '12px',
        }}
      >
        {kidName}'s story
      </p>
      <div
        style={{
          fontSize: '15px',
          color: C.ink,
          lineHeight: 1.6,
          fontFamily: bodyFontFamily,
          whiteSpace: 'pre-wrap',
        }}
      >
        {aboutStory}
      </div>
    </div>
  );
}

// =====================================================================
// BOLD PLAYFUL NAV — the platform chrome, never changes per store
// =====================================================================
function BoldPlayfulNav({ cartCount, cartTotal, onCartClick }) {
  return (
    <header
      style={{
        backgroundColor: `${C.cream}EE`,
        borderBottom: `1px solid ${C.ink}14`,
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
          <span
            style={{
              fontFamily: "'DynaPuff', cursive",
              fontSize: '17px',
              fontWeight: 700,
              color: C.ink,
              whiteSpace: 'nowrap',
            }}
          >
            Lemonade Stand
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            style={{
              fontSize: '13px',
              color: C.inkMuted,
              fontWeight: 500,
              textDecoration: 'none',
            }}
            className="hidden sm:inline"
          >
            Browse stores
          </Link>
          {cartCount > 0 && (
            <button
              onClick={onCartClick}
              className="transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: C.amberBtn,
                color: C.ink,
                border: `1.5px solid ${C.ink}`,
                boxShadow: `2px 2px 0 ${C.ink}`,
                borderRadius: '10px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.ink}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
              </svg>
              {cartCount} · ${cartTotal.toFixed(2)}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// =====================================================================
// PRODUCT CARD — chunky Bold Playful frame with kid's color inside
// =====================================================================
function ProductCard({ product, kidColors, buttonColors, cardFontFamily, bodyFontFamily, inCart, isOutOfStock, isList, onAdd }) {
  // Default buttonColors to kidColors if not supplied (backwards compatibility)
  const btnColors = buttonColors || kidColors;
  return (
    <div
      className={`transition-all ${isList ? 'flex' : ''} ${isOutOfStock ? 'opacity-75' : ''}`}
      style={{
        backgroundColor: C.cardBg,
        border: `1.5px solid ${C.ink}`,
        borderRadius: '18px',
        boxShadow: `3px 3px 0 ${C.ink}`,
        overflow: 'hidden',
      }}
    >
      {/* Product image area — kid's color tint */}
      <div
        style={{
          backgroundColor: kidColors.tint,
          aspectRatio: isList ? 'auto' : '1 / 1',
          width: isList ? '120px' : '100%',
          flexShrink: isList ? 0 : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          position: 'relative',
          overflow: 'hidden',
          filter: isOutOfStock ? 'grayscale(100%)' : 'none',
        }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            loading="lazy"
          />
        ) : (
          <span>{product.emoji || '🎁'}</span>
        )}
        {isOutOfStock && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                backgroundColor: C.ink,
                color: 'white',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Sold out
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '14px', flex: isList ? 1 : undefined }}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: C.ink,
            letterSpacing: '-0.01em',
            marginBottom: '2px',
            lineHeight: 1.25,
            fontFamily: cardFontFamily,
          }}
        >
          {product.name}
        </h3>
        {product.description && (
          <p
            style={{
              fontSize: '12px',
              color: C.inkMuted,
              lineHeight: 1.4,
              marginBottom: '12px',
              fontFamily: bodyFontFamily,
              minHeight: '32px',
            }}
          >
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          {/* Price in kid's deep color */}
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: kidColors.deep,
            }}
          >
            ${Number(product.price).toFixed(2)}
          </span>

          {isOutOfStock ? (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: C.inkGhost,
                backgroundColor: C.cream,
                padding: '6px 12px',
                borderRadius: '10px',
              }}
            >
              Sold out
            </span>
          ) : inCart ? (
            <button
              onClick={onAdd}
              className="transition-all"
              style={{
                backgroundColor: C.successBg,
                color: C.success,
                border: `1.5px solid ${C.ink}`,
                boxShadow: `2px 2px 0 ${C.ink}`,
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              ✓ In cart ({inCart.quantity})
            </button>
          ) : (
            <button
              onClick={onAdd}
              className="transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: btnColors.accent,
                color: btnColors.accentContrast,
                border: `1.5px solid ${C.ink}`,
                boxShadow: `2px 2px 0 ${C.ink}`,
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// CART MODAL — pure Bold Playful (high-trust checkout zone)
// =====================================================================
function CartModal({ cart, cartTotal, kidName, orderSubmitted, buyerInfo, setBuyerInfo, onClose, onRemove, onPlaceOrder, onDone }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 60,
        padding: '0',
      }}
      className="sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: C.cardBg,
          borderRadius: '20px 20px 0 0',
          border: `1.5px solid ${C.ink}`,
          borderBottom: 'none',
          padding: '24px',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '85vh',
          overflowY: 'auto',
          fontFamily: font.sans,
          color: C.ink,
        }}
        className="sm:rounded-[20px] sm:border-b-[1.5px]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '-0.01em',
            }}
          >
            Your cart
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: C.inkFaint,
              fontSize: '28px',
              lineHeight: 1,
              cursor: 'pointer',
              padding: 0,
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {orderSubmitted ? (
          <div className="text-center py-4">
            <p
              className="text-xs uppercase tracking-[0.2em] font-bold mb-3"
              style={{ color: C.amberAccent }}
            >
              Order placed
            </p>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: C.ink,
                marginBottom: '8px',
                letterSpacing: '-0.01em',
              }}
            >
              Thanks!
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: C.inkMuted,
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              {kidName}'s parent will review your order and get back to you to arrange pickup or delivery.
            </p>
            <button
              onClick={onDone}
              className="transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: C.amberBtn,
                color: C.ink,
                border: `1.5px solid ${C.ink}`,
                boxShadow: `3px 3px 0 ${C.ink}`,
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Done
            </button>
          </div>
        ) : cart.length === 0 ? (
          <p style={{ color: C.inkMuted, textAlign: 'center', padding: '32px 0' }}>
            Your cart is empty.
          </p>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: '10px 0',
                    borderBottom: `1px solid ${C.borderFaint}`,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: C.ink }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '12px', color: C.inkMuted }}>
                      ${Number(item.product.price).toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.product.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: C.danger,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: `1px solid ${C.border}`,
                paddingTop: '12px',
                marginBottom: '16px',
              }}
              className="flex justify-between items-center"
            >
              <span style={{ fontWeight: 800, fontSize: '16px' }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: '20px', color: C.amberAccent }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'name', placeholder: 'Your name', type: 'text' },
                { key: 'contact', placeholder: 'Email or phone (so we can reach you)', type: 'text' },
                { key: 'note', placeholder: 'Note (optional)', type: 'text' },
              ].map((f) => (
                <input
                  key={f.key}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={buyerInfo[f.key]}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, [f.key]: e.target.value })}
                  className="focus:outline-none"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: `1.5px solid ${C.borderInput}`,
                    backgroundColor: C.cream,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: C.ink,
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                />
              ))}
              <button
                onClick={onPlaceOrder}
                disabled={!buyerInfo.name || !buyerInfo.contact}
                className="transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  width: '100%',
                  backgroundColor: C.amberBtn,
                  color: C.ink,
                  border: `1.5px solid ${C.ink}`,
                  boxShadow: `3px 3px 0 ${C.ink}`,
                  borderRadius: '12px',
                  padding: '14px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Place order →
              </button>
            </div>
            <p
              style={{
                fontSize: '11px',
                color: C.inkFaint,
                textAlign: 'center',
                marginTop: '12px',
                lineHeight: 1.5,
              }}
            >
              {kidName}'s parent will confirm your order and arrange pickup or delivery.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
