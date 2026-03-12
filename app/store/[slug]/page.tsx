// @ts-nocheck
'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar, Confetti, getPatternStyle, getCardClasses } from '../../components';
import { supabase } from '../../../lib/supabase';

export default function PublicStorePage({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [storeData, setStoreData] = useState(null);
  const [storeTheme, setStoreTheme] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', contact: '', note: '' });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function loadStore() {
      // Try to find store by ID first, then by kid name
      let store = null;

      // Check if slug looks like a UUID (store ID)
      if (slug.length > 20 && slug.includes('-')) {
        const { data } = await supabase
          .from('stores')
          .select('*')
          .eq('id', slug)
          .single();
        if (data) store = data;
      }

      // Fall back to kid name lookup
      if (!store) {
        const { data: stores } = await supabase
          .from('stores')
          .select('*')
          .ilike('kid_name', decodeURIComponent(slug).replace(/-/g, ' '));
        if (stores && stores.length > 0) store = stores[0];
      }

      // Also try with hyphens as spaces
      if (!store) {
        const { data: stores } = await supabase
          .from('stores')
          .select('*')
          .ilike('kid_name', slug);
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

      // Load products
      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .order('sort_order', { ascending: true });
      if (prods) setProducts(prods.filter(p => p.status === 'approved' || !p.status));

      setLoading(false);
    }
    loadStore();
  }, [slug]);

  const storeName = storeData?.store_name || 'Store';
  const kidName = storeData?.kid_name || '';
  const storeBio = storeData?.bio || '';

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
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
      items: cart.map((item) => ({ name: item.product.name, price: item.product.price, quantity: item.quantity })),
      total_amount: cartTotal,
      status: 'pending',
    });
    setOrderSubmitted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Color helpers
  const accentBg = storeTheme?.color === 'blue' ? 'bg-blue-400 hover:bg-blue-500' :
    storeTheme?.color === 'green' ? 'bg-emerald-400 hover:bg-emerald-500' :
    storeTheme?.color === 'pink' ? 'bg-pink-400 hover:bg-pink-500' :
    storeTheme?.color === 'purple' ? 'bg-purple-400 hover:bg-purple-500' :
    storeTheme?.color === 'orange' ? 'bg-orange-400 hover:bg-orange-500' : 'bg-amber-400 hover:bg-amber-500';

  const accentText = storeTheme?.color === 'blue' ? 'text-blue-600' :
    storeTheme?.color === 'green' ? 'text-emerald-600' :
    storeTheme?.color === 'pink' ? 'text-pink-600' :
    storeTheme?.color === 'purple' ? 'text-purple-600' :
    storeTheme?.color === 'orange' ? 'text-orange-600' : 'text-amber-600';

  const pageBg = storeTheme?.color === 'blue' ? 'from-blue-50' :
    storeTheme?.color === 'green' ? 'from-emerald-50' :
    storeTheme?.color === 'pink' ? 'from-pink-50' :
    storeTheme?.color === 'purple' ? 'from-purple-50' :
    storeTheme?.color === 'orange' ? 'from-orange-50' : 'from-amber-50';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-4xl mb-3">🍋</div><p className="text-gray-500">Loading store...</p></div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Store not found</h1>
        <p className="text-gray-500 mb-4">We couldn't find a store for "{slug}"</p>
        <button onClick={() => router.push('/shop')} className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg">Browse all stores</button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-b ${pageBg} to-white`}>
      {showConfetti && <Confetti />}

      {/* Simple nav for public visitors */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">🍋 Lemonade Stand</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/shop')} className="text-sm text-gray-500 hover:text-gray-700">Browse stores</button>
            {cartCount > 0 && (
              <button onClick={() => setShowCart(true)} className={`px-3 py-1.5 rounded-full text-sm font-medium text-white ${accentBg}`}>
                🛒 {cartCount} (${cartTotal.toFixed(2)})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Announcement bar */}
      {storeTheme?.announcement_on && storeTheme?.announcement && (
        <div className={`py-2 px-4 text-center text-sm font-medium text-white ${
          storeTheme?.color === 'blue' ? 'bg-blue-500' :
          storeTheme?.color === 'green' ? 'bg-emerald-500' :
          storeTheme?.color === 'pink' ? 'bg-pink-500' :
          storeTheme?.color === 'purple' ? 'bg-purple-500' :
          storeTheme?.color === 'orange' ? 'bg-orange-500' : 'bg-amber-500'
        }`} style={{ fontFamily: storeTheme?.body_font ? `'${storeTheme.body_font}', sans-serif` : "'Poppins', sans-serif" }}>
          {storeTheme.announcement}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {/* Banner */}
        {storeTheme?.banner_image_url && (
          <div className="mb-6 rounded-2xl overflow-hidden shadow-sm">
            <img src={storeTheme.banner_image_url} alt="Store banner" className="w-full h-48 sm:h-64 object-cover" />
          </div>
        )}

        {/* Store header */}
        <div className={`text-center mb-8 rounded-2xl p-8 relative overflow-hidden ${
          storeTheme?.color === 'blue' ? 'bg-blue-50' :
          storeTheme?.color === 'green' ? 'bg-emerald-50' :
          storeTheme?.color === 'pink' ? 'bg-pink-50' :
          storeTheme?.color === 'purple' ? 'bg-purple-50' :
          storeTheme?.color === 'orange' ? 'bg-orange-50' : 'bg-amber-50'
        }`}>
          {storeTheme?.sticker_pattern && storeTheme?.sticker ? (
            <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><text x='12' y='35' font-size='24' opacity='0.1'>${storeTheme.sticker}</text></svg>`)}")`, backgroundSize: '50px 50px' }} />
          ) : (
            storeTheme?.pattern && storeTheme.pattern !== 'none' && <div className="absolute inset-0" style={getPatternStyle(storeTheme.pattern)} />
          )}
          <div className="relative">
            <div className="text-5xl mb-3">{storeTheme?.sticker || '🍋'}</div>
            {(storeTheme?.accent_stickers || []).length > 0 && (
              <div className="flex justify-center gap-2 mb-2">
                {storeTheme.accent_stickers.map((s, i) => (
                  <span key={i} className="text-2xl" style={{ transform: `rotate(${(i - 1) * 15}deg)` }}>{s}</span>
                ))}
              </div>
            )}
            <h1 className={`text-3xl sm:text-4xl mb-2 font-bold ${
              storeTheme?.color === 'blue' ? 'text-blue-800' :
              storeTheme?.color === 'green' ? 'text-emerald-800' :
              storeTheme?.color === 'pink' ? 'text-pink-800' :
              storeTheme?.color === 'purple' ? 'text-purple-800' :
              storeTheme?.color === 'orange' ? 'text-orange-800' : 'text-amber-800'
            }`} style={{ fontFamily: storeTheme?.header_font ? `'${storeTheme.header_font}', cursive` : "'Poppins', sans-serif" }}>{storeName}</h1>
            <p className="text-gray-600" style={{ fontFamily: storeTheme?.body_font ? `'${storeTheme.body_font}', sans-serif` : "'Poppins', sans-serif" }}>Made with ❤️ by {kidName}</p>
            {storeBio && <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto italic" style={{ fontFamily: storeTheme?.body_font ? `'${storeTheme.body_font}', sans-serif` : "'Poppins', sans-serif" }}>&quot;{storeBio}&quot;</p>}
            <div className="inline-block mt-3 px-3 py-1 bg-white bg-opacity-70 text-gray-600 rounded-full text-sm font-medium">Parent-supervised shop</div>
          </div>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📦</div>
            <p>No products yet. Check back soon!</p>
          </div>
        ) : (
          <div className={`grid ${storeTheme?.product_layout === 'list' ? '' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6`}>
            {products.map((p) => {
              const inCart = cart.find((item) => item.product.id === p.id);
              return (
                <div key={p.id} className={`${storeTheme?.product_layout === 'list' ? 'flex gap-4' : ''} ${getCardClasses(storeTheme?.card_style, p.in_stock, storeTheme?.color)}`}>
                  <div className={`${storeTheme?.product_layout === 'list' ? 'w-32 sm:w-40 shrink-0' : 'h-40'} flex items-center justify-center text-5xl overflow-hidden relative ${
                    storeTheme?.card_style === 'polaroid' ? 'bg-gray-100 rounded-sm' : 'bg-gray-50'
                  }`}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className={`w-full h-full object-cover ${p.in_stock === false ? 'grayscale' : ''}`} />
                    ) : (
                      <span className={p.in_stock === false ? 'grayscale' : ''}>{p.emoji || '🎁'}</span>
                    )}
                    {p.in_stock === false && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                        <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className={`${storeTheme?.product_layout === 'list' ? 'flex-1 py-3 pr-3' : ''} ${storeTheme?.card_style === 'polaroid' ? 'px-1 pt-3 pb-1' : 'p-4'}`}>
                    <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: storeTheme?.card_font ? `'${storeTheme.card_font}', sans-serif` : "'Poppins', sans-serif" }}>{p.name}</h3>
                    <p className="text-gray-500 text-sm mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xl font-bold ${accentText}`} style={{ fontFamily: "'Poppins', sans-serif" }}>${p.price}</span>
                      {p.in_stock === false ? (
                        <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-400">Sold out</span>
                      ) : (
                        <button onClick={() => addToCart(p)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          inCart ? 'bg-emerald-100 text-emerald-700' : `${accentBg} text-white`
                        }`}>
                          {inCart ? `✓ In cart (${inCart.quantity})` : 'Add to cart'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">🛒 Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            {orderSubmitted ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">Order placed!</h3>
                <p className="text-gray-500 text-sm mb-4">{kidName}&apos;s parent will review your order and get back to you.</p>
                <button onClick={() => { setShowCart(false); setCart([]); setOrderSubmitted(false); setBuyerInfo({ name: '', contact: '', note: '' }); }} className={`px-6 py-2 rounded-full text-white font-medium ${accentBg}`}>Done</button>
              </div>
            ) : cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty!</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <div className="font-medium text-gray-800">{item.product.name}</div>
                        <div className="text-sm text-gray-500">${item.product.price} x {item.quantity}</div>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 mb-4">
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
                </div>
                <div className="space-y-3">
                  <input type="text" placeholder="Your name" value={buyerInfo.name} onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:outline-none" />
                  <input type="text" placeholder="Email or phone (so we can reach you)" value={buyerInfo.contact} onChange={(e) => setBuyerInfo({ ...buyerInfo, contact: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:outline-none" />
                  <input type="text" placeholder="Note (optional)" value={buyerInfo.note} onChange={(e) => setBuyerInfo({ ...buyerInfo, note: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:outline-none" />
                  <button onClick={handlePlaceOrder} disabled={!buyerInfo.name || !buyerInfo.contact} className={`w-full py-3 rounded-xl font-semibold text-white transition-colors ${!buyerInfo.name || !buyerInfo.contact ? 'bg-gray-200' : accentBg}`}>
                    Place Order
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3">{kidName}&apos;s parent will confirm your order and arrange pickup/delivery.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
