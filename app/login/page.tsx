// @ts-nocheck
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '../components';
import { useApp } from '../../lib/context';

// ====================== DESIGN TOKENS ======================
const C = {
  cream: '#FEF3C7',
  cardBg: '#FFFFFF',
  inputBg: '#FFFBEB',
  ink: '#1C1917',
  inkMuted: '#57534E',
  inkFaint: '#78716C',
  inkGhost: '#A8A29E',
  border: '#1C191722',
  borderFaint: '#1C19170F',
  amberBtn: '#FCD34D',
  amberAccent: '#D97706',
  errorBg: '#FEE2E2',
  errorText: '#991B1B',
};
const font = {
  sans: "'Poppins', sans-serif",
};

// Autofill override — stops Chrome from painting inputs lavender.
// Scoped by id so it only targets our form.
const AutofillOverrideStyles = () => (
  <style jsx global>{`
    #ls-login-form input:-webkit-autofill,
    #ls-login-form input:-webkit-autofill:hover,
    #ls-login-form input:-webkit-autofill:focus,
    #ls-login-form input:-webkit-autofill:active {
      -webkit-text-fill-color: ${C.ink};
      -webkit-box-shadow: 0 0 0 1000px ${C.inputBg} inset;
      box-shadow: 0 0 0 1000px ${C.inputBg} inset;
      transition: background-color 5000s ease-in-out 0s;
      caret-color: ${C.ink};
    }
  `}</style>
);

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp, user, stores, loading: appLoading } = useApp();

  // Read ?mode=signup from URL so "Get Started" buttons land on signup form
  const initialMode = searchParams?.get('mode') === 'signup';
  const [isSignUp, setIsSignUp] = useState(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  // Keep form in sync if the URL param changes (e.g. client-side nav between login / get started)
  useEffect(() => {
    setIsSignUp(searchParams?.get('mode') === 'signup');
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (isSignUp) {
      const { data, error } = await signUp(email, password);
      if (error) setError(error.message);
      else if (data?.session) {
        // Email confirm disabled - auto logged in
        router.push('/setup');
      } else {
        setConfirmSent(true);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else router.push('/biz');
    }
    setLoading(false);
  };

  // Redirect logged-in users
  if (user && !appLoading) {
    if (stores.length > 0) { router.push('/biz'); return null; }
    else { router.push('/setup'); return null; }
  }

  // ---------- Shared styles ----------
  const pageStyle = {
    backgroundColor: C.cream,
    fontFamily: font.sans,
    color: C.ink,
  };

  const cardStyle = {
    backgroundColor: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: '22px',
    boxShadow: `3px 3px 0 ${C.ink}12`,
    padding: '36px 32px 24px',
    maxWidth: '420px',
    width: '100%',
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '11px',
    border: `1px solid ${C.border}`,
    backgroundColor: C.inputBg,
    fontSize: '14px',
    color: C.ink,
    fontFamily: font.sans,
    outline: 'none',
    transition: 'border-color 0.15s, background-color 0.15s',
  };

  const btnPrimary = {
    width: '100%',
    backgroundColor: C.amberBtn,
    color: C.ink,
    padding: '14px 20px',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '15px',
    border: `1.5px solid ${C.ink}`,
    boxShadow: `3px 3px 0 ${C.ink}`,
    cursor: 'pointer',
    fontFamily: font.sans,
    transition: 'transform 0.15s',
    marginTop: '4px',
  };

  const btnDisabled = {
    ...btnPrimary,
    backgroundColor: '#E7E5E4',
    color: C.inkGhost,
    border: `1.5px solid ${C.border}`,
    boxShadow: 'none',
    cursor: 'not-allowed',
  };

  // ---------- Confirmation state (after signup when email confirm enabled) ----------
  if (confirmSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={pageStyle}>
        <AutofillOverrideStyles />
        <div style={cardStyle} className="text-center">
          <div className="flex justify-center mb-4"><Logo size="lg" /></div>
          <p className="text-[10px] tracking-[0.25em] font-bold mb-2 uppercase" style={{ color: C.amberAccent }}>
            Almost there
          </p>
          <h1 className="text-2xl font-bold mb-2 tracking-[-0.01em]" style={{ color: C.ink, fontWeight: 800 }}>
            Check your email.
          </h1>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: C.inkMuted }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back and log in.
          </p>
          <button
            onClick={() => { setConfirmSent(false); setIsSignUp(false); }}
            style={btnPrimary}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate(-1px, -1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
          >
            Back to Log in
          </button>
        </div>
      </div>
    );
  }

  // ---------- Main form ----------
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={pageStyle}>
      <AutofillOverrideStyles />
      <div style={cardStyle}>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4"><Logo size="lg" /></div>
          <h1 className="text-2xl mb-1 tracking-[-0.01em]" style={{ fontWeight: 800, color: C.ink }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm" style={{ color: C.inkFaint }}>
            {isSignUp ? "Sign up to create your kid's store" : 'Log in to manage your store'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="text-sm p-3 rounded-lg mb-4"
            style={{
              backgroundColor: C.errorBg,
              color: C.errorText,
              border: `1px solid ${C.errorText}20`,
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form id="ls-login-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ fontWeight: 600, color: C.ink }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="parent@email.com"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = C.ink;
                e.target.style.backgroundColor = C.cardBg;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.border;
                e.target.style.backgroundColor = C.inputBg;
              }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ fontWeight: 600, color: C.ink }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = C.ink;
                e.target.style.backgroundColor = C.cardBg;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.border;
                e.target.style.backgroundColor = C.inputBg;
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? btnDisabled : btnPrimary}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translate(-1px, -1px)'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.transform = 'translate(0, 0)'; }}
          >
            {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Log In'}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-5 text-sm" style={{ color: C.inkMuted }}>
          {isSignUp ? 'Already have an account? ' : "Need an account? "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            style={{
              color: C.amberAccent,
              fontWeight: 700,
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              cursor: 'pointer',
            }}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4 pt-4" style={{ borderTop: `1px solid ${C.borderFaint}` }}>
          <button
            onClick={() => router.push('/')}
            className="text-xs transition-colors"
            style={{ color: C.inkGhost }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.inkMuted)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.inkGhost)}
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: '#FEF3C7' }} />}>
      <LoginPageInner />
    </Suspense>
  );
}
