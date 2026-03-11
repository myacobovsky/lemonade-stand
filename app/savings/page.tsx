// @ts-nocheck
'use client';
import { useRouter } from 'next/navigation';
import { NavBar } from '../components';
import { useApp } from '../../lib/context';

export default function SavingsPage() {
  const router = useRouter();
  const { loading, store: storeData } = useApp();
  const totalEarnings = storeData?.total_earnings || 0;
  const confirmedSavings = storeData?.confirmed_savings || 0;
  const kidName = storeData?.kid_name || 'Kid';
  const savingsGoalAmount = parseFloat(storeData?.savings_amount) || 100;
  const savingsGoalName = storeData?.savings_goal || 'New Art Supplies';
  const savingsPercentConfig = storeData?.savings_percent || 50;

  const progressPercent = savingsGoalAmount > 0 ? Math.min((confirmedSavings / savingsGoalAmount) * 100, 100) : 0;

  const milestones = [
    { amount: Math.round(savingsGoalAmount * 0.25), label: '🌟 25%', reached: confirmedSavings >= savingsGoalAmount * 0.25 },
    { amount: Math.round(savingsGoalAmount * 0.5), label: '🎯 50%', reached: confirmedSavings >= savingsGoalAmount * 0.5 },
    { amount: Math.round(savingsGoalAmount * 0.75), label: '🚀 75%', reached: confirmedSavings >= savingsGoalAmount * 0.75 },
    { amount: savingsGoalAmount, label: '🏆 Goal!', reached: confirmedSavings >= savingsGoalAmount },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">🍋</div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <NavBar active="savings-jar" />

      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{kidName}&apos;s Savings Jar 🏦</h1>
          <p className="text-gray-500">Saving for: {savingsGoalName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 text-center">
            <div className="text-3xl font-bold text-emerald-600">${confirmedSavings.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Saved so far</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 text-center">
            <div className="text-3xl font-bold text-amber-600">${totalEarnings.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Total earned</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress to goal</span>
            <span className="font-bold text-emerald-600">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-6 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>$0</span>
            <span className="font-medium text-emerald-600">${savingsGoalAmount} goal</span>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 mb-8">
          <h2 className="font-bold text-gray-800 mb-4">Milestones</h2>
          <div className="grid grid-cols-4 gap-3">
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`text-center p-3 rounded-xl ${
                  m.reached ? 'bg-emerald-100 border-2 border-emerald-300' : 'bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className={`text-xl mb-1 ${m.reached ? '' : 'grayscale opacity-50'}`}>{m.label.split(' ')[0]}</div>
                <div className={`text-xs font-medium ${m.reached ? 'text-emerald-700' : 'text-gray-400'}`}>${m.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational tip */}
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-emerald-800 mb-1">Money Tip: Pay Yourself First!</h3>
              <p className="text-emerald-700 text-sm">
                Every real business owner saves a portion of their earnings before spending. With your {savingsPercentConfig}% savings rule,
                you&apos;re already doing what millionaires do: saving before spending! Keep it up! 🌟
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
