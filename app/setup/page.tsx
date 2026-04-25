// @ts-nocheck
// FILE: app/setup/page.tsx

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Gem,
  Palette,
  Cookie,
  Scissors,
  Sprout,
  CupSoda,
  PawPrint,
  Sparkles,
  Gamepad2,
  Smartphone,
  GraduationCap,
  Bike,
  Gift,
  PiggyBank,
  Pencil,
} from 'lucide-react';
import { Logo, Confetti } from '../components';
import { useApp } from '../../lib/context';
import { supabase } from '../../lib/supabase';

// ====================== DESIGN TOKENS ======================
// We use the same palette across the whole flow, but lean on different
// shades to create a parent/kid temperature distinction (Option C).
// Parent zone: amberDeep accents, tighter density, serious tone.
// Kid zone: amberAccent (brighter) accents, larger type, warmer tone.
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
  amberAccent: '#D97706',  // kid zone (warmer/brighter)
  amberDeep: '#92400E',    // parent zone (deeper, more serious)
  amberBtn: '#FCD34D',
  success: '#059669',
  successBg: '#D1FAE5',
  successBorder: '#10B98140',
  danger: '#DC2626',
  tipBg: '#EDE9FE',
  tipInk: '#4C1D95',
};

const font = {
  sans: "'Poppins', sans-serif",
};

// ====================== ICON MAP ======================
// Maps each option label to a Lucide icon component. Lucide icons accept
// `size`, `strokeWidth`, and inherit `color` via currentColor — perfect for
// our active-state color flip (amber → ink) without re-render gymnastics.
const CATEGORY_ICONS = {
  'Jewelry & Bracelets': Gem,
  'Art & Drawings':      Palette,
  'Baked Goods':         Cookie,
  'Handmade Crafts':     Scissors,
  'Plants & Garden':     Sprout,
  'Lemonade & Treats':   CupSoda,
  'Pet Products':        PawPrint,
  'Other':               Sparkles,
};

const SAVINGS_ICONS = {
  'Toy or Game':        Gamepad2,
  'Art Supplies':       Palette,
  'Tech / Electronics': Smartphone,
  'College Fund':       GraduationCap,
  'Bike or Scooter':    Bike,
  'Gift for Someone':   Gift,
  'Just Save It!':      PiggyBank,
  'Other':              Pencil,
};

// ====================== OPTION DATA ======================
const AGE_TIERS = [
  { id: '6-8',  label: 'Ages 6-8',  desc: 'Young entrepreneur' },
  { id: '9-12', label: 'Ages 9-12', desc: 'Growing entrepreneur' },
  { id: '13+',  label: 'Ages 13+',  desc: 'Teen entrepreneur' },
];

const CATEGORY_OPTIONS = [
  { label: 'Jewelry & Bracelets' },
  { label: 'Art & Drawings' },
  { label: 'Baked Goods' },
  { label: 'Handmade Crafts' },
  { label: 'Plants & Garden' },
  { label: 'Lemonade & Treats' },
  { label: 'Pet Products' },
  { label: 'Other' },
];

const SAVINGS_GOAL_OPTIONS = [
  { label: 'Toy or Game' },
  { label: 'Art Supplies' },
  { label: 'Tech / Electronics' },
  { label: 'College Fund' },
  { label: 'Bike or Scooter' },
  { label: 'Gift for Someone' },
  { label: 'Just Save It!' },
  { label: 'Other' },
];

const SAVINGS_AMOUNT_OPTIONS = ['25', '50', '100', '250', '500', '1000'];

// ====================== COMPONENT ======================
export default function SetupPage() {
  const router = useRouter();
  const { user, createStore } = useApp();
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [miniConfetti, setMiniConfetti] = useState(false); // celebrates kid milestones inline
  const [pulseKey, setPulseKey] = useState(0); // bumps to retrigger headline animation
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

  // Celebrate a milestone — used when kid advances on key kid steps (3, 4, 5, 6, 7).
  // Fires mini confetti for ~1.5s and bumps a pulse key so the next screen's
  // headline can replay its bounce animation.
  const celebrateMilestone = () => {
    setMiniConfetti(true);
    setPulseKey((k) => k + 1);
    setTimeout(() => setMiniConfetti(false), 1500);
  };

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

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
    if (!trimmed) {
      updateField('schoolId', null);
      updateField('schoolName', '');
      return;
    }
    setSchoolLookupLoading(true);
    const { data } = await supabase
      .from('schools')
      .select('id, name, slug')
      .eq('slug', trimmed)
      .eq('is_active', true)
      .single();
    setSchoolLookupLoading(false);
    if (data) {
      updateField('schoolId', data.id);
      updateField('schoolName', data.name);
      setSchoolLookupError('');
    } else {
      updateField('schoolId', null);
      updateField('schoolName', '');
      setSchoolLookupError("No club found with that code. Check with your club leader.");
    }
  };

  const handleComplete = async () => {
    const savingsGoal = formData.savingsGoal === 'Other' ? formData.savingsGoalCustom : formData.savingsGoal;
    if (!user) {
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
      savings_percent: 50,
      school_id: formData.schoolId || null,
      public_listing: formData.schoolId ? false : true,
    });
    setShowConfetti(true);
    setTimeout(() => router.push('/onboarding'), 3500);
  };

  // Zone classification — drives styling decisions
  const isParentStep = step === 1;
  const isHandoff = step === 2;
  const isKidStep = step >= 3;

  // Active accent color — deeper for parent, brighter for kid
  const accent = isParentStep ? C.amberDeep : C.amberAccent;

  // ====================== CELEBRATION SCREEN ======================
  if (showConfetti) {
    const kidColors = { tint: '#FEF3C7', deep: '#92400E' };
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
      >
        <Confetti />
        <div className="text-center max-w-md">
          <p
            className="text-xs uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: C.amberAccent }}
          >
            Congratulations
          </p>
          <h1
            className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02]"
            style={{ fontWeight: 800, color: C.ink }}
          >
            You did it,{' '}
            <span style={{ color: C.amberAccent }}>{formData.kidName}!</span>
          </h1>
          <p
            className="mt-4 text-lg"
            style={{ color: C.inkMuted, fontWeight: 600 }}
          >
            {formData.storeName} is open for business.
          </p>
          <p
            className="mt-8 text-sm"
            style={{ color: C.inkFaint }}
          >
            Taking you to your store now…
          </p>
        </div>
      </div>
    );
  }

  // Progress dots — kid steps only (steps 3-8 = 6 kid steps)
  const kidStepIndex = step - 3;
  const totalKidSteps = 6;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      {/* Mini confetti fires when kid hits a milestone (Steps 3-7 advance) */}
      {miniConfetti && <Confetti />}

      {/* Inline animation styles for bouncy active states + headline pop */}
      <style>{`
        @keyframes setup-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.1); }
          70% { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        @keyframes setup-bounce-in {
          0% { transform: translateY(8px) scale(0.95); opacity: 0; }
          60% { transform: translateY(-3px) scale(1.04); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes setup-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        .setup-pop-on-active { animation: setup-pop 0.4s ease-out; }
        .setup-bounce-headline { animation: setup-bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .setup-wiggle-icon { animation: setup-wiggle 0.5s ease-in-out; }
      `}</style>

      {/* ===== HEADER (custom for setup wizard) ===== */}
      <header
        className="px-4 sm:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${C.borderFaint}` }}
      >
        <Link href="/" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
          <span
            style={{
              fontFamily: "'DynaPuff', cursive",
              fontSize: '17px',
              fontWeight: 700,
              color: C.ink,
              whiteSpace: 'nowrap',
            }}
          >
            Lemonade Stand
          </span>
        </Link>

        {/* Status pill — different label per zone */}
        {isParentStep && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: C.amberDeep,
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              padding: '4px 12px',
              borderRadius: '999px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: `1px 1px 0 ${C.ink}14`,
            }}
          >
            Parent setup
          </span>
        )}
        {isKidStep && formData.kidName && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: C.ink,
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              padding: '4px 12px',
              borderRadius: '999px',
              boxShadow: `1px 1px 0 ${C.ink}14`,
            }}
          >
            {formData.kidName}'s turn
          </span>
        )}
      </header>

      {/* ===== PROGRESS ===== */}
      {isParentStep && (
        <div className="max-w-xl mx-auto px-4 pt-6 pb-2">
          <div
            style={{
              height: '6px',
              borderRadius: '999px',
              backgroundColor: C.borderInput,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: '20%',
                backgroundColor: C.amberDeep,
                borderRadius: '999px',
                transition: 'width 0.5s',
              }}
            />
          </div>
          <p
            className="text-center mt-3"
            style={{
              fontSize: '11px',
              color: C.inkFaint,
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            One step for you, then the fun begins
          </p>
        </div>
      )}

      {isKidStep && (
        <div className="max-w-xl mx-auto px-4 pt-6 pb-2">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalKidSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '6px',
                  borderRadius: '999px',
                  transition: 'all 0.3s',
                  width: i === kidStepIndex ? '32px' : i < kidStepIndex ? '24px' : '16px',
                  backgroundColor: i === kidStepIndex ? C.ink : i < kidStepIndex ? C.amberAccent : C.borderInput,
                }}
              />
            ))}
          </div>
          <p
            className="text-center mt-3"
            style={{
              fontSize: '11px',
              color: C.inkFaint,
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            Step {kidStepIndex + 1} of {totalKidSteps}
          </p>
        </div>
      )}


      <main className="max-w-xl mx-auto px-4 pb-20 pt-4">

        {/* =========================================================
            STEP 1 — PARENT SETUP
            Tighter density, deeper amber accents, "serious" tone.
            ========================================================= */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-7">
              <p
                className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
                style={{ color: C.amberDeep }}
              >
                For parents
              </p>
              <h1
                className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
                style={{ fontWeight: 800, color: C.ink }}
              >
                Set up your kid's{' '}
                <span style={{ color: C.amberDeep }}>store.</span>
              </h1>
              <p
                className="mt-3"
                style={{ fontSize: '14px', color: C.inkMuted, lineHeight: 1.5 }}
              >
                Takes about 2 minutes. Then your kid takes the wheel.
              </p>
            </div>

            <div className="space-y-3">
              {/* Parent name */}
              <ParentField label="Your first name">
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => updateField('parentName', e.target.value)}
                  placeholder="e.g. Sarah"
                  autoComplete="given-name"
                  className="focus:outline-none"
                  style={parentInputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                />
              </ParentField>

              {/* Kid name */}
              <ParentField label="Your kid's first name">
                <input
                  type="text"
                  value={formData.kidName}
                  onChange={(e) => handleKidNameChange(e.target.value)}
                  placeholder="e.g. Emma"
                  className="focus:outline-none"
                  style={parentInputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                />
              </ParentField>

              {/* Age tier */}
              <ParentField label="Age group">
                <div className="grid grid-cols-3 gap-2">
                  {AGE_TIERS.map((tier) => {
                    const isActive = formData.kidAge === tier.id;
                    return (
                      <button
                        key={tier.id}
                        onClick={() => updateField('kidAge', tier.id)}
                        className="transition-all"
                        style={{
                          padding: '10px 6px',
                          borderRadius: '12px',
                          border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                          boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                          transform: isActive ? 'translate(-1px, -1px)' : 'none',
                          backgroundColor: isActive ? C.amberBtn : C.cardBg,
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 800,
                            color: C.ink,
                            marginBottom: '1px',
                          }}
                        >
                          {tier.label}
                        </div>
                        <div
                          style={{
                            fontSize: '10px',
                            color: C.inkFaint,
                            fontWeight: 600,
                          }}
                        >
                          {tier.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ParentField>

              {/* School club toggle */}
              <div
                style={{
                  backgroundColor: C.cardBg,
                  border: `1px solid ${C.border}`,
                  borderRadius: '14px',
                  padding: '14px 16px',
                  boxShadow: `2px 2px 0 ${C.ink}12`,
                }}
              >
                <button
                  onClick={() => {
                    const next = !formData.joiningClub;
                    updateField('joiningClub', next);
                    if (!next) {
                      updateField('schoolCode', '');
                      updateField('schoolId', null);
                      updateField('schoolName', '');
                      setSchoolLookupError('');
                    }
                  }}
                  className="w-full flex items-center justify-between"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: C.ink,
                        marginBottom: '2px',
                      }}
                    >
                      Joining a school club?
                    </div>
                    <div style={{ fontSize: '12px', color: C.inkFaint }}>
                      Enter your club code if you have one.
                    </div>
                  </div>
                  {/* Chunky toggle */}
                  <div
                    style={{
                      position: 'relative',
                      width: '44px',
                      height: '24px',
                      borderRadius: '999px',
                      backgroundColor: formData.joiningClub ? C.amberBtn : '#D6D3D1',
                      border: `1.5px solid ${C.ink}`,
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '1px',
                        left: formData.joiningClub ? '21px' : '1px',
                        width: '19px',
                        height: '19px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: `1px solid ${C.ink}`,
                        transition: 'all 0.2s',
                      }}
                    />
                  </div>
                </button>

                {formData.joiningClub && (
                  <div className="mt-3 animate-fadeIn">
                    <input
                      type="text"
                      value={formData.schoolCode}
                      onChange={(e) => handleSchoolCodeCheck(e.target.value)}
                      placeholder="e.g. ps150"
                      className="focus:outline-none"
                      style={{
                        ...parentInputStyle,
                        marginTop: '8px',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                    />
                    {schoolLookupLoading && (
                      <p style={{ fontSize: '11px', color: C.inkFaint, marginTop: '6px' }}>
                        Looking up club…
                      </p>
                    )}
                    {formData.schoolName && (
                      <div
                        className="mt-2"
                        style={{
                          padding: '10px 14px',
                          backgroundColor: C.successBg,
                          border: `1px solid ${C.successBorder}`,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: C.success, fontWeight: 800 }}>✓</span>
                        <span style={{ fontSize: '13px', color: C.success, fontWeight: 700 }}>
                          {formData.schoolName}
                        </span>
                      </div>
                    )}
                    {schoolLookupError && (
                      <p style={{ fontSize: '12px', color: C.danger, marginTop: '6px' }}>
                        {schoolLookupError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Community Standards */}
              <div
                style={{
                  backgroundColor: C.creamWarm,
                  border: `1px solid ${C.borderFaint}`,
                  borderRadius: '14px',
                  padding: '16px 18px',
                  marginTop: '8px',
                }}
              >
                <p
                  className="text-xs uppercase tracking-[0.14em] font-bold mb-2"
                  style={{ color: C.amberDeep }}
                >
                  Community standards
                </p>
                <div
                  style={{
                    fontSize: '12px',
                    color: C.inkMuted,
                    lineHeight: 1.55,
                    maxHeight: '128px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}
                >
                  <p style={{ marginBottom: '8px' }}>By creating a store, you agree to the following:</p>
                  <p style={{ marginBottom: '6px' }}>
                    <strong style={{ color: C.ink, fontWeight: 700 }}>Parent responsibility:</strong>{' '}
                    You are responsible for supervising your kid's activity, reviewing and approving all products, and overseeing orders and interactions.
                  </p>
                  <p style={{ marginBottom: '6px' }}>
                    <strong style={{ color: C.ink, fontWeight: 700 }}>Safe content:</strong>{' '}
                    All content must be family-appropriate. No offensive language, imagery, or harmful content.
                  </p>
                  <p style={{ marginBottom: '6px' }}>
                    <strong style={{ color: C.ink, fontWeight: 700 }}>Privacy:</strong>{' '}
                    No personal information in listings. No photos of children. All communications handled by a parent.
                  </p>
                  <p>
                    <strong style={{ color: C.ink, fontWeight: 700 }}>Respect & moderation:</strong>{' '}
                    Treat everyone with kindness. Lemonade Stand may remove content that violates these standards.
                  </p>
                </div>
                <label
                  className="flex items-start gap-3 cursor-pointer mt-3"
                  style={{ paddingTop: '10px', borderTop: `1px solid ${C.borderFaint}` }}
                >
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      marginTop: '2px',
                      flexShrink: 0,
                      accentColor: C.amberDeep,
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: '12px', color: C.inkMuted, lineHeight: 1.5 }}>
                    I agree to the community standards and will supervise my kid's store.{' '}
                    <Link
                      href="/privacy"
                      target="_blank"
                      style={{
                        color: C.amberDeep,
                        fontWeight: 700,
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px',
                      }}
                    >
                      Privacy policy
                    </Link>
                  </span>
                </label>
              </div>
            </div>

            {/* Continue button */}
            <button
              onClick={() => setStep(2)}
              disabled={
                !formData.parentName ||
                !formData.kidName ||
                !formData.kidAge ||
                !agreedToTerms ||
                (formData.joiningClub && !formData.schoolId)
              }
              className="w-full transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
              style={{
                backgroundColor: C.amberBtn,
                color: C.ink,
                border: `1.5px solid ${C.ink}`,
                boxShadow: `3px 3px 0 ${C.ink}`,
                borderRadius: '14px',
                padding: '15px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '-0.005em',
              }}
            >
              All set — pass it to {formData.kidName || 'your kid'} →
            </button>
          </div>
        )}

        {/* =========================================================
            STEP 2 — HANDOFF
            The transition moment. Bigger spread, single focus.
            ========================================================= */}
        {step === 2 && (
          <div className="animate-fadeIn flex flex-col items-center justify-center py-8 sm:py-14 text-center">
            <Logo size="xl" />
            <p
              className="text-xs uppercase tracking-[0.25em] font-bold mt-6 mb-2"
              style={{ color: C.amberAccent }}
            >
              Handoff time
            </p>
            <h1
              className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02] max-w-md"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Ok {formData.parentName},<br />
              <span style={{ color: C.amberAccent }}>hand it over.</span>
            </h1>

            <div
              className="mt-4"
              style={{
                width: '60px',
                height: '4px',
                borderRadius: '999px',
                backgroundColor: C.amberBtn,
                border: `1px solid ${C.ink}`,
              }}
            />

            <p
              className="mt-6 max-w-md"
              style={{ fontSize: '17px', color: C.inkMuted, lineHeight: 1.5 }}
            >
              It's{' '}
              <span style={{ color: C.amberAccent, fontWeight: 800 }}>
                {formData.kidName}'s
              </span>{' '}
              turn now.
            </p>

            <div
              className="mt-6 max-w-sm"
              style={{
                backgroundColor: C.cardBg,
                border: `1px solid ${C.border}`,
                borderRadius: '14px',
                padding: '14px 18px',
                boxShadow: `2px 2px 0 ${C.ink}12`,
              }}
            >
              <p style={{ fontSize: '13px', color: C.inkMuted, lineHeight: 1.55 }}>
                {formData.kidName} will name their store, pick what they sell, and set a savings goal. Only takes a few minutes.
              </p>
            </div>

            <button
              onClick={() => setStep(3)}
              className="transition-all hover:-translate-y-0.5 mt-10"
              style={{
                backgroundColor: C.amberBtn,
                color: C.ink,
                border: `1.5px solid ${C.ink}`,
                boxShadow: `4px 4px 0 ${C.ink}`,
                borderRadius: '16px',
                padding: '18px 36px',
                fontWeight: 800,
                fontSize: '18px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '-0.005em',
              }}
            >
              I'm ready! →
            </button>
          </div>
        )}

        {/* =========================================================
            STEP 3 — KID: WHAT'S YOUR NAME?
            Brighter amber, larger headline, warmer copy.
            ========================================================= */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <p
                className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
                style={{ color: C.amberAccent }}
              >
                Welcome
              </p>
              <h1
                key={pulseKey} className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05] setup-bounce-headline"
                style={{ fontWeight: 800, color: C.ink }}
              >
                Hey there!
              </h1>
              <p
                className="mt-3"
                style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
              >
                First things first.{' '}
                <span style={{ color: C.amberAccent, fontWeight: 700 }}>
                  What should we call you?
                </span>
              </p>
            </div>

            <div
              style={{
                backgroundColor: C.cardBg,
                border: `1.5px solid ${C.ink}`,
                borderRadius: '18px',
                padding: '20px',
                boxShadow: `3px 3px 0 ${C.ink}`,
              }}
            >
              <label style={kidLabelStyle}>Your name</label>
              <input
                type="text"
                value={formData.kidName}
                onChange={(e) => handleKidNameChange(e.target.value)}
                placeholder="Type your name"
                className="focus:outline-none"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: `1.5px solid ${C.borderInput}`,
                  backgroundColor: C.cream,
                  fontSize: '24px',
                  fontWeight: 800,
                  color: C.ink,
                  fontFamily: 'inherit',
                  textAlign: 'center',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
                autoFocus
              />
            </div>

            {formData.kidName && (
              <div className="mt-6 text-center setup-bounce-headline" key={`s3-${formData.kidName.length}`}>
                <p
                  style={{
                    fontSize: '20px',
                    color: C.amberAccent,
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Nice to meet you, {formData.kidName}! 👋
                </p>
              </div>
            )}

            <KidNavButtons
              onBack={() => setStep(2)}
              onNext={() => { celebrateMilestone(); setStep(4); }}
              nextDisabled={!formData.kidName}
              nextLabel="That's me! →"
            />
          </div>
        )}

        {/* =========================================================
            STEP 4 — KID: NAME YOUR STORE
            ========================================================= */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <p
                className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
                style={{ color: C.amberAccent }}
              >
                Your store
              </p>
              <h1
                key={pulseKey} className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05] setup-bounce-headline"
                style={{ fontWeight: 800, color: C.ink }}
              >
                Name your <span style={{ color: C.amberAccent }}>store.</span>
              </h1>
              <p
                className="mt-3"
                style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
              >
                This is what your customers will see.
              </p>
            </div>

            <div
              style={{
                backgroundColor: C.cardBg,
                border: `1.5px solid ${C.ink}`,
                borderRadius: '18px',
                padding: '20px',
                boxShadow: `3px 3px 0 ${C.ink}`,
              }}
            >
              <label style={kidLabelStyle}>Store name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => handleStoreNameChange(e.target.value)}
                placeholder="Your store name"
                className="focus:outline-none"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: `1.5px solid ${C.borderInput}`,
                  backgroundColor: C.cream,
                  fontSize: '20px',
                  fontWeight: 800,
                  color: C.ink,
                  fontFamily: 'inherit',
                  textAlign: 'center',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
              />
              {!formData.storeNameEdited && formData.storeName && (
                <p
                  style={{
                    fontSize: '11px',
                    color: C.inkFaint,
                    marginTop: '8px',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  We picked this for you. Tap to change it.
                </p>
              )}
            </div>

            {/* Live preview */}
            {formData.storeName && (
              <div
                className="mt-4 setup-bounce-headline"
                key={`s4-${formData.storeName}`}
                style={{
                  backgroundColor: C.creamWarm,
                  border: `1px solid ${C.border}`,
                  borderRadius: '14px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: C.amberAccent,
                    fontWeight: 800,
                    marginBottom: '8px',
                  }}
                >
                  Preview
                </p>
                <p
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: C.ink,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                  }}
                >
                  {formData.storeName}
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: C.inkMuted,
                    marginTop: '4px',
                  }}
                >
                  by {formData.kidName}
                </p>
              </div>
            )}

            <KidNavButtons
              onBack={() => setStep(3)}
              onNext={() => { celebrateMilestone(); setStep(5); }}
              nextDisabled={!formData.storeName}
              nextLabel="Love it! →"
            />
          </div>
        )}

        {/* =========================================================
            STEP 5 — KID: WHAT DO YOU MAKE? (Category)
            Uses inline SVG icons instead of emojis.
            ========================================================= */}
        {step === 5 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <p
                className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
                style={{ color: C.amberAccent }}
              >
                Your products
              </p>
              <h1
                key={pulseKey} className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05] setup-bounce-headline"
                style={{ fontWeight: 800, color: C.ink }}
              >
                What do you <span style={{ color: C.amberAccent }}>make?</span>
              </h1>
              <p
                className="mt-3"
                style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
              >
                Pick what you sell. You can always add more later.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORY_OPTIONS.map((cat) => {
                const isActive = formData.category === cat.label;
                const IconCmp = CATEGORY_ICONS[cat.label] || Sparkles;
                return (
                  <button
                    key={cat.label}
                    onClick={() => updateField('category', cat.label)}
                    className={`flex items-center gap-3 transition-all ${isActive ? "setup-pop-on-active" : ""}`}
                    style={{
                      padding: '14px 14px',
                      borderRadius: '14px',
                      border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                      boxShadow: isActive ? `3px 3px 0 ${C.ink}` : 'none',
                      transform: isActive ? 'translate(-1px, -1px)' : 'none',
                      backgroundColor: isActive ? C.amberBtn : C.cardBg,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      color: C.ink,
                    }}
                  >
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: isActive ? '#FFFBEB' : C.cream,
                        border: `1px solid ${isActive ? C.ink : C.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: isActive ? C.ink : C.amberAccent,
                      }}
                    >
                      <IconCmp size={22} strokeWidth={2} />
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        lineHeight: 1.2,
                      }}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <KidNavButtons
              onBack={() => setStep(4)}
              onNext={() => { celebrateMilestone(); setStep(6); }}
              nextDisabled={!formData.category}
              nextLabel="That's what I make! →"
            />
          </div>
        )}

        {/* =========================================================
            STEP 6 — KID: WHAT ARE YOU SAVING FOR?
            ========================================================= */}
        {step === 6 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <p
                className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
                style={{ color: C.amberAccent }}
              >
                Your goal
              </p>
              <h1
                key={pulseKey} className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05] setup-bounce-headline"
                style={{ fontWeight: 800, color: C.ink }}
              >
                What are you <span style={{ color: C.amberAccent }}>saving for?</span>
              </h1>
              <p
                className="mt-3"
                style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
              >
                Every sale gets you closer.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SAVINGS_GOAL_OPTIONS.map((goal) => {
                const isActive = formData.savingsGoal === goal.label;
                const IconCmp = SAVINGS_ICONS[goal.label] || Pencil;
                return (
                  <button
                    key={goal.label}
                    onClick={() => updateField('savingsGoal', goal.label)}
                    className={`flex items-center gap-3 transition-all ${isActive ? "setup-pop-on-active" : ""}`}
                    style={{
                      padding: '14px 14px',
                      borderRadius: '14px',
                      border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                      boxShadow: isActive ? `3px 3px 0 ${C.ink}` : 'none',
                      transform: isActive ? 'translate(-1px, -1px)' : 'none',
                      backgroundColor: isActive ? C.amberBtn : C.cardBg,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      color: C.ink,
                    }}
                  >
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: isActive ? '#FFFBEB' : C.cream,
                        border: `1px solid ${isActive ? C.ink : C.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: isActive ? C.ink : C.amberAccent,
                      }}
                    >
                      <IconCmp size={22} strokeWidth={2} />
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        lineHeight: 1.2,
                      }}
                    >
                      {goal.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom "Other" input */}
            {formData.savingsGoal === 'Other' && (
              <input
                type="text"
                value={formData.savingsGoalCustom}
                onChange={(e) => updateField('savingsGoalCustom', e.target.value)}
                placeholder="What are you saving for?"
                autoFocus
                className="focus:outline-none animate-fadeIn"
                style={{
                  width: '100%',
                  marginTop: '14px',
                  padding: '14px',
                  borderRadius: '14px',
                  border: `1.5px solid ${C.borderInput}`,
                  backgroundColor: C.cream,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: C.ink,
                  fontFamily: 'inherit',
                  textAlign: 'center',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
              />
            )}

            <KidNavButtons
              onBack={() => setStep(5)}
              onNext={() => { celebrateMilestone(); setStep(7); }}
              nextDisabled={
                !formData.savingsGoal ||
                (formData.savingsGoal === 'Other' && !formData.savingsGoalCustom)
              }
              nextLabel="Great pick! →"
            />
          </div>
        )}

        {/* =========================================================
            STEP 7 — KID: HOW MUCH DO YOU NEED?
            ========================================================= */}
        {step === 7 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <p
                className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
                style={{ color: C.amberAccent }}
              >
                Set your target
              </p>
              <h1
                key={pulseKey} className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05] setup-bounce-headline"
                style={{ fontWeight: 800, color: C.ink }}
              >
                How much do you <span style={{ color: C.amberAccent }}>need?</span>
              </h1>
              <p
                className="mt-3"
                style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
              >
                Set your target. You'll see your progress as you sell.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SAVINGS_AMOUNT_OPTIONS.map((amt) => {
                const isActive = formData.savingsAmount === amt;
                return (
                  <button
                    key={amt}
                    onClick={() => updateField('savingsAmount', amt)}
                    className={`transition-all ${isActive ? "setup-pop-on-active" : ""}`}
                    style={{
                      padding: '20px 8px',
                      borderRadius: '14px',
                      border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                      boxShadow: isActive ? `3px 3px 0 ${C.ink}` : 'none',
                      transform: isActive ? 'translate(-1px, -1px)' : 'none',
                      backgroundColor: isActive ? C.amberBtn : C.cardBg,
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      color: C.ink,
                      fontSize: '22px',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    ${amt}
                  </button>
                );
              })}
            </div>

            {formData.savingsAmount && (
              <div className="mt-6 text-center setup-bounce-headline" key={`s7-${formData.savingsAmount}`}>
                <p
                  style={{
                    fontSize: '18px',
                    color: C.amberAccent,
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.4,
                  }}
                >
                  ${formData.savingsAmount} for{' '}
                  {formData.savingsGoal === 'Other'
                    ? formData.savingsGoalCustom
                    : formData.savingsGoal.toLowerCase()}
                  . Let's do this! 🚀
                </p>
              </div>
            )}

            <KidNavButtons
              onBack={() => setStep(6)}
              onNext={() => { celebrateMilestone(); setStep(8); }}
              nextDisabled={!formData.savingsAmount}
              nextLabel="Almost there! →"
            />
          </div>
        )}

        {/* =========================================================
            STEP 8 — LAUNCH SUMMARY
            Clean label/value rows. No decorative emojis.
            ========================================================= */}
        {step === 8 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <p
                className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
                style={{ color: C.amberAccent }}
              >
                One last look
              </p>
              <h1
                className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
                style={{ fontWeight: 800, color: C.ink }}
              >
                Ready to <span style={{ color: C.amberAccent }}>launch?</span>
              </h1>
              <p
                className="mt-3"
                style={{ fontSize: '15px', color: C.inkMuted, lineHeight: 1.5 }}
              >
                Here's your store at a glance.
              </p>
            </div>

            {/* Summary card — rows of label/value */}
            <div
              style={{
                backgroundColor: C.cardBg,
                border: `1.5px solid ${C.ink}`,
                borderRadius: '18px',
                padding: '8px 18px',
                boxShadow: `3px 3px 0 ${C.ink}`,
              }}
            >
              {[
                ['Owner',     formData.kidName],
                ['Store',     formData.storeName],
                ['Selling',   formData.category],
                ['Saving for', formData.savingsGoal === 'Other' ? formData.savingsGoalCustom : formData.savingsGoal],
                ['Goal',      `$${formData.savingsAmount}`],
                ...(formData.schoolName ? [['Club', formData.schoolName]] : []),
              ].map(([label, value], i, arr) => (
                <div
                  key={i}
                  className="flex items-center justify-between"
                  style={{
                    padding: '14px 0',
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.borderFaint}` : 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: C.inkFaint,
                      fontWeight: 700,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: C.ink,
                      letterSpacing: '-0.005em',
                      textAlign: 'right',
                      maxWidth: '60%',
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="text-center mt-4"
              style={{ fontSize: '12px', color: C.inkFaint, fontWeight: 500 }}
            >
              You can change any of this later in your store editor.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
              <button
                onClick={() => setStep(7)}
                style={{
                  padding: '14px 20px',
                  borderRadius: '14px',
                  border: `1.5px solid ${C.borderInput}`,
                  backgroundColor: 'transparent',
                  color: C.inkMuted,
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  flexShrink: 0,
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                className="transition-all hover:-translate-y-0.5"
                style={{
                  flex: 1,
                  backgroundColor: C.amberBtn,
                  color: C.ink,
                  border: `1.5px solid ${C.ink}`,
                  boxShadow: `4px 4px 0 ${C.ink}`,
                  borderRadius: '16px',
                  padding: '17px',
                  fontWeight: 800,
                  fontSize: '17px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.005em',
                }}
              >
                Launch my store! →
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// =====================================================================
// PARENT ZONE — small field wrapper with label
// =====================================================================
function ParentField({ label, children }) {
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
      <label
        style={{
          display: 'block',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.amberDeep,
          fontWeight: 800,
          marginBottom: '8px',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// =====================================================================
// KID ZONE — back/next button row used on steps 3-7
// =====================================================================
function KidNavButtons({ onBack, onNext, nextDisabled = false, nextLabel = 'Next →' }) {
  return (
    <div className="flex gap-3 mt-8 max-w-md mx-auto">
      <button
        onClick={onBack}
        style={{
          padding: '14px 20px',
          borderRadius: '14px',
          border: `1.5px solid ${C.borderInput}`,
          backgroundColor: 'transparent',
          color: C.inkMuted,
          fontWeight: 700,
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          flexShrink: 0,
        }}
      >
        ← Back
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        style={{
          flex: 1,
          backgroundColor: C.amberBtn,
          color: C.ink,
          border: `1.5px solid ${C.ink}`,
          boxShadow: `3px 3px 0 ${C.ink}`,
          borderRadius: '14px',
          padding: '15px',
          fontWeight: 800,
          fontSize: '15px',
          cursor: nextDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          letterSpacing: '-0.005em',
        }}
      >
        {nextLabel}
      </button>
    </div>
  );
}

// ====================== SHARED INPUT STYLES ======================

const parentInputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: `1.5px solid ${C.borderInput}`,
  backgroundColor: C.cream,
  fontSize: '15px',
  fontWeight: 600,
  color: C.ink,
  fontFamily: 'inherit',
};

const kidLabelStyle = {
  display: 'block',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: C.amberAccent,
  fontWeight: 800,
  marginBottom: '10px',
  paddingLeft: '4px',
};
