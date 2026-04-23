// @ts-nocheck
// FILE: app/biz/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { NavBar } from '../components';
import { useApp } from '../../lib/context';

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
  // Red alert colors — for pending orders callout
  alertBg: '#FEE2E2',
  alertBorder: '#F87171',
  alertInk: '#991B1B',
};
const font = {
  sans: "'Poppins', sans-serif",
};

export default function BizPage() {
  const router = useRouter();
  const {
    loading,
    store: storeData,
    products,
    orders,
  } = useApp();

  // Redirect to setup if no store exists (preserved from original)
  if (!loading && !storeData) {
    router.push('/setup');
    return null;
  }

  // ====================== DERIVED VALUES ======================
  const kidName = storeData?.kid_name || 'there';
  const totalEarnings = storeData?.total_earnings || 0;
  const pendingOrders = (orders || []).filter((o) => o.status === 'pending');
  const completedOrders = (orders || []).filter((o) => o.status === 'completed');
  const productCount = (products || []).length;

  const hasFirstSale = completedOrders.length > 0;
  const hasPendingOrders = pendingOrders.length > 0;

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

  // ====================== SHARED STYLES ======================
  const chunkyCardStyle = {
    backgroundColor: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: '16px',
    boxShadow: `2px 2px 0 ${C.ink}12`,
  };

  // Action card — chunky with black border and 3px offset shadow
  const actionCardStyle = {
    backgroundColor: C.cardBg,
    border: `1.5px solid ${C.ink}`,
    borderRadius: '16px',
    boxShadow: `3px 3px 0 ${C.ink}`,
    padding: '20px 18px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'left',
    fontFamily: 'inherit',
    width: '100%',
  };

  // Primary action (Edit Store) gets amber fill
  const actionCardPrimaryStyle = {
    ...actionCardStyle,
    backgroundColor: C.amberBtn,
  };

  // Action card hover: translate + bigger shadow
  const onActionHover = (e, active = true) => {
    if (active) {
      e.currentTarget.style.transform = 'translate(-2px, -2px)';
      e.currentTarget.style.boxShadow = `5px 5px 0 ${C.ink}`;
    } else {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = `3px 3px 0 ${C.ink}`;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      <NavBar active="biz" />

      {/* Greeting */}
      <div className="max-w-2xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-3">
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Hey <span style={{ color: C.amberAccent }}>{kidName}.</span>
        </h1>
        <p
          className="mt-1.5"
          style={{ fontSize: '14px', color: C.inkMuted }}
        >
          {hasFirstSale
            ? `Here's how your business is doing today.`
            : `Here's your business so far. Let's get your first sale.`}
        </p>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-8 pb-12 space-y-4">

        {/* =========================================================
            FIRST SALE / MOMENTUM CALLOUT (top of page, amber)
            Swaps message based on sales state:
              - No sales yet: "Get your first sale" push
              - Has sales: celebration + encouragement to keep sharing
            ========================================================= */}
        <button
          onClick={() => router.push('/biz/marketing')}
          className="w-full transition-all hover:-translate-y-0.5"
          style={{
            backgroundColor: C.amberBtn,
            border: `1.5px solid ${C.ink}`,
            borderRadius: '18px',
            boxShadow: `3px 3px 0 ${C.ink}`,
            padding: '20px 22px',
            textAlign: 'left',
            fontFamily: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: C.amberAccent,
                fontWeight: 800,
                marginBottom: '4px',
              }}
            >
              {hasFirstSale ? 'Keep the momentum' : 'Get your first sale'}
            </div>
            <div
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: C.ink,
                letterSpacing: '-0.01em',
                lineHeight: 1.25,
                marginBottom: '4px',
              }}
            >
              {hasFirstSale
                ? `You've made ${completedOrders.length} sale${completedOrders.length === 1 ? '' : 's'}. Tell more people about your store.`
                : `Share your store link and let people know you're open for business.`}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: C.inkMuted,
                fontWeight: 500,
              }}
            >
              Open marketing tools →
            </div>
          </div>
        </button>

        {/* =========================================================
            STAT STRIP — earned / orders / products
            Typography-forward, no decorative emojis.
            ========================================================= */}
        <div className="grid grid-cols-3 gap-3">
          {/* Earned — amber-accented number since it's the money stat */}
          <div style={{ ...chunkyCardStyle, padding: '16px 14px' }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: C.inkFaint,
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              Earned
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: C.amberAccent,
              }}
            >
              ${totalEarnings.toFixed(0)}
              {totalEarnings % 1 !== 0 && (
                <span style={{ fontSize: '18px', color: C.amberAccent }}>
                  .{totalEarnings.toFixed(2).split('.')[1]}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: C.inkMuted,
                fontWeight: 500,
                marginTop: '3px',
              }}
            >
              total sales
            </div>
          </div>

          {/* Orders to fill */}
          <div style={{ ...chunkyCardStyle, padding: '16px 14px' }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: C.inkFaint,
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              Orders
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: C.ink,
              }}
            >
              {pendingOrders.length}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: C.inkMuted,
                fontWeight: 500,
                marginTop: '3px',
              }}
            >
              to fill
            </div>
          </div>

          {/* Products */}
          <div style={{ ...chunkyCardStyle, padding: '16px 14px' }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: C.inkFaint,
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              Products
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: C.ink,
              }}
            >
              {productCount}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: C.inkMuted,
                fontWeight: 500,
                marginTop: '3px',
              }}
            >
              in your store
            </div>
          </div>
        </div>

        {/* =========================================================
            PENDING ORDERS ALERT (conditional)
            Only shows if there are pending orders. Red dot + text + arrow.
            Tappable — goes to /biz (which is here, so might want /dashboard later)
            Using parent dashboard since that's where order approval lives.
            ========================================================= */}
        {hasPendingOrders && (
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: C.alertBg,
              border: `1px solid ${C.alertBorder}`,
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#DC2626',
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <div style={{ flex: 1, fontSize: '13px', color: C.alertInk, lineHeight: 1.5 }}>
              <strong style={{ fontWeight: 800 }}>
                {pendingOrders.length} order{pendingOrders.length === 1 ? '' : 's'}
              </strong>{' '}
              waiting to be filled. Ask your parent to help.
            </div>
            <div
              style={{
                color: C.alertInk,
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0,
              }}
            >
              →
            </div>
          </button>
        )}

        {/* =========================================================
            ACTION GRID — 2x2 chunky cards
            Primary action (Edit store) is amber-filled.
            Others are cream with black border + offset shadow.
            ========================================================= */}
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.inkFaint,
            fontWeight: 700,
            paddingLeft: '4px',
            paddingTop: '8px',
          }}
        >
          What next?
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Edit store — primary action */}
          <button
            onClick={() => router.push('/editor')}
            style={actionCardPrimaryStyle}
            onMouseEnter={(e) => onActionHover(e, true)}
            onMouseLeave={(e) => onActionHover(e, false)}
          >
            <div
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: C.ink,
                letterSpacing: '-0.01em',
                marginBottom: '4px',
              }}
            >
              Edit store
            </div>
            <div style={{ fontSize: '12px', color: C.ink, lineHeight: 1.45, fontWeight: 500 }}>
              Add products, change design, update announcements.
            </div>
          </button>

          {/* View store */}
          <button
            onClick={() => router.push('/store')}
            style={actionCardStyle}
            onMouseEnter={(e) => onActionHover(e, true)}
            onMouseLeave={(e) => onActionHover(e, false)}
          >
            <div
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: C.ink,
                letterSpacing: '-0.01em',
                marginBottom: '4px',
              }}
            >
              View store
            </div>
            <div style={{ fontSize: '12px', color: C.inkMuted, lineHeight: 1.45 }}>
              See what customers see when they visit your shop.
            </div>
          </button>

          {/* Money math */}
          <button
            onClick={() => router.push('/biz/money')}
            style={actionCardStyle}
            onMouseEnter={(e) => onActionHover(e, true)}
            onMouseLeave={(e) => onActionHover(e, false)}
          >
            <div
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: C.ink,
                letterSpacing: '-0.01em',
                marginBottom: '4px',
              }}
            >
              Money math
            </div>
            <div style={{ fontSize: '12px', color: C.inkMuted, lineHeight: 1.45 }}>
              Figure out your costs, prices, and profit per product.
            </div>
          </button>

          {/* Marketing */}
          <button
            onClick={() => router.push('/biz/marketing')}
            style={actionCardStyle}
            onMouseEnter={(e) => onActionHover(e, true)}
            onMouseLeave={(e) => onActionHover(e, false)}
          >
            <div
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: C.ink,
                letterSpacing: '-0.01em',
                marginBottom: '4px',
              }}
            >
              Marketing
            </div>
            <div style={{ fontSize: '12px', color: C.inkMuted, lineHeight: 1.45 }}>
              Share your store and tell people what you're selling.
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
