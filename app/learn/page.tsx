// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar, Logo } from '../components';
import Link from 'next/link';
import learnArticles from './articles';



const LearnHub = () => {
  const router = useRouter();
  
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', '1. Brainstorm', '2. Plan', '3. Build', '4. Launch', '5. Grow'];

  const filteredArticles = selectedCategory === 'all'
    ? learnArticles
    : learnArticles.filter((a) => a.category === selectedCategory);

  // Article Detail View

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <NavBar active="learn" />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">📚 Learn & Grow</h1>
          <p className="text-gray-500">Tips, tricks, and lessons to help you run a great business!</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'all' ? '📚 All' : cat.replace(/^\d+\.\s*/, '')}
            </button>
          ))}
        </div>

        {/* Article Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => router.push(`/learn/${article.id}`)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all text-left w-full"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{article.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{article.category}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{article.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{article.summary}</p>
                  <p className="text-xs text-gray-400 mt-2">{article.readTime} read</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Coming soon teaser */}
        <div className="mt-8 text-center p-6 bg-amber-50 rounded-2xl border border-amber-100">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-bold text-gray-800 mb-1">More lessons coming soon!</h3>
          <p className="text-sm text-gray-500">We're always adding new tips to help you grow your business.</p>
        </div>
      </main>
    </div>
  );
}

export default LearnHub;
