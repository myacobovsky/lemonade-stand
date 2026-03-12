// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar, Confetti, getPatternStyle, getCardClasses } from '../components';
import { useApp } from '../../lib/context';

export default function StorePage() {
  const router = useRouter();
  const { loading, store: storeData, products, addOrder: addOrderToDb, theme: storeTheme } = useApp();
  const approvedProducts = products.filter(p => p.status === 'approved' || !p.status);
  const storeBio = storeData?.bio || '';
  const addOrder = async (order) => { await addOrderToDb(order); };
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', contact: '', note: '' });
  const [showConfetti, setShowConfetti] = useState(false);

  const storeName = storeData?.store_name || 'My Store';
  const kidName = storeData?.kid_name || 'Kid';
  const kidAge = storeData?.kidAge || '7';

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = () => {
    if (buyerInfo.name && buyerInfo.contact && cart.length > 0) {
      const order = {
        id: Date.now(),
        items: cart.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        buyerName: buyerInfo.name,
        buyerContact: buyerInfo.contact,
        note: buyerInfo.note,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      addOrder(order);
      setShowConfetti(true);
      setOrderSubmitted(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  if (orderSubmitted) {
    if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">🍋</div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );

  return (
      <div className={`min-h-screen bg-gradient-to-b ${pageBg} to-white flex items-center justify-center p-4`}>
        {showConfetti && <Confetti />}
        <div className="text-center animate-bounceIn">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Sent!</h1>
          <p className="text-gray-600 mb-6">{kidName}&apos;s parent will review your order and get back to you at {buyerInfo.contact}.</p>
          <button onClick={() => router.push('/dashboard')} className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-full transition-colors">
            View Parent Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // Color-based page background
  const pageBg = storeTheme?.color === 'blue' ? 'from-blue-50' :
    storeTheme?.color === 'green' ? 'from-emerald-50' :
    storeTheme?.color === 'pink' ? 'from-pink-50' :
    storeTheme?.color === 'purple' ? 'from-purple-50' :
    storeTheme?.color === 'orange' ? 'from-orange-50' : 'from-amber-50';

  // Accent color for buttons
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

  return (
    <div className={`min-h-screen bg-gradient-to-b ${pageBg} to-white`}>
      {/* Header */}
      <NavBar active="store" />

      {/* Announcement Bar */}
      {storeTheme?.announcement_on && storeTheme?.announcement && (
        <div className={`py-2.5 px-4 text-center text-sm font-medium text-white ${
          storeTheme?.color === 'blue' ? 'bg-blue-500' :
          storeTheme?.color === 'green' ? 'bg-emerald-500' :
          storeTheme?.color === 'pink' ? 'bg-pink-500' :
          storeTheme?.color === 'purple' ? 'bg-purple-500' :
          storeTheme?.color === 'orange' ? 'bg-orange-500' : 'bg-amber-500'
        }`} style={{ fontFamily: storeTheme?.body_font ? `'${storeTheme?.body_font}', sans-serif` : "'Poppins', sans-serif" }}>
          {storeTheme?.announcement}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {/* Banner Image */}
        {storeTheme?.banner_image_url && (
          <div className="mb-6 rounded-2xl overflow-hidden shadow-sm">
            <img src={storeTheme?.banner_image_url} alt="Store banner" className="w-full h-48 sm:h-64 object-cover" />
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
            <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><text x='12' y='35' font-size='24' opacity='0.1'>${storeTheme?.sticker}</text></svg>`)}")`, backgroundSize: '50px 50px' }} />
          ) : (
            storeTheme?.pattern && storeTheme?.pattern !== 'none' && <div className="absolute inset-0" style={getPatternStyle(storeTheme?.pattern)} />
          )}
          <div className="relative">
          <div className="text-5xl mb-3">{storeTheme?.sticker || '🍋'}</div>
          <h1 className={`text-3xl sm:text-4xl mb-2 font-bold ${
            storeTheme?.color === 'blue' ? 'text-blue-800' :
            storeTheme?.color === 'green' ? 'text-emerald-800' :
            storeTheme?.color === 'pink' ? 'text-pink-800' :
            storeTheme?.color === 'purple' ? 'text-purple-800' :
            storeTheme?.color === 'orange' ? 'text-orange-800' : 'text-amber-800'
          }`} style={{ fontFamily: storeTheme?.header_font ? `'${storeTheme?.header_font}', cursive` : "'Poppins', sans-serif" }}>{storeName}</h1>
          <p className="text-gray-600" style={{ fontFamily: storeTheme?.body_font ? `'${storeTheme?.body_font}', sans-serif` : "'Poppins', sans-serif" }}>Made with ❤️ by {kidName}</p>
          {storeBio && <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto italic" style={{ fontFamily: storeTheme?.body_font ? `'${storeTheme?.body_font}', sans-serif` : "'Poppins', sans-serif" }}>&quot;{storeBio}&quot;</p>}
          <div className="inline-block mt-3 px-3 py-1 bg-white bg-opacity-70 text-gray-600 rounded-full text-sm font-medium">
            Parent-supervised shop
          </div>
          {/* Accent Stickers */}
          {storeTheme?.accent_stickers?.length > 0 && (
            <div className="flex justify-center gap-2 mt-3">
              {(storeTheme?.accent_stickers || []).map((s, i) => (
                <span key={i} className="text-2xl" style={{ transform: `rotate(${(i - 1) * 15}deg)` }}>{s}</span>
              ))}
            </div>
          )}
          </div>
        </div>

        {/* Products */}
        {(() => {
          const layout = storeTheme?.product_layout || 'grid';
          const renderProductCard = (p, isFeatured = false) => {
            const inCart = cart.find((item) => item.product.id === p.id);
            const imgHeight = isFeatured ? 'h-64' : 'h-40';
            const imgBlock = (
              <>
                {p.image ? (
                  <img src={p.image} alt={p.name} className={`w-full h-full object-cover ${p.inStock === false ? 'grayscale' : ''}`} />
                ) : (
                  <span className={p.inStock === false ? 'grayscale' : ''}>{p.emoji || '🎁'}</span>
                )}
                {p.inStock === false && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                    <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
                  </div>
                )}
              </>
            );
            const priceBtn = (
              <div className="flex items-center justify-between">
                <span className={`${isFeatured ? 'text-2xl' : 'text-xl'} font-bold ${accentText}`} style={{ fontFamily: "'Poppins', sans-serif" }}>${p.price}</span>
                {p.inStock === false ? (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-400">Sold out</span>
                ) : (
                  <button onClick={() => addToCart(p)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    inCart ? 'bg-emerald-100 text-emerald-700' : `${accentBg} text-white`
                  }`}>
                    {inCart ? `✓ In cart (${inCart.quantity})` : 'Add to cart'}
                  </button>
                )}
              </div>
            );

            if (layout === 'list' && !isFeatured) {
              return (
                <div key={p.id} className={`flex gap-4 ${getCardClasses(storeTheme?.card_style, p.inStock, storeTheme?.color)}`}>
                  <div className={`w-32 sm:w-40 shrink-0 flex items-center justify-center text-4xl overflow-hidden relative ${
                    storeTheme?.card_style === 'polaroid' ? 'bg-gray-100 rounded-sm' : 'bg-gray-50'
                  }`}>{imgBlock}</div>
                  <div className="flex-1 py-3 pr-3">
                    <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: storeTheme?.card_font ? `'${storeTheme?.card_font}', sans-serif` : "'Poppins', sans-serif" }}>{p.name}</h3>
                    <p className="text-gray-500 text-sm mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.description}</p>
                    {priceBtn}
                  </div>
                </div>
              );
            }

            return (
              <div key={p.id} className={getCardClasses(storeTheme?.card_style, p.inStock, storeTheme?.color)}>
                <div className={`${imgHeight} flex items-center justify-center ${isFeatured ? 'text-7xl' : 'text-5xl'} overflow-hidden relative ${
                  storeTheme?.card_style === 'polaroid' ? 'bg-gray-100 rounded-sm' : 'bg-gray-50'
                }`}>{imgBlock}</div>
                <div className={storeTheme?.card_style === 'polaroid' ? 'px-1 pt-3 pb-1' : 'p-4'}>
                  <h3 className={`font-bold text-gray-800 mb-1 ${isFeatured ? 'text-xl' : ''}`} style={{ fontFamily: storeTheme?.card_font ? `'${storeTheme?.card_font}', sans-serif` : "'Poppins', sans-serif" }}>{p.name}</h3>
                  <p className="text-gray-500 text-sm mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.description}</p>
                  {priceBtn}
                </div>
              </div>
            );
          };

          if (layout === 'featured' && approvedProducts.length > 0) {
            return (
              <div className="space-y-6">
                {renderProductCard(products[0], true)}
                {approvedProducts.length > 1 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {approvedProducts.slice(1).map((p) => renderProductCard(p))}
                  </div>
                )}
              </div>
            );
          }
          if (layout === 'list') {
            return (
              <div className="space-y-4">
                {approvedProducts.map((p) => renderProductCard(p))}
              </div>
            );
          }
          return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {approvedProducts.map((p) => renderProductCard(p))}
            </div>
          );
        })()}
      </main>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md max-h-[80vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">🛒 Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty!</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded object-cover" />
                        ) : (
                          <span className="text-xl">{item.product.emoji || '🎁'}</span>
                        )}
                        <div>
                          <div className="font-medium text-sm">{item.product.name}</div>
                          <div className="text-xs text-gray-500">${item.product.price} × {item.quantity}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">${(item.product.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-200 mb-4">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-amber-600 text-lg">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={buyerInfo.name}
                    onChange={(e) => setBuyerInfo((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name *"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={buyerInfo.contact}
                    onChange={(e) => setBuyerInfo((prev) => ({ ...prev, contact: e.target.value }))}
                    placeholder="Phone or email *"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                  />
                  <textarea
                    value={buyerInfo.note}
                    onChange={(e) => setBuyerInfo((prev) => ({ ...prev, note: e.target.value }))}
                    placeholder="Note for the seller (optional)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                  />
                </div>
                <button
                  onClick={handleSubmitOrder}
                  disabled={!buyerInfo.name || !buyerInfo.contact}
                  className="w-full py-4 rounded-full bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-lg transition-colors"
                >
                  Send Order Request 🍋
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  {kidName}&apos;s parent will confirm your order and arrange pickup/delivery.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
