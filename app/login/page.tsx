// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '../components';
import { useApp } from '../../lib/context';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, user, stores, loading: appLoading } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  

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

  if (confirmSent) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Check your email!</h1>
          <p className="text-gray-500 mb-6">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back and log in.</p>
          <button onClick={() => { setConfirmSent(false); setIsSignUp(false); }} className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><Logo size="lg" /></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-gray-500 text-sm">{isSignUp ? 'Sign up to create your kid\'s store' : 'Log in to manage your store'}</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:outline-none" placeholder="parent@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:outline-none" placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 text-white font-semibold py-3 rounded-xl transition-colors">
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-sm text-amber-600 hover:underline">
            {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
          </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => router.push('/')} className="text-xs text-gray-400 hover:text-gray-600">Back to home</button>
        </div>
      </div>
    </div>
  );
}
