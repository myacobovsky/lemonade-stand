// @ts-nocheck
'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '../../components';
import learnArticles from '../articles';

export default function ArticlePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const article = learnArticles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Article not found</h1>
          <p className="text-lg text-gray-500 mb-6">We couldn't find that article.</p>
          <Link href="/learn" className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl text-lg">Back to Learn</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar active="learn" />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-5">
        <Link href="/learn" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-3">
          <span className="text-lg">←</span>
          <span className="text-base font-medium">Back to Learn</span>
        </Link>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700">{article.category.replace(/^\d+\.\s*/, '')}</span>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500">{article.difficulty}</span>
            <span className="text-sm text-gray-400">{article.readTime} read</span>
          </div>
          <div className="text-5xl sm:text-6xl mb-4">{article.emoji}</div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 leading-tight">{article.title}</h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed">{article.summary}</p>
        </div>

        <div className="space-y-5">
          {article.content.map((block, i) => {
            if (block.type === 'intro') return (
              <p key={i} className="text-lg sm:text-xl text-gray-600 leading-relaxed border-l-4 border-amber-300 pl-5 py-1">{block.text}</p>
            );
            if (block.type === 'heading') return (
              <h2 key={i} className="text-xl sm:text-2xl font-bold text-gray-800 mt-8 mb-1">{block.text}</h2>
            );
            if (block.type === 'text') return (
              <p key={i} className="text-base sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line">{block.text}</p>
            );
            if (block.type === 'example') return (
              <div key={i} className="bg-amber-50 rounded-2xl p-5 sm:p-6 border border-amber-200">
                <div className="text-sm font-bold text-amber-700 mb-2">📝 Example</div>
                <p className="text-base sm:text-lg text-amber-900 whitespace-pre-line leading-relaxed">{block.text}</p>
              </div>
            );
            if (block.type === 'ideas') return (
              <div key={i} className="grid gap-3">
                {block.items.map((idea) => (
                  <div key={idea.num} className="flex gap-4 bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-amber-200 transition-colors">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm sm:text-base font-bold shrink-0">{idea.num}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-base sm:text-lg">{idea.name}</div>
                      <div className="text-sm sm:text-base text-gray-500 mt-0.5 leading-relaxed">{idea.desc}</div>
                      <div className="flex gap-3 mt-2">
                        <span className="text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Cost: {idea.cost}</span>
                        <span className="text-xs sm:text-sm font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">Sell: {idea.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
            if (block.type === 'tip') return (
              <div key={i} className="bg-blue-50 rounded-2xl p-5 sm:p-6 border border-blue-200">
                <div className="text-sm font-bold text-blue-700 mb-2">💡 Pro Tip</div>
                <p className="text-base sm:text-lg text-blue-900 leading-relaxed">{block.text}</p>
              </div>
            );
            if (block.type === 'vocab') return (
              <div key={i} className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 sm:p-5">
                <span className="text-sm font-bold text-white bg-gray-800 px-3 py-1 rounded-lg mt-0.5 shrink-0">{block.term}</span>
                <span className="text-base sm:text-lg text-gray-600 leading-relaxed">{block.definition}</span>
              </div>
            );
            return null;
          })}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/learn" className="text-base text-gray-500 hover:text-gray-700 font-medium">← Back to all lessons</Link>
          <Link href="/editor" className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl text-base transition-colors">
            Go to My Store →
          </Link>
        </div>
      </main>
    </div>
  );
}
