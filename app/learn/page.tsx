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
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Article not found</h1>
          <p className="text-gray-500 mb-4">We couldn't find that article.</p>
          <Link href="/learn" className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg">Back to Learn</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar active="learn" />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-4">
        <Link href="/learn" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-2">
          <span>←</span>
          <span className="text-sm font-medium">Back to Learn</span>
        </Link>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700">{article.category.replace(/^\d+\.\s*/, '')}</span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">{article.difficulty}</span>
            <span className="text-xs text-gray-400">{article.readTime} read</span>
          </div>
          <div className="text-4xl mb-3">{article.emoji}</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{article.title}</h1>
          <p className="text-gray-500">{article.summary}</p>
        </div>

        <div className="space-y-4">
          {article.content.map((block, i) => {
            if (block.type === 'intro') return (
              <p key={i} className="text-gray-600 text-lg leading-relaxed border-l-4 border-amber-300 pl-4">{block.text}</p>
            );
            if (block.type === 'heading') return (
              <h2 key={i} className="text-lg font-bold text-gray-800 mt-6">{block.text}</h2>
            );
            if (block.type === 'text') return (
              <p key={i} className="text-gray-600 leading-relaxed whitespace-pre-line">{block.text}</p>
            );
            if (block.type === 'example') return (
              <div key={i} className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="text-xs font-semibold text-amber-700 mb-1">📝 Example</div>
                <p className="text-amber-900 text-sm whitespace-pre-line">{block.text}</p>
              </div>
            );
            if (block.type === 'ideas') return (
              <div key={i} className="grid gap-2 sm:gap-3">
                {block.items.map((idea) => (
                  <div key={idea.num} className="flex gap-3 bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-amber-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">{idea.num}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm">{idea.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{idea.desc}</div>
                      <div className="flex gap-3 mt-1.5">
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Cost: {idea.cost}</span>
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Sell: {idea.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
            if (block.type === 'tip') return (
              <div key={i} className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-xs font-semibold text-blue-700 mb-1">💡 Pro Tip</div>
                <p className="text-blue-900 text-sm">{block.text}</p>
              </div>
            );
            if (block.type === 'vocab') return (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                <span className="text-xs font-bold text-white bg-gray-800 px-2 py-0.5 rounded mt-0.5 shrink-0">{block.term}</span>
                <span className="text-sm text-gray-600">{block.definition}</span>
              </div>
            );
            return null;
          })}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
          <Link href="/learn" className="text-sm text-gray-500 hover:text-gray-700">← Back to all articles</Link>
          <Link href="/editor" className="bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Go to My Store →
          </Link>
        </div>
      </main>
    </div>
  );
}
