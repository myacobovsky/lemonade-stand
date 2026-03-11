// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '../components';

import learnArticles from './articles';

const stages = [
  {
    id: '1. Brainstorm',
    num: 1,
    title: 'Brainstorm',
    emoji: '💡',
    color: 'amber',
    tagline: 'Figure out what to sell',
    description: "Every great business starts with an idea. These lessons help you find the perfect product based on what you love, what people want, and what you can actually make.",
  },
  {
    id: '2. Plan',
    num: 2,
    title: 'Plan',
    emoji: '📋',
    color: 'blue',
    tagline: 'Get your business ready',
    description: "Before you start selling, you need a plan. Learn how to price your products, figure out if you'll make money, and set goals for your business.",
  },
  {
    id: '3. Build',
    num: 3,
    title: 'Build',
    emoji: '🏗️',
    color: 'emerald',
    tagline: 'Set up your store',
    description: "Time to build your store! Learn how to make it look amazing, take great product photos, and create a brand people remember.",
  },
  {
    id: '4. Launch',
    num: 4,
    title: 'Launch',
    emoji: '🚀',
    color: 'purple',
    tagline: 'Get your first customers',
    description: "Your store is ready. Now it's time to tell the world! Learn how to market your store, land your first sale, and understand what makes products sell.",
  },
  {
    id: '5. Grow',
    num: 5,
    title: 'Grow',
    emoji: '🌱',
    color: 'pink',
    tagline: 'Keep getting better',
    description: "You made some sales. Now learn how to keep customers happy, get great reviews, and expand your product line to earn even more.",
  },
];

const colorMap = {
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', numBg: 'bg-amber-400', tag: 'bg-amber-100 text-amber-700', line: 'bg-amber-200' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', numBg: 'bg-blue-400', tag: 'bg-blue-100 text-blue-700', line: 'bg-blue-200' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', numBg: 'bg-emerald-400', tag: 'bg-emerald-100 text-emerald-700', line: 'bg-emerald-200' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', numBg: 'bg-purple-400', tag: 'bg-purple-100 text-purple-700', line: 'bg-purple-200' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', numBg: 'bg-pink-400', tag: 'bg-pink-100 text-pink-700', line: 'bg-pink-200' },
};

export default function LearnHub() {
  const router = useRouter();
  const [expandedStage, setExpandedStage] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <NavBar active="learn" />

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">📚</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">The Kids MBA</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Learn how to start and run a real business, step by step. From your very first idea all the way to growing your store.</p>
        </div>

        {/* Stage progression */}
        <div className="space-y-4">
          {stages.map((stage, stageIndex) => {
            const colors = colorMap[stage.color];
            const articles = learnArticles.filter(a => a.category === stage.id);
            const isExpanded = expandedStage === stage.id || expandedStage === null;

            return (
              <div key={stage.id}>
                {/* Stage header */}
                <button
                  onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                  className={`w-full rounded-xl p-5 text-left transition-all ${colors.bg} ${colors.border} border hover:shadow-sm`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step number */}
                    <div className={`w-10 h-10 rounded-full ${colors.numBg} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                      {stage.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-gray-800">{stage.emoji} {stage.title}</h2>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.tag}`}>{articles.length} lesson{articles.length !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{stage.tagline}</p>
                      <p className="text-xs text-gray-500 mt-1">{stage.description}</p>
                    </div>
                    <div className="text-gray-400 shrink-0 mt-1">
                      <svg className={`w-5 h-5 transition-transform ${isExpanded && expandedStage !== null ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                </button>

                {/* Articles within this stage */}
                {isExpanded && (
                  <div className="ml-9 pl-5 mt-2 mb-6 space-y-2 relative">
                    {/* Connecting line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${colors.line} rounded-full`} />

                    {articles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => router.push(`/learn/${article.id}`)}
                        className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all text-left flex items-start gap-3 relative"
                      >
                        {/* Dot on the line */}
                        <div className={`absolute -left-[22px] top-5 w-2.5 h-2.5 rounded-full ${colors.numBg} border-2 border-white`} />

                        <span className="text-2xl shrink-0">{article.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm">{article.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{article.summary}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-gray-400">{article.readTime} read</span>
                            <span className="text-[10px] text-gray-300">·</span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${article.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{article.difficulty}</span>
                          </div>
                        </div>
                        <span className="text-gray-300 text-sm shrink-0 mt-1">→</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Connector between stages */}
                {stageIndex < stages.length - 1 && !isExpanded && (
                  <div className="flex justify-center py-1">
                    <div className="w-0.5 h-4 bg-gray-200 rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Coming soon */}
        <div className="mt-10 text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-2xl mb-2">🎓</div>
          <h3 className="font-bold text-gray-800 mb-1">More lessons on the way!</h3>
          <p className="text-sm text-gray-500">We are always adding new lessons to help you become a better business owner.</p>
        </div>
      </main>
    </div>
  );
}
