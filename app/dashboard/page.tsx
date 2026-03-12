// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar, ParentGate } from '../components';
import { useApp } from '../../lib/context';

export default function DashboardPage() {
  const router = useRouter();
  const { loading, store: storeData, stores, products, orders, updateOrderStatus, confirmPayment, updateProduct, deleteStore, switchStore } = useApp();
  const totalEarnings = storeData?.total_earnings || 0;
  const confirmedSavings = storeData?.confirmed_savings || 0;
  const storeName = storeData?.store_name || 'My Store';
  const kidName = storeData?.kid_name || 'Kid';
  const savingsPercentConfig = storeData?.savings_percent || 50;
  const savingsGoalAmount = storeData?.savings_amount || 100;

  const [completingOrder, setCompletingOrder] = useState(null);
  const [confirmAmount, setConfirmAmount] = useState('');
  const [deletingStore, setDeletingStore] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [confirmSavings, setConfirmSavings] = useState('');

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const acceptedOrders = orders.filter((o) => o.status === 'accepted');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const handleStartComplete = (order) => {
    const totalAmount = order.items ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : order.price;
    setCompletingOrder(order);
    setConfirmAmount(totalAmount.toFixed(2));
    setConfirmSavings((totalAmount * (savingsPercentConfig / 100)).toFixed(2));
  };

  const handleConfirmComplete = () => {
    if (completingOrder) {
      updateOrderStatus(completingOrder.id, 'completed');
      confirmPayment(completingOrder.id, parseFloat(confirmAmount), parseFloat(confirmSavings));
      setCompletingOrder(null);
      setConfirmAmount('');
      setConfirmSavings('');
    }
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
    <ParentGate onCancel={() => router.push('/biz')}>
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <NavBar active="dashboard" />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back, {storeData?.parent_name || 'Parent'}!</h1>
        <p className="text-gray-500 mb-6">Managing {storeName}</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Total Earned</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-600">${totalEarnings.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">{completedOrders.length} sale{completedOrders.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">In Savings</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">${confirmedSavings.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">{savingsPercentConfig}% of earnings</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Orders</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{orders.length}</div>
            <div className="text-xs text-gray-400 mt-1">{pendingOrders.length} pending</div>
          </div>
        </div>

        {/* Savings Progress */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-gray-800 text-sm">Savings Goal: {storeData?.savings_goal || 'New Art Supplies'}</div>
              <div className="text-xs text-gray-400">${confirmedSavings.toFixed(2)} of ${savingsGoalAmount} saved</div>
            </div>
            <div className="text-sm font-bold text-emerald-600">
              {Math.min(Math.round((confirmedSavings / savingsGoalAmount) * 100), 100)}%
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((confirmedSavings / savingsGoalAmount) * 100, 100)}%` }}
            />
          </div>
          {confirmedSavings >= savingsGoalAmount ? (
            <div className="text-sm text-emerald-600 font-medium mt-2">Goal reached! Time to set a new one.</div>
          ) : (
            <div className="text-xs text-gray-400 mt-2">${(savingsGoalAmount - confirmedSavings).toFixed(2)} to go</div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <button onClick={() => router.push('/editor')} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <div className="text-xs font-medium text-gray-700">Edit Store</div>
          </button>
          <button onClick={() => router.push('/store')} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <div className="text-xs font-medium text-gray-700">View Store</div>
          </button>
          <button onClick={() => router.push('/savings')} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <div className="text-xs font-medium text-gray-700">Savings</div>
          </button>
          <button onClick={() => router.push('/shop')} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <div className="text-xs font-medium text-gray-700">Marketplace</div>
          </button>
        </div>

        {/* Share Store */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">Share {kidName}&apos;s Store</h2>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500 border border-gray-200 truncate font-mono">
              getlemonadestand.com/store/{kidName.toLowerCase()}
            </div>
            <button
              onClick={() => { navigator.clipboard?.writeText(`https://getlemonadestand.com/store/${kidName.toLowerCase()}`); }}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-amber-400 hover:bg-amber-500 text-white transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { window.open(`sms:?body=Check out ${kidName}'s store on Lemonade Stand! https://getlemonadestand.com/store/${kidName.toLowerCase()}`); }}
              className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2.5 text-center transition-colors"
            >
              <svg className="w-4 h-4 mx-auto mb-1 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <div className="text-[10px] font-medium text-gray-600">Text</div>
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText(`https://getlemonadestand.com/store/${kidName.toLowerCase()}`); }}
              className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2.5 text-center transition-colors"
            >
              <svg className="w-4 h-4 mx-auto mb-1 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <div className="text-[10px] font-medium text-gray-600">Copy Link</div>
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText(`Check out ${kidName}'s store! https://getlemonadestand.com/store/${kidName.toLowerCase()}`); }}
              className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2.5 text-center transition-colors"
            >
              <svg className="w-4 h-4 mx-auto mb-1 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <div className="text-[10px] font-medium text-gray-600">Share</div>
            </button>
          </div>
        </div>

        {/* Store Management */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 text-sm">Your Stores</h2>
            <button onClick={() => router.push('/setup')} className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium rounded-lg transition-colors">
              + Add Store
            </button>
          </div>
          <div className="space-y-2">
            {stores.map((s) => (
              <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl border ${storeData?.id === s.id ? 'border-amber-200 bg-amber-50' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="text-xl">{storeData?.id === s.id ? '🏪' : '🏬'}</div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{s.store_name}</div>
                    <div className="text-xs text-gray-400">{s.kid_name}{storeData?.id === s.id ? ' · Active' : ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {storeData?.id !== s.id && (
                    <button
                      onClick={() => switchStore(s.id)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Switch
                    </button>
                  )}
                  <button
                    onClick={() => setDeletingStore(s)}
                    className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Store Confirmation */}
        {deletingStore && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-3xl text-center mb-3">⚠️</div>
              <h3 className="font-bold text-lg text-center text-gray-800 mb-2">Delete {deletingStore.store_name}?</h3>
              <div className="bg-red-50 rounded-xl p-4 mb-4 text-sm text-red-700 space-y-1">
                <p>This will permanently delete:</p>
                <p>• All products in this store</p>
                <p>• All order history</p>
                <p>• Store design and settings</p>
                <p>• Savings tracking data</p>
                <p className="font-semibold mt-2">This cannot be undone.</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Type <strong>{deletingStore.kid_name}</strong> to confirm:</label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={deletingStore.kid_name}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-base"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setDeletingStore(null); setDeleteConfirmText(''); }}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (deleteConfirmText.toLowerCase() === deletingStore.kid_name.toLowerCase()) {
                      await deleteStore(deletingStore.id);
                      setDeletingStore(null);
                      setDeleteConfirmText('');
                    }
                  }}
                  disabled={deleteConfirmText.toLowerCase() !== deletingStore.kid_name.toLowerCase()}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    deleteConfirmText.toLowerCase() === deletingStore.kid_name.toLowerCase()
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending orders alert */}
        {pendingOrders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 animate-fadeIn">
            <div className="font-semibold text-amber-800 text-sm">{pendingOrders.length} new order{pendingOrders.length > 1 ? 's' : ''} waiting for your review</div>
          </div>
        )}

        {/* Payment Confirmation Modal */}
        {completingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-bounceIn">
              <h3 className="font-bold text-lg mb-4">💰 Confirm Payment Received</h3>
              <p className="text-gray-600 text-sm mb-4">
                How much did you receive for this order? {kidName}&apos;s savings jar will be updated.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount received ($)</label>
                  <input type="number" value={confirmAmount} onChange={(e) => { setConfirmAmount(e.target.value); setConfirmSavings((parseFloat(e.target.value || 0) * (savingsPercentConfig / 100)).toFixed(2)); }} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount to savings ({savingsPercentConfig}%)</label>
                  <input type="number" value={confirmSavings} onChange={(e) => setConfirmSavings(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setCompletingOrder(null)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium">Cancel</button>
                <button onClick={handleConfirmComplete} className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600">Confirm ✓</button>
              </div>
            </div>
          </div>
        )}


        {/* Product Review */}
        {(() => {
          const pendingProducts = products.filter(p => p.status === 'pending_review');
          if (pendingProducts.length === 0) return null;
          return (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6 animate-fadeIn">
              <div className="font-semibold text-purple-800 text-sm mb-3">
                ✋ {pendingProducts.length} product{pendingProducts.length !== 1 ? 's' : ''} waiting for your approval
              </div>
              <p className="text-xs text-purple-600 mb-4">{kidName} wants to add these to the store. Review and approve to make them visible to customers.</p>
              <div className="space-y-3">
                {pendingProducts.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl p-4 border border-purple-100">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{p.emoji || '🎁'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800">{p.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{p.description || 'No description'}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm font-bold text-amber-600">${p.price}</span>
                          <span className="text-xs text-gray-400">{p.category || 'General'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => updateProduct(p.id, { status: 'approved' })}
                        className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => updateProduct(p.id, { status: 'changes_requested' })}
                        className="py-2.5 px-4 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Request Changes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4">Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-gray-300 mb-2"><svg className="w-10 h-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
              <p>No orders yet. Share your store link to get started!</p>
              <button onClick={() => router.push('/store')} className="mt-4 text-amber-600 font-medium hover:underline">View & share your store →</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className={`rounded-xl border-2 overflow-hidden ${
                  order.status === 'pending' ? 'border-amber-300 bg-amber-50/30' :
                  order.status === 'accepted' ? 'border-blue-200' :
                  order.status === 'completed' ? 'border-emerald-200' :
                  'border-gray-200'
                }`}>
                  {/* Status banner for pending orders */}
                  {order.status === 'pending' && (
                    <div className="bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-800 flex items-center gap-2">
                      <span>🔔</span> New order! Reach out to the customer to arrange pickup or delivery.
                    </div>
                  )}
                  {order.status === 'accepted' && (
                    <div className="bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 flex items-center gap-2">
                      <span>📦</span> Accepted. Contact the customer to complete this order.
                    </div>
                  )}

                  <div className="p-4">
                    {/* Customer info */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-gray-800 text-base">{order.buyer_name || 'Customer'}</div>
                        {order.buyer_contact && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <span className="text-sm text-blue-600 font-medium">{order.buyer_contact}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">${order.total_amount?.toFixed(2) || (order.items ? order.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2) : '0.00')}</div>
                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'declined' ? 'bg-red-100 text-red-500' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                    </div>

                    {/* Items ordered */}
                    <div className="bg-white rounded-lg p-3 mb-3 border border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 mb-2">Items ordered</div>
                      {order.items ? order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                          <span className="text-gray-600 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      )) : <div className="text-sm text-gray-500">Order details unavailable</div>}
                    </div>

                    {/* Customer note */}
                    {order.buyer_note && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-xs font-semibold text-gray-500 mb-1">Note from customer</div>
                        <p className="text-sm text-gray-700 italic">&quot;{order.buyer_note}&quot;</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => updateOrderStatus(order.id, 'accepted')} className="flex-1 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
                            ✓ Accept Order
                          </button>
                          <button onClick={() => updateOrderStatus(order.id, 'declined')} className="py-2.5 px-4 rounded-lg border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors">
                            Decline
                          </button>
                        </>
                      )}
                      {order.status === 'accepted' && (
                        <div className="w-full space-y-2">
                          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
                            <strong>Next step:</strong> Contact {order.buyer_name || 'the customer'} at <strong>{order.buyer_contact || 'their contact info'}</strong> to arrange pickup or delivery. When done, mark complete below.
                          </div>
                          <button onClick={() => handleStartComplete(order)} className="w-full py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
                            Mark Complete & Confirm Payment
                          </button>
                        </div>
                      )}
                      {order.status === 'completed' && (
                        <div className="text-xs text-emerald-600 font-medium">✓ Completed{order.confirmed_amount ? ` — $${order.confirmed_amount.toFixed(2)} received` : ''}</div>
                      )}
                      {order.status === 'declined' && (
                        <div className="text-xs text-gray-400">Order declined</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community Standards */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mt-6">
          <h2 className="font-semibold text-gray-700 text-sm mb-3">Community Standards</h2>
          <div className="text-xs text-gray-500 space-y-2">
            <p><strong>Parent Responsibility:</strong> You are responsible for supervising your child's activity, reviewing and approving all products, and overseeing all orders, payments, and customer interactions.</p>
            <p><strong>Safe & Appropriate Content:</strong> All store names, product listings, descriptions, and images must be appropriate for a family audience. No offensive language, inappropriate imagery, or harmful content.</p>
            <p><strong>Privacy & Safety:</strong> Never share personal information in store listings. Photos of children or children's faces are never permitted in store listings, product images, or banners. All customer communications should be handled by a parent.</p>
            <p><strong>Honest Practices:</strong> Products must be accurately described with fair, clear pricing. Customers must be notified promptly if an order cannot be fulfilled.</p>
            <p><strong>Respect & Moderation:</strong> Treat all community members with kindness. Bullying, harassment, or discrimination is not tolerated. Lemonade Stand reserves the right to review, flag, or remove content that violates these standards.</p>
          </div>
          <a href="/privacy" className="inline-block mt-3 text-xs text-amber-600 hover:underline">Read our full Privacy & Data Practices →</a>
        </div>
      </main>
    </div>
    </ParentGate>
  );
}
