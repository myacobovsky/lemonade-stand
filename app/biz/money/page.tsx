// @ts-nocheck
// FILE: app/biz/money/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar, LearnTip } from '../../components';
import { useApp } from '../../../lib/context';

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
  borderInput: '#1C19172B',
  amberAccent: '#D97706',
  amberBtn: '#FCD34D',
  amberInputBg: '#FEF3C7',
  // Profit colors
  positive: '#059669',
  negative: '#DC2626',
  // Coaching colors
  coachAmber: '#92400E',
  coachGreen: '#059669',
  coachRed: '#DC2626',
  // Tip card
  tipBg: '#EDE9FE',
  tipInk: '#4C1D95',
};
const font = {
  sans: "'Poppins', sans-serif",
};

export default function MoneyMathPage() {
  const router = useRouter();
  const { loading, store: storeData, products } = useApp();

  // ====================== STATE ======================
  // productCosts keyed by product.id. Not persisted — resets on visit.
  // { [productId]: { materials, minutes, hourlyRate, customPrice, goal } }
  const [productCosts, setProductCosts] = useState({});
  // Which product is currently being analyzed. Defaults to first product.
  const [activeProductId, setActiveProductId] = useState(null);

  // Redirect to setup if no store exists
  if (!loading && !storeData) {
    router.push('/setup');
    return null;
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

  // ====================== EMPTY STATE (no products yet) ======================
  if (!products || products.length === 0) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
      >
        <NavBar active="biz" />
        <main className="max-w-2xl mx-auto px-4 sm:px-8 pt-8 pb-16">
          <Link
            href="/biz"
            className="inline-flex items-center gap-1.5 mb-4 transition-colors"
            style={{ fontSize: '13px', color: C.inkFaint, fontWeight: 500 }}
          >
            ← Back to My Biz
          </Link>
          <p
            className="text-xs uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: C.amberAccent }}
          >
            Money math
          </p>
          <h1
            className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02] mb-6"
            style={{ fontWeight: 800, color: C.ink }}
          >
            Add a product <span style={{ color: C.amberAccent }}>to start.</span>
          </h1>
          <p className="mb-8" style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.6 }}>
            Money Math helps you figure out your costs, prices, and profit per product.
            Add your first product in the store editor to use this tool.
          </p>
          <button
            onClick={() => router.push('/editor')}
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
            Go to store editor →
          </button>
        </main>
      </div>
    );
  }

  // ====================== DERIVED — ACTIVE PRODUCT ======================
  // Default to first product if no active selection.
  const activeId = activeProductId || products[0]?.id;
  const activeProduct = products.find((p) => p.id === activeId) || products[0];

  // ====================== CALCULATIONS FOR ACTIVE PRODUCT ======================
  const costs = productCosts[activeProduct.id] || {};
  const materials = parseFloat(costs.materials) || 0;
  const minutes = parseFloat(costs.minutes) || 0;
  const hourlyRate = parseFloat(costs.hourlyRate) || 0;
  const timeCost = (minutes / 60) * hourlyRate;
  const totalCost = materials + timeCost;
  const hasCost = materials > 0 || (minutes > 0 && hourlyRate > 0);

  const customPriceRaw = costs.customPrice;
  const customPrice =
    customPriceRaw !== undefined && customPriceRaw !== '' && customPriceRaw !== null
      ? parseFloat(customPriceRaw)
      : null;
  const currentPrice =
    customPrice !== null && !isNaN(customPrice) ? customPrice : activeProduct.price;
  const priceChanged =
    customPrice !== null && !isNaN(customPrice) && customPrice !== activeProduct.price;

  const profit = currentPrice - totalCost;
  const margin = currentPrice > 0 ? Math.round((profit / currentPrice) * 100) : 0;

  const goalRaw = costs.goal;
  const goal = parseFloat(goalRaw) || 0;
  const unitsNeeded = profit > 0 && goal > 0 ? Math.ceil(goal / profit) : 0;

  // ====================== STATE UPDATERS ======================
  function updateCost(field, value) {
    setProductCosts((prev) => ({
      ...prev,
      [activeProduct.id]: {
        ...(prev[activeProduct.id] || {}),
        [field]: value,
      },
    }));
  }

  // ====================== SHARED STYLES ======================
  const labelStyle = {
    fontSize: '11px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: C.inkFaint,
    fontWeight: 700,
  };

  const inputBase = {
    padding: '8px 10px 8px 22px',
    borderRadius: '10px',
    border: `1.5px solid ${C.borderInput}`,
    backgroundColor: C.amberInputBg,
    fontSize: '14px',
    fontWeight: 700,
    color: C.ink,
    fontFamily: 'inherit',
    width: '90px',
  };

  const sectionStyle = {
    padding: '20px 22px',
    borderBottom: `1px solid ${C.borderFaint}`,
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      <NavBar active="biz" />

      <main className="max-w-2xl mx-auto px-4 sm:px-8 pt-8 pb-16">
        {/* Back link */}
        <Link
          href="/biz"
          className="inline-flex items-center gap-1.5 mb-4 transition-colors hover:text-stone-900"
          style={{ fontSize: '13px', color: C.inkFaint, fontWeight: 500 }}
        >
          ← Back to My Biz
        </Link>

        {/* Header */}
        <p
          className="text-xs uppercase tracking-[0.25em] font-bold mb-3"
          style={{ color: C.amberAccent }}
        >
          Money math
        </p>
        <h1
          className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02] mb-3"
          style={{ fontWeight: 800, color: C.ink }}
        >
          What am I{' '}
          <span style={{ color: C.amberAccent }}>really earning?</span>
        </h1>
        <div className="flex items-start gap-2 mb-8">
          <p style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.6, maxWidth: '440px' }}>
            Figure out your costs, see your profit, and learn what price will help you reach your goals.
          </p>
          <LearnTip title="Cost = Supplies + Time" color="amber">
            <p>Making things costs money AND time.</p>
            <p>
              The beads and string you buy? That is your <strong>supplies</strong> cost.
            </p>
            <p>
              The time you spend making it? That has value too. If you could earn $10/hour babysitting, then 30 minutes of your time is worth $5.
            </p>
            <p>Enter what you spend below and see how much you really earn.</p>
          </LearnTip>
        </div>

        {/* ========================================================= */}
        {/* PRODUCT PICKER (only shown when 2+ products)              */}
        {/* ========================================================= */}
        {products.length > 1 && (
          <div className="mb-4">
            <div style={{ ...labelStyle, paddingLeft: '4px', marginBottom: '6px' }}>
              Pick a product
            </div>
            <div
              className="flex gap-2 overflow-x-auto py-1 -my-1"
              style={{ scrollbarWidth: 'none' }}
            >
              {products.map((p) => {
                const isActive = p.id === activeProduct.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveProductId(p.id)}
                    className="flex items-center gap-2 whitespace-nowrap transition-all flex-shrink-0"
                    style={{
                      backgroundColor: isActive ? C.amberBtn : C.cardBg,
                      border: isActive
                        ? `1.5px solid ${C.ink}`
                        : `1px solid ${C.border}`,
                      borderRadius: '12px',
                      padding: isActive ? '9px 13px' : '10px 14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: isActive ? C.ink : C.inkMuted,
                      boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>
                      {p.emoji || '🎁'}
                    </span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CALCULATOR CARD                                           */}
        {/* ========================================================= */}
        <div
          style={{
            backgroundColor: C.cardBg,
            border: `1px solid ${C.border}`,
            borderRadius: '20px',
            boxShadow: `2px 2px 0 ${C.ink}12`,
            overflow: 'hidden',
          }}
        >
          {/* Product header */}
          <div
            style={{
              padding: '18px 22px',
              borderBottom: `1px solid ${C.borderFaint}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '32px', lineHeight: 1 }}>
              {activeProduct.emoji || '🎁'}
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: C.ink,
                letterSpacing: '-0.01em',
              }}
            >
              {activeProduct.name}
            </div>
          </div>

          {/* SELLING PRICE */}
          <div style={sectionStyle}>
            <div style={{ ...labelStyle, marginBottom: '12px' }}>Selling price</div>

            {/* Stepper */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() =>
                  updateCost('customPrice', String(Math.max(0.5, currentPrice - 1)))
                }
                className="transition-all"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: C.cream,
                  border: `1.5px solid ${C.borderInput}`,
                  color: C.negative,
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  fontFamily: 'inherit',
                }}
              >
                −$1
              </button>

              <div className="flex-1 text-center">
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: C.ink,
                    lineHeight: 1,
                  }}
                >
                  ${currentPrice.toFixed(2)}
                </div>
                {priceChanged && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: C.inkFaint,
                      marginTop: '4px',
                    }}
                  >
                    was ${activeProduct.price.toFixed(2)} ·{' '}
                    <button
                      onClick={() => updateCost('customPrice', undefined)}
                      style={{
                        color: C.amberAccent,
                        fontWeight: 700,
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '11px',
                      }}
                    >
                      reset
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => updateCost('customPrice', String(currentPrice + 1))}
                className="transition-all"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: C.cream,
                  border: `1.5px solid ${C.borderInput}`,
                  color: C.positive,
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  fontFamily: 'inherit',
                }}
              >
                +$1
              </button>
            </div>

            {/* Or set directly */}
            <div className="flex items-center gap-2 mt-2.5">
              <span style={{ fontSize: '12px', color: C.inkFaint }}>Or set to</span>
              <div className="relative">
                <span
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: C.inkGhost,
                    fontSize: '13px',
                    pointerEvents: 'none',
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.50"
                  placeholder={String(activeProduct.price)}
                  value={customPrice !== null && !isNaN(customPrice) ? costs.customPrice : ''}
                  onChange={(e) => updateCost('customPrice', e.target.value)}
                  className="focus:outline-none"
                  style={inputBase}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.ink;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.borderInput;
                  }}
                />
              </div>
            </div>

            {/* Price-change tip */}
            {priceChanged && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  backgroundColor: C.tipBg,
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: C.tipInk,
                  lineHeight: 1.5,
                }}
              >
                {customPrice > activeProduct.price
                  ? 'Higher price means more profit per sale, but some people might not buy if it is too expensive.'
                  : 'Lower price means more people might buy, but you earn less on each one.'}
              </div>
            )}
          </div>

          {/* MY COSTS */}
          <div style={sectionStyle}>
            <div style={{ ...labelStyle, marginBottom: '12px' }}>My costs</div>

            {/* Supplies row */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                style={{
                  width: '68px',
                  fontSize: '12px',
                  color: C.inkMuted,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                Supplies
              </div>
              <div className="relative">
                <span
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: C.inkGhost,
                    fontSize: '13px',
                    pointerEvents: 'none',
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.25"
                  placeholder="0.00"
                  value={costs.materials || ''}
                  onChange={(e) => updateCost('materials', e.target.value)}
                  className="focus:outline-none"
                  style={inputBase}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                />
              </div>
            </div>

            {/* Time row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div
                style={{
                  width: '68px',
                  fontSize: '12px',
                  color: C.inkMuted,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                Time
              </div>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="5"
                placeholder="min"
                value={costs.minutes || ''}
                onChange={(e) => updateCost('minutes', e.target.value)}
                className="focus:outline-none"
                style={{
                  ...inputBase,
                  padding: '8px 10px',
                  width: '70px',
                  textAlign: 'center',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
              />
              <span style={{ fontSize: '12px', color: C.inkFaint }}>min @</span>
              <div className="relative">
                <span
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: C.inkGhost,
                    fontSize: '13px',
                    pointerEvents: 'none',
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={costs.hourlyRate || ''}
                  onChange={(e) => updateCost('hourlyRate', e.target.value)}
                  className="focus:outline-none"
                  style={{ ...inputBase, width: '70px' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                />
              </div>
              <span style={{ fontSize: '12px', color: C.inkFaint }}>/hr</span>
            </div>
          </div>

          {/* PROFIT RESULT (conditional — only if costs entered) */}
          {hasCost && (
            <div
              style={{
                padding: '22px',
                backgroundColor: C.creamCool,
                borderBottom: `1px solid ${C.borderFaint}`,
              }}
            >
              {/* Breakdown */}
              <div
                className="flex justify-between items-center mb-2"
                style={{ fontSize: '12px', color: C.inkMuted }}
              >
                <span>
                  Supplies ${materials.toFixed(2)}
                  {timeCost > 0 ? ` + Time $${timeCost.toFixed(2)}` : ''}
                </span>
                <span style={{ fontWeight: 800, color: C.ink }}>
                  Cost: ${totalCost.toFixed(2)}
                </span>
              </div>

              {/* Big profit number + bar */}
              <div className="flex items-center gap-3.5">
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: profit > 0 ? C.positive : C.negative,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {profit > 0 ? '+' : ''}${profit.toFixed(2)} profit
                </div>
                <div
                  className="flex-1"
                  style={{
                    height: '10px',
                    backgroundColor: C.cream,
                    borderRadius: '999px',
                    overflow: 'hidden',
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(0, Math.min(margin, 100))}%`,
                      backgroundColor:
                        margin >= 50
                          ? '#6EE7B7'
                          : margin >= 25
                          ? '#FCD34D'
                          : '#FCA5A5',
                      borderRadius: '999px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              {/* Coaching text */}
              {profit <= 0 && (
                <div
                  style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: C.coachRed,
                    fontWeight: 600,
                  }}
                >
                  You are losing money. Raise your price or lower your costs.
                </div>
              )}
              {profit > 0 && margin < 30 && (
                <div
                  style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: C.coachAmber,
                    fontWeight: 600,
                  }}
                >
                  You are not keeping much. Try raising your price a little.
                </div>
              )}
              {profit > 0 && margin >= 60 && (
                <div
                  style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: C.coachGreen,
                    fontWeight: 600,
                  }}
                >
                  Great. You are keeping most of what you earn.
                </div>
              )}
            </div>
          )}

          {/* GOAL CALCULATOR (conditional — only if profit is positive) */}
          {hasCost && profit > 0 && (
            <div style={{ ...sectionStyle, borderBottom: 'none' }}>
              <div style={{ ...labelStyle, marginBottom: '12px' }}>I want to earn</div>

              {/* Preset pills + custom */}
              <div className="flex gap-2 flex-wrap items-center">
                {[25, 50, 100].map((g) => {
                  const isActive = costs.goal === String(g);
                  return (
                    <button
                      key={g}
                      onClick={() => updateCost('goal', String(g))}
                      className="transition-all"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        backgroundColor: isActive ? C.ink : C.cream,
                        color: isActive ? C.amberBtn : C.ink,
                        border: `1.5px solid ${isActive ? C.ink : C.borderInput}`,
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      ${g}
                    </button>
                  );
                })}
                <div className="relative">
                  <span
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: C.inkGhost,
                      fontSize: '13px',
                      pointerEvents: 'none',
                    }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="10"
                    placeholder="Other"
                    value={!['25', '50', '100'].includes(costs.goal) ? (costs.goal || '') : ''}
                    onChange={(e) => updateCost('goal', e.target.value)}
                    className="focus:outline-none"
                    style={{ ...inputBase, width: '90px' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                  />
                </div>
              </div>

              {/* Result card */}
              {unitsNeeded > 0 && (
                <div
                  className="mt-4"
                  style={{
                    padding: '18px',
                    backgroundColor: C.amberBtn,
                    border: `1.5px solid ${C.ink}`,
                    borderRadius: '14px',
                    textAlign: 'center',
                    boxShadow: `2px 2px 0 ${C.ink}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: '40px',
                      fontWeight: 800,
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      color: C.ink,
                    }}
                  >
                    {unitsNeeded}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: C.inkMuted,
                      fontWeight: 600,
                      marginTop: '4px',
                    }}
                  >
                    {unitsNeeded === 1 ? 'sale' : 'sales'} to reach ${goal}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

