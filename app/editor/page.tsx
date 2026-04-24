// @ts-nocheck
// FILE: app/editor/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar, LearnTip, getPatternStyle, stickerSets } from '../components';
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
  danger: '#DC2626',
  tipBg: '#EDE9FE',
  tipInk: '#4C1D95',
};

const font = {
  sans: "'Poppins', sans-serif",
};

// ====================== KID COLOR PALETTE MAP ======================
// Mirrors the store page so preview renders accurately.
function getKidColors(colorKey) {
  const palettes = {
    amber:  { tint: '#FEF3C7', accent: '#F59E0B', deep: '#92400E', accentContrast: '#1C1917' },
    blue:   { tint: '#EFF6FF', accent: '#3B82F6', deep: '#1E3A8A', accentContrast: '#FFFFFF' },
    green:  { tint: '#ECFDF5', accent: '#10B981', deep: '#065F46', accentContrast: '#FFFFFF' },
    pink:   { tint: '#FDF2F8', accent: '#EC4899', deep: '#9D174D', accentContrast: '#FFFFFF' },
    purple: { tint: '#F5F3FF', accent: '#8B5CF6', deep: '#5B21B6', accentContrast: '#FFFFFF' },
    orange: { tint: '#FFF7ED', accent: '#F97316', deep: '#9A3412', accentContrast: '#FFFFFF' },
  };
  return palettes[colorKey] || palettes.amber;
}

// ====================== SECTION STRUCTURE ======================
// The editor is organized into 3 sections. Each owns a subset of the
// draftTheme fields and saves independently.
const SECTIONS = [
  { id: 'vibe',     label: 'Vibe',     desc: 'How it looks' },
  { id: 'voice',    label: 'Voice',    desc: 'How it reads' },
  { id: 'products', label: 'Products', desc: 'What you sell' },
];

// Color options — the 6 available theme colors.
const COLOR_OPTIONS = [
  { name: 'Sunshine',  value: 'amber',  swatch: '#F59E0B' },
  { name: 'Ocean',     value: 'blue',   swatch: '#3B82F6' },
  { name: 'Forest',    value: 'green',  swatch: '#10B981' },
  { name: 'Bubblegum', value: 'pink',   swatch: '#EC4899' },
  { name: 'Grape',     value: 'purple', swatch: '#8B5CF6' },
  { name: 'Tangerine', value: 'orange', swatch: '#F97316' },
];

// Font options — the kid-selectable fonts for header / body / card.
const FONT_OPTIONS = [
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

// Pattern options — the available background patterns.
const PATTERN_OPTIONS = [
  { name: 'None',     value: 'none' },
  { name: 'Hearts',   value: 'hearts' },
  { name: 'Stars',    value: 'stars' },
  { name: 'Smileys',  value: 'smileys' },
  { name: 'Stripes',  value: 'stripes' },
  { name: 'Confetti', value: 'confetti' },
  { name: 'Spirals',  value: 'spirals' },
  { name: 'Poop',     value: 'poop' },
];

const LAYOUT_OPTIONS = [
  { name: 'Grid',     value: 'grid' },
  { name: 'List',     value: 'list' },
  { name: 'Featured', value: 'featured' },
];

const EMOJI_OPTIONS = ['🎁', '🧸', '🎨', '🍪', '💎', '🌸', '⭐', '🦋'];

// ====================== EDITOR COMPONENT ======================
export default function EditorPage() {
  const router = useRouter();
  const {
    loading,
    store: storeData,
    products,
    addProduct: addProductToDb,
    updateProduct,
    deleteProduct,
    reorderProducts,
    theme: storeTheme,
    updateTheme,
    updateStore,
  } = useApp();

  // ---- DRAFT STATE — what the kid is editing before saving ----
  const [draftTheme, setDraftTheme] = useState(() => ({
    color: storeTheme?.color || 'amber',
    sticker: storeTheme?.sticker || '🌈',
    accentStickers: storeTheme?.accent_stickers || [],
    stickerPattern: storeTheme?.sticker_pattern || false,
    pattern: storeTheme?.pattern || 'none',
    bannerImage: storeTheme?.banner_image_url || null,
    headerFont: storeTheme?.header_font || 'Poppins',
    bodyFont: storeTheme?.body_font || 'Poppins',
    cardFont: storeTheme?.card_font || 'Poppins',
    announcement: storeTheme?.announcement || '',
    announcementOn: storeTheme?.announcement_on || false,
    productLayout: storeTheme?.product_layout || 'grid',
  }));
  const [draftBio, setDraftBio] = useState(storeData?.bio || '');

  // When storeTheme/storeData loads, sync into draft
  useEffect(() => {
    if (storeTheme) {
      setDraftTheme({
        color: storeTheme.color || 'amber',
        sticker: storeTheme.sticker || '🌈',
        accentStickers: storeTheme.accent_stickers || [],
        stickerPattern: storeTheme.sticker_pattern || false,
        pattern: storeTheme.pattern || 'none',
        bannerImage: storeTheme.banner_image_url || null,
        headerFont: storeTheme.header_font || 'Poppins',
        bodyFont: storeTheme.body_font || 'Poppins',
        cardFont: storeTheme.card_font || 'Poppins',
        announcement: storeTheme.announcement || '',
        announcementOn: storeTheme.announcement_on || false,
        productLayout: storeTheme.product_layout || 'grid',
      });
    }
    if (storeData?.bio !== undefined) setDraftBio(storeData.bio || '');
  }, [storeTheme, storeData]);

  // ---- UI STATE ----
  const [activeSection, setActiveSection] = useState('vibe');
  const [mobileView, setMobileView] = useState('edit'); // 'edit' | 'preview'
  const [stickerTab, setStickerTab] = useState('popular');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', image: null, usePhoto: false, emoji: '🎁', category: '',
  });

  // Saved indicators per section
  const [savedSection, setSavedSection] = useState(null); // 'vibe' | 'voice' | 'products'

  // ---- REDIRECT IF NO STORE ----
  if (!loading && !storeData) {
    router.push('/setup');
    return null;
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: C.cream, fontFamily: font.sans }}
      >
        <p style={{ color: C.inkFaint, fontSize: '14px' }}>Loading your store…</p>
      </div>
    );
  }

  const kidName = storeData?.kid_name || 'Kid';

  // ---- SAVE HANDLERS (per section) ----
  async function saveVibe() {
    await updateTheme({
      color: draftTheme.color,
      sticker: draftTheme.sticker,
      accent_stickers: draftTheme.accentStickers || [],
      sticker_pattern: draftTheme.stickerPattern || false,
      pattern: draftTheme.pattern || 'none',
      banner_image_url: draftTheme.bannerImage || null,
    });
    flashSaved('vibe');
  }

  async function saveVoice() {
    await updateTheme({
      header_font: draftTheme.headerFont || 'Poppins',
      body_font: draftTheme.bodyFont || 'Poppins',
      announcement: draftTheme.announcement || '',
      announcement_on: draftTheme.announcementOn || false,
    });
    if (draftBio !== (storeData?.bio || '')) {
      await updateStore({ bio: draftBio });
    }
    flashSaved('voice');
  }

  async function saveProductsDesign() {
    await updateTheme({
      card_font: draftTheme.cardFont || 'Poppins',
      product_layout: draftTheme.productLayout || 'grid',
    });
    flashSaved('products');
  }

  function flashSaved(section) {
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2500);
  }

  // ---- PRODUCT HANDLERS ----
  function handleStartEdit(p) {
    setEditingProduct(p.id);
    setNewProduct({
      name: p.name,
      price: String(p.price),
      description: p.description || '',
      image: p.image_url || p.image || null,
      usePhoto: !!(p.image_url || p.image),
      emoji: p.emoji || '🎁',
      category: p.category || 'General',
    });
    setShowAddProduct(true);
  }

  async function handleSaveProduct() {
    if (!newProduct.name || !newProduct.price) return;
    const productData = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      emoji: newProduct.usePhoto ? null : (newProduct.emoji || '🎁'),
      image_url: newProduct.usePhoto ? newProduct.image : null,
      category: newProduct.category || 'General',
    };
    if (editingProduct) {
      await updateProduct(editingProduct, { ...productData, status: 'pending_review' });
      setEditingProduct(null);
    } else {
      await addProductToDb({ ...productData, in_stock: true, status: 'pending_review' });
    }
    setNewProduct({ name: '', price: '', description: '', image: null, usePhoto: false, emoji: '🎁', category: '' });
    setShowAddProduct(false);
  }

  function handleCancelEdit() {
    setEditingProduct(null);
    setNewProduct({ name: '', price: '', description: '', image: null, usePhoto: false, emoji: '🎁', category: '' });
    setShowAddProduct(false);
  }

  function moveProduct(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= products.length) return;
    const updated = [...products];
    const tmp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = tmp;
    reorderProducts(updated);
  }


  // ============================================================
  // RENDER — the big one
  // ============================================================
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      <NavBar active="editor" />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-16">
        {/* ===== HEADER ===== */}
        <div className="mb-5 sm:mb-6">
          <p
            className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
            style={{ color: C.amberAccent }}
          >
            Store editor
          </p>
          <h1
            className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
            style={{ fontWeight: 800, color: C.ink }}
          >
            Make it <span style={{ color: C.amberAccent }}>your own.</span>
          </h1>
          <p className="mt-1" style={{ fontSize: '14px', color: C.inkMuted }}>
            Choose how your store looks and feels to customers.
          </p>
        </div>

        {/* ===== PRESETS TEASER ===== */}
        <div
          className="mb-5 sm:mb-6 flex items-center gap-3 sm:gap-4"
          style={{
            background: 'linear-gradient(135deg, #FCD34D 0%, #FEF3C7 100%)',
            border: `1.5px solid ${C.ink}`,
            borderRadius: '14px',
            padding: '14px 18px',
            boxShadow: `3px 3px 0 ${C.ink}`,
          }}
        >
          <div style={{ fontSize: '28px', lineHeight: 1 }}>✨</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: C.inkFaint,
                fontWeight: 700,
              }}
            >
              Coming soon
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: C.ink,
                marginTop: '2px',
                letterSpacing: '-0.005em',
              }}
            >
              One-tap designs
            </div>
            <div style={{ fontSize: '12px', color: C.inkMuted, marginTop: '2px' }}>
              Pick a ready-made look and tweak from there.
            </div>
          </div>
          <div
            style={{
              backgroundColor: C.ink,
              color: C.amberBtn,
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            Soon
          </div>
        </div>

        {/* ===== MOBILE EDIT/PREVIEW TOGGLE (shown only on mobile) ===== */}
        <div className="sm:hidden mb-4">
          <div
            className="flex gap-1"
            style={{
              padding: '4px',
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              boxShadow: `1px 1px 0 ${C.ink}14`,
            }}
          >
            {['edit', 'preview'].map((v) => {
              const isActive = mobileView === v;
              return (
                <button
                  key={v}
                  onClick={() => setMobileView(v)}
                  className="transition-all"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: isActive ? '8px 11px' : '9px 12px',
                    fontSize: '13px',
                    fontWeight: isActive ? 800 : 700,
                    color: isActive ? C.ink : C.inkFaint,
                    backgroundColor: isActive ? C.amberBtn : 'transparent',
                    border: isActive ? `1px solid ${C.ink}` : '1px solid transparent',
                    borderRadius: '8px',
                    boxShadow: isActive ? `1px 1px 0 ${C.ink}` : 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textTransform: 'capitalize',
                  }}
                >
                  {v === 'edit' ? 'Edit' : 'Preview'}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== TWO-COLUMN LAYOUT ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_380px] lg:grid-cols-[1fr_420px] gap-5 sm:gap-6">

          {/* ================================================
              LEFT — CONTROLS
              Hidden on mobile when preview toggle is active
              ================================================ */}
          <div className={`${mobileView === 'preview' ? 'hidden sm:block' : ''}`}>

            {/* Section tabs — Vibe / Voice / Products */}
            <div
              className="flex gap-1 mb-4"
              style={{
                padding: '4px',
                backgroundColor: C.cardBg,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                boxShadow: `1px 1px 0 ${C.ink}14`,
              }}
            >
              {SECTIONS.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className="transition-all"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: isActive ? '8px 11px' : '9px 12px',
                      fontSize: '13px',
                      fontWeight: isActive ? 800 : 700,
                      color: isActive ? C.ink : C.inkFaint,
                      backgroundColor: isActive ? C.amberBtn : 'transparent',
                      border: isActive ? `1px solid ${C.ink}` : '1px solid transparent',
                      borderRadius: '8px',
                      boxShadow: isActive ? `1px 1px 0 ${C.ink}` : 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* ========== VIBE SECTION ========== */}
            {activeSection === 'vibe' && (
              <div className="space-y-3">
                {/* Color */}
                <ControlGroup label="Color">
                  <div className="grid grid-cols-6 gap-2">
                    {COLOR_OPTIONS.map((c) => {
                      const isActive = draftTheme.color === c.value;
                      return (
                        <button
                          key={c.value}
                          onClick={() => setDraftTheme((prev) => ({ ...prev, color: c.value }))}
                          title={c.name}
                          className="transition-all"
                          style={{
                            aspectRatio: '1',
                            backgroundColor: c.swatch,
                            borderRadius: '10px',
                            border: isActive ? `1.5px solid ${C.ink}` : '1.5px solid transparent',
                            boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                            transform: isActive ? 'translate(-1px, -1px)' : 'none',
                            cursor: 'pointer',
                          }}
                        />
                      );
                    })}
                  </div>
                </ControlGroup>

                {/* Main Sticker */}
                <ControlGroup label="Main sticker">
                  <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {['popular', 'faces', 'animals', 'food', 'nature', 'sports', 'sparkle'].map((cat) => {
                      const isActive = stickerTab === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setStickerTab(cat)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: isActive ? C.amberBtn : C.inkFaint,
                            backgroundColor: isActive ? C.ink : C.cream,
                            border: `1px solid ${isActive ? C.ink : C.border}`,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            flexShrink: 0,
                            textTransform: 'capitalize',
                          }}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-8 gap-1.5">
                    {(stickerSets[stickerTab] || stickerSets.popular).map((s) => {
                      const isActive = draftTheme.sticker === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setDraftTheme((prev) => ({ ...prev, sticker: s }))}
                          style={{
                            aspectRatio: '1',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: isActive ? `1.5px solid ${C.ink}` : '1.5px solid transparent',
                            backgroundColor: isActive ? C.amberBtn : C.cream,
                            boxShadow: isActive ? `1px 1px 0 ${C.ink}` : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.1s',
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </ControlGroup>

                {/* Accent stickers */}
                <ControlGroup label="Accent stickers (up to 5)">
                  <div className="flex gap-1.5 items-center flex-wrap mb-3">
                    {(draftTheme.accentStickers || []).map((s, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setDraftTheme((prev) => ({
                            ...prev,
                            accentStickers: prev.accentStickers.filter((_, idx) => idx !== i),
                          }))
                        }
                        title="Tap to remove"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: `1.5px solid ${C.ink}`,
                          backgroundColor: C.amberBtn,
                          boxShadow: `1px 1px 0 ${C.ink}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          cursor: 'pointer',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                    {(draftTheme.accentStickers || []).length < 5 && (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: `1.5px dashed ${C.ink}40`,
                          backgroundColor: C.cream,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: C.inkGhost,
                          fontSize: '14px',
                          fontWeight: 700,
                        }}
                      >
                        +
                      </div>
                    )}
                    <span style={{ fontSize: '11px', color: C.inkFaint, marginLeft: '4px' }}>
                      {(draftTheme.accentStickers || []).length === 0
                        ? 'Tap stickers below to add'
                        : 'Tap filled to remove'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(stickerSets[stickerTab] || stickerSets.popular).slice(0, 12).map((s) => {
                      const isIncluded = (draftTheme.accentStickers || []).includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() =>
                            setDraftTheme((prev) => {
                              const current = prev.accentStickers || [];
                              if (current.includes(s)) return { ...prev, accentStickers: current.filter((x) => x !== s) };
                              if (current.length >= 5) return prev;
                              return { ...prev, accentStickers: [...current, s] };
                            })
                          }
                          style={{
                            width: '36px',
                            height: '36px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            border: isIncluded ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                            backgroundColor: isIncluded ? C.amberBtn : C.cream,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.1s',
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </ControlGroup>

                {/* Background Pattern */}
                <ControlGroup label="Background">
                  <div className="grid grid-cols-4 gap-1.5">
                    {PATTERN_OPTIONS.map((p) => {
                      const isActive = draftTheme.pattern === p.value;
                      return (
                        <button
                          key={p.value}
                          onClick={() => setDraftTheme((prev) => ({ ...prev, pattern: p.value }))}
                          style={{
                            aspectRatio: '1.3',
                            borderRadius: '10px',
                            border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                            boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                            transform: isActive ? 'translate(-1px, -1px)' : 'none',
                            backgroundColor: C.cream,
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: isActive ? C.ink : C.inkMuted,
                            transition: 'all 0.1s',
                          }}
                        >
                          {p.value !== 'none' && (
                            <div style={{ position: 'absolute', inset: 0, ...getPatternStyle(p.value) }} />
                          )}
                          <span style={{ position: 'relative', backgroundColor: isActive ? 'transparent' : C.cream, padding: '2px 6px', borderRadius: '4px' }}>
                            {p.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </ControlGroup>

                {/* Banner */}
                <ControlGroup label="Banner photo">
                  {draftTheme.bannerImage ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={draftTheme.bannerImage}
                        alt="Banner"
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: `1.5px solid ${C.ink}`,
                        }}
                      />
                      <button
                        onClick={() => setDraftTheme((prev) => ({ ...prev, bannerImage: null }))}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          border: `1.5px solid ${C.ink}`,
                          color: C.ink,
                          fontSize: '16px',
                          fontWeight: 700,
                          lineHeight: 1,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label style={{ display: 'block', cursor: 'pointer' }}>
                      <div
                        style={{
                          border: `1.5px dashed ${C.ink}40`,
                          borderRadius: '10px',
                          padding: '18px',
                          textAlign: 'center',
                          backgroundColor: C.cream,
                        }}
                      >
                        <div style={{ fontSize: '12px', color: C.inkMuted, fontWeight: 700 }}>
                          Tap to upload a photo
                        </div>
                        <div style={{ fontSize: '11px', color: C.inkGhost, marginTop: '2px' }}>
                          Looks best wide and short
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setDraftTheme((prev) => ({ ...prev, bannerImage: reader.result }));
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </ControlGroup>

                <SaveBar
                  sectionLabel="Vibe"
                  isSaved={savedSection === 'vibe'}
                  onSave={saveVibe}
                />
              </div>
            )}


            {/* ========== VOICE SECTION ========== */}
            {activeSection === 'voice' && (
              <div className="space-y-3">
                {/* Store name font */}
                <ControlGroup label="Store name font">
                  <p style={{ fontSize: '11px', color: C.inkFaint, marginBottom: '10px' }}>
                    The font customers see at the top of your store
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FONT_OPTIONS.map((f) => {
                      const isActive = draftTheme.headerFont === f.value;
                      return (
                        <button
                          key={f.value}
                          onClick={() => setDraftTheme((prev) => ({ ...prev, headerFont: f.value }))}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '10px',
                            border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                            boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                            transform: isActive ? 'translate(-1px, -1px)' : 'none',
                            backgroundColor: isActive ? C.amberBtn : C.cream,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.1s',
                          }}
                        >
                          <div style={{ fontFamily: f.family, fontSize: '17px', marginBottom: '2px', color: C.ink }}>
                            {kidName}
                          </div>
                          <div style={{ fontSize: '10px', color: C.inkFaint, fontWeight: 600 }}>
                            {f.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ControlGroup>

                {/* Bio */}
                <ControlGroup label="Store bio">
                  <p style={{ fontSize: '11px', color: C.inkFaint, marginBottom: '10px' }}>
                    Tell people what you make and why it's awesome
                  </p>
                  <textarea
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value.slice(0, 150))}
                    placeholder={`Hi! I'm ${kidName} and I love making things by hand...`}
                    rows={3}
                    className="focus:outline-none"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `1.5px solid ${C.borderInput}`,
                      backgroundColor: C.cream,
                      fontSize: '14px',
                      fontWeight: 500,
                      color: C.ink,
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                  />
                  <div style={{ textAlign: 'right', fontSize: '11px', color: C.inkFaint, marginTop: '4px' }}>
                    {draftBio.length}/150
                  </div>
                </ControlGroup>

                {/* Body font */}
                <ControlGroup label="Bio font">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FONT_OPTIONS.map((f) => {
                      const isActive = draftTheme.bodyFont === f.value;
                      return (
                        <button
                          key={f.value}
                          onClick={() => setDraftTheme((prev) => ({ ...prev, bodyFont: f.value }))}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '10px',
                            border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                            boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                            transform: isActive ? 'translate(-1px, -1px)' : 'none',
                            backgroundColor: isActive ? C.amberBtn : C.cream,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.1s',
                          }}
                        >
                          <div style={{ fontFamily: f.family, fontSize: '13px', marginBottom: '2px', color: C.ink }}>
                            The quick brown fox
                          </div>
                          <div style={{ fontSize: '10px', color: C.inkFaint, fontWeight: 600 }}>
                            {f.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ControlGroup>

                {/* Announcement bar */}
                <ControlGroup
                  label="Announcement bar"
                  rightElement={
                    <button
                      onClick={() =>
                        setDraftTheme((prev) => ({ ...prev, announcementOn: !prev.announcementOn }))
                      }
                      style={{
                        position: 'relative',
                        width: '44px',
                        height: '24px',
                        borderRadius: '999px',
                        backgroundColor: draftTheme.announcementOn ? C.amberBtn : '#D6D3D1',
                        border: `1.5px solid ${C.ink}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '1px',
                          left: draftTheme.announcementOn ? '21px' : '1px',
                          width: '19px',
                          height: '19px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          border: `1px solid ${C.ink}`,
                          transition: 'all 0.2s',
                        }}
                      />
                    </button>
                  }
                >
                  <p style={{ fontSize: '11px', color: C.inkFaint, marginBottom: draftTheme.announcementOn ? '10px' : 0 }}>
                    A message at the top of your store
                  </p>
                  {draftTheme.announcementOn && (
                    <>
                      <input
                        type="text"
                        value={draftTheme.announcement || ''}
                        onChange={(e) =>
                          setDraftTheme((prev) => ({ ...prev, announcement: e.target.value.slice(0, 80) }))
                        }
                        placeholder="Free delivery this week!"
                        className="focus:outline-none"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: `1.5px solid ${C.borderInput}`,
                          backgroundColor: C.cream,
                          fontSize: '14px',
                          fontWeight: 500,
                          color: C.ink,
                          fontFamily: 'inherit',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                      />
                      <div style={{ textAlign: 'right', fontSize: '11px', color: C.inkFaint, marginTop: '4px' }}>
                        {(draftTheme.announcement || '').length}/80
                      </div>
                    </>
                  )}
                </ControlGroup>

                <SaveBar
                  sectionLabel="Voice"
                  isSaved={savedSection === 'voice'}
                  onSave={saveVoice}
                />
              </div>
            )}

            {/* ========== PRODUCTS SECTION ========== */}
            {activeSection === 'products' && (
              <div className="space-y-3">
                <div
                  style={{
                    backgroundColor: C.cardBg,
                    border: `1px solid ${C.border}`,
                    borderRadius: '14px',
                    padding: '16px 18px',
                    boxShadow: `2px 2px 0 ${C.ink}12`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: C.inkFaint,
                          fontWeight: 700,
                          marginBottom: '2px',
                        }}
                      >
                        My products
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: C.ink, letterSpacing: '-0.005em' }}>
                        {products?.length || 0} {(products?.length || 0) === 1 ? 'product' : 'products'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setNewProduct({ name: '', price: '', description: '', image: null, usePhoto: false, emoji: '🎁', category: '' });
                        setShowAddProduct(true);
                      }}
                      className="transition-all hover:-translate-y-0.5"
                      style={{
                        backgroundColor: C.amberBtn,
                        color: C.ink,
                        border: `1.5px solid ${C.ink}`,
                        boxShadow: `2px 2px 0 ${C.ink}`,
                        borderRadius: '10px',
                        padding: '7px 12px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      + Add product
                    </button>
                  </div>

                  {/* Add/edit form (conditional) */}
                  {showAddProduct && (
                    <div
                      style={{
                        backgroundColor: C.cream,
                        border: `1px solid ${C.border}`,
                        borderRadius: '12px',
                        padding: '14px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 800, color: C.ink, marginBottom: '10px' }}>
                        {editingProduct ? 'Edit product' : 'New product'}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Product name"
                          className="focus:outline-none"
                          style={inputBaseStyle}
                          onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                        />
                        <input
                          type="number"
                          inputMode="decimal"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                          placeholder="Price ($)"
                          className="focus:outline-none"
                          style={inputBaseStyle}
                          onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                        />
                        <textarea
                          value={newProduct.description}
                          onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                          placeholder="Tell customers about it"
                          rows={2}
                          className="focus:outline-none"
                          style={{ ...inputBaseStyle, resize: 'none' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                        />

                        {/* Emoji/photo toggle */}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => setNewProduct((p) => ({ ...p, usePhoto: false }))}
                            style={{
                              flex: 1,
                              padding: '8px',
                              borderRadius: '10px',
                              border: !newProduct.usePhoto ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                              boxShadow: !newProduct.usePhoto ? `1px 1px 0 ${C.ink}` : 'none',
                              backgroundColor: !newProduct.usePhoto ? C.amberBtn : C.cardBg,
                              fontSize: '12px',
                              fontWeight: 700,
                              color: C.ink,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            Use emoji
                          </button>
                          <button
                            onClick={() => setNewProduct((p) => ({ ...p, usePhoto: true }))}
                            style={{
                              flex: 1,
                              padding: '8px',
                              borderRadius: '10px',
                              border: newProduct.usePhoto ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                              boxShadow: newProduct.usePhoto ? `1px 1px 0 ${C.ink}` : 'none',
                              backgroundColor: newProduct.usePhoto ? C.amberBtn : C.cardBg,
                              fontSize: '12px',
                              fontWeight: 700,
                              color: C.ink,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            Upload photo
                          </button>
                        </div>

                        {!newProduct.usePhoto ? (
                          <div className="flex gap-1.5 flex-wrap mt-2">
                            {EMOJI_OPTIONS.map((e) => {
                              const isActive = newProduct.emoji === e;
                              return (
                                <button
                                  key={e}
                                  onClick={() => setNewProduct((p) => ({ ...p, emoji: e }))}
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                                    backgroundColor: isActive ? C.amberBtn : 'white',
                                    boxShadow: isActive ? `1px 1px 0 ${C.ink}` : 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {e}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mt-2">
                            {newProduct.image ? (
                              <div style={{ position: 'relative' }}>
                                <img
                                  src={newProduct.image}
                                  alt="Product"
                                  style={{
                                    width: '100%',
                                    height: '96px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    border: `1.5px solid ${C.ink}`,
                                  }}
                                />
                                <button
                                  onClick={() => setNewProduct((p) => ({ ...p, image: null }))}
                                  style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '6px',
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    border: `1.5px solid ${C.ink}`,
                                    color: C.ink,
                                    fontSize: '14px',
                                    lineHeight: 1,
                                    cursor: 'pointer',
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <label style={{ display: 'block', cursor: 'pointer' }}>
                                <div
                                  style={{
                                    border: `1.5px dashed ${C.ink}40`,
                                    borderRadius: '10px',
                                    padding: '16px',
                                    textAlign: 'center',
                                    backgroundColor: 'white',
                                  }}
                                >
                                  <div style={{ fontSize: '12px', color: C.inkMuted, fontWeight: 700 }}>
                                    Tap to upload
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () =>
                                        setNewProduct((p) => ({ ...p, image: reader.result }));
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '10px',
                              border: `1px solid ${C.border}`,
                              backgroundColor: 'white',
                              color: C.inkMuted,
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProduct}
                            disabled={!newProduct.name || !newProduct.price}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '10px',
                              backgroundColor: C.amberBtn,
                              border: `1.5px solid ${C.ink}`,
                              boxShadow: `1px 1px 0 ${C.ink}`,
                              color: C.ink,
                              fontSize: '13px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            {editingProduct ? 'Save changes' : 'Add product'}
                          </button>
                        </div>
                        {editingProduct && (
                          <p style={{ fontSize: '11px', color: C.tipInk, textAlign: 'center', marginTop: '4px' }}>
                            Saving sends this back to your parent for approval.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Product list */}
                  <div className="space-y-2">
                    {(products || []).map((p, index) => (
                      <div
                        key={p.id}
                        style={{
                          padding: '10px',
                          borderRadius: '12px',
                          border: `1px solid ${C.border}`,
                          backgroundColor: p.in_stock === false ? C.cream : 'white',
                          opacity: p.in_stock === false ? 0.7 : 1,
                          transition: 'all 0.15s',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Up/down reorder */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => moveProduct(index, -1)}
                              disabled={index === 0}
                              style={{
                                width: '24px',
                                height: '22px',
                                borderRadius: '6px',
                                backgroundColor: index === 0 ? 'transparent' : C.cream,
                                border: index === 0 ? '1px solid transparent' : `1px solid ${C.border}`,
                                color: index === 0 ? C.inkGhost : C.inkMuted,
                                fontSize: '10px',
                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => moveProduct(index, 1)}
                              disabled={index === products.length - 1}
                              style={{
                                width: '24px',
                                height: '22px',
                                borderRadius: '6px',
                                backgroundColor: index === products.length - 1 ? 'transparent' : C.cream,
                                border: index === products.length - 1 ? '1px solid transparent' : `1px solid ${C.border}`,
                                color: index === products.length - 1 ? C.inkGhost : C.inkMuted,
                                fontSize: '10px',
                                cursor: index === products.length - 1 ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              ▼
                            </button>
                          </div>

                          {/* Thumbnail */}
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '10px',
                              backgroundColor: C.cream,
                              border: `1px solid ${C.border}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '22px',
                              overflow: 'hidden',
                              flexShrink: 0,
                              filter: p.in_stock === false ? 'grayscale(1)' : 'none',
                            }}
                          >
                            {p.image_url || p.image ? (
                              <img
                                src={p.image_url || p.image}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              p.emoji || '🎁'
                            )}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="flex items-center gap-2 mb-0.5">
                              <div style={{ fontSize: '13px', fontWeight: 800, color: C.ink }}>
                                {p.name}
                              </div>
                              {p.status === 'pending_review' && (
                                <span
                                  style={{
                                    fontSize: '9px',
                                    fontWeight: 800,
                                    color: C.tipInk,
                                    backgroundColor: C.tipBg,
                                    padding: '2px 6px',
                                    borderRadius: '999px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                  }}
                                >
                                  Waiting
                                </span>
                              )}
                              {p.status === 'approved' && (
                                <span
                                  style={{
                                    fontSize: '9px',
                                    fontWeight: 800,
                                    color: C.success,
                                    backgroundColor: C.successBg,
                                    padding: '2px 6px',
                                    borderRadius: '999px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                  }}
                                >
                                  Live
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: C.inkFaint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.description || '(no description)'}
                            </div>
                          </div>

                          <div style={{ fontSize: '14px', fontWeight: 800, color: C.amberAccent, flexShrink: 0 }}>
                            ${Number(p.price).toFixed(2)}
                          </div>
                        </div>

                        {/* Action row */}
                        <div className="flex gap-1.5 mt-2 pt-2" style={{ borderTop: `1px solid ${C.borderFaint}` }}>
                          <button
                            onClick={() => handleStartEdit(p)}
                            style={{
                              flex: 1,
                              padding: '6px',
                              borderRadius: '8px',
                              backgroundColor: C.cream,
                              border: `1px solid ${C.border}`,
                              color: C.inkMuted,
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => updateProduct(p.id, { in_stock: p.in_stock === false ? true : false })}
                            style={{
                              flex: 1,
                              padding: '6px',
                              borderRadius: '8px',
                              backgroundColor: p.in_stock === false ? C.successBg : C.cream,
                              border: `1px solid ${C.border}`,
                              color: p.in_stock === false ? C.success : C.inkMuted,
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            {p.in_stock === false ? 'Back in stock' : 'Out of stock'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Remove this product?')) deleteProduct(p.id);
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              backgroundColor: '#FEE2E2',
                              border: `1px solid #FCA5A5`,
                              color: C.danger,
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {(products || []).length === 0 && !showAddProduct && (
                      <div
                        style={{
                          padding: '24px',
                          textAlign: 'center',
                          backgroundColor: C.cream,
                          borderRadius: '12px',
                          border: `1px dashed ${C.border}`,
                        }}
                      >
                        <p style={{ fontSize: '13px', color: C.inkMuted, marginBottom: '4px', fontWeight: 700 }}>
                          No products yet.
                        </p>
                        <p style={{ fontSize: '11px', color: C.inkFaint }}>
                          Tap "+ Add product" to get started.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* ===== DESIGN CONTROLS (layout, card style, font) ===== */}
                {/* Product layout */}
                <ControlGroup label="Product layout">
                  <div className="grid grid-cols-3 gap-2">
                    {LAYOUT_OPTIONS.map((l) => {
                      const isActive = draftTheme.productLayout === l.value;
                      return (
                        <button
                          key={l.value}
                          onClick={() => setDraftTheme((prev) => ({ ...prev, productLayout: l.value }))}
                          style={{
                            padding: '12px 8px',
                            borderRadius: '10px',
                            border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                            boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                            transform: isActive ? 'translate(-1px, -1px)' : 'none',
                            backgroundColor: isActive ? C.amberBtn : C.cream,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.1s',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: C.ink,
                            fontFamily: 'inherit',
                          }}
                        >
                          {l.name}
                        </button>
                      );
                    })}
                  </div>
                </ControlGroup>

                {/* Card font */}
                <ControlGroup label="Product name font">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FONT_OPTIONS.map((f) => {
                      const isActive = draftTheme.cardFont === f.value;
                      return (
                        <button
                          key={f.value}
                          onClick={() => setDraftTheme((prev) => ({ ...prev, cardFont: f.value }))}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '10px',
                            border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                            boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                            transform: isActive ? 'translate(-1px, -1px)' : 'none',
                            backgroundColor: isActive ? C.amberBtn : C.cream,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.1s',
                          }}
                        >
                          <div style={{ fontFamily: f.family, fontSize: '13px', marginBottom: '2px', color: C.ink }}>
                            Friendship Bracelet
                          </div>
                          <div style={{ fontSize: '10px', color: C.inkFaint, fontWeight: 600 }}>
                            {f.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ControlGroup>

                <SaveBar
                  sectionLabel="Products design"
                  isSaved={savedSection === 'products'}
                  onSave={saveProductsDesign}
                />

              </div>
            )}
          </div>

          {/* ================================================
              RIGHT — LIVE PREVIEW
              Hidden on mobile when edit toggle is active
              ================================================ */}
          <div className={`${mobileView === 'edit' ? 'hidden sm:block' : ''}`}>
            <LivePreview
              storeData={storeData}
              draftTheme={draftTheme}
              draftBio={draftBio}
              products={products}
              kidColors={getKidColors(draftTheme.color)}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

// =====================================================================
// CONTROL GROUP — shared wrapper for each editor control
// =====================================================================
function ControlGroup({ label, children, rightElement }) {
  return (
    <div
      style={{
        backgroundColor: C.cardBg,
        border: `1px solid ${C.border}`,
        borderRadius: '14px',
        padding: '14px 16px',
        boxShadow: `2px 2px 0 ${C.ink}12`,
      }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.inkFaint,
            fontWeight: 700,
          }}
        >
          {label}
        </div>
        {rightElement}
      </div>
      {children}
    </div>
  );
}

// =====================================================================
// SAVE BAR — per-section save with saved indicator
// =====================================================================
function SaveBar({ sectionLabel, isSaved, onSave }) {
  return (
    <div
      className="flex items-center justify-between gap-3 mt-1"
      style={{
        padding: '10px 14px',
        backgroundColor: C.creamWarm,
        border: `1px dashed ${C.ink}33`,
        borderRadius: '12px',
      }}
    >
      <div style={{ fontSize: '11px', color: C.inkFaint, fontWeight: 600 }}>
        {sectionLabel} — {isSaved ? (
          <span style={{ color: C.success, fontWeight: 800 }}>Saved ✓</span>
        ) : (
          'Tap save to make changes live'
        )}
      </div>
      <button
        onClick={onSave}
        className="transition-all hover:-translate-y-0.5"
        style={{
          backgroundColor: C.amberBtn,
          color: C.ink,
          border: `1.5px solid ${C.ink}`,
          boxShadow: `2px 2px 0 ${C.ink}`,
          borderRadius: '10px',
          padding: '7px 14px',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        Save {sectionLabel.split(' ')[0]}
      </button>
    </div>
  );
}

// =====================================================================
// LIVE PREVIEW — mini store rendered with draft theme
// =====================================================================
function LivePreview({ storeData, draftTheme, draftBio, products, kidColors }) {
  const storeName = storeData?.store_name || 'My Store';
  const kidName = storeData?.kid_name || 'Kid';

  const headerFontFamily = FONT_OPTIONS.find((f) => f.value === draftTheme.headerFont)?.family || "'Poppins', sans-serif";
  const bodyFontFamily = FONT_OPTIONS.find((f) => f.value === draftTheme.bodyFont)?.family || "'Poppins', sans-serif";
  const cardFontFamily = FONT_OPTIONS.find((f) => f.value === draftTheme.cardFont)?.family || "'Poppins', sans-serif";

  return (
    <div style={{ position: 'sticky', top: '80px' }}>
      <div className="flex items-center justify-between mb-3">
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.amberAccent,
            fontWeight: 800,
          }}
        >
          Live preview
        </div>
        {storeData?.id && (
          <Link
            href={`/store/${storeData.id}`}
            target="_blank"
            style={{
              fontSize: '11px',
              color: C.inkMuted,
              fontWeight: 700,
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            Visit live store →
          </Link>
        )}
      </div>

      {/* Phone frame */}
      <div
        style={{
          backgroundColor: C.ink,
          padding: '8px',
          borderRadius: '22px',
          boxShadow: `4px 4px 0 ${C.ink}24`,
        }}
      >
        <div
          style={{
            backgroundColor: C.cream,
            borderRadius: '16px',
            overflow: 'hidden',
            maxHeight: '600px',
            overflowY: 'auto',
          }}
        >
          {/* Mini nav */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: C.cream,
              borderBottom: `1px solid ${C.borderFaint}`,
            }}
          >
            <div style={{ fontFamily: "'DynaPuff', cursive", fontSize: '11px', fontWeight: 700, color: C.ink }}>
              Lemonade Stand
            </div>
          </div>

          {/* Announcement bar */}
          {draftTheme.announcementOn && draftTheme.announcement && (
            <div
              style={{
                backgroundColor: C.ink,
                color: C.cream,
                textAlign: 'center',
                padding: '6px 10px',
                fontSize: '10px',
                fontWeight: 600,
                fontFamily: bodyFontFamily,
              }}
            >
              <span style={{ color: kidColors.accent, fontWeight: 800, marginRight: '4px' }}>📣</span>
              {draftTheme.announcement}
            </div>
          )}

          {/* Banner */}
          {draftTheme.bannerImage && (
            <img
              src={draftTheme.bannerImage}
              alt=""
              style={{
                width: '100%',
                height: '70px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          )}

          {/* Hero */}
          <div
            style={{
              padding: '20px 14px 18px',
              backgroundColor: kidColors.tint,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {draftTheme.stickerPattern && draftTheme.sticker ? (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                    `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><text x='8' y='28' font-size='20' opacity='0.08'>${draftTheme.sticker}</text></svg>`
                  )}")`,
                  backgroundSize: '40px 40px',
                }}
              />
            ) : (
              draftTheme.pattern && draftTheme.pattern !== 'none' && (
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, ...getPatternStyle(draftTheme.pattern) }} />
              )
            )}

            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '36px', lineHeight: 1 }}>{draftTheme.sticker || '🍋'}</div>
              {(draftTheme.accentStickers || []).length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '4px', fontSize: '14px' }}>
                  {draftTheme.accentStickers.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        transform: `rotate(${(i - Math.floor((draftTheme.accentStickers.length - 1) / 2)) * 12}deg)`,
                        display: 'inline-block',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <h2
                style={{
                  fontFamily: headerFontFamily,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: kidColors.deep,
                  lineHeight: 1.1,
                  marginTop: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                {storeName}
              </h2>
              <div style={{ fontSize: '10px', color: C.inkMuted, marginTop: '2px', fontFamily: bodyFontFamily }}>
                by {kidName}
              </div>
              {draftBio && (
                <p
                  style={{
                    fontSize: '10px',
                    color: C.inkMuted,
                    fontStyle: 'italic',
                    marginTop: '8px',
                    lineHeight: 1.4,
                    fontFamily: bodyFontFamily,
                    maxWidth: '220px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  "{draftBio}"
                </p>
              )}
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'white',
                  border: `1px solid ${C.border}`,
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: '8px',
                  fontWeight: 700,
                  color: C.inkMuted,
                  marginTop: '8px',
                }}
              >
                Parent-supervised
              </div>
            </div>
          </div>

          {/* Products */}
          <div
            style={{
              padding: '12px',
              backgroundColor: C.cream,
              display: 'grid',
              gridTemplateColumns: draftTheme.productLayout === 'list' ? '1fr' : '1fr 1fr',
              gap: '8px',
            }}
          >
            {(!products || products.length === 0) ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '20px 12px',
                  textAlign: 'center',
                  backgroundColor: C.cardBg,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  fontSize: '10px',
                  color: C.inkMuted,
                }}
              >
                Add products to see them here
              </div>
            ) : (
              products.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: C.cardBg,
                    border: `1.5px solid ${C.ink}`,
                    borderRadius: '10px',
                    boxShadow: `2px 2px 0 ${C.ink}`,
                    overflow: 'hidden',
                    display: draftTheme.productLayout === 'list' ? 'flex' : 'block',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: kidColors.tint,
                      aspectRatio: draftTheme.productLayout === 'list' ? 'auto' : '1',
                      width: draftTheme.productLayout === 'list' ? '60px' : '100%',
                      flexShrink: draftTheme.productLayout === 'list' ? 0 : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                    }}
                  >
                    {p.image_url || p.image ? (
                      <img
                        src={p.image_url || p.image}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      p.emoji || '🎁'
                    )}
                  </div>
                  <div style={{ padding: '6px 8px 7px', flex: draftTheme.productLayout === 'list' ? 1 : undefined }}>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: C.ink,
                        lineHeight: 1.1,
                        fontFamily: cardFontFamily,
                        marginBottom: '2px',
                      }}
                    >
                      {p.name}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: kidColors.deep }}>
                      ${Number(p.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Hint */}
      <p
        style={{
          fontSize: '11px',
          color: C.inkFaint,
          textAlign: 'center',
          marginTop: '12px',
          lineHeight: 1.5,
        }}
      >
        Updates as you edit. <strong style={{ color: C.ink, fontWeight: 700 }}>Save each section</strong> to make changes live for customers.
      </p>
    </div>
  );
}

// ====================== SHARED INPUT STYLE ======================
const inputBaseStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '10px',
  border: `1.5px solid ${C.borderInput}`,
  backgroundColor: 'white',
  fontSize: '13px',
  fontWeight: 500,
  color: C.ink,
  fontFamily: 'inherit',
};
