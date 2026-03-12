// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar, Logo, LearnTip } from '../components';
import { useApp } from '../../lib/context';

export default function BizPage() {
  const router = useRouter();
  const { loading, store: storeData, products, orders, theme: storeTheme, updateTheme: setStoreTheme } = useApp();
  const totalEarnings = storeData?.total_earnings || 0;
  const confirmedSavings = storeData?.confirmed_savings || 0;
  const storeBio = storeData?.bio || '';
  const kidName = storeData?.kid_name || 'Kid';
  const storeName = storeData?.store_name || 'My Store';
  const savingsGoalAmount = storeData?.savings_amount || 100;
  const savingsGoalName = storeData?.savings_goal || 'New Art Supplies';
  const savingsPercentConfig = storeData?.savings_percent || 50;
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const progressPercent = Math.min((confirmedSavings / savingsGoalAmount) * 100, 100);

  const [copiedLink, setCopiedLink] = useState(false);
  const [showFlyer, setShowFlyer] = useState(false);
  const [productCosts, setProductCosts] = useState({});
  
  
  ; // { productId: { materials: '', minutes: '', hourlyRate: '' } }
  

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
      <NavBar active="kid-biz" />

      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Hey {kidName}! 👋</h1>
        <p className="text-gray-500 mb-6">Here&apos;s how your business is doing</p>

        {/* Business Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-1">💰</div>
            <div className="text-xl font-bold text-amber-600">${totalEarnings.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Earned</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-1">📦</div>
            <div className="text-xl font-bold text-blue-600">{pendingOrders.length}</div>
            <div className="text-xs text-gray-500">Orders to fill</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-1">🏪</div>
            <div className="text-xl font-bold text-emerald-600">{products.length}</div>
            <div className="text-xs text-gray-500">Products</div>
          </div>
        </div>

        {/* Savings Progress */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-gray-800 text-sm">🫙 Saving for: {savingsGoalName}</div>
            <div className="text-sm font-bold text-emerald-600">{Math.round(progressPercent)}%</div>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>${confirmedSavings.toFixed(2)} saved</span>
            <span>${savingsGoalAmount} goal</span>
          </div>
          {confirmedSavings >= savingsGoalAmount && (
            <div className="mt-2 text-sm text-emerald-600 font-bold text-center">🎉 You reached your goal!</div>
          )}
        </div>

        {/* Pending Orders Alert */}
        {pendingOrders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 animate-fadeIn">
            <div className="font-bold text-amber-800 text-sm">🔔 You have {pendingOrders.length} order{pendingOrders.length > 1 ? 's' : ''} to fill!</div>
            <p className="text-amber-700 text-xs mt-1">Ask your parent to help you get these ready.</p>
          </div>
        )}

        {/* My Store */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-800 mb-3">🏪 My Store</h2>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => router.push('/editor')} className="bg-amber-50 hover:bg-amber-100 active:scale-95 rounded-xl p-4 text-center transition-all">
              <div className="text-2xl mb-1">🎨</div>
              <div className="text-sm font-medium text-gray-700">Edit Store</div>
            </button>
            <button onClick={() => router.push('/store')} className="bg-blue-50 hover:bg-blue-100 active:scale-95 rounded-xl p-4 text-center transition-all">
              <div className="text-2xl mb-1">👀</div>
              <div className="text-sm font-medium text-gray-700">View Store</div>
            </button>
            <button onClick={() => router.push('/savings')} className="bg-emerald-50 hover:bg-emerald-100 active:scale-95 rounded-xl p-4 text-center transition-all">
              <div className="text-2xl mb-1">🫙</div>
              <div className="text-sm font-medium text-gray-700">Savings</div>
            </button>
          </div>
        </div>




        {/* Money Math */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-bold text-gray-800">💰 Money Math</h2>
            <LearnTip title="Your Money" color="green">
              <p>When you sell something, the money you get is called <strong>sales</strong>.</p>
              <p>But you had to spend money to make it. That is your <strong>cost</strong>.</p>
              <p>The money left over is your <strong>profit</strong>. That is the money you actually keep.</p>
            </LearnTip>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">${totalEarnings.toFixed(2)}</div>
              <div className="text-xs text-amber-700 mt-1 font-medium">Total Sales</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">${confirmedSavings.toFixed(2)}</div>
              <div className="text-xs text-emerald-700 mt-1 font-medium">In Savings</div>
            </div>
          </div>

          {completedOrders.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 mb-5 text-sm text-blue-700">
              <p><strong>{completedOrders.length}</strong> sale{completedOrders.length !== 1 ? 's' : ''} so far · <strong>${(totalEarnings / completedOrders.length).toFixed(2)}</strong> avg per sale</p>
              {savingsGoalAmount > confirmedSavings && (
                <p className="mt-1"><strong>{Math.ceil((savingsGoalAmount - confirmedSavings) / Math.max(totalEarnings / Math.max(completedOrders.length, 1), 1))}</strong> more sale{Math.ceil((savingsGoalAmount - confirmedSavings) / Math.max(totalEarnings / Math.max(completedOrders.length, 1), 1)) !== 1 ? 's' : ''} to reach your savings goal</p>
              )}
            </div>
          )}

          {/* Product profit cards */}
          {products.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-sm font-bold text-gray-700">🧮 How much do I earn?</div>
                <LearnTip title="Cost = Supplies + Time" color="amber">
                  <p>Making things costs money AND time.</p>
                  <p>The beads and string you buy? That is your <strong>supplies</strong> cost.</p>
                  <p>The time you spend making it? That has value too. If you could earn $10/hour babysitting, then 30 minutes of your time is worth $5.</p>
                  <p>Type in what you spend below and see how much you really earn.</p>
                </LearnTip>
              </div>
              <div className="space-y-4">
                {products.map((p) => {
                  const costs = productCosts[p.id] || {};
                  const materials = parseFloat(costs.materials) || 0;
                  const minutes = parseFloat(costs.minutes) || 0;
                  const hourlyRate = parseFloat(costs.hourlyRate) || 0;
                  const timeCost = (minutes / 60) * hourlyRate;
                  const totalCost = materials + timeCost;
                  const hasCost = materials > 0 || (minutes > 0 && hourlyRate > 0);

                  const customPrice = costs.customPrice !== undefined ? parseFloat(costs.customPrice) : null;
                  const currentPrice = customPrice !== null && !isNaN(customPrice) ? customPrice : p.price;
                  const profit = currentPrice - totalCost;
                  const margin = currentPrice > 0 ? Math.round((profit / currentPrice) * 100) : 0;
                  const priceChanged = customPrice !== null && !isNaN(customPrice) && customPrice !== p.price;

                  const goal = parseFloat(costs.goal) || 0;
                  const unitsNeeded = profit > 0 && goal > 0 ? Math.ceil(goal / profit) : 0;

                  const updateCost = (field, value) => {
                    setProductCosts(prev => ({
                      ...prev,
                      [p.id]: { ...(prev[p.id] || {}), [field]: value }
                    }));
                  };

                  return (
                    <div key={p.id} className="bg-gray-50 rounded-xl p-4">
                      {/* Product header with price controls */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{p.emoji || '🎁'}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{p.name}</div>
                        </div>
                      </div>

                      {/* Price control */}
                      <div className="bg-white rounded-lg p-3 mb-3 border border-gray-100">
                        <div className="text-xs font-medium text-gray-500 mb-2">Selling price</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCost('customPrice', String(Math.max(0.5, currentPrice - 1)))}
                            className="w-10 h-10 rounded-lg bg-red-50 text-red-600 font-bold text-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                          >-$1</button>
                          <div className="flex-1 text-center">
                            <div className="text-2xl font-bold text-gray-800">${currentPrice.toFixed(2)}</div>
                            {priceChanged && (
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                was ${p.price.toFixed(2)} · <button onClick={() => updateCost('customPrice', undefined)} className="text-amber-600 hover:underline">reset</button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => updateCost('customPrice', String(currentPrice + 1))}
                            className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-lg hover:bg-emerald-100 transition-colors flex items-center justify-center"
                          >+$1</button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">or set price to</span>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                            <input
                              type="number" min="0" step="0.50" placeholder={String(p.price)}
                              value={customPrice !== null && !isNaN(customPrice) ? costs.customPrice : ''}
                              onChange={(e) => updateCost('customPrice', e.target.value)}
                              className="w-20 pl-5 pr-2 py-1.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                        {priceChanged && (
                          <div className="mt-2 text-xs text-purple-600 bg-purple-50 rounded-lg p-2">
                            {customPrice > p.price
                              ? '📈 Higher price = more profit per sale, but fewer people might buy.'
                              : '📉 Lower price = more people might buy, but you earn less on each one.'}
                          </div>
                        )}
                      </div>

                      {/* Cost inputs */}
                      <div className="bg-white rounded-lg p-3 mb-3 border border-gray-100">
                        <div className="text-xs font-medium text-gray-500 mb-2">My costs</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500 w-16 shrink-0">Supplies</span>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                            <input
                              type="number" min="0" step="0.25" placeholder="0.00"
                              value={costs.materials || ''}
                              onChange={(e) => updateCost('materials', e.target.value)}
                              className="w-20 pl-6 pr-2 py-1.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-500 w-16 shrink-0">Time</span>
                          <input
                            type="number" min="0" step="5" placeholder="min"
                            value={costs.minutes || ''}
                            onChange={(e) => updateCost('minutes', e.target.value)}
                            className="w-14 px-2 py-1.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none text-sm text-center"
                          />
                          <span className="text-xs text-gray-400">min @</span>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                            <input
                              type="number" min="0" step="1" placeholder="0"
                              value={costs.hourlyRate || ''}
                              onChange={(e) => updateCost('hourlyRate', e.target.value)}
                              className="w-14 pl-5 pr-2 py-1.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
                            />
                          </div>
                          <span className="text-xs text-gray-400">/hr</span>
                        </div>
                      </div>

                      {/* Profit result */}
                      {hasCost && (
                        <div className="bg-white rounded-lg p-3 mb-3 border border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>Supplies: ${materials.toFixed(2)}{timeCost > 0 ? ` + Time: $${timeCost.toFixed(2)}` : ''}</span>
                            <span className="font-semibold text-gray-700">Cost: ${totalCost.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`text-xl font-bold ${profit > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {profit > 0 ? '+' : ''}${profit.toFixed(2)} profit
                            </div>
                            <div className="flex-1">
                              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${margin >= 50 ? 'bg-emerald-400' : margin >= 25 ? 'bg-amber-400' : 'bg-red-400'}`}
                                  style={{ width: Math.max(0, Math.min(margin, 100)) + '%' }}
                                />
                              </div>
                            </div>
                          </div>
                          {profit <= 0 && <p className="text-xs text-red-500 mt-2">You are losing money. Raise your price or lower your costs.</p>}
                          {profit > 0 && margin < 30 && <p className="text-xs text-amber-600 mt-2">💡 You are not keeping much. Try raising your price a little.</p>}
                          {profit > 0 && margin >= 60 && <p className="text-xs text-emerald-600 mt-2">🌟 Great. You are keeping most of what you earn.</p>}
                        </div>
                      )}

                      {/* Goal calculator */}
                      {hasCost && profit > 0 && (
                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                          <div className="text-xs font-medium text-gray-500 mb-2">🎯 I want to earn</div>
                          <div className="flex gap-2 flex-wrap">
                            {[25, 50, 100].map((g) => (
                              <button
                                key={g}
                                onClick={() => updateCost('goal', String(g))}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  costs.goal === String(g) ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >${g}</button>
                            ))}
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                              <input
                                type="number" min="0" step="10" placeholder="Other"
                                value={!['25','50','100'].includes(costs.goal) ? (costs.goal || '') : ''}
                                onChange={(e) => updateCost('goal', e.target.value)}
                                className="w-20 pl-6 pr-2 py-1.5 rounded-lg border border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
                              />
                            </div>
                          </div>
                          {unitsNeeded > 0 && (
                            <div className="bg-purple-50 rounded-lg p-3 mt-3 text-center">
                              <div className="text-2xl font-bold text-purple-700">{unitsNeeded}</div>
                              <div className="text-sm text-purple-600">sales to reach ${goal}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p className="text-sm">Add products to use Money Math.</p>
              <button onClick={() => router.push('/editor')} className="mt-2 text-amber-600 text-sm font-medium hover:underline">Go to Editor →</button>
            </div>
          )}
        </div>


        {/* Marketing & Promotion */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-bold text-gray-800">📣 Tell People About Your Store</h2>
            <LearnTip title="Marketing Your Store" color="purple">
              <p>Marketing means telling people about what you sell. The more people who know about your store, the more you can sell!</p>
              <p><strong>Tell your friends.</strong> Word of mouth is the best way to get your first customers.</p>
              <p><strong>Share your link.</strong> Ask your parents to text your store link to neighbors and family.</p>
              <p><strong>Make a sign.</strong> Draw a poster and put it up where people will see it.</p>
              <p><strong>Use your announcement bar.</strong> Change it every week to give people a reason to come back!</p>
            </LearnTip>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              onClick={handleCopyLink}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-xl active:scale-95 border-2 transition-all ${
                copiedLink ? 'border-emerald-400 bg-emerald-50' : 'border-gray-100 bg-gray-50 hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              <span className="text-2xl">{copiedLink ? '✅' : '🔗'}</span>
              <span className="text-xs font-medium text-gray-700">{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={() => { window.open(`sms:?body=Check out ${kidName}'s store on Lemonade Stand! getlemonadestand.com/store/${encodeURIComponent(kidName.toLowerCase())}`); }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-100 bg-gray-50 hover:border-green-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">💬</span>
              <span className="text-xs font-medium text-gray-700">Text</span>
            </button>
            <button
              onClick={() => { handleCopyLink(); }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-100 bg-gray-50 hover:border-pink-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">📸</span>
              <span className="text-xs font-medium text-gray-700">Instagram</span>
            </button>
            <button
              onClick={() => setShowFlyer(!showFlyer)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-100 bg-gray-50 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">🖨️</span>
              <span className="text-xs font-medium text-gray-700">Flyer</span>
            </button>
          </div>

          {/* Store Link */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="text-xs text-gray-500 mb-1">Your store link</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white rounded-lg px-3 py-2 text-sm text-gray-600 border border-gray-200 truncate font-mono text-xs">
                getlemonadestand.com/store/{encodeURIComponent(kidName.toLowerCase())}
              </div>
            </div>
          </div>

          {/* Printable Flyer Preview */}
          {showFlyer && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-3 text-center bg-white">
              <div className="max-w-xs mx-auto">
                <Logo size="lg" />
                <h3 className="text-xl font-bold text-gray-800 mt-3 mb-1" style={{ fontFamily: storeTheme?.headerFont ? `'${storeTheme.headerFont}', cursive` : "'Poppins', sans-serif" }}>{storeName}</h3>
                <p className="text-sm text-gray-600 mb-3">by {kidName}</p>
                {storeBio && <p className="text-xs text-gray-500 italic mb-3">&quot;{storeBio}&quot;</p>}
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="w-24 h-24 mx-auto bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center mb-2">
                    <div className="text-center">
                      <div className="grid grid-cols-5 gap-0.5 w-16 h-16 mx-auto">
                        {Array.from({length: 25}).map((_, i) => (
                          <div key={i} className={`${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'} rounded-[1px]`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">getlemonadestand.com/store/{encodeURIComponent(kidName.toLowerCase())}</div>
                </div>
                <p className="text-xs text-gray-400">Scan the code or visit the link to shop!</p>
              </div>
              <button className="mt-3 text-xs text-amber-600 font-medium hover:underline">Print this flyer</button>
            </div>
          )}

          {/* Quick Marketing Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => router.push('/editor')} className="bg-purple-50 hover:bg-purple-100 rounded-lg p-3 text-left transition-colors">
              <div className="font-medium text-gray-800 text-sm">📢 Update Announcement</div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                {storeTheme?.announcementOn && storeTheme?.announcement
                  ? `"${storeTheme.announcement.slice(0, 30)}${storeTheme.announcement.length > 30 ? '...' : ''}" `
                  : 'No announcement set'}
              </div>
            </button>
            <button onClick={() => router.push('/shop')} className="bg-pink-50 hover:bg-pink-100 rounded-lg p-3 text-left transition-colors">
              <div className="font-medium text-gray-800 text-sm">🛍️ See Other Stores</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Get ideas from other kids</div>
            </button>
          </div>

          {/* Sharing Tips */}
          <div className="mt-3 p-3 bg-amber-50 rounded-lg">
            <div className="text-xs font-semibold text-amber-800 mb-1">Sharing ideas:</div>
            <div className="text-[10px] text-amber-700 space-y-0.5">
              <p>Post on your building&apos;s group chat</p>
              <p>Ask grandparents to share with their friends</p>
              <p>Put a flyer in the lobby or mailroom</p>
              <p>Tell neighbors in the elevator!</p>
            </div>
          </div>
        </div>

        {/* Learn & Grow */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-800 mb-3">📚 Learn Something New</h2>
          <div className="space-y-2">
            {[
              { title: 'How to Pick the Right Price', emoji: '💰', id: 'pricing-101' },
              { title: 'Tell People About Your Store!', emoji: '📣', id: 'marketing-basics' },
              { title: 'Making Customers Happy', emoji: '😊', id: 'customer-service' },
            ].map((article) => (
              <button
                key={article.id}
                onClick={() => router.push('/learn')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-left transition-colors"
              >
                <span className="text-lg">{article.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{article.title}</span>
                <span className="ml-auto text-gray-400 text-xs">Read →</span>
              </button>
            ))}
          </div>
          <button onClick={() => router.push('/learn')} className="w-full mt-3 text-amber-600 text-sm font-medium hover:underline">
            See all lessons →
          </button>
        </div>


        {/* Community Rules */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-800 mb-3">🤝 Our Community Rules</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-3">
              <span className="text-xl shrink-0">😊</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Be Kind</div>
                <p className="text-sm text-gray-600 mt-0.5">Treat every customer and fellow store owner the way you want to be treated. No mean words, no bullying.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-3">
              <span className="text-xl shrink-0">✅</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Be Honest</div>
                <p className="text-sm text-gray-600 mt-0.5">Show your real products. Describe them the way they really are. If something goes wrong with an order, tell your parent right away.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3">
              <span className="text-xl shrink-0">🔒</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Stay Safe</div>
                <p className="text-sm text-gray-600 mt-0.5">Never share your address, phone number, or school name on your store. Your parent handles all the messages with customers.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-3">
              <span className="text-xl shrink-0">📷</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">No Photos of Kids</div>
                <p className="text-sm text-gray-600 mt-0.5">Never put pictures of yourself or other kids on your store. Use photos of your products instead. This is an important rule that keeps everyone safe.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-3">
              <span className="text-xl shrink-0">👀</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Parent Approved</div>
                <p className="text-sm text-gray-600 mt-0.5">Everything you add to your store gets checked by your parent first. This keeps everyone safe and helps you learn.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-pink-50 rounded-xl p-3">
              <span className="text-xl shrink-0">⭐</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Do Your Best</div>
                <p className="text-sm text-gray-600 mt-0.5">Make things you are proud of. Take care with every order. Happy customers come back and tell their friends.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="text-center py-4">
          {completedOrders.length === 0 ? (
            <p className="text-gray-400 text-sm">Ready for your first sale? Share your store link!</p>
          ) : (
            <p className="text-gray-400 text-sm">You&apos;ve made {completedOrders.length} sale{completedOrders.length !== 1 ? 's' : ''}. Keep going! 🌟</p>
          )}
        </div>
      </main>
    </div>
  );
}
