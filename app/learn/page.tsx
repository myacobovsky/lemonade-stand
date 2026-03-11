// @ts-nocheck
'use client';
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
    description: "Every great business starts with an idea. Find the perfect product based on what you love and what people want.",
  },
  {
    id: '2. Plan',
    num: 2,
    title: 'Plan',
    emoji: '📋',
    color: 'blue',
    tagline: 'Get your business ready',
    description: "Before you start selling, you need a plan. Learn how to price your products and set goals.",
  },
  {
    id: '3. Build',
    num: 3,
    title: 'Build',
    emoji: '🏗️',
    color: 'emerald',
    tagline: 'Set up your store',
    description: "Make your store look amazing, take great photos, and create a brand people remember.",
  },
  {
    id: '4. Launch',
    num: 4,
    title: 'Launch',
    emoji: '🚀',
    color: 'purple',
    tagline: 'Get your first customers',
    description: "Your store is ready. Time to tell the world and land your first sale.",
  },
  {
    id: '5. Grow',
    num: 5,
    title: 'Grow',
    emoji: '🌱',
    color: 'pink',
    tagline: 'Keep getting better',
    description: "Keep customers happy, get great reviews, and add new products to earn even more.",
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

  return (
    <div className="min-h-screen bg-white">
      <NavBar active="learn" />

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl sm:text-6xl mb-4">📚</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">The Kids MBA</h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">Learn how to start and run a real business, step by step.</p>
        </div>

        {/* All stages, always open */}
        <div className="space-y-8">
          {stages.map((stage) => {
            const colors = colorMap[stage.color];
            const articles = learnArticles.filter(a => a.category === stage.id);

            return (
              <div key={stage.id}>
                {/* Stage header */}
                <div className={`w-full rounded-2xl p-5 sm:p-6 text-left ${colors.bg} ${colors.border} border`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${colors.numBg} text-white flex items-center justify-center font-bold text-xl shrink-0`}>
                      {stage.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{stage.emoji} {stage.title}</h2>
                        <span className={`text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full ${colors.tag}`}>{articles.length} lesson{articles.length !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-base sm:text-lg text-gray-600 font-medium">{stage.tagline}</p>
                      <p className="text-sm sm:text-base text-gray-500 mt-1 leading-relaxed">{stage.description}</p>
                    </div>
                  </div>
                </div>

                {/* Articles */}
                <div className="ml-10 sm:ml-12 pl-6 mt-3 mb-2 space-y-3 relative">
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${colors.line} rounded-full`} />

                  {articles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => router.push(`/learn/${article.id}`)}
                      className="w-full bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all text-left flex items-start gap-4 relative"
                    >
                      <div className={`absolute -left-[26px] top-6 w-3 h-3 rounded-full ${colors.numBg} border-2 border-white`} />

                      <span className="text-3xl sm:text-4xl shrink-0">{article.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1">{article.title}</h3>
                        <p className="text-sm sm:text-base text-gray-500 leading-relaxed line-clamp-2">{article.summary}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs sm:text-sm text-gray-400">{article.readTime} read</span>
                          <span className="text-gray-300">·</span>
                          <span className={`text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full ${article.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{article.difficulty}</span>
                        </div>
                      </div>
                      <span className="text-gray-300 text-lg shrink-0 mt-2">→</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming soon */}
        <div className="mt-12 text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-3xl mb-3">🎓</div>
          <h3 className="font-bold text-gray-800 text-lg mb-2">More lessons on the way!</h3>
          <p className="text-base text-gray-500">We are always adding new lessons to help you become a better business owner.</p>
        </div>
      </main>
    </div>
  );
}
