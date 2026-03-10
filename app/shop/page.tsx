// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar, Logo } from '../components';
import { useApp } from '../../lib/context';
import { supabase } from '../../lib/supabase';

export default function ShopPage() {
  const router = useRouter();
  const { store: storeData, products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [realStores, setRealStores] = useState([]);

  useEffect(() => {
    async function fetchStores() {
      const { data } = await supabase.from('stores').select('*');
      if (data) setRealStores(data);
    }
    fetchStores();
  }, []);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');

  const neighborhoods = [
    { id: 'all', label: 'All Areas', icon: '🗽' },
    { id: 'tribeca', label: 'Tribeca', icon: '🏙️' },
    { id: 'fidi', label: 'FiDi', icon: '🏦' },
    { id: 'bpc', label: 'Battery Park City', icon: '🌳' },
  ];

  const demoStores = [];

  // Build store list from real DB stores + demo stores
  const dbStores = realStores.map((s) => ({
    id: s.id,
    name: s.store_name,
    owner: s.kid_name,
    neighborhood: 'tribeca',
    image: '🏪',
    productCount: 0,
    rating: 5,
    description: s.bio || `${s.kid_name}'s store! Check out what's for sale!`,
    isUserStore: storeData?.id === s.id,
    isReal: true,
  }));

  // Only show demo stores if there are fewer than 3 real stores
  const allStores = dbStores;

  const filteredStores = allStores.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNeighborhood = selectedNeighborhood === 'all' || store.neighborhood === selectedNeighborhood;
    return matchesSearch && matchesNeighborhood;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <NavBar active="marketplace" />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">🛍️ Shop Kids' Stores</h1>
          <p className="text-gray-500">Browse and buy from young entrepreneurs near you</p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stores..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:outline-none text-sm"
          />
        </div>

        {/* Neighborhood Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {neighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNeighborhood(n.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedNeighborhood === n.id
                  ? 'bg-amber-400 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {n.icon} {n.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-4">{filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} found</p>

        {/* Store Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredStores.map((store) => (
            <button
              key={store.id}
              onClick={() => router.push('/store/' + store.owner.toLowerCase())}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all text-left w-full"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {store.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 truncate">{store.name}</h3>
                    {store.isUserStore && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium shrink-0">Your store</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">by {store.owner} • {store.productCount} items</p>
                  <div className="text-amber-400 text-xs mb-2">{'★'.repeat(store.rating)}{'☆'.repeat(5 - store.rating)}</div>
                  <p className="text-sm text-gray-500 line-clamp-2">{store.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-800 mb-2">No stores found</h3>
            <p className="text-gray-500 mb-4">Try a different search or neighborhood</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedNeighborhood('all'); }}
              className="px-4 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
