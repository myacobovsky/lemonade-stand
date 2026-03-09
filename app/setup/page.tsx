// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '../components';
import { useApp } from '../../lib/context';

export default function SetupPage() {
  const router = useRouter();
  const { user, createStore } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    parentName: '',
    kidName: '',
    kidAge: '',
    storeName: '',
    storeNameEdited: false,
    category: '',
    savingsGoal: '',
    savingsGoalCustom: '',
    savingsAmount: '',
    savingsPercent: 50,
  });

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  // Auto-generate store name when kid name changes (unless manually edited)
  const handleKidNameChange = (name) => {
    updateField('kidName', name);
    if (!formData.storeNameEdited && name) {
      updateField('storeName', `${name}'s Shop`);
    }
  };

  const handleStoreNameChange = (name) => {
    updateField('storeName', name);
    updateField('storeNameEdited', true);
  };

  const handleComplete = async () => {
    const savingsGoal = formData.savingsGoal === 'Other' ? formData.savingsGoalCustom : formData.savingsGoal;
    if (!user) {
      // Not logged in - redirect to login first
      router.push('/login');
      return;
    }
    await createStore({
      parent_name: formData.parentName,
      kid_name: formData.kidName,
      kid_age_tier: formData.kidAge,
      store_name: formData.storeName,
      category: formData.category,
      savings_goal: savingsGoal,
      savings_amount: parseFloat(formData.savingsAmount) || 100,
      savings_percent: parseInt(formData.savingsPercent) || 50,
    });
    router.push('/biz');
  };

  const ageTiers = [
    { id: '5-8', label: 'Ages 5-8', desc: 'Young Entrepreneur' },
    { id: '9-12', label: 'Ages 9-12', desc: 'Growing Entrepreneur' },
    { id: '13+', label: 'Ages 13+', desc: 'Teen Entrepreneur' },
  ];

  const categoryOptions = [
    { emoji: '📿', label: 'Jewelry & Bracelets' },
    { emoji: '🎨', label: 'Art & Drawings' },
    { emoji: '🍪', label: 'Baked Goods' },
    { emoji: '🧶', label: 'Handmade Crafts' },
    { emoji: '🌱', label: 'Plants & Garden' },
    { emoji: '🧁', label: 'Lemonade & Treats' },
    { emoji: '🐾', label: 'Pet Products' },
    { emoji: '✨', label: 'Other' },
  ];

  const savingsGoalOptions = [
    { emoji: '🎮', label: 'Toy or Game' },
    { emoji: '🎨', label: 'Art Supplies' },
    { emoji: '📱', label: 'Tech / Electronics' },
    { emoji: '🎓', label: 'College Fund (529)' },
    { emoji: '🚲', label: 'Bike or Scooter' },
    { emoji: '🎁', label: 'Gift for Someone' },
    { emoji: '💰', label: 'Just Save It!' },
    { emoji: '✏️', label: 'Other' },
  ];

  const savingsAmountOptions = ['25', '50', '100', '250', '500', '1000'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4">
        <button onClick={() => router.push('/')} className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="font-semibold text-gray-900">Lemonade Stand</span>
        </button>
        <div className="text-sm text-gray-500">Step {step} of 4</div>
      </header>

      {/* Progress bar */}
      <div className="max-w-xl mx-auto px-4 mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 pb-20">
        {/* Step 1: Who's Opening Shop? */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">👋</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Welcome!</h1>
              <p className="text-gray-600">Tell us who&apos;s opening shop today.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your first name</label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => updateField('parentName', e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-lg"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your child&apos;s first name</label>
                <input
                  type="text"
                  value={formData.kidName}
                  onChange={(e) => handleKidNameChange(e.target.value)}
                  placeholder="e.g. Emma"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What age group is {formData.kidName || 'your child'} in?</label>
                <div className="grid grid-cols-3 gap-2">
                  {ageTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => updateField('kidAge', tier.id)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData.kidAge === tier.id
                          ? 'border-amber-400 bg-amber-50 text-amber-700 scale-[1.02]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="font-semibold text-sm">{tier.label}</div>
                      <div className="text-xs mt-0.5 opacity-70">{tier.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!formData.parentName || !formData.kidName || !formData.kidAge}
              className="w-full mt-8 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-full text-lg transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Store Setup */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🏪</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{formData.kidName}&apos;s Store</h1>
              <p className="text-gray-600">Pick a name and what {formData.kidName} will sell.</p>
            </div>
            <div className="space-y-5">
              {/* Auto-suggested store name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store name</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleStoreNameChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-lg"
                />
                {!formData.storeNameEdited && formData.storeName && (
                  <p className="text-xs text-gray-400 mt-1">✨ Auto-suggested! Tap to change it.</p>
                )}
              </div>

              {/* Category - bigger tappable buttons with emojis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What will {formData.kidName} sell?</label>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => updateField('category', cat.label)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        formData.category === cat.label
                          ? 'border-amber-400 bg-amber-50 text-amber-700 scale-[1.02]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-600 font-semibold">←</button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.storeName || !formData.category}
                className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-full text-lg transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Savings Goal */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎯</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Savings Goal</h1>
              <p className="text-gray-600">What is {formData.kidName} saving for?</p>
            </div>
            <div className="space-y-5">
              {/* Savings goal - tappable presets */}
              <div>
                <div className="grid grid-cols-2 gap-2">
                  {savingsGoalOptions.map((goal) => (
                    <button
                      key={goal.label}
                      onClick={() => updateField('savingsGoal', goal.label)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        formData.savingsGoal === goal.label
                          ? 'border-amber-400 bg-amber-50 text-amber-700 scale-[1.02]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <span className="text-lg">{goal.emoji}</span>
                      <span>{goal.label}</span>
                    </button>
                  ))}
                </div>
                {formData.savingsGoal === 'Other' && (
                  <input
                    type="text"
                    value={formData.savingsGoalCustom}
                    onChange={(e) => updateField('savingsGoalCustom', e.target.value)}
                    placeholder="What are they saving for?"
                    className="w-full mt-3 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-lg animate-fadeIn"
                    autoFocus
                  />
                )}
              </div>

              {/* Amount - tappable presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal amount</label>
                <div className="grid grid-cols-3 gap-2">
                  {savingsAmountOptions.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => updateField('savingsAmount', amt)}
                      className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                        formData.savingsAmount === amt
                          ? 'border-amber-400 bg-amber-50 text-amber-700 scale-105'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Savings split slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How much to save? <span className="text-amber-600 font-bold">{formData.savingsPercent}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="10"
                  value={formData.savingsPercent}
                  onChange={(e) => updateField('savingsPercent', parseInt(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">Mostly spending</span>
                  <span className="text-gray-400">Mostly saving</span>
                </div>
                <div className="mt-2 bg-amber-50 rounded-xl p-3 text-center">
                  <span className="text-sm text-amber-800">
                    For every <span className="font-bold">$10</span> earned → <span className="font-bold text-emerald-600">${(10 * formData.savingsPercent / 100).toFixed(0)} saved</span>, <span className="font-bold text-amber-600">${(10 * (100 - formData.savingsPercent) / 100).toFixed(0)} to spend</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(2)} className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-600 font-semibold">←</button>
              <button
                onClick={() => setStep(4)}
                disabled={!formData.savingsGoal || !formData.savingsAmount || (formData.savingsGoal === 'Other' && !formData.savingsGoalCustom)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-full text-lg transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Launch */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🚀</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Ready to Launch!</h1>
              <p className="text-gray-600">Here&apos;s {formData.storeName} at a glance.</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              {[
                ['👤', 'Parent', formData.parentName],
                ['🧒', 'Entrepreneur', `${formData.kidName} (${formData.kidAge})`],
                ['🏪', 'Store', formData.storeName],
                ['📦', 'Selling', formData.category],
                ['🎯', 'Saving for', formData.savingsGoal === 'Other' ? formData.savingsGoalCustom : formData.savingsGoal],
                ['💰', 'Goal', `$${formData.savingsAmount}`],
                ['📊', 'Split', `${formData.savingsPercent}% saved / ${100 - formData.savingsPercent}% spending`],
              ].map(([emoji, label, value], i, arr) => (
                <div key={i} className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className="text-lg w-8 text-center">{emoji}</span>
                  <span className="text-gray-400 text-sm w-24">{label}</span>
                  <span className="font-medium text-gray-800 flex-1 text-right">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">You can change all of this later in your dashboard.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(3)} className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-600 font-semibold">←</button>
              <button
                onClick={handleComplete}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 rounded-full text-lg transition-colors shadow-lg shadow-amber-200"
              >
                🍋 Launch My Store!
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
