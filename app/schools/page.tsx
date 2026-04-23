// @ts-nocheck
// FILE: app/schools/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { NavBar } from '../components';

// ====================== DESIGN TOKENS ======================
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
  amberAccent: '#D97706',
  amberBtn: '#FCD34D',
  amberInputBg: '#FEF3C7',
  danger: '#DC2626',
};
const font = {
  sans: "'Poppins', sans-serif",
};

// ====================== PILOT CTA EMAIL ======================
const PILOT_EMAIL = 'hello@getlemonadestand.com';
const PILOT_SUBJECT = 'Pilot interest — Lemonade Stand for Schools';
const PILOT_BODY = `Hi Lemonade Stand team,

I'm interested in piloting Lemonade Stand at my school. A few quick details:

- School name:
- Your name and role:
- Grade level(s) you'd pilot with:
- What you're hoping to do with it:

Thanks!`;

const pilotMailto = `mailto:${PILOT_EMAIL}?subject=${encodeURIComponent(PILOT_SUBJECT)}&body=${encodeURIComponent(PILOT_BODY)}`;

export default function SchoolsLandingPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  // ====================== SUBMIT HANDLER ======================
  // Validates BOTH the school code (slug) and password in one flow.
  // On success: stores access in localStorage, then routes to the marketplace.
  // The /schools/[slug] page checks localStorage on mount and skips its own
  // gate if the stored password matches — so users experience a single form.
  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedCode = code.trim().toLowerCase();
    const trimmedPassword = password.trim();
    if (!trimmedCode || !trimmedPassword) return;

    setChecking(true);
    setError('');

    // Step 1: Does a school with this slug exist and is it active?
    const { data: school } = await supabase
      .from('schools')
      .select('id, slug, password')
      .eq('slug', trimmedCode)
      .eq('is_active', true)
      .single();

    if (!school) {
      setChecking(false);
      setError(
        "We couldn't find a club with that code. Check with your club leader."
      );
      return;
    }

    // Step 2: Does the password match?
    if (trimmedPassword !== school.password) {
      setChecking(false);
      setError(
        'That password is not correct. Check with your club leader.'
      );
      return;
    }

    // Step 3: Store access in localStorage so /schools/[slug] recognizes us
    // and skips its own gate. Same key pattern the [slug] page already uses.
    try {
      localStorage.setItem(`school_access_${school.id}`, school.password);
    } catch {
      // localStorage can fail in some browser modes — the [slug] page will
      // handle this by redirecting back here if it can't read the key.
    }

    // Step 4: Route into the marketplace
    router.push(`/schools/${school.slug}`);
  }

  // ====================== SHARED STYLES ======================
  const btnPrimary = {
    backgroundColor: C.amberBtn,
    color: C.ink,
    border: `1.5px solid ${C.ink}`,
    boxShadow: `3px 3px 0 ${C.ink}`,
    borderRadius: '12px',
    fontWeight: 800,
    transition: 'all 0.15s ease',
  };

  const inputStyle = {
    padding: '14px 16px',
    borderRadius: '12px',
    border: `1.5px solid ${C.ink}2B`,
    backgroundColor: C.amberInputBg,
    fontSize: '15px',
    textAlign: 'center',
    fontWeight: 700,
    color: C.ink,
    letterSpacing: '0.01em',
    fontFamily: 'inherit',
    // Force cream input background even when Chrome autofill overrides
    WebkitBoxShadow: `0 0 0 1000px ${C.amberInputBg} inset`,
    WebkitTextFillColor: C.ink,
  };

  const labelStyle = {
    fontSize: '11px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: C.inkFaint,
    fontWeight: 700,
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      <NavBar active="schools" />

      {/* =========================================================
          SECTION 1 — HERO + TWO-FIELD FORM (primary purpose)
          Single form with both code + password. One submit handles both
          checks so users experience it as one gate.
          ========================================================= */}
      <section className="px-4 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-md mx-auto text-center">
          <p
            className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: C.amberAccent }}
          >
            For school clubs
          </p>
          <h1
            className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02]"
            style={{ fontWeight: 800, color: C.ink }}
          >
            Welcome back,{' '}
            <span style={{ color: C.amberAccent }}>club members.</span>
          </h1>
          <p
            className="mt-4 text-base leading-relaxed"
            style={{ color: C.inkMuted }}
          >
            Enter your school's code and password to access your private marketplace.
          </p>

          {/* Code + password entry card */}
          <div
            className="mt-8"
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: '20px',
              padding: '28px',
              boxShadow: `2px 2px 0 ${C.ink}12`,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* School code */}
              <div>
                <label className="block text-left mb-2.5" style={labelStyle}>
                  School code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your school code"
                  autoFocus
                  autoComplete="off"
                  className="w-full focus:outline-none"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = `${C.ink}2B`; }}
                />
              </div>

              {/* Club password */}
              <div>
                <label className="block text-left mb-2.5" style={labelStyle}>
                  Club password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter password"
                  autoComplete="off"
                  className="w-full focus:outline-none"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = `${C.ink}2B`; }}
                />
              </div>

              {/* Single error slot — appears for either wrong code or wrong password */}
              {error && (
                <p
                  className="text-center"
                  style={{
                    fontSize: '13px',
                    color: C.danger,
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!code.trim() || !password.trim() || checking}
                className="w-full transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  ...btnPrimary,
                  padding: '14px',
                  fontSize: '15px',
                  letterSpacing: '-0.005em',
                }}
              >
                {checking ? 'Checking…' : 'Go to my school →'}
              </button>
            </form>
          </div>

          {/* Helper text */}
          <p
            className="mt-5 px-3 leading-relaxed"
            style={{ fontSize: '12px', color: C.inkFaint }}
          >
            Your club leader will share your school's code and password during
            the first club session. If you do not have them yet, check with
            your club leader.
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 — WHAT THIS ACTUALLY IS
          ========================================================= */}
      <section
        style={{
          backgroundColor: C.creamWarm,
          borderTop: `1px solid ${C.borderFaint}`,
        }}
        className="px-4 sm:px-8 py-16 sm:py-20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

            <div className="flex-1 text-center md:text-left">
              <p
                className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3"
                style={{ color: C.amberAccent }}
              >
                What is this?
              </p>
              <h2
                className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
                style={{ fontWeight: 800, color: C.ink }}
              >
                Entrepreneurship education,{' '}
                <span style={{ color: C.amberAccent }}>in real practice.</span>
              </h2>
              <p
                className="mt-5 leading-relaxed"
                style={{ fontSize: '16px', color: C.inkMuted, lineHeight: 1.65 }}
              >
                Lemonade Stand for Schools lets kids run real businesses as
                part of their school's entrepreneurship programming. Each
                participating school gets a private marketplace where
                students list products, handle orders, and learn business
                fundamentals by actually doing the work.
              </p>
            </div>

            <div className="w-full md:w-5/12 flex justify-center">
              <img
                src="/hero-mascot-phone.webp"
                alt="Lemonade Stand mascot holding up a smartphone showing a kid's online store"
                className="w-full max-w-[280px] md:max-w-none h-auto"
                width={800}
                height={533}
                loading="lazy"
                decoding="async"
              />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3 — BRING IT TO YOUR SCHOOL
          ========================================================= */}
      <section
        style={{ borderTop: `1px solid ${C.borderFaint}` }}
        className="px-4 sm:px-8 py-16 sm:py-20"
      >
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-10">
            <p
              className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3"
              style={{ color: C.amberAccent }}
            >
              For educators and administrators
            </p>
            <h2
              className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Bring it to{' '}
              <span style={{ color: C.amberAccent }}>your school.</span>
            </h2>
          </div>

          <div
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: '24px',
              padding: '32px',
              boxShadow: `3px 3px 0 ${C.ink}12`,
            }}
          >
            <p
              className="leading-relaxed"
              style={{
                fontSize: '16px',
                color: C.ink,
                lineHeight: 1.65,
                margin: '0 0 8px',
                fontWeight: 500,
              }}
            >
              We're in pilot phase, working with a small number of schools to
              shape how Lemonade Stand fits into the classroom.
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontSize: '16px',
                color: C.inkMuted,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              If you're a teacher, administrator, or school leader who wants
              to run entrepreneurship programming that students genuinely
              engage with, we'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 mb-7">
              {[
                { title: 'Free pilot', desc: 'No cost during the pilot program.' },
                { title: 'Small groups OK', desc: 'Start with one class or one after-school club.' },
                { title: 'Private to your school', desc: "Students only see their school's marketplace." },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: C.cream,
                    borderRadius: '14px',
                    padding: '16px 14px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      letterSpacing: '0.12em',
                      color: C.amberAccent,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: C.inkMuted,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <a
                href={pilotMailto}
                className="inline-block transition-all hover:-translate-y-0.5"
                style={{
                  ...btnPrimary,
                  padding: '14px 24px',
                  fontSize: '15px',
                  letterSpacing: '-0.005em',
                  textDecoration: 'none',
                }}
              >
                Request pilot access →
              </a>
              <p
                className="mt-3"
                style={{
                  fontSize: '12px',
                  color: C.inkFaint,
                  lineHeight: 1.5,
                }}
              >
                Opens your email with everything pre-filled.
              </p>
            </div>
          </div>

          <p
            className="mt-8 text-center mx-auto leading-relaxed"
            style={{
              fontSize: '12px',
              color: C.inkGhost,
              fontStyle: 'italic',
              maxWidth: '520px',
            }}
          >
            Lemonade Stand for Schools is currently in pilot. The code + password entry
            above is for students in active pilot programs only.
          </p>
        </div>
      </section>
    </div>
  );
}
