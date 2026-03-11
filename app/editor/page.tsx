// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar, LearnTip, getPatternStyle, getCardClasses, fontOptions, stickerSets } from '../components';
import { useApp } from '../../lib/context';

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

  const handleUpdateStore = async () => {
    await updateTheme({
      color: draftTheme.color,
      sticker: draftTheme.sticker,
      accent_stickers: draftTheme.accentStickers || [],
      sticker_pattern: draftTheme.stickerPattern || false,
      header_font: draftTheme.headerFont || 'Poppins',
      body_font: draftTheme.bodyFont || 'Poppins',
      card_font: draftTheme.cardFont || 'Poppins',
      pattern: draftTheme.pattern || 'none',
      card_style: draftTheme.cardStyle || 'rounded',
      product_layout: draftTheme.productLayout || 'grid',
      announcement: draftTheme.announcement || '',
      announcement_on: draftTheme.announcementOn || false,
      banner_image_url: draftTheme.bannerImage || null,
    });
    if (draftBio !== storeBio) {
      await updateStore({ bio: draftBio });
    }
    setThemeUpdated(true);
    setTimeout(() => setThemeUpdated(false), 2000);
  };
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: null, usePhoto: false, category: '' });

  const kidName = storeData?.kid_name || 'Kid';

  const colorOptions = [
    { name: 'Sunshine', value: 'amber', bg: 'bg-amber-400' },
    { name: 'Ocean', value: 'blue', bg: 'bg-blue-400' },
    { name: 'Forest', value: 'green', bg: 'bg-emerald-400' },
    { name: 'Bubblegum', value: 'pink', bg: 'bg-pink-400' },
    { name: 'Grape', value: 'purple', bg: 'bg-purple-400' },
    { name: 'Tangerine', value: 'orange', bg: 'bg-orange-400' },
  ];

  const fontOptions = [
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

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product = {
        id: Date.now(),
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        emoji: newProduct.usePhoto ? null : newProduct.emoji,
        image: newProduct.usePhoto ? newProduct.image : null,
        inStock: true,
        category: newProduct.category || 'General',
      };
      addProductToDb({ name: product.name, price: product.price, description: product.description, emoji: product.emoji, image_url: product.image || null, category: product.category || 'General', in_stock: true });
      setNewProduct({ name: '', price: '', description: '', image: null, usePhoto: false, category: '' });
      setShowAddProduct(false);
    }
  };

  const moveProduct = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= products.length) return;
    setProducts((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      return updated;
    });
  };

  if (!loading && !storeData) {
    router.push('/setup');
    return null;
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">🍋</div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <NavBar  active="kid-editor" />

      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">🎨 {kidName}&apos;s Store Editor</h1>
        <p className="text-gray-500 mb-6">Make your store look awesome!</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'theme', label: '🎨 Design' },
            { id: 'products', label: '📦 Products' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-amber-400 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-6 animate-fadeIn">

            {/* ===== STORE HEADER ===== */}
            <div className="bg-amber-50 rounded-xl px-4 py-2">
              <h3 className="font-bold text-gray-700 text-sm">🏪 Store Header</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-gray-800">Pick your store color</h3>
                <LearnTip title="Colors & Branding" color="amber">
                  <p>Colors make people feel things! Picking the right one helps your store stand out.</p>
                  <p><strong>Warm colors</strong> (yellow, orange, pink) feel friendly and fun.</p>
                  <p><strong>Cool colors</strong> (blue, green, purple) feel calm and trustworthy.</p>
                  <p><strong>Pick one and stick with it.</strong> Using the same color everywhere is called "branding." It helps people remember your store!</p>
                  <p>Think about your favorite stores. They all have a color you remember them by, right?</p>
                </LearnTip>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setDraftTheme((prev) => ({ ...prev, color: c.value }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      draftTheme.color === c.value ? 'border-gray-800 scale-105' : 'border-transparent'
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg ${c.bg} mb-2`} />
                    <div className="text-xs font-medium text-gray-600">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Stickers</h3>

              {/* Sticker Category Tabs */}
              <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                {[
                  { id: 'popular', label: 'Popular' },
                  { id: 'faces', label: 'Faces' },
                  { id: 'animals', label: 'Animals' },
                  { id: 'food', label: 'Food' },
                  { id: 'nature', label: 'Nature' },
                  { id: 'sports', label: 'Sports' },
                  { id: 'sparkle', label: 'Sparkle' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setStickerTab(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      stickerTab === cat.id ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Header Sticker */}
              <div className="text-xs font-semibold text-gray-600 mb-2">Main sticker (shows in your header)</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(stickerSets[stickerTab] || stickerSets.popular).map((s) => (
                  <button
                    key={s}
                    onClick={() => setDraftTheme((prev) => ({ ...prev, sticker: s }))}
                    className={`w-10 h-10 text-xl rounded-lg border-2 flex items-center justify-center transition-all ${
                      draftTheme.sticker === s ? 'border-amber-400 bg-amber-50 scale-110' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Accent Stickers */}
              <div className="text-xs font-semibold text-gray-600 mb-1">Accent stickers (pick up to 5, they decorate your store)</div>
              <div className="text-[10px] text-gray-400 mb-2">Tap to add, tap again to remove</div>
              <div className="flex gap-1.5 mb-2">
                {(draftTheme.accentStickers || []).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setDraftTheme((prev) => ({ ...prev, accentStickers: prev.accentStickers.filter((_, idx) => idx !== i) }))}
                    className="w-10 h-10 text-xl rounded-lg border-2 border-amber-400 bg-amber-50 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all"
                  >
                    {s}
                  </button>
                ))}
                {(draftTheme.accentStickers || []).length < 5 && (
                  <div className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-300 text-sm">+</div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(stickerSets[stickerTab] || stickerSets.popular).slice(0, 12).map((s) => (
                  <button
                    key={s}
                    onClick={() => setDraftTheme((prev) => {
                      const current = prev.accentStickers || [];
                      if (current.includes(s)) return { ...prev, accentStickers: current.filter(x => x !== s) };
                      if (current.length >= 5) return prev;
                      return { ...prev, accentStickers: [...current, s] };
                    })}
                    className={`w-8 h-8 text-base rounded-md border flex items-center justify-center transition-all ${
                      (draftTheme.accentStickers || []).includes(s) ? 'border-amber-400 bg-amber-50' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Sticker as pattern toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs font-semibold text-gray-700">Use main sticker as background pattern</div>
                  <div className="text-[10px] text-gray-400">Tiles your sticker across the store header</div>
                </div>
                <button
                  onClick={() => setDraftTheme((prev) => ({ ...prev, stickerPattern: !prev.stickerPattern }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    draftTheme.stickerPattern ? 'bg-amber-400' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    draftTheme.stickerPattern ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>


            {/* Font Pickers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800">Pick your fonts</h3>
                <LearnTip title="Fonts & Readability" color="purple">
                  <p>Big stores use TWO fonts: one fun one for their name, and one easy-to-read one for everything else.</p>
                  <p><strong>Header font</strong> is for your store name. This is where you show off your personality! Go bold, go fun.</p>
                  <p><strong>Body font</strong> is for descriptions and details. Pick something clean and easy to read so people can learn about your products.</p>
                  <p>A good rule: if your header font is fancy, keep your body font simple. That way your store looks cool AND is easy to read!</p>
                </LearnTip>
              </div>
              <p className="text-xs text-gray-400 mb-4">Use a fun font for your store name and a clear one for descriptions</p>
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Store name font</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                {fontOptions.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setDraftTheme((prev) => ({ ...prev, headerFont: f.value }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      draftTheme.headerFont === f.value ? 'border-gray-800 bg-gray-50' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="text-lg mb-0.5" style={{ fontFamily: f.family }}>{storeData?.kidName || 'Hello!'}</div>
                    <div className="text-[10px] font-medium text-gray-400">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>


            {/* Background Pattern */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Background style</h3>
              <div className="grid grid-cols-4 gap-3">
                {patternOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setDraftTheme((prev) => ({ ...prev, pattern: p.value }))}
                    className={`rounded-xl border-2 overflow-hidden transition-all ${
                      draftTheme.pattern === p.value ? 'border-gray-800 scale-[1.02]' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="h-16 relative bg-gray-50 flex items-center justify-center">
                      {p.value === 'none' && <div className="text-xs text-gray-400">None</div>}
                      {p.emoji && <div className="absolute inset-0" style={getPatternStyle(p.value)} />}
                      {p.value === 'stripes' && <div className="absolute inset-0" style={getPatternStyle('stripes')} />}
                      {p.value === 'confetti' && <div className="absolute inset-0" style={getPatternStyle('confetti')} />}
                    </div>
                    <div className="text-xs font-medium text-gray-500 py-1.5 text-center">{p.emoji ? `${p.emoji} ${p.name}` : p.name}</div>
                  </button>
                ))}
              </div>
            </div>


            {/* Banner Image */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800">Store banner image</h3>
                <LearnTip title="First Impressions" color="green">
                  <p>Your banner is the first thing people see. Make it count!</p>
                  <p><strong>Show your products:</strong> A flat lay of your best items looks amazing.</p>
                  <p><strong>Show your workspace:</strong> People love seeing where you make things. It makes your store feel real.</p>
                  <p><strong>Keep it bright:</strong> Light, colorful photos get more attention than dark ones.</p>
                  <p>Did you know? Stores with banner images get looked at longer than stores without one. People are drawn to pictures!</p>
                </LearnTip>
              </div>
              <p className="text-xs text-gray-400 mb-3">Add a photo of your workspace, products, or anything that shows off your brand!</p>
              {draftTheme.bannerImage ? (
                <div className="relative">
                  <img src={draftTheme.bannerImage} alt="Store banner" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                  <button
                    onClick={() => setDraftTheme((prev) => ({ ...prev, bannerImage: null }))}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow text-gray-500 text-sm flex items-center justify-center hover:bg-gray-100"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-400 transition-colors">
                    <div className="text-3xl mb-2">🖼️</div>
                    <div className="text-sm text-gray-500 font-medium">Tap to upload a banner photo</div>
                    <div className="text-xs text-gray-400 mt-1">Looks best at a wide, short size</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setDraftTheme((prev) => ({ ...prev, bannerImage: reader.result }));
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>


            {/* Store Header Preview */}
            <div className={`rounded-2xl p-6 shadow-sm border border-gray-100 ${
              draftTheme.color === 'blue' ? 'bg-blue-50 bg-opacity-30' :
              draftTheme.color === 'green' ? 'bg-emerald-50 bg-opacity-30' :
              draftTheme.color === 'pink' ? 'bg-pink-50 bg-opacity-30' :
              draftTheme.color === 'purple' ? 'bg-purple-50 bg-opacity-30' :
              draftTheme.color === 'orange' ? 'bg-orange-50 bg-opacity-30' : 'bg-amber-50 bg-opacity-30'
            }`}>
              <h3 className="font-bold text-gray-800 mb-4">Store header preview</h3>
              {draftTheme.bannerImage && (
                <img src={draftTheme.bannerImage} alt="Banner preview" className="w-full h-24 object-cover rounded-xl mb-3" />
              )}
              {draftTheme.announcementOn && draftTheme.announcement && (
                <div className={`rounded-t-xl py-2 px-4 text-center text-xs font-medium text-white -mx-2 -mt-1 mb-3 ${
                  draftTheme.color === 'blue' ? 'bg-blue-500' :
                  draftTheme.color === 'green' ? 'bg-emerald-500' :
                  draftTheme.color === 'pink' ? 'bg-pink-500' :
                  draftTheme.color === 'purple' ? 'bg-purple-500' :
                  draftTheme.color === 'orange' ? 'bg-orange-500' : 'bg-amber-500'
                }`} style={{ fontFamily: fontOptions.find(f => f.value === draftTheme.bodyFont)?.family || "'Poppins', sans-serif" }}>
                  {draftTheme.announcement}
                </div>
              )}
              <div className={`rounded-xl p-6 text-center relative overflow-hidden ${
                draftTheme.color === 'amber' ? 'bg-amber-50' :
                draftTheme.color === 'blue' ? 'bg-blue-50' :
                draftTheme.color === 'green' ? 'bg-emerald-50' :
                draftTheme.color === 'pink' ? 'bg-pink-50' :
                draftTheme.color === 'purple' ? 'bg-purple-50' :
                draftTheme.color === 'orange' ? 'bg-orange-50' : 'bg-gray-50'
              }`}>
                {draftTheme.stickerPattern && draftTheme.sticker ? (
                  <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><text x='8' y='28' font-size='20' opacity='0.1'>${draftTheme.sticker}</text></svg>`)}")`, backgroundSize: '40px 40px' }} />
                ) : (
                  draftTheme.pattern && draftTheme.pattern !== 'none' && <div className="absolute inset-0" style={getPatternStyle(draftTheme.pattern)} />
                )}
                <div className="relative">
                <div className="text-4xl mb-2">{draftTheme.sticker}</div>
                {(draftTheme.accentStickers || []).length > 0 && (
                  <div className="flex justify-center gap-1.5 mb-2">
                    {draftTheme.accentStickers.map((s, i) => (
                      <span key={i} className="text-xl" style={{ transform: `rotate(${(i - 1) * 15}deg)` }}>{s}</span>
                    ))}
                  </div>
                )}
                <h4 className={`text-xl mb-1 ${
                  draftTheme.color === 'amber' ? 'text-amber-700' :
                  draftTheme.color === 'blue' ? 'text-blue-700' :
                  draftTheme.color === 'green' ? 'text-emerald-700' :
                  draftTheme.color === 'pink' ? 'text-pink-700' :
                  draftTheme.color === 'purple' ? 'text-purple-700' :
                  draftTheme.color === 'orange' ? 'text-orange-700' : 'text-gray-700'
                }`} style={{ fontFamily: fontOptions.find(f => f.value === draftTheme.headerFont)?.family || "'Poppins', sans-serif" }}>{storeData?.storeName || "Your Store"}</h4>
                {draftBio && <p className="text-sm text-gray-600 mt-1 italic" style={{ fontFamily: fontOptions.find(f => f.value === draftTheme.bodyFont)?.family || "'Poppins', sans-serif" }}>&quot;{draftBio}&quot;</p>}
                {!draftBio && <p className="text-sm text-gray-400 mt-1">Write something above to see it here!</p>}
                </div>
              </div>

            </div>

            {/* ===== ABOUT YOUR STORE ===== */}
            <div className="bg-amber-50 rounded-xl px-4 py-2">
              <h3 className="font-bold text-gray-700 text-sm">📝 About Your Store</h3>
            </div>

            {/* Store Bio */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800">Describe your store</h3>
                <LearnTip title="Introducing Your Store" color="amber">
                  <p>Your store description is like saying hi to a new friend. Tell people who you are and what makes your stuff special!</p>
                  <p><strong>Keep it short.</strong> One or two sentences is perfect.</p>
                  <p><strong>Be yourself.</strong> Talk like YOU talk. If you're funny, be funny. If you're serious about your craft, say that.</p>
                  <p><strong>Say what you sell.</strong> People should know right away what kind of stuff they'll find here.</p>
                  <p>Example: "Hi there! I make friendship bracelets with cool patterns. Every one is handmade and totally unique!"</p>
                </LearnTip>
              </div>
              <p className="text-xs text-gray-400 mb-3">Tell people about your store in a few words!</p>
              <textarea
                value={draftBio}
                onChange={(e) => setDraftBio(e.target.value.slice(0, 150))}
                placeholder={`Hi! I'm ${kidName} and I love making things by hand...`}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none text-sm resize-none"
                style={{ fontFamily: fontOptions.find(f => f.value === draftTheme.bodyFont)?.family || "'Poppins', sans-serif" }}
              />
              <div className="text-right text-xs text-gray-400 mt-1">{draftBio.length}/150</div>
            </div>


            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Bio font</h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fontOptions.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setDraftTheme((prev) => ({ ...prev, bodyFont: f.value }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      draftTheme.bodyFont === f.value ? 'border-gray-800 bg-gray-50' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="text-sm mb-0.5" style={{ fontFamily: f.family }}>The quick brown fox</div>
                    <div className="text-[10px] font-medium text-gray-400">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ===== PRODUCT CARDS ===== */}
            <div className="bg-amber-50 rounded-xl px-4 py-2">
              <h3 className="font-bold text-gray-700 text-sm">📦 Product Cards</h3>
            </div>

            {/* Product Layout */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Product layout</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Grid', value: 'grid' },
                  { name: 'List', value: 'list' },
                  { name: 'Featured', value: 'featured' },
                ].map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => setDraftTheme((prev) => ({ ...prev, productLayout: layout.value }))}
                    className={`rounded-xl border-2 overflow-hidden transition-all ${
                      draftTheme.productLayout === layout.value ? 'border-gray-800 scale-[1.02]' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="p-3 h-20 flex items-center justify-center">
                      {layout.value === 'grid' && (
                        <div className="grid grid-cols-3 gap-1 w-full">
                          {[1,2,3,4,5,6].map(i => <div key={i} className="bg-gray-200 rounded-sm h-5" />)}
                        </div>
                      )}
                      {layout.value === 'list' && (
                        <div className="space-y-1.5 w-full">
                          {[1,2,3].map(i => <div key={i} className="flex gap-1.5"><div className="bg-gray-200 rounded-sm h-4 w-6 shrink-0" /><div className="bg-gray-100 rounded-sm h-4 flex-1" /></div>)}
                        </div>
                      )}
                      {layout.value === 'featured' && (
                        <div className="w-full space-y-1.5">
                          <div className="bg-gray-200 rounded-sm h-10 w-full" />
                          <div className="grid grid-cols-3 gap-1">
                            {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-sm h-4" />)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-gray-500 py-1.5 text-center">{layout.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Style */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Product card style</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Rounded', value: 'rounded' },
                  { name: 'Flat', value: 'flat' },
                  { name: 'Bordered', value: 'bordered' },
                  { name: 'Polaroid', value: 'polaroid' },
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setDraftTheme((prev) => ({ ...prev, cardStyle: style.value }))}
                    className={`rounded-xl border-2 overflow-hidden transition-all ${
                      draftTheme.cardStyle === style.value ? 'border-gray-800 scale-[1.02]' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="p-2">
                      <div className={`h-20 flex flex-col overflow-hidden ${
                        style.value === 'rounded' ? 'bg-white rounded-xl shadow-sm border border-gray-100' :
                        style.value === 'flat' ? 'bg-gray-50 rounded-none' :
                        style.value === 'bordered' ? 'bg-white rounded-lg border-2 ' + (
                          draftTheme.color === 'blue' ? 'border-blue-400' :
                          draftTheme.color === 'green' ? 'border-emerald-400' :
                          draftTheme.color === 'pink' ? 'border-pink-400' :
                          draftTheme.color === 'purple' ? 'border-purple-400' :
                          draftTheme.color === 'orange' ? 'border-orange-400' : 'border-amber-400'
                        ) :
                        'bg-white rounded-sm shadow-md p-1'
                      }`}>
                        <div className={`flex-1 flex items-center justify-center text-lg ${
                          style.value === 'flat' ? 'bg-gray-100' : 'bg-gray-50'
                        }`}>
                          🎀
                        </div>
                        <div className={`text-[8px] font-medium text-gray-600 px-1.5 py-1 ${
                          style.value === 'polaroid' ? 'text-center pt-1.5' : ''
                        }`}>Product</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-gray-500 py-1.5 text-center">{style.name}</div>
                  </button>
                ))}
              </div>
            </div>


            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-600 mb-2 ">Product name font</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fontOptions.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setDraftTheme((prev) => ({ ...prev, cardFont: f.value }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      draftTheme.cardFont === f.value ? 'border-gray-800 bg-gray-50' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="text-sm mb-0.5" style={{ fontFamily: f.family }}>Friendship Bracelet</div>
                    <div className="text-[10px] font-medium text-gray-400">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mt-0 mb-3">Product card preview</h3>

              {/* Grid preview */}
              {(!draftTheme.productLayout || draftTheme.productLayout === 'grid') && (
                <div className="grid grid-cols-2 gap-3">
                  {[{ emoji: '🎀', name: 'Friendship Bracelet', price: '5.00' }, { emoji: '🪨', name: 'Painted Rock', price: '3.00' }].map((item, i) => (
                    <div key={i} className={getCardClasses(draftTheme.cardStyle, true, draftTheme.color)}>
                      <div className={`h-20 flex items-center justify-center text-2xl ${draftTheme.cardStyle === 'polaroid' ? 'bg-gray-100 rounded-sm' : 'bg-gray-50'}`}>{item.emoji}</div>
                      <div className={draftTheme.cardStyle === 'polaroid' ? 'px-1 pt-2 pb-1' : 'p-3'}>
                        <h4 className="font-bold text-gray-800 text-xs mb-0.5" style={{ fontFamily: fontOptions.find(f => f.value === draftTheme.cardFont)?.family || "'Poppins', sans-serif" }}>{item.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-amber-600" style={{ fontFamily: "'Poppins', sans-serif" }}>${item.price}</span>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium text-white ${
                            draftTheme.color === 'blue' ? 'bg-blue-400' :
                            draftTheme.color === 'green' ? 'bg-emerald-400' :
                            draftTheme.color === 'pink' ? 'bg-pink-400' :
                            draftTheme.color === 'purple' ? 'bg-purple-400' :
                            draftTheme.color === 'orange' ? 'bg-orange-400' : 'bg-amber-400'
                          }`}>Add to cart</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List preview */}
              {draftTheme.productLayout === 'list' && (
                <div className="space-y-3">
                  {[{ emoji: '🎀', name: 'Friendship Bracelet', desc: 'Handmade with love!', price: '5.00' }, { emoji: '🪨', name: 'Painted Rock', desc: 'Cute animal designs!', price: '3.00' }].map((item, i) => (
                    <div key={i} className={`flex gap-3 ${getCardClasses(draftTheme.cardStyle, true, draftTheme.color)}`}>
                      <div className={`w-20 shrink-0 flex items-center justify-center text-2xl ${draftTheme.cardStyle === 'polaroid' ? 'bg-gray-100 rounded-sm' : 'bg-gray-50'}`}>{item.emoji}</div>
                      <div className="flex-1 py-2 pr-2">
                        <h4 className="font-bold text-gray-800 text-xs mb-0.5" style={{ fontFamily: fontOptions.find(f => f.value === draftTheme.cardFont)?.family || "'Poppins', sans-serif" }}>{item.name}</h4>
                        <p className="text-gray-400 text-[10px] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-amber-600" style={{ fontFamily: "'Poppins', sans-serif" }}>${item.price}</span>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium text-white ${
                            draftTheme.color === 'blue' ? 'bg-blue-400' :
                            draftTheme.color === 'green' ? 'bg-emerald-400' :
                            draftTheme.color === 'pink' ? 'bg-pink-400' :
                            draftTheme.color === 'purple' ? 'bg-purple-400' :
                            draftTheme.color === 'orange' ? 'bg-orange-400' : 'bg-amber-400'
                          }`}>Add to cart</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Featured preview */}
              {draftTheme.productLayout === 'featured' && (
                <div className="space-y-3">
                  <div className={getCardClasses(draftTheme.cardStyle, true, draftTheme.color)}>
                    <div className={`h-32 flex items-center justify-center text-4xl ${draftTheme.cardStyle === 'polaroid' ? 'bg-gray-100 rounded-sm' : 'bg-gray-50'}`}>🎀</div>
                    <div className={draftTheme.cardStyle === 'polaroid' ? 'px-1 pt-3 pb-1' : 'p-4'}>
                      <h4 className="font-bold text-gray-800 mb-0.5 text-base" style={{ fontFamily: fontOptions.find(f => f.value === draftTheme.cardFont)?.family || "'Poppins', sans-serif" }}>Friendship Bracelet</h4>
                      <p className="text-gray-400 text-xs mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Handmade with love! Choose your favorite colors.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-amber-600" style={{ fontFamily: "'Poppins', sans-serif" }}>$5.00</span>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium text-white ${
                          draftTheme.color === 'blue' ? 'bg-blue-400' :
                          draftTheme.color === 'green' ? 'bg-emerald-400' :
                          draftTheme.color === 'pink' ? 'bg-pink-400' :
                          draftTheme.color === 'purple' ? 'bg-purple-400' :
                          draftTheme.color === 'orange' ? 'bg-orange-400' : 'bg-amber-400'
                        }`}>Add to cart</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ emoji: '🪨', name: 'Painted Rock', price: '3.00' }, { emoji: '🍪', name: 'Cookies', price: '8.00' }].map((item, i) => (
                      <div key={i} className={getCardClasses(draftTheme.cardStyle, true, draftTheme.color)}>
                        <div className={`h-14 flex items-center justify-center text-xl ${draftTheme.cardStyle === 'polaroid' ? 'bg-gray-100 rounded-sm' : 'bg-gray-50'}`}>{item.emoji}</div>
                        <div className={draftTheme.cardStyle === 'polaroid' ? 'px-1 pt-1.5 pb-1' : 'p-2'}>
                          <h4 className="font-bold text-gray-800 text-[10px]" style={{ fontFamily: fontOptions.find(f => f.value === draftTheme.cardFont)?.family || "'Poppins', sans-serif" }}>{item.name}</h4>
                          <span className="text-xs font-bold text-amber-600">${item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== UPDATES & PROMOTIONS ===== */}
            <div className="bg-amber-50 rounded-xl px-4 py-2">
              <h3 className="font-bold text-gray-700 text-sm">📣 Updates & Promotions</h3>
            </div>

            {/* Announcement Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800">Announcement bar</h3>
                  <LearnTip title="Promotions & Announcements" color="amber">
                    <p>An announcement bar grabs attention right away. Big stores use these all the time!</p>
                    <p><strong>Sales and deals:</strong> "Buy 2 bracelets, get 1 free!"</p>
                    <p><strong>New stuff:</strong> "NEW! Painted rocks now available!"</p>
                    <p><strong>Important info:</strong> "Orders take 2-3 days to make"</p>
                    <p><strong>Events:</strong> "Come to my bake sale Saturday at 10am!"</p>
                    <p>Keep it short and exciting. Change it up every week to give people a reason to check back!</p>
                  </LearnTip>
                </div>
                <button
                  onClick={() => setDraftTheme((prev) => ({ ...prev, announcementOn: !prev.announcementOn }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    draftTheme.announcementOn ? 'bg-amber-400' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    draftTheme.announcementOn ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-3">Add a message at the top of your store for everyone to see</p>
              {draftTheme.announcementOn && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={draftTheme.announcement || ''}
                    onChange={(e) => setDraftTheme((prev) => ({ ...prev, announcement: e.target.value.slice(0, 80) }))}
                    placeholder="Free delivery this week! 🎉"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                  />
                  <div className="text-right text-xs text-gray-400">{(draftTheme.announcement || '').length}/80</div>
                  {draftTheme.announcement && (
                    <div className={`rounded-lg py-2 px-4 text-center text-sm font-medium text-white ${
                      draftTheme.color === 'blue' ? 'bg-blue-500' :
                      draftTheme.color === 'green' ? 'bg-emerald-500' :
                      draftTheme.color === 'pink' ? 'bg-pink-500' :
                      draftTheme.color === 'purple' ? 'bg-purple-500' :
                      draftTheme.color === 'orange' ? 'bg-orange-500' : 'bg-amber-500'
                    }`}>
                      {draftTheme.announcement}
                    </div>
                  )}
                </div>
              )}
            </div>




            <button
              onClick={handleUpdateStore}
              className={`w-full py-3 rounded-xl font-semibold text-base transition-all ${
                themeUpdated
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-400 hover:bg-amber-500 text-white'
              }`}
            >
              {themeUpdated ? '✅ Store Updated!' : '🚀 Update My Store'}
            </button>
          </div>
        )}

        {/* Products Tab */}

        {activeTab === 'products' && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Your Products</h3>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-full"
                >
                  + Add Product
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200 animate-fadeIn">
                  <h4 className="font-medium text-amber-800 mb-3">New Product</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Product name"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                    />
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="Price ($)"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                    />
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Description"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                    />
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {['Jewelry', 'Art', 'Food', 'Crafts', 'Plants', 'Services', 'Other'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setNewProduct((prev) => ({ ...prev, category: cat }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              newProduct.category === cat
                                ? 'bg-amber-400 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-xs font-medium text-gray-600">Add a picture</label>
                        <LearnTip title="Great Product Photos" color="green">
                          <p>Good photos help people decide to buy. Here are some easy tips:</p>
                          <p><strong>Use good lighting.</strong> Take photos near a window during the day. Natural light makes everything look better!</p>
                          <p><strong>Keep it simple.</strong> Put your product on a clean, plain background so it stands out.</p>
                          <p><strong>Show it off.</strong> Take the photo from an angle that shows the best part of what you made.</p>
                          <p><strong>No blurry pics!</strong> Hold your phone steady or prop it up against something.</p>
                          <p>Stores with good photos sell way more than stores with bad ones. It really matters!</p>
                        </LearnTip>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => setNewProduct((prev) => ({ ...prev, usePhoto: false }))}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                            !newProduct.usePhoto ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-500'
                          }`}
                        >
                          Use Emoji
                        </button>
                        <button
                          onClick={() => setNewProduct((prev) => ({ ...prev, usePhoto: true }))}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                            newProduct.usePhoto ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-500'
                          }`}
                        >
                          Upload Photo
                        </button>
                      </div>
                      {!newProduct.usePhoto ? (
                        <div className="flex gap-2 flex-wrap">
                          {emojiOptions.map((e) => (
                            <button
                              key={e}
                              onClick={() => setNewProduct((prev) => ({ ...prev, emoji: e }))}
                              className={`w-9 h-9 text-lg rounded-lg border-2 flex items-center justify-center ${
                                newProduct.emoji === e ? 'border-amber-400 bg-amber-50' : 'border-gray-200'
                              }`}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {newProduct.image ? (
                            <div className="relative">
                              <img src={newProduct.image} alt="Product" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                              <button
                                onClick={() => setNewProduct((prev) => ({ ...prev, image: null }))}
                                className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow text-gray-500 text-xs flex items-center justify-center hover:bg-gray-100"
                              >
                                &times;
                              </button>
                            </div>
                          ) : (
                            <label className="block cursor-pointer">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                                <div className="text-2xl mb-1">📷</div>
                                <div className="text-xs text-gray-500">Tap to upload a photo</div>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setNewProduct((prev) => ({ ...prev, image: reader.result }));
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowAddProduct(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm">Cancel</button>
                      <button onClick={handleAddProduct} disabled={!newProduct.name || !newProduct.price} className="flex-1 py-2 rounded-lg bg-amber-400 text-white text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400">Add Product</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Sorting Tip */}
              <div className="flex items-start gap-2 mb-3 p-3 bg-blue-50 rounded-xl">
                <LearnTip title="Product Sorting" color="blue">
                  <p>The way you line up your products matters!</p>
                  <p>Good sellers put their products in a smart order:</p>
                  <p><strong>Popularity:</strong> Put the stuff people love most at the top!</p>
                  <p><strong>Price:</strong> Show cheaper stuff first. It gets people to buy!</p>
                  <p><strong>Availability:</strong> Put things you still have at the top!</p>
                  <p>Big stores like Amazon and Target do this every day!</p>
                </LearnTip>
                <p className="text-xs text-blue-700">Use the arrows to move your products up or down. This is the order people will see!</p>
              </div>

              {/* Product List */}
              <div className="space-y-3">
                {products.map((p, index) => (
                  <div key={p.id} className={`p-3 rounded-xl border transition-all ${p.inStock === false ? 'border-gray-200 bg-gray-50 opacity-70' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      {/* Reorder arrows */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => moveProduct(index, -1)}
                          disabled={index === 0}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                            index === 0 ? 'text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveProduct(index, 1)}
                          disabled={index === products.length - 1}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                            index === products.length - 1 ? 'text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          ▼
                        </button>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl overflow-hidden shrink-0 ${p.inStock === false ? 'grayscale' : ''}`}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          p.emoji || '🎁'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800">{p.name}</div>
                        <div className="text-sm text-gray-500 truncate">{p.description}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-amber-600">${p.price}</div>
                        {p.inStock === false && <div className="text-xs text-red-500 font-medium">Out of stock</div>}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => // Local state handles this
    setLocalProducts((prev) => prev.map((item) => item.id === p.id ? { ...item, inStock: !item.inStock } : item))}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          p.inStock === false
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {p.inStock === false ? '✅ Mark In Stock' : '⏸ Mark Out of Stock'}
                      </button>
                      <button
                        onClick={() => { if (confirm('Remove this product?')) setLocalProducts((prev) => prev.filter((item) => item.id !== p.id)); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
// ============================================
// KID'S BUSINESS CENTER
// ============================================
