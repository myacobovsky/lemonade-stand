// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar, Logo, LearnTip, getPatternStyle, getCardClasses, stickerSets } from '../components';
import { useApp } from '../../lib/context';

const font = {
  heading: "'Poppins', sans-serif",
  accent: "'DynaPuff', cursive",
};

export default function EditorPage() {
  const router = useRouter();
  const { loading, store: storeData, products, addProduct: addProductToDb, updateProduct, deleteProduct, reorderProducts, theme: storeTheme, updateTheme, updateStore, uploadImage } = useApp();
  const storeBio = storeData?.bio || '';
  const [activeTab, setActiveTab] = useState('theme');
  const [stickerTab, setStickerTab] = useState('popular');
  const [draftTheme, setDraftTheme] = useState(() => {
    if (storeTheme) return {
      color: storeTheme.color || 'amber',
      sticker: storeTheme.sticker || '🌈',
      accentStickers: storeTheme.accent_stickers || [],
      stickerPattern: storeTheme.sticker_pattern || false,
      headerFont: storeTheme.header_font || 'Poppins',
      bodyFont: storeTheme.body_font || 'Poppins',
      cardFont: storeTheme.card_font || 'Poppins',
      pattern: storeTheme.pattern || 'none',
      cardStyle: storeTheme.card_style || 'rounded',
      productLayout: storeTheme.product_layout || 'grid',
      announcement: storeTheme.announcement || '',
      announcementOn: storeTheme.announcement_on || false,
      bannerImage: storeTheme.banner_image_url || null,
    };
    return { color: 'amber', sticker: '🌈', accentStickers: [], stickerPattern: false, headerFont: 'Poppins', bodyFont: 'Poppins', cardFont: 'Poppins', pattern: 'none', announcement: '', announcementOn: false, bannerImage: null, cardStyle: 'rounded', productLayout: 'grid' };
  });
  const [draftBio, setDraftBio] = useState(storeBio || '');
  const [themeUpdated, setThemeUpdated] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: null, usePhoto: false, emoji: '🎁', category: '' });
  const [onboardingStep, setOnboardingStep] = useState(1);

  const kidName = storeData?.kid_name || 'Kid';

  const handleUpdateStore = async () => {
    await updateTheme({
      color: draftTheme.color, sticker: draftTheme.sticker, accent_stickers: draftTheme.accentStickers || [],
      sticker_pattern: draftTheme.stickerPattern || false, header_font: draftTheme.headerFont || 'Poppins',
      body_font: draftTheme.bodyFont || 'Poppins', card_font: draftTheme.cardFont || 'Poppins',
      pattern: draftTheme.pattern || 'none', card_style: draftTheme.cardStyle || 'rounded',
      product_layout: draftTheme.productLayout || 'grid', announcement: draftTheme.announcement || '',
      announcement_on: draftTheme.announcementOn || false, banner_image_url: draftTheme.bannerImage || null,
    });
    if (draftBio !== storeBio) await updateStore({ bio: draftBio });
    setThemeUpdated(true);
    setTimeout(() => setThemeUpdated(false), 2000);
  };

  const colorOptions = [
    { name: 'Sunshine', value: 'amber', bg: 'bg-amber-400' },
    { name: 'Ocean', value: 'blue', bg: 'bg-blue-400' },
    { name: 'Forest', value: 'green', bg: 'bg-emerald-400' },
    { name: 'Bubblegum', value: 'pink', bg: 'bg-pink-400' },
    { name: 'Grape', value: 'purple', bg: 'bg-purple-400' },
    { name: 'Tangerine', value: 'orange', bg: 'bg-orange-400' },
  ];

  const fontOpts = [
    { name: 'Poppins', value: 'Poppins', family: "'Poppins', sans-serif" },
    { name: 'Montserrat', value: 'Montserrat', family: "'Montserrat', sans-serif" },
    { name: 'Pacifico', value: 'Pacifico', family: "'Pacifico', cursive" },
    { name: 'Sour Gummy', value: 'Sour Gummy', family: "'Sour Gummy', cursive" },
    { name: 'DynaPuff', value: 'DynaPuff', family: "'DynaPuff', cursive" },
    { name: 'Delius', value: 'Delius', family: "'Delius', cursive" },
    { name: 'Emilys Candy', value: 'Emilys Candy', family: "'Emilys Candy', cursive" },
    { name: 'Unica One', value: 'Unica One', family: "'Unica One', sans-serif" },
    { name: 'Ultra', value: 'Ultra', family: "'Ultra', serif" },
    { name: 'Quantico', value: 'Quantico', family: "'Quantico', sans-serif" },
  ];

  const patternOptions = [
    { name: 'None', value: 'none', emoji: null },
    { name: 'Hearts', value: 'hearts', emoji: '❤️' },
    { name: 'Stars', value: 'stars', emoji: '⭐' },
    { name: 'Smileys', value: 'smileys', emoji: '😊' },
    { name: 'Spirals', value: 'spirals', emoji: '🌀' },
    { name: 'Poop', value: 'poop', emoji: '💩' },
    { name: 'Stripes', value: 'stripes', emoji: null },
    { name: 'Confetti', value: 'confetti', emoji: null },
  ];

  const emojiOptions = ['🎁', '🧸', '🎨', '🍪', '💎', '🌸', '⭐', '🦋'];

  const handleStartEdit = (p) => {
    setEditingProduct(p.id);
    setNewProduct({ name: p.name, price: String(p.price), description: p.description || '', image: p.image_url || p.image || null, usePhoto: !!(p.image_url || p.image), emoji: p.emoji || '🎁', category: p.category || 'General' });
    setShowAddProduct(true);
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    const productData = {
      name: newProduct.name, price: parseFloat(newProduct.price), description: newProduct.description,
      emoji: newProduct.usePhoto ? null : (newProduct.emoji || '🎁'),
      image_url: newProduct.usePhoto ? newProduct.image : null, category: newProduct.category || 'General',
    };
    if (editingProduct) {
      await updateProduct(editingProduct, { ...productData, status: 'pending_review' });
      setEditingProduct(null);
    } else {
      await addProductToDb({ ...productData, in_stock: true, status: 'pending_review' });
    }
    setNewProduct({ name: '', price: '', description: '', image: null, usePhoto: false, emoji: '🎁', category: '' });
    setShowAddProduct(false);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({ name: '', price: '', description: '', image: null, usePhoto: false, emoji: '🎁', category: '' });
    setShowAddProduct(false);
  };

  const moveProduct = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= products.length) return;
    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    reorderProducts(updated);
  };

  if (!loading && !storeData) { router.push('/setup'); return null; }
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
      <div className="text-center"><Logo size="lg" /><p className="text-gray-400 mt-3 text-sm">Loading your store...</p></div>
    </div>
  );

  const hasProducts = products && products.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white" style={{ fontFamily: font.heading }}>
      <NavBar active="kid-editor" />

      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <Logo size="md" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: font.accent }}>{kidName}'s Store Editor</h1>
            <p className="text-gray-400 text-sm">Make your store awesome!</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-5 mb-6">
          {[
            { id: 'theme', label: 'Design' },
            { id: 'products', label: 'My Products' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-white shadow-md shadow-amber-200'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
              }`} style={{ fontFamily: activeTab === tab.id ? font.accent : font.heading }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================= */}
        {/* DESIGN TAB */}
        {/* ============================= */}
        {activeTab === 'theme' && (
          <div className="space-y-5 animate-fadeIn">

            {/* Section: Store Header */}
            <div className="bg-amber-100/50 rounded-xl px-4 py-2.5">
              <h3 className="font-bold text-amber-800 text-sm" style={{ fontFamily: font.accent }}>Store Header</h3>
            </div>

            {/* Color */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-gray-800" style={{ fontFamily: font.accent }}>Pick your color</h3>
                <LearnTip title="Colors & Branding" color="amber">
                  <p>Colors make people feel things! Picking the right one helps your store stand out.</p>
                  <p><strong>Warm colors</strong> (yellow, orange, pink) feel friendly and fun.</p>
                  <p><strong>Cool colors</strong> (blue, green, purple) feel calm and trustworthy.</p>
                </LearnTip>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((c) => (
                  <button key={c.value} onClick={() => setDraftTheme((prev) => ({ ...prev, color: c.value }))}
                    className={`p-3 rounded-xl border-2 transition-all active:scale-95 ${
                      draftTheme.color === c.value ? 'border-gray-800 scale-[1.03] shadow-md' : 'border-transparent hover:border-gray-200'
                    }`}>
                    <div className={`w-full h-8 rounded-lg ${c.bg} mb-1.5`} />
                    <div className="text-xs font-semibold text-gray-500">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stickers */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <h3 className="font-bold text-gray-800 mb-3" style={{ fontFamily: font.accent }}>Pick your sticker</h3>
              <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                {['popular','faces','animals','food','nature','sports','sparkle'].map((cat) => (
                  <button key={cat} onClick={() => setStickerTab(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      stickerTab === cat ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
                ))}
              </div>
              <div className="text-xs font-semibold text-amber-700 mb-2" style={{ fontFamily: font.accent }}>Main sticker</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(stickerSets[stickerTab] || stickerSets.popular).map((s) => (
                  <button key={s} onClick={() => setDraftTheme((prev) => ({ ...prev, sticker: s }))}
                    className={`w-12 h-12 text-2xl rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 ${
                      draftTheme.sticker === s ? 'border-amber-400 bg-amber-50 scale-110 shadow-md shadow-amber-100' : 'border-gray-100 hover:border-amber-200'
                    }`}>{s}</button>
                ))}
              </div>
              <div className="text-xs font-semibold text-amber-700 mb-1" style={{ fontFamily: font.accent }}>Accent stickers (up to 5)</div>
              <div className="text-xs text-gray-400 mb-2">Tap to add, tap again to remove</div>
              <div className="flex gap-1.5 mb-2">
                {(draftTheme.accentStickers || []).map((s, i) => (
                  <button key={i} onClick={() => setDraftTheme((prev) => ({ ...prev, accentStickers: prev.accentStickers.filter((_, idx) => idx !== i) }))}
                    className="w-10 h-10 text-xl rounded-lg border-2 border-amber-400 bg-amber-50 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all">{s}</button>
                ))}
                {(draftTheme.accentStickers || []).length < 5 && (
                  <div className="w-10 h-10 rounded-lg border-2 border-dashed border-amber-200 flex items-center justify-center text-amber-300 text-sm">+</div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(stickerSets[stickerTab] || stickerSets.popular).slice(0, 12).map((s) => (
                  <button key={s} onClick={() => setDraftTheme((prev) => {
                      const current = prev.accentStickers || [];
                      if (current.includes(s)) return { ...prev, accentStickers: current.filter(x => x !== s) };
                      if (current.length >= 5) return prev;
                      return { ...prev, accentStickers: [...current, s] };
                    })}
                    className={`w-10 h-10 text-lg rounded-lg border flex items-center justify-center transition-all active:scale-90 ${
                      (draftTheme.accentStickers || []).includes(s) ? 'border-amber-400 bg-amber-50' : 'border-gray-100 hover:border-amber-200'
                    }`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Store Name Font */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: font.accent }}>Store name font</h3>
              <p className="text-xs text-gray-400 mb-3">This is the font your customers see at the top of your store</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fontOpts.map((f) => (
                  <button key={f.value} onClick={() => setDraftTheme((prev) => ({ ...prev, headerFont: f.value }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all active:scale-95 ${
                      draftTheme.headerFont === f.value ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-gray-100 hover:border-amber-200'
                    }`}>
                    <div className="text-lg mb-0.5" style={{ fontFamily: f.family }}>{kidName}</div>
                    <div className="text-xs text-gray-400">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <h3 className="font-bold text-gray-800 mb-3" style={{ fontFamily: font.accent }}>Background style</h3>
              <div className="grid grid-cols-4 gap-2">
                {patternOptions.map((p) => (
                  <button key={p.value} onClick={() => setDraftTheme((prev) => ({ ...prev, pattern: p.value }))}
                    className={`rounded-xl border-2 overflow-hidden transition-all active:scale-95 ${
                      draftTheme.pattern === p.value ? 'border-amber-400 scale-[1.03] shadow-sm' : 'border-gray-100 hover:border-amber-200'
                    }`}>
                    <div className="h-14 relative bg-gray-50 flex items-center justify-center">
                      {p.value === 'none' && <div className="text-xs text-gray-400">None</div>}
                      {p.emoji && <div className="absolute inset-0" style={getPatternStyle(p.value)} />}
                      {p.value === 'stripes' && <div className="absolute inset-0" style={getPatternStyle('stripes')} />}
                      {p.value === 'confetti' && <div className="absolute inset-0" style={getPatternStyle('confetti')} />}
                    </div>
                    <div className="text-xs font-medium text-gray-500 py-1.5 text-center">{p.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Banner */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: font.accent }}>Store banner</h3>
              <p className="text-xs text-gray-400 mb-3">A photo of your workspace or products</p>
              {draftTheme.bannerImage ? (
                <div className="relative">
                  <img src={draftTheme.bannerImage} alt="Banner" className="w-full h-36 object-cover rounded-xl border border-amber-100" />
                  <button onClick={() => setDraftTheme((prev) => ({ ...prev, bannerImage: null }))}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow text-gray-500 text-sm flex items-center justify-center hover:bg-gray-100">&times;</button>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-amber-200 rounded-xl p-8 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all">
                    <div className="text-3xl mb-2">📸</div>
                    <div className="text-sm text-amber-600 font-semibold" style={{ fontFamily: font.accent }}>Tap to upload a photo</div>
                    <div className="text-xs text-gray-400 mt-1">Looks best wide and short</div>
                  </div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setDraftTheme((prev) => ({ ...prev, bannerImage: reader.result })); reader.readAsDataURL(file); }}} />
                </label>
              )}
            </div>

            {/* Section: About */}
            <div className="bg-amber-100/50 rounded-xl px-4 py-2.5">
              <h3 className="font-bold text-amber-800 text-sm" style={{ fontFamily: font.accent }}>About Your Store</h3>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: font.accent }}>Describe your store</h3>
              <p className="text-xs text-gray-400 mb-3">Tell people what you make and why it's awesome</p>
              <textarea value={draftBio} onChange={(e) => setDraftBio(e.target.value.slice(0, 150))}
                placeholder={`Hi! I'm ${kidName} and I love making things by hand...`} rows={3}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-100 focus:border-amber-400 focus:outline-none text-sm resize-none" />
              <div className="text-right text-xs text-gray-400 mt-1">{draftBio.length}/150</div>
            </div>

            {/* Bio Font */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <h3 className="font-bold text-gray-800 mb-3" style={{ fontFamily: font.accent }}>Bio font</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fontOpts.map((f) => (
                  <button key={f.value} onClick={() => setDraftTheme((prev) => ({ ...prev, bodyFont: f.value }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all active:scale-95 ${
                      draftTheme.bodyFont === f.value ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-gray-100 hover:border-amber-200'
                    }`}>
                    <div className="text-sm mb-0.5" style={{ fontFamily: f.family }}>The quick brown fox</div>
                    <div className="text-xs text-gray-400">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section: Product Cards */}
            <div className="bg-amber-100/50 rounded-xl px-4 py-2.5">
              <h3 className="font-bold text-amber-800 text-sm" style={{ fontFamily: font.accent }}>Product Cards</h3>
            </div>

            {/* Layout */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <h3 className="font-bold text-gray-800 mb-3" style={{ fontFamily: font.accent }}>Product layout</h3>
              <div className="grid grid-cols-3 gap-2">
                {[{ name: 'Grid', value: 'grid' }, { name: 'List', value: 'list' }, { name: 'Featured', value: 'featured' }].map((layout) => (
                  <button key={layout.value} onClick={() => setDraftTheme((prev) => ({ ...prev, productLayout: layout.value }))}
                    className={`rounded-xl border-2 overflow-hidden transition-all active:scale-95 ${
                      draftTheme.productLayout === layout.value ? 'border-amber-400 scale-[1.03] shadow-sm' : 'border-gray-100 hover:border-amber-200'
                    }`}>
                    <div className="p-3 h-16 flex items-center justify-center">
                      {layout.value === 'grid' && <div className="grid grid-cols-3 gap-1 w-full">{[1,2,3,4,5,6].map(i => <div key={i} className="bg-amber-200 rounded-sm h-4" />)}</div>}
                      {layout.value === 'list' && <div className="space-y-1.5 w-full">{[1,2,3].map(i => <div key={i} className="flex gap-1.5"><div className="bg-amber-200 rounded-sm h-3 w-5 shrink-0" /><div className="bg-amber-100 rounded-sm h-3 flex-1" /></div>)}</div>}
                      {layout.value === 'featured' && <div className="w-full space-y-1.5"><div className="bg-amber-200 rounded-sm h-8 w-full" /><div className="grid grid-cols-3 gap-1">{[1,2,3].map(i => <div key={i} className="bg-amber-100 rounded-sm h-3" />)}</div></div>}
                    </div>
                    <div className="text-xs font-medium text-gray-500 py-1.5 text-center">{layout.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Style */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <h3 className="font-bold text-gray-800 mb-3" style={{ fontFamily: font.accent }}>Card style</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[{ name: 'Rounded', value: 'rounded' }, { name: 'Flat', value: 'flat' }, { name: 'Bordered', value: 'bordered' }, { name: 'Polaroid', value: 'polaroid' }].map((style) => (
                  <button key={style.value} onClick={() => setDraftTheme((prev) => ({ ...prev, cardStyle: style.value }))}
                    className={`rounded-xl border-2 overflow-hidden transition-all active:scale-95 ${
                      draftTheme.cardStyle === style.value ? 'border-amber-400 scale-[1.03] shadow-sm' : 'border-gray-100 hover:border-amber-200'
                    }`}>
                    <div className="p-2">
                      <div className={`h-16 flex flex-col overflow-hidden ${
                        style.value === 'rounded' ? 'bg-white rounded-xl shadow-sm border border-gray-100' :
                        style.value === 'flat' ? 'bg-gray-50 rounded-none' :
                        style.value === 'bordered' ? 'bg-white rounded-lg border-2 border-amber-400' :
                        'bg-white rounded-sm shadow-md p-1'
                      }`}>
                        <div className={`flex-1 flex items-center justify-center text-lg ${style.value === 'flat' ? 'bg-gray-100' : 'bg-gray-50'}`}>🎀</div>
                        <div className={`text-xs font-medium text-gray-600 px-1.5 py-1 ${style.value === 'polaroid' ? 'text-center pt-1.5' : ''}`}>Product</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-gray-500 py-1.5 text-center">{style.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Font */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <h3 className="font-bold text-gray-800 mb-3" style={{ fontFamily: font.accent }}>Product name font</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fontOpts.map((f) => (
                  <button key={f.value} onClick={() => setDraftTheme((prev) => ({ ...prev, cardFont: f.value }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all active:scale-95 ${
                      draftTheme.cardFont === f.value ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-gray-100 hover:border-amber-200'
                    }`}>
                    <div className="text-sm mb-0.5" style={{ fontFamily: f.family }}>Friendship Bracelet</div>
                    <div className="text-xs text-gray-400">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section: Promotions */}
            <div className="bg-amber-100/50 rounded-xl px-4 py-2.5">
              <h3 className="font-bold text-amber-800 text-sm" style={{ fontFamily: font.accent }}>Updates & Promotions</h3>
            </div>

            {/* Announcement */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-800" style={{ fontFamily: font.accent }}>Announcement bar</h3>
                <button onClick={() => setDraftTheme((prev) => ({ ...prev, announcementOn: !prev.announcementOn }))}
                  className={`relative w-12 h-7 rounded-full transition-colors ${draftTheme.announcementOn ? 'bg-amber-400' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${draftTheme.announcementOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-3">A message at the top of your store</p>
              {draftTheme.announcementOn && (
                <div className="space-y-3 animate-fadeIn">
                  <input type="text" value={draftTheme.announcement || ''} onChange={(e) => setDraftTheme((prev) => ({ ...prev, announcement: e.target.value.slice(0, 80) }))}
                    placeholder="Free delivery this week!" className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-100 focus:border-amber-400 focus:outline-none text-sm" />
                  <div className="text-right text-xs text-gray-400">{(draftTheme.announcement || '').length}/80</div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button onClick={handleUpdateStore}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all active:scale-[0.98] shadow-md ${
                themeUpdated ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-amber-400 hover:bg-amber-500 text-white shadow-amber-200'
              }`} style={{ fontFamily: font.accent }}>
              {themeUpdated ? 'Store Updated!' : 'Save My Design'}
            </button>
          </div>
        )}

        {/* ============================= */}
        {/* PRODUCTS TAB */}
        {/* ============================= */}
        {activeTab === 'products' && (
          <div className="animate-fadeIn">

            {/* Empty State: First Product Onboarding */}
            {!hasProducts && !showAddProduct && (
              <div className="text-center py-8">
                <Logo size="lg" />
                <h2 className="text-2xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
                  Time to add your first product!
                </h2>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                  This is the exciting part. What do you want to sell first?
                </p>

                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-amber-100 text-left max-w-sm mx-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center gap-1">
                      {[1,2,3].map((s) => (
                        <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          onboardingStep >= s ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-400'
                        }`} style={{ fontFamily: font.accent }}>{s}</div>
                      ))}
                    </div>
                  </div>

                  {onboardingStep === 1 && (
                    <div className="animate-fadeIn">
                      <h3 className="font-bold text-amber-700 mb-2" style={{ fontFamily: font.accent }}>Give it a name</h3>
                      <p className="text-xs text-gray-400 mb-3">What do you call what you make?</p>
                      <input type="text" value={newProduct.name} onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Friendship Bracelet" className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-lg" />
                      <button onClick={() => setOnboardingStep(2)} disabled={!newProduct.name}
                        className="w-full mt-4 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-full transition-colors"
                        style={{ fontFamily: font.accent }}>Next →</button>
                    </div>
                  )}

                  {onboardingStep === 2 && (
                    <div className="animate-fadeIn">
                      <h3 className="font-bold text-amber-700 mb-2" style={{ fontFamily: font.accent }}>Set your price</h3>
                      <p className="text-xs text-gray-400 mb-3">How much should {newProduct.name} cost?</p>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-lg text-gray-400">$</span>
                        <input type="number" inputMode="decimal" value={newProduct.price} onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00" className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-lg" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => setOnboardingStep(1)} className="px-5 py-3 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
                        <button onClick={() => setOnboardingStep(3)} disabled={!newProduct.price}
                          className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-full transition-colors"
                          style={{ fontFamily: font.accent }}>Next →</button>
                      </div>
                    </div>
                  )}

                  {onboardingStep === 3 && (
                    <div className="animate-fadeIn">
                      <h3 className="font-bold text-amber-700 mb-2" style={{ fontFamily: font.accent }}>Describe it</h3>
                      <p className="text-xs text-gray-400 mb-3">Tell customers why they'll love {newProduct.name}</p>
                      <textarea value={newProduct.description} onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Handmade with love..." rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-sm resize-none" />

                      <div className="mt-3">
                        <div className="text-xs font-semibold text-amber-700 mb-2" style={{ fontFamily: font.accent }}>Pick an emoji</div>
                        <div className="flex gap-2 flex-wrap">
                          {emojiOptions.map((e) => (
                            <button key={e} onClick={() => setNewProduct((prev) => ({ ...prev, emoji: e }))}
                              className={`w-10 h-10 text-lg rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 ${
                                newProduct.emoji === e ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-gray-100 hover:border-amber-200'
                              }`}>{e}</button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button onClick={() => setOnboardingStep(2)} className="px-5 py-3 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
                        <button onClick={() => { handleSaveProduct(); setOnboardingStep(1); }}
                          disabled={!newProduct.name || !newProduct.price}
                          className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-full transition-colors"
                          style={{ fontFamily: font.accent }}>Add to My Store!</button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-4">Your parent will review it before it goes live.</p>
              </div>
            )}

            {/* Has Products: Normal View */}
            {(hasProducts || showAddProduct) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800" style={{ fontFamily: font.accent }}>My Products</h3>
                  <button onClick={() => { setEditingProduct(null); setNewProduct({ name: '', price: '', description: '', image: null, usePhoto: false, emoji: '🎁', category: '' }); setShowAddProduct(true); }}
                    className="bg-amber-400 hover:bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-sm shadow-amber-200 transition-all active:scale-95"
                    style={{ fontFamily: font.accent }}>+ Add Product</button>
                </div>

                {/* Add/Edit Product Form */}
                {showAddProduct && (
                  <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200 animate-fadeIn">
                    <h4 className="font-bold text-amber-800 mb-3" style={{ fontFamily: font.accent }}>{editingProduct ? "Edit Product" : "New Product"}</h4>
                    <div className="space-y-3">
                      <input type="text" value={newProduct.name} onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Product name" className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-sm" />
                      <input type="number" inputMode="decimal" value={newProduct.price} onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="Price ($)" className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-sm" />
                      <textarea value={newProduct.description} onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Tell customers about it" rows={2} className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-sm resize-none" />
                      <div>
                        <div className="flex gap-2 mb-3">
                          <button onClick={() => setNewProduct((prev) => ({ ...prev, usePhoto: false }))}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${!newProduct.usePhoto ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-500'}`}>Use Emoji</button>
                          <button onClick={() => setNewProduct((prev) => ({ ...prev, usePhoto: true }))}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${newProduct.usePhoto ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-500'}`}>Upload Photo</button>
                        </div>
                        {!newProduct.usePhoto ? (
                          <div className="flex gap-2 flex-wrap">
                            {emojiOptions.map((e) => (
                              <button key={e} onClick={() => setNewProduct((prev) => ({ ...prev, emoji: e }))}
                                className={`w-10 h-10 text-lg rounded-xl border-2 flex items-center justify-center active:scale-90 ${
                                  newProduct.emoji === e ? 'border-amber-400 bg-amber-50' : 'border-gray-200'
                                }`}>{e}</button>
                            ))}
                          </div>
                        ) : (
                          <div>
                            {newProduct.image ? (
                              <div className="relative">
                                <img src={newProduct.image} alt="Product" className="w-full h-32 object-cover rounded-xl border border-amber-200" />
                                <button onClick={() => setNewProduct((prev) => ({ ...prev, image: null }))}
                                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow text-gray-500 text-sm flex items-center justify-center">&times;</button>
                              </div>
                            ) : (
                              <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-amber-200 rounded-xl p-6 text-center hover:border-amber-400 transition-colors">
                                  <div className="text-2xl mb-1">📷</div>
                                  <div className="text-xs text-amber-600 font-semibold" style={{ fontFamily: font.accent }}>Tap to upload</div>
                                </div>
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setNewProduct((prev) => ({ ...prev, image: reader.result })); reader.readAsDataURL(file); }}} />
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleCancelEdit} className="flex-1 py-3 rounded-full border-2 border-gray-200 text-gray-600 text-sm font-semibold active:scale-[0.98]">Cancel</button>
                        <button onClick={handleSaveProduct} disabled={!newProduct.name || !newProduct.price}
                          className="flex-1 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-white text-sm font-bold disabled:bg-gray-200 disabled:text-gray-400 active:scale-[0.98] shadow-sm"
                          style={{ fontFamily: font.accent }}>{editingProduct ? 'Save Changes' : 'Add Product'}</button>
                      </div>
                      {editingProduct && <p className="text-xs text-purple-600 mt-1 text-center">Saving sends this back to your parent for approval.</p>}
                    </div>
                  </div>
                )}

                {/* Product List */}
                <div className="space-y-3">
                  {products.map((p, index) => (
                    <div key={p.id} className={`p-3 rounded-xl border-2 transition-all ${
                      p.in_stock === false ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-amber-100 hover:border-amber-200 bg-white'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 shrink-0">
                          <button onClick={() => moveProduct(index, -1)} disabled={index === 0}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${index === 0 ? 'text-gray-300' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>▲</button>
                          <button onClick={() => moveProduct(index, 1)} disabled={index === products.length - 1}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${index === products.length - 1 ? 'text-gray-300' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>▼</button>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl overflow-hidden shrink-0 ${p.in_stock === false ? 'grayscale' : ''}`}>
                          {p.image_url || p.image ? <img src={p.image_url || p.image} alt={p.name} className="w-full h-full object-cover" /> : (p.emoji || '🎁')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-gray-800 text-sm">{p.name}</div>
                            {p.status === 'pending_review' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Waiting</span>}
                            {p.status === 'approved' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Live</span>}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{p.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-amber-600" style={{ fontFamily: font.accent }}>${p.price}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2 pt-2 border-t border-amber-50">
                        <button onClick={() => handleStartEdit(p)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-[0.98]">Edit</button>
                        <button onClick={() => updateProduct(p.id, { in_stock: p.in_stock === false ? true : false })}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                            p.in_stock === false ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}>{p.in_stock === false ? 'Back in Stock' : 'Out of Stock'}</button>
                        <button onClick={() => { if (confirm('Remove this product?')) deleteProduct(p.id); }}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 active:scale-[0.98]">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
