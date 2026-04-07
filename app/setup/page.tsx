// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo, Confetti } from '../components';
import { useApp } from '../../lib/context';
import { supabase } from '../../lib/supabase';

const font = {
  heading: "'Poppins', sans-serif",
  accent: "'DynaPuff', cursive",
};

export default function SetupPage() {
  const router = useRouter();
  const { user, createStore } = useApp();
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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
    schoolCode: '',
    schoolId: null,
    schoolName: '',
    joiningClub: false,
  });
  const [schoolLookupError, setSchoolLookupError] = useState('');
  const [schoolLookupLoading, setSchoolLookupLoading] = useState(false);

  const totalSteps = 8;
  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

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

  const handleSchoolCodeCheck = async (code) => {
    const trimmed = code.trim().toLowerCase();
    updateField('schoolCode', code);
    setSchoolLookupError('');
    if (!trimmed) { updateField('schoolId', null); updateField('schoolName', ''); return; }
    setSchoolLookupLoading(true);
    const { data } = await supabase.from('schools').select('id, name, slug').eq('slug', trimmed).eq('is_active', true).single();
    setSchoolLookupLoading(false);
    if (data) { updateField('schoolId', data.id); updateField('schoolName', data.name); setSchoolLookupError(''); }
    else { updateField('schoolId', null); updateField('schoolName', ''); setSchoolLookupError('No club found with that code. Check with your club leader.'); }
  };

  const handleComplete = async () => {
    const savingsGoal = formData.savingsGoal === 'Other' ? formData.savingsGoalCustom : formData.savingsGoal;
    if (!user) { router.push('/login'); return; }
    await createStore({
      parent_name: formData.parentName, kid_name: formData.kidName, kid_age_tier: formData.kidAge,
      store_name: formData.storeName, category: formData.category, savings_goal: savingsGoal,
      savings_amount: parseFloat(formData.savingsAmount) || 100, savings_percent: 50,
      school_id: formData.schoolId || null, public_listing: formData.schoolId ? false : true,
    });
    setShowConfetti(true);
    setTimeout(() => router.push('/biz'), 3500);
  };

  const ageTiers = [
    { id: '6-8', label: 'Ages 6-8', desc: 'Young Entrepreneur' },
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
    { emoji: '🎓', label: 'College Fund' },
    { emoji: '🚲', label: 'Bike or Scooter' },
    { emoji: '🎁', label: 'Gift for Someone' },
    { emoji: '💰', label: 'Just Save It!' },
    { emoji: '✏️', label: 'Other' },
  ];

  const savingsAmountOptions = ['25', '50', '100', '250', '500', '1000'];

  const isParentStep = step === 1;
  const isHandoff = step === 2;
  const isKidStep = step >= 3;

  // Celebration screen
  if (showConfetti) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-white flex items-center justify-center px-4">
        <Confetti />
        <div className="text-center">
          <Logo size="xl" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-6" style={{ fontFamily: font.accent }}>
            You did it, {formData.kidName}!
          </h1>
          <p className="text-xl text-amber-600 mt-3 font-semibold" style={{ fontFamily: font.accent }}>
            {formData.storeName} is open for business!
          </p>
          <p className="text-gray-400 text-sm mt-8">Taking you to your store now...</p>
        </div>
      </div>
    );
  }

  // Progress dots for kid steps (steps 3-8 = 6 kid steps)
  const kidStepIndex = step - 3;
  const totalKidSteps = 6;

  return (
    <div className={`min-h-screen ${isParentStep ? 'bg-gray-900' : isHandoff ? 'bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50' : 'bg-gradient-to-b from-amber-50 to-white'}`}>

      {/* Header */}
      <header className={`flex items-center justify-between px-4 sm:px-8 py-4 ${isParentStep ? '' : ''}`}>
        <button onClick={() => router.push('/')} className="flex items-center gap-2">
          <Logo size="sm" />
          <span className={`font-bold text-lg ${isParentStep ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: font.accent }}>Lemonade Stand</span>
        </button>
        <div className="flex items-center gap-3">
          {isParentStep && (
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full font-medium border border-white/10">Parent Setup</span>
          )}
          {isKidStep && (
            <span className="text-xs bg-amber-400 text-white px-3 py-1 rounded-full font-bold" style={{ fontFamily: font.accent }}>{formData.kidName}'s Turn</span>
          )}
        </div>
      </header>

      {/* Progress */}
      {isParentStep && (
        <div className="max-w-xl mx-auto px-4 mb-6">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/40 rounded-full transition-all duration-500" style={{ width: '100%' }} />
          </div>
          <p className="text-white/30 text-xs mt-2 text-center">One step for you, then the fun begins</p>
        </div>
      )}
      {isKidStep && (
        <div className="max-w-xl mx-auto px-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalKidSteps }).map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
                i < kidStepIndex ? 'w-8 bg-amber-400' :
                i === kidStepIndex ? 'w-10 bg-amber-500' :
                'w-6 bg-amber-200'
              }`} />
            ))}
          </div>
        </div>
      )}

      <main className="max-w-xl mx-auto px-4 pb-20">

        {/* ===== STEP 1: PARENT ZONE ===== */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ fontFamily: font.heading }}>Quick Parent Setup</h1>
              <p className="text-white/50 text-sm">Takes about 2 minutes. Then your kid takes the wheel.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Your first name</label>
                <input type="text" value={formData.parentName} onChange={(e) => updateField('parentName', e.target.value)}
                  placeholder="e.g. Sarah" className="w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-white/5 focus:border-amber-400 focus:outline-none text-lg text-white placeholder-white/20" autoComplete="given-name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Your child&apos;s first name</label>
                <input type="text" value={formData.kidName} onChange={(e) => handleKidNameChange(e.target.value)}
                  placeholder="e.g. Emma" className="w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-white/5 focus:border-amber-400 focus:outline-none text-lg text-white placeholder-white/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Age group</label>
                <div className="grid grid-cols-3 gap-2">
                  {ageTiers.map((tier) => (
                    <button key={tier.id} onClick={() => updateField('kidAge', tier.id)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData.kidAge === tier.id
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300 scale-[1.02]'
                          : 'border-white/10 hover:border-white/20 text-white/50'
                      }`}>
                      <div className="font-semibold text-sm">{tier.label}</div>
                      <div className="text-xs mt-0.5 opacity-60">{tier.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* School Club */}
              <div className="pt-1">
                <button onClick={() => {
                    const next = !formData.joiningClub;
                    updateField('joiningClub', next);
                    if (!next) { updateField('schoolCode', ''); updateField('schoolId', null); updateField('schoolName', ''); setSchoolLookupError(''); }
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    formData.joiningClub ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-white/10 hover:border-white/20'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏫</span>
                    <div className="text-left">
                      <div className={`font-medium text-sm ${formData.joiningClub ? 'text-emerald-300' : 'text-white/60'}`}>Joining a school club?</div>
                      <div className="text-xs text-white/30">Enter your club code if you have one</div>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors flex items-center ${formData.joiningClub ? 'bg-emerald-400 justify-end' : 'bg-white/10 justify-start'}`}>
                    <div className="w-5 h-5 bg-white rounded-full shadow mx-0.5" />
                  </div>
                </button>
                {formData.joiningClub && (
                  <div className="mt-3 animate-fadeIn">
                    <input type="text" value={formData.schoolCode} onChange={(e) => handleSchoolCodeCheck(e.target.value)}
                      placeholder="e.g. ps150" className="w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-white/5 focus:border-emerald-400 focus:outline-none text-lg text-white placeholder-white/20" />
                    {schoolLookupLoading && <p className="text-xs text-white/30 mt-1">Looking up club...</p>}
                    {formData.schoolName && (
                      <div className="mt-2 p-3 bg-emerald-400/10 rounded-xl flex items-center gap-2 border border-emerald-400/20">
                        <span className="text-emerald-400">✓</span>
                        <span className="text-sm text-emerald-300 font-medium">{formData.schoolName}</span>
                      </div>
                    )}
                    {schoolLookupError && <p className="text-xs text-red-400 mt-1">{schoolLookupError}</p>}
                  </div>
                )}
              </div>

              {/* Community Standards */}
              <div className="bg-white/5 rounded-2xl p-5 mt-3 border border-white/10">
                <h3 className="font-bold text-white/70 mb-3 text-sm">Community Standards</h3>
                <div className="text-xs text-white/40 space-y-2 mb-4 max-h-32 overflow-y-auto pr-2">
                  <p>By creating a store, you agree to the following:</p>
                  <p><strong className="text-white/50">Parent Responsibility:</strong> You are responsible for supervising your child's activity, reviewing and approving all products, and overseeing orders and interactions.</p>
                  <p><strong className="text-white/50">Safe Content:</strong> All content must be family-appropriate. No offensive language, imagery, or harmful content.</p>
                  <p><strong className="text-white/50">Privacy:</strong> No personal information in listings. No photos of children. All communications handled by a parent.</p>
                  <p><strong className="text-white/50">Respect & Moderation:</strong> Treat everyone with kindness. Lemonade Stand may remove content that violates these standards.</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-white/50">I agree to the Community Standards and will supervise my child's store. <a href="/privacy" target="_blank" className="text-amber-400/70 underline">Privacy Policy</a></span>
                </label>
              </div>
            </div>

            <button onClick={() => setStep(2)}
              disabled={!formData.parentName || !formData.kidName || !formData.kidAge || !agreedToTerms || (formData.joiningClub && !formData.schoolId)}
              className="w-full mt-8 bg-amber-400 hover:bg-amber-500 disabled:bg-white/10 disabled:text-white/20 text-white font-bold py-4 rounded-full text-lg transition-colors">
              All done — hand it to {formData.kidName || 'your kid'} →
            </button>
          </div>
        )}

        {/* ===== STEP 2: HANDOFF ===== */}
        {step === 2 && (
          <div className="animate-fadeIn flex flex-col items-center justify-center py-8 sm:py-16">
            <Logo size="xl" />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-8 text-center leading-tight" style={{ fontFamily: font.accent }}>
              Ok {formData.parentName},<br />hand it over!
            </h1>
            <div className="w-16 h-1 bg-amber-400 rounded-full mt-4" />
            <p className="text-gray-600 mt-6 text-center text-lg" style={{ fontFamily: font.heading }}>
              It's <span className="font-bold text-amber-600" style={{ fontFamily: font.accent }}>{formData.kidName}'s</span> turn now.
            </p>
            <div className="mt-4 bg-white rounded-2xl px-6 py-4 shadow-sm border border-amber-100 max-w-sm">
              <p className="text-gray-500 text-sm text-center leading-relaxed">
                {formData.kidName} will name their store, pick what they sell, and set a savings goal. It only takes a few minutes.
              </p>
            </div>
            <button onClick={() => setStep(3)}
              className="mt-10 px-12 py-5 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-full text-2xl transition-all hover:shadow-xl hover:shadow-amber-200 active:scale-[0.97]"
              style={{ fontFamily: font.accent }}>
              I'm ready!
            </button>
          </div>
        )}

        {/* ===== STEP 3: KID — What's your name? ===== */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <Logo size="lg" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
                Hey there!
              </h1>
              <p className="text-gray-500 mt-2 text-lg" style={{ fontFamily: font.heading }}>First things first. What should we call you?</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              <label className="block text-sm font-bold text-amber-700 mb-2" style={{ fontFamily: font.accent }}>Your name</label>
              <input type="text" value={formData.kidName} onChange={(e) => handleKidNameChange(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-2xl text-center font-bold text-gray-900"
                style={{ fontFamily: font.accent }} />
            </div>

            {formData.kidName && (
              <div className="mt-6 text-center animate-fadeIn">
                <p className="text-amber-600 text-lg font-semibold" style={{ fontFamily: font.accent }}>
                  Nice to meet you, {formData.kidName}!
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(2)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={() => setStep(4)} disabled={!formData.kidName}
                className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-full text-lg transition-colors"
                style={{ fontFamily: font.accent }}>
                That's me! →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: KID — Name your store ===== */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <Logo size="lg" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
                Name your store!
              </h1>
              <p className="text-gray-500 mt-2" style={{ fontFamily: font.heading }}>This is what your customers will see.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              <label className="block text-sm font-bold text-amber-700 mb-2" style={{ fontFamily: font.accent }}>Store name</label>
              <input type="text" value={formData.storeName} onChange={(e) => handleStoreNameChange(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-xl text-center font-bold text-gray-900"
                style={{ fontFamily: font.accent }} />
              {!formData.storeNameEdited && formData.storeName && (
                <p className="text-xs text-amber-400 mt-2 text-center">We picked this for you. Tap to change it!</p>
              )}
            </div>

            {formData.storeName && (
              <div className="mt-6 bg-amber-50 rounded-2xl p-5 border border-amber-100 text-center">
                <p className="text-xs text-amber-600/60 mb-1">Preview</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: font.accent }}>{formData.storeName}</p>
                <p className="text-sm text-gray-400 mt-1">by {formData.kidName}</p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(3)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={() => setStep(5)} disabled={!formData.storeName}
                className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-full text-lg transition-colors"
                style={{ fontFamily: font.accent }}>
                Love it! →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 5: KID — What do you make? ===== */}
        {step === 5 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <Logo size="lg" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
                What do you make?
              </h1>
              <p className="text-gray-500 mt-2" style={{ fontFamily: font.heading }}>Pick what you sell. You can always add more later.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categoryOptions.map((cat) => (
                <button key={cat.label} onClick={() => updateField('category', cat.label)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-sm font-semibold transition-all text-left ${
                    formData.category === cat.label
                      ? 'border-amber-400 bg-amber-50 text-amber-700 scale-[1.03] shadow-md shadow-amber-100'
                      : 'border-gray-200 hover:border-amber-200 text-gray-600 bg-white'
                  }`}>
                  <span className="text-2xl">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(4)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={() => setStep(6)} disabled={!formData.category}
                className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-full text-lg transition-colors"
                style={{ fontFamily: font.accent }}>
                That's what I make! →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 6: KID — What are you saving for? ===== */}
        {step === 6 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <Logo size="lg" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
                What are you saving for?
              </h1>
              <p className="text-gray-500 mt-2" style={{ fontFamily: font.heading }}>Every sale gets you closer.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {savingsGoalOptions.map((goal) => (
                <button key={goal.label} onClick={() => updateField('savingsGoal', goal.label)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-sm font-semibold transition-all text-left ${
                    formData.savingsGoal === goal.label
                      ? 'border-amber-400 bg-amber-50 text-amber-700 scale-[1.03] shadow-md shadow-amber-100'
                      : 'border-gray-200 hover:border-amber-200 text-gray-600 bg-white'
                  }`}>
                  <span className="text-2xl">{goal.emoji}</span>
                  <span>{goal.label}</span>
                </button>
              ))}
            </div>

            {formData.savingsGoal === 'Other' && (
              <input type="text" value={formData.savingsGoalCustom} onChange={(e) => updateField('savingsGoalCustom', e.target.value)}
                placeholder="What are you saving for?" autoFocus
                className="w-full mt-4 px-4 py-4 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-lg bg-white text-center animate-fadeIn" />
            )}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(5)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={() => setStep(7)}
                disabled={!formData.savingsGoal || (formData.savingsGoal === 'Other' && !formData.savingsGoalCustom)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-full text-lg transition-colors"
                style={{ fontFamily: font.accent }}>
                Great pick! →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 7: KID — How much do you need? ===== */}
        {step === 7 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <Logo size="lg" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
                How much do you need?
              </h1>
              <p className="text-gray-500 mt-2" style={{ fontFamily: font.heading }}>
                Set your target. You'll see your progress as you sell.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {savingsAmountOptions.map((amt) => (
                <button key={amt} onClick={() => updateField('savingsAmount', amt)}
                  className={`py-5 rounded-2xl border-2 font-bold text-xl transition-all ${
                    formData.savingsAmount === amt
                      ? 'border-amber-400 bg-amber-50 text-amber-700 scale-105 shadow-md shadow-amber-100'
                      : 'border-gray-200 hover:border-amber-200 text-gray-500 bg-white'
                  }`} style={{ fontFamily: font.accent }}>
                  ${amt}
                </button>
              ))}
            </div>

            {formData.savingsAmount && (
              <div className="mt-6 text-center animate-fadeIn">
                <p className="text-amber-600 font-semibold" style={{ fontFamily: font.accent }}>
                  ${formData.savingsAmount} for {formData.savingsGoal === 'Other' ? formData.savingsGoalCustom : formData.savingsGoal.toLowerCase()}. Let's do this!
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(6)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={() => setStep(8)} disabled={!formData.savingsAmount}
                className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-full text-lg transition-colors"
                style={{ fontFamily: font.accent }}>
                Almost there! →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 8: LAUNCH ===== */}
        {step === 8 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <Logo size="lg" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4" style={{ fontFamily: font.accent }}>
                Ready to launch?
              </h1>
              <p className="text-gray-500 mt-2" style={{ fontFamily: font.heading }}>Here's your store at a glance.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              {[
                ['🧒', 'Owner', formData.kidName],
                ['🏪', 'Store', formData.storeName],
                ['📦', 'Selling', formData.category],
                ['🎯', 'Saving for', formData.savingsGoal === 'Other' ? formData.savingsGoalCustom : formData.savingsGoal],
                ['💰', 'Goal', `$${formData.savingsAmount}`],
                ...(formData.schoolName ? [['🏫', 'Club', formData.schoolName]] : []),
              ].map(([emoji, label, value], i, arr) => (
                <div key={i} className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? 'border-b border-amber-50' : ''}`}>
                  <span className="text-lg w-8 text-center">{emoji}</span>
                  <span className="text-gray-400 text-sm w-20">{label}</span>
                  <span className="font-bold text-gray-900 flex-1 text-right" style={{ fontFamily: font.accent }}>{value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center mt-3">You can change any of this later in your store editor.</p>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(7)} className="px-6 py-4 rounded-full border-2 border-amber-200 text-amber-500 font-semibold">←</button>
              <button onClick={handleComplete}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-bold py-5 rounded-full text-xl transition-all shadow-lg shadow-amber-200 hover:shadow-xl active:scale-[0.97]"
                style={{ fontFamily: font.accent }}>
                Launch My Store!
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
