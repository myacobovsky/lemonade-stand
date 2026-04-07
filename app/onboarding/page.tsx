// @ts-nocheck
// FILE: app/onboarding/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo, Confetti, stickerSets } from '../components';
import { useApp } from '../../lib/context';

const font = {
  heading: "'Poppins', sans-serif",
  accent: "'DynaPuff', cursive",
};

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

const colorOptions = [
  { name: 'Sunshine', value: 'amber', bg: 'bg-amber-400', ring: 'ring-amber-400' },
  { name: 'Ocean', value: 'blue', bg: 'bg-blue-400', ring: 'ring-blue-400' },
  { name: 'Forest', value: 'green', bg: 'bg-emerald-400', ring: 'ring-emerald-400' },
  { name: 'Bubblegum', value: 'pink', bg: 'bg-pink-400', ring: 'ring-pink-400' },
  { name: 'Grape', value: 'purple', bg: 'bg-purple-400', ring: 'ring-purple-400' },
  { name: 'Tangerine', value: 'orange', bg: 'bg-orange-400', ring: 'ring-orange-400' },
];

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

  const emojiOptions = ['🎁', '🧸', '🎨', '🍪', '💎', '🌸', '⭐', '🦋', '📿', '🧁', '🌱', '🐾'];

  // Save design choices
  const saveDesign = async () => {
    await updateTheme({
      color,
      sticker,
      header_font: headerFont,
      body_font: bodyFont,
    });
    if (bio) await updateStore({ bio });
  };

  // Save product
  const saveProduct = async () => {
    if (!productName || !productPrice) return;
    await addProductToDb({
      name: productName,
      price: parseFloat(productPrice),
      description: productDesc,
      emoji: productEmoji,
      in_stock: true,
      status: 'pending_review',
    });
  };

  const handleComplete = async () => {
    await saveDesign();
    if (productName && productPrice) await saveProduct();
    setShowComplete(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
      <Logo size="lg" /><p className="text-gray-400 mt-3 text-sm">Loading...</p>
    </div>
  );

  if (!store) { router.push('/setup'); return null; }

  // Completion screen
  if (showComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-white flex items-center justify-center px-4">
        <Confetti />
        <div className="text-center max-w-sm">
          <Logo size="xl" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-6" style={{ fontFamily: font.accent }}>
            Your store is ready!
          </h1>
          <p className="text-gray-500 mt-3" style={{ fontFamily: font.heading }}>
            {storeName} is looking great, {kidName}. Time to show the world.
          </p>

          {/* Mini preview */}
          <div className={`mt-6 rounded-2xl p-5 text-center ${
            color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-emerald-50' : color === 'pink' ? 'bg-pink-50' :
            color === 'purple' ? 'bg-purple-50' : color === 'orange' ? 'bg-orange-50' : 'bg-amber-50'
          }`}>
            <div className="text-4xl mb-2">{sticker}</div>
            <h2 className="text-xl font-bold" style={{
              fontFamily: fontOpts.find(f => f.value === headerFont)?.family || "'Poppins', sans-serif",
              color: color === 'blue' ? '#1E40AF' : color === 'green' ? '#065F46' : color === 'pink' ? '#BE185D' :
                color === 'purple' ? '#5B21B6' : color === 'orange' ? '#C2410C' : '#92400E'
            }}>{storeName}</h2>
            {bio && <p className="text-sm text-gray-500 mt-1 italic">"{bio}"</p>}
            <p className="text-xs text-gray-400 mt-1">by {kidName}</p>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button onClick={() => router.push(`/store/${store.id}`)}
              className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-full text-lg transition-all shadow-lg shadow-amber-200 active:scale-[0.97]"
              style={{ fontFamily: font.accent }}>
              Visit My Store
            </button>
            <button onClick={() => router.push('/editor')}
              className="w-full py-3 bg-white border-2 border-amber-200 text-amber-600 font-bold rounded-full text-sm transition-all hover:bg-amber-50"
              style={{ fontFamily: font.accent }}>
              Keep Customizing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white" style={{ fontFamily: font.heading }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="font-bold text-gray-900" style={{ fontFamily: font.accent }}>Build Your Store</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-amber-400 text-white px-3 py-1 rounded-full font-bold" style={{ fontFamily: font.accent }}>{kidName}'s Turn</span>
        </div>
      </header>

      {/* Progress dots */}
      <div className="max-w-xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
              i < step - 1 ? 'w-8 bg-amber-400' :
              i === step - 1 ? 'w-10 bg-amber-500' :
              'w-6 bg-amber-200'
            }`} />
          ))}
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 pb-20">

        {/* ===== STEP 1: Pick your color ===== */}
        {step === 1 && (
          <div className="animate-fadeIn text-center">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
              Pick your store color!
            </h1>
            <p className="text-gray-500 mt-2">This sets the vibe for your whole store.</p>

            <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm mx-auto">
              {colorOptions.map((c) => (
                <button key={c.value} onClick={() => setColor(c.value)}
                  className={`p-4 rounded-2xl border-3 transition-all active:scale-95 ${
                    color === c.value ? 'border-gray-800 scale-[1.05] shadow-lg' : 'border-transparent hover:scale-[1.02]'
                  }`}>
                  <div className={`w-full h-14 rounded-xl ${c.bg} mb-2`} />
                  <div className="text-sm font-bold text-gray-600">{c.name}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-10">
              <button onClick={() => { setStep(2); }}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 rounded-full text-lg transition-all active:scale-[0.97]"
                style={{ fontFamily: font.accent }}>
                Love it! →
              </button>
            </div>
            <button onClick={() => setStep(2)} className="text-sm text-gray-400 mt-3 hover:text-gray-500">Skip for now</button>
          </div>
        )}

        {/* ===== STEP 2: Choose your sticker ===== */}
        {step === 2 && (
          <div className="animate-fadeIn text-center">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
              Choose your sticker!
            </h1>
            <p className="text-gray-500 mt-2">This shows up at the top of your store.</p>

            <div className="mt-6 flex gap-1.5 justify-center flex-wrap">
              {['popular','faces','animals','food','nature','sports'].map((cat) => (
                <button key={cat} onClick={() => setStickerTab(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    stickerTab === cat ? 'bg-amber-400 text-white' : 'bg-white text-gray-500 border border-gray-200'
                  }`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-sm mx-auto">
              {(stickerSets[stickerTab] || stickerSets.popular).map((s) => (
                <button key={s} onClick={() => setSticker(s)}
                  className={`w-14 h-14 text-3xl rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 ${
                    sticker === s ? 'border-amber-400 bg-amber-50 scale-110 shadow-md shadow-amber-100' : 'border-gray-100 hover:border-amber-200 bg-white'
                  }`}>{s}</button>
              ))}
            </div>

            {sticker && (
              <div className="mt-6 animate-fadeIn">
                <div className="text-5xl">{sticker}</div>
                <p className="text-amber-600 text-sm font-semibold mt-1" style={{ fontFamily: font.accent }}>Great pick!</p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={() => setStep(3)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 rounded-full text-lg transition-all active:scale-[0.97]"
                style={{ fontFamily: font.accent }}>Next →</button>
            </div>
            <button onClick={() => setStep(3)} className="text-sm text-gray-400 mt-3 hover:text-gray-500">Skip for now</button>
          </div>
        )}

        {/* ===== STEP 3: Pick your fonts ===== */}
        {step === 3 && (
          <div className="animate-fadeIn text-center">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
              Pick your fonts!
            </h1>
            <p className="text-gray-500 mt-2">Two fonts. One for personality, one for reading.</p>

            {/* Headline font */}
            <div className="mt-8 text-left">
              <h3 className="font-bold text-amber-700 text-sm mb-1" style={{ fontFamily: font.accent }}>Headline font</h3>
              <p className="text-xs text-gray-400 mb-3">This is where you show off your personality. Go bold, go fun!</p>
              <div className="grid grid-cols-2 gap-2">
                {fontOpts.map((f) => (
                  <button key={f.value} onClick={() => setHeaderFont(f.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all active:scale-95 ${
                      headerFont === f.value ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-100' : 'border-gray-100 hover:border-amber-200 bg-white'
                    }`}>
                    <div className="text-lg mb-0.5" style={{ fontFamily: f.family }}>{storeName}</div>
                    <div className="text-xs text-gray-400">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description font */}
            <div className="mt-6 text-left">
              <h3 className="font-bold text-amber-700 text-sm mb-1" style={{ fontFamily: font.accent }}>Description font</h3>
              <p className="text-xs text-gray-400 mb-3">This is where all the info about what you sell will appear. Pick something easy to read!</p>
              <div className="grid grid-cols-2 gap-2">
                {fontOpts.map((f) => (
                  <button key={f.value} onClick={() => setBodyFont(f.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all active:scale-95 ${
                      bodyFont === f.value ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-100' : 'border-gray-100 hover:border-amber-200 bg-white'
                    }`}>
                    <div className="text-sm mb-0.5" style={{ fontFamily: f.family }}>Handmade with love by {kidName}</div>
                    <div className="text-xs text-gray-400">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(2)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={() => setStep(4)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 rounded-full text-lg transition-all active:scale-[0.97]"
                style={{ fontFamily: font.accent }}>Looks great! →</button>
            </div>
            <button onClick={() => setStep(4)} className="text-sm text-gray-400 mt-3 hover:text-gray-500">Skip for now</button>
          </div>
        )}

        {/* ===== STEP 4: Store bio ===== */}
        {step === 4 && (
          <div className="animate-fadeIn text-center">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
              Tell people about your store!
            </h1>
            <p className="text-gray-500 mt-2">A few words about what you make and why it's awesome.</p>

            <div className="mt-8 text-left">
              <textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 150))}
                placeholder={`Hi! I'm ${kidName} and I love making things by hand...`}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-base resize-none" />
              <div className="text-right text-xs text-gray-400 mt-1">{bio.length}/150</div>
            </div>

            {bio && (
              <div className="mt-4 bg-amber-50 rounded-xl p-4 animate-fadeIn">
                <p className="text-xs text-amber-600/60 mb-1">Preview</p>
                <p className="text-gray-700 italic">"{bio}"</p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(3)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={() => setStep(5)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 rounded-full text-lg transition-all active:scale-[0.97]"
                style={{ fontFamily: font.accent }}>{bio ? "Nice! →" : "Next →"}</button>
            </div>
            <button onClick={() => setStep(5)} className="text-sm text-gray-400 mt-3 hover:text-gray-500">Skip for now</button>
          </div>
        )}

        {/* ===== STEP 5: First product ===== */}
        {step === 5 && (
          <div className="animate-fadeIn text-center">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
              Add your first product!
            </h1>
            <p className="text-gray-500 mt-2">This is the exciting part. What do you want to sell?</p>

            <div className="mt-8 text-left space-y-4">
              <div>
                <label className="block text-sm font-bold text-amber-700 mb-1" style={{ fontFamily: font.accent }}>What's it called?</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Friendship Bracelet"
                  className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-lg" />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-700 mb-1" style={{ fontFamily: font.accent }}>How much does it cost?</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-lg text-gray-400">$</span>
                  <input type="number" inputMode="decimal" value={productPrice} onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-700 mb-1" style={{ fontFamily: font.accent }}>Tell customers about it</label>
                <textarea value={productDesc} onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Handmade with love..." rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-sm resize-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-700 mb-2" style={{ fontFamily: font.accent }}>Pick an emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {emojiOptions.map((e) => (
                    <button key={e} onClick={() => setProductEmoji(e)}
                      className={`w-12 h-12 text-2xl rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 ${
                        productEmoji === e ? 'border-amber-400 bg-amber-50 scale-110 shadow-md shadow-amber-100' : 'border-gray-100 hover:border-amber-200 bg-white'
                      }`}>{e}</button>
                  ))}
                </div>
              </div>
            </div>

            {productName && productPrice && (
              <div className="mt-6 bg-white rounded-2xl p-4 border border-amber-100 shadow-sm animate-fadeIn">
                <p className="text-xs text-amber-600/60 mb-2">Product preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">{productEmoji}</div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-800">{productName}</p>
                    {productDesc && <p className="text-xs text-gray-400">{productDesc}</p>}
                  </div>
                  <div className="font-bold text-amber-600 text-lg" style={{ fontFamily: font.accent }}>${productPrice}</div>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4">Your parent will review it before it goes live.</p>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(4)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={() => setStep(6)}
                disabled={!productName || !productPrice}
                className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-full text-lg transition-all active:scale-[0.97]"
                style={{ fontFamily: font.accent }}>Add to My Store! →</button>
            </div>
            <button onClick={() => setStep(6)} className="text-sm text-gray-400 mt-3 hover:text-gray-500">Skip for now</button>
          </div>
        )}

        {/* ===== STEP 6: Review & Launch ===== */}
        {step === 6 && (
          <div className="animate-fadeIn text-center">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
              Your store is looking amazing!
            </h1>
            <p className="text-gray-500 mt-2">Here's what you built.</p>

            {/* Store preview */}
            <div className={`mt-8 rounded-2xl p-6 text-center ${
              color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-emerald-50' : color === 'pink' ? 'bg-pink-50' :
              color === 'purple' ? 'bg-purple-50' : color === 'orange' ? 'bg-orange-50' : 'bg-amber-50'
            }`}>
              <div className="text-5xl mb-2">{sticker}</div>
              <h2 className="text-2xl font-bold" style={{
                fontFamily: fontOpts.find(f => f.value === headerFont)?.family || "'Poppins', sans-serif",
                color: color === 'blue' ? '#1E40AF' : color === 'green' ? '#065F46' : color === 'pink' ? '#BE185D' :
                  color === 'purple' ? '#5B21B6' : color === 'orange' ? '#C2410C' : '#92400E'
              }}>{storeName}</h2>
              {bio && <p className="text-sm text-gray-500 mt-1 italic">"{bio}"</p>}
              <p className="text-xs text-gray-400 mt-1">by {kidName}</p>
            </div>

            {/* Product preview */}
            {productName && productPrice && (
              <div className="mt-4 bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">{productEmoji}</div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-800">{productName}</p>
                    {productDesc && <p className="text-xs text-gray-400">{productDesc}</p>}
                  </div>
                  <div className="font-bold text-amber-600 text-lg" style={{ fontFamily: font.accent }}>${productPrice}</div>
                </div>
              </div>
            )}

            {/* Parent approval reminder */}
            {productName && productPrice && (
              <div className="mt-4 bg-purple-50 rounded-xl p-4 border border-purple-100 flex items-start gap-3 text-left animate-fadeIn">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 text-sm">🔒</div>
                <div>
                  <p className="text-sm font-bold text-purple-800" style={{ fontFamily: font.accent }}>One more step!</p>
                  <p className="text-xs text-purple-600 mt-0.5">Ask your parent to approve your product on the Parent Dashboard. It won't show up in your store until they say it's good to go.</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(5)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={handleComplete}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-bold py-5 rounded-full text-xl transition-all shadow-lg shadow-amber-200 active:scale-[0.97]"
                style={{ fontFamily: font.accent }}>
                I'm Done — Show Me My Store!
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
