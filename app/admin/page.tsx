// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../lib/context';
import { supabase } from '../../lib/supabase';
import { Logo } from '../components';

// Add your admin email(s) here
const ADMIN_EMAILS = ['mikkel@getlemonadestand.com', 'myacobovsky@gmail.com'];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useApp();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [storeOrders, setStoreOrders] = useState([]);
  const [timeframe, setTimeframe] = useState('all');

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (!authLoading && !isAdmin) return;
    if (isAdmin) loadAdminData();
  }, [user, authLoading]);

  async function loadAdminData() {
    try {
      // Fetch all stores with product/order counts
      const { data: allStores } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: allProducts } = await supabase
        .from('products')
        .select('id, store_id');

      const { data: allOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

      const storesThisWeek = (allStores || []).filter(s => new Date(s.created_at) > weekAgo).length;
      const storesThisMonth = (allStores || []).filter(s => new Date(s.created_at) > monthAgo).length;
      const ordersThisWeek = (allOrders || []).filter(o => new Date(o.created_at) > weekAgo).length;
      const ordersThisMonth = (allOrders || []).filter(o => new Date(o.created_at) > monthAgo).length;
      const totalGMV = (allOrders || []).filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.confirmed_amount || o.total_amount || 0), 0);
      const activeStores = (allStores || []).filter(s => (allProducts || []).some(p => p.store_id === s.id)).length;

      // Enrich stores with counts
      const enrichedStores = (allStores || []).map(s => ({
        ...s,
        productCount: (allProducts || []).filter(p => p.store_id === s.id).length,
        orderCount: (allOrders || []).filter(o => o.store_id === s.id).length,
        revenue: (allOrders || []).filter(o => o.store_id === s.id && o.status === 'completed').reduce((sum, o) => sum + (o.confirmed_amount || o.total_amount || 0), 0),
      }));

      setStats({
        totalStores: (allStores || []).length,
        totalProducts: (allProducts || []).length,
        totalOrders: (allOrders || []).length,
        totalGMV,
        activeStores,
        storesThisWeek,
        storesThisMonth,
        ordersThisWeek,
        ordersThisMonth,
        pendingOrders: (allOrders || []).filter(o => o.status === 'pending').length,
      });

      setStores(enrichedStores);
      setOrders(allOrders || []);
    } catch (err) {
      console.error('Admin data error:', err);
    }
    setLoading(false);
  }

  async function viewStoreDetails(store) {
    setSelectedStore(store);
    const { data: prods } = await supabase.from('products').select('*').eq('store_id', store.id).order('sort_order');
    const { data: ords } = await supabase.from('orders').select('*').eq('store_id', store.id).order('created_at', { ascending: false });
    setStoreProducts(prods || []);
    setStoreOrders(ords || []);
  }

  // Auth guard
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center"><div className="text-4xl">🍋</div></div>
  );

  if (!user || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Admin Access Only</h1>
        <p className="text-gray-500 mb-4">You don't have permission to view this page.</p>
        <button onClick={() => router.push('/')} className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg">Go Home</button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="text-4xl mb-3">🍋</div><p className="text-gray-500">Loading admin data...</p></div></div>
  );

  // Store detail view
  if (selectedStore) return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-sm font-semibold text-gray-500">Admin</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-800">{selectedStore.store_name}</span>
          </div>
          <button onClick={() => setSelectedStore(null)} className="text-sm text-gray-500 hover:text-gray-700">← Back to overview</button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        {/* Store info */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{selectedStore.store_name}</h1>
              <p className="text-gray-500 text-sm mt-1">by {selectedStore.kid_name} (Parent: {selectedStore.parent_name})</p>
              <p className="text-gray-400 text-xs mt-1">Created {new Date(selectedStore.created_at).toLocaleDateString()}</p>
              {selectedStore.bio && <p className="text-gray-600 text-sm mt-2 italic">"{selectedStore.bio}"</p>}
            </div>
            <div className="flex gap-2">
              <a href={`/store/${selectedStore.kid_name.toLowerCase()}`} target="_blank" className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-200">View Store →</a>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div><div className="text-lg font-bold text-gray-800">{selectedStore.productCount}</div><div className="text-xs text-gray-500">Products</div></div>
            <div><div className="text-lg font-bold text-gray-800">{selectedStore.orderCount}</div><div className="text-xs text-gray-500">Orders</div></div>
            <div><div className="text-lg font-bold text-emerald-600">${selectedStore.revenue.toFixed(2)}</div><div className="text-xs text-gray-500">Revenue</div></div>
            <div><div className="text-lg font-bold text-gray-800">${(selectedStore.total_earnings || 0).toFixed(2)}</div><div className="text-xs text-gray-500">Total Earnings</div></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Products */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="font-bold text-gray-800 mb-3">Products ({storeProducts.length})</h2>
            {storeProducts.length === 0 ? (
              <p className="text-gray-400 text-sm">No products yet</p>
            ) : (
              <div className="space-y-2">
                {storeProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.emoji || '🎁'}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.category || 'General'} {!p.in_stock && '· Out of stock'}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-700">${p.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="font-bold text-gray-800 mb-3">Orders ({storeOrders.length})</h2>
            {storeOrders.length === 0 ? (
              <p className="text-gray-400 text-sm">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {storeOrders.map(o => (
                  <div key={o.id} className="py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{o.buyer_name}</div>
                        <div className="text-xs text-gray-400">{o.buyer_contact}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">${o.total_amount?.toFixed(2)}</div>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          o.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          o.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          o.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>{o.status}</span>
                      </div>
                    </div>
                    {o.items && <div className="text-xs text-gray-400 mt-1">{o.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  // Filtered stores
  const filteredStores = stores.filter(s =>
    s.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.kid_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.parent_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-sm font-semibold text-gray-800">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{user.email}</span>
            <button onClick={() => router.push('/')} className="text-xs text-gray-500 hover:text-gray-700">Exit Admin</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Platform Overview</h1>
        <p className="text-gray-500 text-sm mb-6">Lemonade Stand admin panel</p>

        {/* Top metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{stats.totalStores}</div>
            <div className="text-xs text-gray-500">Total Stores</div>
            <div className="text-[10px] text-emerald-600 mt-1">+{stats.storesThisWeek} this week</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-amber-600">{stats.activeStores}</div>
            <div className="text-xs text-gray-500">Active Stores</div>
            <div className="text-[10px] text-gray-400 mt-1">Have products listed</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{stats.totalProducts}</div>
            <div className="text-xs text-gray-500">Total Products</div>
            <div className="text-[10px] text-gray-400 mt-1">Across all stores</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
            <div className="text-xs text-gray-500">Total Orders</div>
            <div className="text-[10px] text-emerald-600 mt-1">+{stats.ordersThisWeek} this week</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-emerald-600">${stats.totalGMV.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Platform GMV</div>
            <div className="text-[10px] text-gray-400 mt-1">Completed orders</div>
          </div>
        </div>

        {/* Alerts */}
        {stats.pendingOrders > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="text-sm font-semibold text-amber-800">🔔 {stats.pendingOrders} pending order{stats.pendingOrders > 1 ? 's' : ''} across the platform</div>
          </div>
        )}

        {/* Stores table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-bold text-gray-800">All Stores ({stores.length})</h2>
            <input
              type="text"
              placeholder="Search stores, kids, or parents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-amber-400 focus:outline-none w-full sm:w-64"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium">Store</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Parent</th>
                  <th className="text-center px-4 py-3 font-medium">Products</th>
                  <th className="text-center px-4 py-3 font-medium">Orders</th>
                  <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Revenue</th>
                  <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Created</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map(store => (
                  <tr key={store.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 text-sm">{store.store_name}</div>
                      <div className="text-xs text-gray-400">by {store.kid_name}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{store.parent_name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-medium ${store.productCount > 0 ? 'text-gray-800' : 'text-red-400'}`}>{store.productCount}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-800">{store.orderCount}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600 hidden sm:table-cell">${store.revenue.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400 hidden sm:table-cell">{new Date(store.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => viewStoreDetails(store)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-600 transition-colors">Details</button>
                        <a href={`/store/${store.kid_name.toLowerCase()}`} target="_blank" className="px-2 py-1 bg-amber-50 hover:bg-amber-100 rounded text-xs text-amber-700 transition-colors">View</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStores.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">No stores match your search</div>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-200 mt-6 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Store</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Items</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 20).map(order => {
                  const store = stores.find(s => s.id === order.store_id);
                  return (
                    <tr key={order.id} className="border-b border-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-800">{order.buyer_name}</div>
                        <div className="text-xs text-gray-400">{order.buyer_contact}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{store?.store_name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
                      <td className="px-4 py-3 text-right text-sm font-bold">${order.total_amount?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-gray-400 hidden sm:table-cell">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">No orders yet</div>
          )}
        </div>
      </main>
    </div>
  );
}
