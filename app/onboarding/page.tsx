// @ts-nocheck
// FILE: app/onboarding/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar, Logo, Confetti, stickerSets } from '../components';
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
  borderInput: '#1C19172B',
  amberAccent: '#D97706',
  amberBtn: '#FCD34D',
  amberInputBg: '#FEF3C7',
  success: '#059669',
  successBg: '#D1FAE5',
  tipBg: '#EDE9FE',
  tipInk: '#4C1D95',
};

const font = {
  sans: "'Poppins', sans-serif",
  brand: "'DynaPuff', cursive", // ONLY for "Lemonade Stand" brand moments
};

// ====================== KID COLOR PALETTE MAP ======================
// Mirrors the editor + store page so previews render accurately.
function getKidColors(colorKey) {
  const palettes = {
    amber:  { tint: '#FEF3C7', accent: '#F59E0B', deep: '#92400E' },
    blue:   { tint: '#EFF6FF', accent: '#3B82F6', deep: '#1E3A8A' },
    green:  { tint: '#ECFDF5', accent: '#10B981', deep: '#065F46' },
    pink:   { tint: '#FDF2F8', accent: '#EC4899', deep: '#9D174D' },
    purple: { tint: '#F5F3FF', accent: '#8B5CF6', deep: '#5B21B6' },
    orange: { tint: '#FFF7ED', accent: '#F97316', deep: '#9A3412' },
  };
  return palettes[colorKey] || palettes.amber;
}

// ====================== OPTION CONSTANTS ======================
const FONT_OPTS = [
  { name: 'Poppins',      value: 'Poppins',      family: "'Poppins', sans-serif" },
  { name: 'Montserrat',   value: 'Montserrat',   family: "'Montserrat', sans-serif" },
  { name: 'Pacifico',     value: 'Pacifico',     family: "'Pacifico', cursive" },
  { name: 'Sour Gummy',   value: 'Sour Gummy',   family: "'Sour Gummy', cursive" },
  { name: 'DynaPuff',     value: 'DynaPuff',     family: "'DynaPuff', cursive" },
  { name: 'Delius',       value: 'Delius',       family: "'Delius', cursive" },
  { name: 'Emilys Candy', value: 'Emilys Candy', family: "'Emilys Candy', cursive" },
  { name: 'Unica One',    value: 'Unica One',    family: "'Unica One', sans-serif" },
  { name: 'Ultra',        value: 'Ultra',        family: "'Ultra', serif" },
  { name: 'Quantico',     value: 'Quantico',     family: "'Quantico', sans-serif" },
];

const COLOR_OPTIONS = [
  { name: 'Sunshine',  value: 'amber',  swatch: '#F59E0B' },
  { name: 'Ocean',     value: 'blue',   swatch: '#3B82F6' },
  { name: 'Forest',    value: 'green',  swatch: '#10B981' },
  { name: 'Bubblegum', value: 'pink',   swatch: '#EC4899' },
  { name: 'Grape',     value: 'purple', swatch: '#8B5CF6' },
  { name: 'Tangerine', value: 'orange', swatch: '#F97316' },
];

const EMOJI_OPTIONS = ['🎁', '🧸', '🎨', '🍪', '💎', '🌸', '⭐', '🦋', '📿', '🧁', '🌱', '🐾'];

// ====================== COMPONENT ======================
export default function OnboardingPage() {
  const router = useRouter();
  const { store, theme: storeTheme, updateTheme, updateStore, addProduct: addProductToDb, loading } = useApp();

  const [step, setStep] = useState(1);
  const [showComplete, setShowComplete] = useState(false);

  // Design choices
  const [color, setColor] = useState(storeTheme?.color || 'amber');
  const [sticker, setSticker] = useState(storeTheme?.sticker || '🌈');
  const [headerFont, setHeaderFont] = useState(storeTheme?.header_font || 'Poppins');
  const [bodyFont, setBodyFont] = useState(storeTheme?.body_font || 'Poppins');
  const [bio, setBio] = useState(store?.bio || '');

  // First product
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productEmoji, setProductEmoji] = useState('🎁');

  const [stickerTab, setStickerTab] = useState('popular');

  const kidName = store?.kid_name || 'Kid';
  const storeName = store?.store_name || 'My Store';
  const totalSteps = 6;

  // ====================== ACTIONS ======================
  async function saveDesign() {
    await updateTheme({
      color,
      sticker,
      header_font: headerFont,
      body_font: bodyFont,
    });
    if (bio) await updateStore({ bio });
  }

  async function saveProduct() {
    if (!productName || !productPrice) return;
    await addProductToDb({
      name: productName,
      price: parseFloat(productPrice),
      description: productDesc,
      emoji: productEmoji,
      in_stock: true,
      status: 'pending_review',
    });
  }

  async function handleComplete() {
    await saveDesign();
    if (productName && productPrice) await saveProduct();
    setShowComplete(true);
  }

  // ====================== EARLY STATES ======================
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

  if (!store) {
    router.push('/setup');
    return null;
  }

  // Color palette for current selection (used in completion preview)
  const kidColors = getKidColors(color);

  // ====================== COMPLETION SCREEN ======================
  if (showComplete) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
      >
        <Confetti />
        <NavBar active="biz" />

        <main className="max-w-md mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-16 text-center">
          <p
            className="text-xs uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: C.amberAccent }}
          >
            Your store is ready
          </p>
          <h1
            className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02]"
            style={{ fontWeight: 800, color: C.ink }}
          >
            Let's <span style={{ color: C.amberAccent }}>show the world.</span>
          </h1>
          <p
            className="mt-4 leading-relaxed"
            style={{ fontSize: '15px', color: C.inkMuted }}
          >
            {storeName} is looking great, {kidName}.
          </p>

          {/* Mini store preview — uses kid's chosen color/font/sticker/bio */}
          <div
            className="mt-8 mx-auto relative overflow-hidden"
            style={{
              backgroundColor: kidColors.tint,
              border: `1.5px solid ${C.ink}`,
              borderRadius: '20px',
              boxShadow: `3px 3px 0 ${C.ink}`,
              padding: '28px 22px',
              maxWidth: '380px',
            }}
          >
            <div style={{ fontSize: '52px', lineHeight: 1, marginBottom: '8px' }}>
              {sticker}
            </div>
            <h2
              style={{
                fontFamily: FONT_OPTS.find((f) => f.value === headerFont)?.family || font.sans,
                fontSize: '28px',
                fontWeight: 700,
                color: kidColors.deep,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              {storeName}
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: C.inkMuted,
                marginTop: '4px',
                fontFamily: FONT_OPTS.find((f) => f.value === bodyFont)?.family || font.sans,
              }}
            >
              by {kidName}
            </p>
            {bio && (
              <p
                style={{
                  fontSize: '13px',
                  color: C.inkMuted,
                  fontStyle: 'italic',
                  marginTop: '10px',
                  lineHeight: 1.45,
                  fontFamily: FONT_OPTS.find((f) => f.value === bodyFont)?.family || font.sans,
                }}
              >
                "{bio}"
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={() => router.push(`/store/${store.id}`)}
              className="w-full transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: C.amberBtn,
                color: C.ink,
                border: `1.5px solid ${C.ink}`,
                boxShadow: `3px 3px 0 ${C.ink}`,
                borderRadius: '14px',
                padding: '15px',
                fontWeight: 800,
                fontSize: '16px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '-0.005em',
              }}
            >
              Visit my store →
            </button>
            <button
              onClick={() => router.push('/editor')}
              className="w-full transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: C.inkMuted,
                border: `1.5px solid ${C.borderInput}`,
                borderRadius: '14px',
                padding: '13px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Keep customizing
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ====================== WIZARD CHROME ======================
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      <NavBar active="" />

      {/* Wizard sub-header — small chunky pill showing whose turn it is */}
      <div className="max-w-xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between gap-3">
        <p
          className="text-xs uppercase tracking-[0.25em] font-bold"
          style={{ color: C.amberAccent }}
        >
          Build your store
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: C.cardBg,
            border: `1px solid ${C.border}`,
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 700,
            color: C.ink,
            boxShadow: `1px 1px 0 ${C.ink}14`,
          }}
        >
          {kidName}'s turn
        </div>
      </div>

      {/* Progress dots */}
      <div className="max-w-xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                height: '6px',
                borderRadius: '999px',
                transition: 'all 0.3s',
                width: i === step - 1 ? '32px' : i < step - 1 ? '24px' : '16px',
                backgroundColor: i === step - 1 ? C.ink : i < step - 1 ? C.amberAccent : C.borderInput,
              }}
            />
          ))}
        </div>
        <p
          className="text-center mt-3"
          style={{
            fontSize: '11px',
            color: C.inkFaint,
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          Step {step} of {totalSteps}
        </p>
      </div>

      <main className="max-w-xl mx-auto px-4 pb-20">

        {/* ===================== STEP 1: COLOR ===================== */}
        {step === 1 && (
          <div className="text-center animate-fadeIn">
            <h1
              className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Pick your <span style={{ color: C.amberAccent }}>store color.</span>
            </h1>
            <p
              className="mt-3"
              style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
            >
              This sets the vibe for your whole store.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-8 max-w-sm mx-auto">
              {COLOR_OPTIONS.map((c) => {
                const isActive = color === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className="transition-all"
                    style={{
                      padding: '14px 12px',
                      borderRadius: '16px',
                      border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                      boxShadow: isActive ? `3px 3px 0 ${C.ink}` : 'none',
                      transform: isActive ? 'translate(-1px, -1px)' : 'none',
                      backgroundColor: C.cardBg,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '52px',
                        borderRadius: '10px',
                        backgroundColor: c.swatch,
                        border: `1.5px solid ${C.ink}`,
                        marginBottom: '8px',
                      }}
                    />
                    <div style={{ fontSize: '12px', fontWeight: 700, color: C.ink }}>
                      {c.name}
                    </div>
                  </button>
                );
              })}
            </div>

            <NavButtons step={step} setStep={setStep} totalSteps={totalSteps} />
          </div>
        )}

        {/* ===================== STEP 2: STICKER ===================== */}
        {step === 2 && (
          <div className="text-center animate-fadeIn">
            <h1
              className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Choose your <span style={{ color: C.amberAccent }}>sticker.</span>
            </h1>
            <p
              className="mt-3"
              style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
            >
              This shows up at the top of your store.
            </p>

            {/* Category tabs */}
            <div className="flex gap-1.5 justify-center flex-wrap mt-6 mb-4">
              {['popular', 'faces', 'animals', 'food', 'nature', 'sports'].map((cat) => {
                const isActive = stickerTab === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setStickerTab(cat)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isActive ? C.amberBtn : C.inkFaint,
                      backgroundColor: isActive ? C.ink : C.cardBg,
                      border: `1px solid ${isActive ? C.ink : C.border}`,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textTransform: 'capitalize',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sticker grid */}
            <div className="flex flex-wrap gap-2 justify-center max-w-sm mx-auto">
              {(stickerSets[stickerTab] || stickerSets.popular).map((s) => {
                const isActive = sticker === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSticker(s)}
                    className="transition-all"
                    style={{
                      width: '52px',
                      height: '52px',
                      fontSize: '26px',
                      borderRadius: '12px',
                      border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                      boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                      transform: isActive ? 'translate(-1px, -1px)' : 'none',
                      backgroundColor: isActive ? C.amberBtn : C.cardBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Live confirmation */}
            {sticker && (
              <div className="mt-8 animate-fadeIn">
                <div style={{ fontSize: '60px', lineHeight: 1 }}>{sticker}</div>
                <p
                  style={{
                    fontSize: '13px',
                    color: C.amberAccent,
                    fontWeight: 800,
                    marginTop: '8px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Great pick!
                </p>
              </div>
            )}

            <NavButtons step={step} setStep={setStep} totalSteps={totalSteps} />
          </div>
        )}

        {/* ===================== STEP 3: FONTS ===================== */}
        {step === 3 && (
          <div className="text-center animate-fadeIn">
            <h1
              className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Pick your <span style={{ color: C.amberAccent }}>fonts.</span>
            </h1>
            <p
              className="mt-3"
              style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
            >
              Two fonts. One for personality, one for reading.
            </p>

            {/* Headline font */}
            <div className="mt-8 text-left">
              <div
                className="mb-2"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.amberAccent,
                  fontWeight: 800,
                  paddingLeft: '4px',
                }}
              >
                Headline font
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: C.inkFaint,
                  marginBottom: '12px',
                  paddingLeft: '4px',
                  lineHeight: 1.5,
                }}
              >
                Where you show off your personality. Go bold, go fun.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTS.map((f) => {
                  const isActive = headerFont === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => setHeaderFont(f.value)}
                      className="transition-all"
                      style={{
                        padding: '12px 8px',
                        borderRadius: '12px',
                        border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                        boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                        transform: isActive ? 'translate(-1px, -1px)' : 'none',
                        backgroundColor: isActive ? C.amberBtn : C.cardBg,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: f.family,
                          fontSize: '17px',
                          marginBottom: '2px',
                          color: C.ink,
                        }}
                      >
                        {storeName}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: C.inkFaint,
                          fontWeight: 600,
                        }}
                      >
                        {f.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description font */}
            <div className="mt-6 text-left">
              <div
                className="mb-2"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.amberAccent,
                  fontWeight: 800,
                  paddingLeft: '4px',
                }}
              >
                Description font
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: C.inkFaint,
                  marginBottom: '12px',
                  paddingLeft: '4px',
                  lineHeight: 1.5,
                }}
              >
                For descriptions and details. Pick something easy to read.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTS.map((f) => {
                  const isActive = bodyFont === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => setBodyFont(f.value)}
                      className="transition-all"
                      style={{
                        padding: '12px 8px',
                        borderRadius: '12px',
                        border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                        boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                        transform: isActive ? 'translate(-1px, -1px)' : 'none',
                        backgroundColor: isActive ? C.amberBtn : C.cardBg,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: f.family,
                          fontSize: '13px',
                          marginBottom: '2px',
                          color: C.ink,
                        }}
                      >
                        Handmade with love by {kidName}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: C.inkFaint,
                          fontWeight: 600,
                        }}
                      >
                        {f.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <NavButtons step={step} setStep={setStep} totalSteps={totalSteps} />
          </div>
        )}

        {/* ===================== STEP 4: BIO ===================== */}
        {step === 4 && (
          <div className="text-center animate-fadeIn">
            <h1
              className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Tell people <span style={{ color: C.amberAccent }}>about your store.</span>
            </h1>
            <p
              className="mt-3"
              style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
            >
              A few words about what you make and why it's awesome.
            </p>

            <div
              className="mt-8 text-left"
              style={{
                backgroundColor: C.cardBg,
                border: `1px solid ${C.border}`,
                borderRadius: '16px',
                padding: '16px 18px',
                boxShadow: `2px 2px 0 ${C.ink}12`,
              }}
            >
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 150))}
                placeholder={`Hi! I'm ${kidName} and I love making things by hand...`}
                rows={4}
                className="focus:outline-none"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${C.borderInput}`,
                  backgroundColor: C.cream,
                  fontSize: '15px',
                  fontWeight: 500,
                  color: C.ink,
                  fontFamily: 'inherit',
                  resize: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
              />
              <div
                style={{
                  textAlign: 'right',
                  fontSize: '11px',
                  color: C.inkFaint,
                  marginTop: '6px',
                  fontWeight: 600,
                }}
              >
                {bio.length}/150
              </div>
            </div>

            {bio && (
              <div
                className="mt-4 animate-fadeIn"
                style={{
                  backgroundColor: kidColors.tint,
                  border: `1px solid ${C.border}`,
                  borderRadius: '14px',
                  padding: '16px',
                }}
              >
                <p
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: C.amberAccent,
                    fontWeight: 800,
                    marginBottom: '6px',
                  }}
                >
                  Preview
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: C.ink,
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                  }}
                >
                  "{bio}"
                </p>
              </div>
            )}

            <NavButtons step={step} setStep={setStep} totalSteps={totalSteps} />
          </div>
        )}

        {/* ===================== STEP 5: FIRST PRODUCT ===================== */}
        {step === 5 && (
          <div className="text-center animate-fadeIn">
            <h1
              className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Add your <span style={{ color: C.amberAccent }}>first product.</span>
            </h1>
            <p
              className="mt-3"
              style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
            >
              The exciting part. What do you want to sell?
            </p>

            <div
              className="mt-8 text-left space-y-4"
              style={{
                backgroundColor: C.cardBg,
                border: `1px solid ${C.border}`,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: `2px 2px 0 ${C.ink}12`,
              }}
            >
              {/* Name */}
              <div>
                <label style={fieldLabelStyle}>What's it called?</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Friendship Bracelet"
                  className="focus:outline-none"
                  style={fieldInputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                />
              </div>

              {/* Price */}
              <div>
                <label style={fieldLabelStyle}>How much does it cost?</label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: C.inkGhost,
                      fontSize: '15px',
                      pointerEvents: 'none',
                      fontWeight: 700,
                    }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00"
                    className="focus:outline-none"
                    style={{ ...fieldInputStyle, paddingLeft: '28px' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={fieldLabelStyle}>Tell customers about it</label>
                <textarea
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Handmade with love..."
                  rows={2}
                  className="focus:outline-none"
                  style={{ ...fieldInputStyle, resize: 'none' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                />
              </div>

              {/* Emoji picker */}
              <div>
                <label style={fieldLabelStyle}>Pick an emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {EMOJI_OPTIONS.map((e) => {
                    const isActive = productEmoji === e;
                    return (
                      <button
                        key={e}
                        onClick={() => setProductEmoji(e)}
                        className="transition-all"
                        style={{
                          width: '44px',
                          height: '44px',
                          fontSize: '20px',
                          borderRadius: '10px',
                          border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                          boxShadow: isActive ? `1px 1px 0 ${C.ink}` : 'none',
                          transform: isActive ? 'translate(-1px, -1px)' : 'none',
                          backgroundColor: isActive ? C.amberBtn : C.cream,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {e}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live preview */}
            {productName && productPrice && (
              <div
                className="mt-4 animate-fadeIn"
                style={{
                  backgroundColor: C.cardBg,
                  border: `1.5px solid ${C.ink}`,
                  borderRadius: '14px',
                  padding: '14px 16px',
                  boxShadow: `2px 2px 0 ${C.ink}`,
                }}
              >
                <p
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: C.amberAccent,
                    fontWeight: 800,
                    marginBottom: '10px',
                    textAlign: 'left',
                  }}
                >
                  Product preview
                </p>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      backgroundColor: kidColors.tint,
                      border: `1px solid ${C.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    {productEmoji}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: C.ink,
                        marginBottom: '2px',
                      }}
                    >
                      {productName}
                    </p>
                    {productDesc && (
                      <p
                        style={{
                          fontSize: '12px',
                          color: C.inkFaint,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {productDesc}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 800,
                      color: kidColors.deep,
                      flexShrink: 0,
                    }}
                  >
                    ${productPrice}
                  </div>
                </div>
              </div>
            )}

            <p
              className="mt-4"
              style={{ fontSize: '12px', color: C.inkFaint, fontWeight: 500 }}
            >
              Your parent will review it before it goes live.
            </p>

            <NavButtons
              step={step}
              setStep={setStep}
              totalSteps={totalSteps}
              nextDisabled={!productName || !productPrice}
            />
          </div>
        )}

        {/* ===================== STEP 6: REVIEW & LAUNCH ===================== */}
        {step === 6 && (
          <div className="text-center animate-fadeIn">
            <h1
              className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Your store is <span style={{ color: C.amberAccent }}>looking amazing.</span>
            </h1>
            <p
              className="mt-3"
              style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
            >
              Here's what you built.
            </p>

            {/* Store preview — kid's chosen everything */}
            <div
              className="mt-8 mx-auto"
              style={{
                backgroundColor: kidColors.tint,
                border: `1.5px solid ${C.ink}`,
                borderRadius: '20px',
                boxShadow: `3px 3px 0 ${C.ink}`,
                padding: '32px 22px',
                maxWidth: '420px',
              }}
            >
              <div style={{ fontSize: '56px', lineHeight: 1, marginBottom: '8px' }}>
                {sticker}
              </div>
              <h2
                style={{
                  fontFamily: FONT_OPTS.find((f) => f.value === headerFont)?.family || font.sans,
                  fontSize: '30px',
                  fontWeight: 700,
                  color: kidColors.deep,
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                {storeName}
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: C.inkMuted,
                  marginTop: '4px',
                  fontFamily: FONT_OPTS.find((f) => f.value === bodyFont)?.family || font.sans,
                }}
              >
                by {kidName}
              </p>
              {bio && (
                <p
                  style={{
                    fontSize: '13px',
                    color: C.inkMuted,
                    fontStyle: 'italic',
                    marginTop: '10px',
                    lineHeight: 1.45,
                    fontFamily: FONT_OPTS.find((f) => f.value === bodyFont)?.family || font.sans,
                  }}
                >
                  "{bio}"
                </p>
              )}
            </div>

            {/* Product preview */}
            {productName && productPrice && (
              <div
                className="mt-3 mx-auto"
                style={{
                  backgroundColor: C.cardBg,
                  border: `1.5px solid ${C.ink}`,
                  borderRadius: '14px',
                  padding: '14px 16px',
                  boxShadow: `2px 2px 0 ${C.ink}`,
                  maxWidth: '420px',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      backgroundColor: kidColors.tint,
                      border: `1px solid ${C.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    {productEmoji}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: C.ink,
                        marginBottom: '2px',
                      }}
                    >
                      {productName}
                    </p>
                    {productDesc && (
                      <p
                        style={{
                          fontSize: '12px',
                          color: C.inkFaint,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {productDesc}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 800,
                      color: kidColors.deep,
                      flexShrink: 0,
                    }}
                  >
                    ${productPrice}
                  </div>
                </div>
              </div>
            )}

            {/* Parent approval reminder — text-only, no emoji */}
            {productName && productPrice && (
              <div
                className="mt-4 animate-fadeIn"
                style={{
                  backgroundColor: C.tipBg,
                  border: `1px solid #C4B5FD`,
                  borderRadius: '14px',
                  padding: '14px 16px',
                  textAlign: 'left',
                  maxWidth: '420px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: C.tipInk,
                    fontWeight: 800,
                    marginBottom: '4px',
                  }}
                >
                  One more step
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: C.tipInk,
                    lineHeight: 1.5,
                  }}
                >
                  Ask your parent to approve your product on the parent dashboard. It won't show up in your store until they say it's good to go.
                </p>
              </div>
            )}

            {/* Final actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
              <button
                onClick={() => setStep(5)}
                style={{
                  padding: '14px 20px',
                  borderRadius: '14px',
                  border: `1.5px solid ${C.borderInput}`,
                  backgroundColor: 'transparent',
                  color: C.inkMuted,
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  flexShrink: 0,
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                className="transition-all hover:-translate-y-0.5"
                style={{
                  flex: 1,
                  backgroundColor: C.amberBtn,
                  color: C.ink,
                  border: `1.5px solid ${C.ink}`,
                  boxShadow: `3px 3px 0 ${C.ink}`,
                  borderRadius: '14px',
                  padding: '15px',
                  fontWeight: 800,
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.005em',
                }}
              >
                Show me my store →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// =====================================================================
// NAV BUTTONS — back / next / skip-for-now (used on every step except 6)
// =====================================================================
function NavButtons({ step, setStep, totalSteps, nextDisabled = false }) {
  return (
    <>
      <div className="flex gap-3 mt-10 max-w-md mx-auto">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              padding: '14px 20px',
              borderRadius: '14px',
              border: `1.5px solid ${C.borderInput}`,
              backgroundColor: 'transparent',
              color: C.inkMuted,
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={() => setStep(step + 1)}
          disabled={nextDisabled}
          className="transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{
            flex: 1,
            backgroundColor: C.amberBtn,
            color: C.ink,
            border: `1.5px solid ${C.ink}`,
            boxShadow: `3px 3px 0 ${C.ink}`,
            borderRadius: '14px',
            padding: '15px',
            fontWeight: 800,
            fontSize: '15px',
            cursor: nextDisabled ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '-0.005em',
          }}
        >
          Next →
        </button>
      </div>
      <button
        onClick={() => setStep(step + 1)}
        style={{
          fontSize: '12px',
          color: C.inkFaint,
          marginTop: '14px',
          background: 'transparent',
          border: 'none',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
        }}
      >
        Skip for now
      </button>
    </>
  );
}

// ====================== SHARED FIELD STYLES ======================
const fieldLabelStyle = {
  display: 'block',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: C.amberAccent,
  fontWeight: 800,
  marginBottom: '8px',
  paddingLeft: '4px',
};

const fieldInputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: `1.5px solid ${C.borderInput}`,
  backgroundColor: C.cream,
  fontSize: '15px',
  fontWeight: 500,
  color: C.ink,
  fontFamily: 'inherit',
};
