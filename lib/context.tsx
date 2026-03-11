// @ts-nocheck
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [activeStoreId, setActiveStoreId] = useState(null);
  const [theme, setTheme] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Derived: current active store
  const store = stores.find(s => s.id === activeStoreId) || null;

  // Listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) loadUserStores(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) loadUserStores(session.user.id);
      else {
        setStores([]); setActiveStoreId(null); setTheme(null); setProducts([]); setOrders([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // When active store changes, load its data
  useEffect(() => {
    if (activeStoreId) loadStoreData(activeStoreId);
  }, [activeStoreId]);

  // Load all stores for a user
  async function loadUserStores(userId) {
    try {
      const { data: userStores } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (userStores && userStores.length > 0) {
        setStores(userStores);
        // Auto-select: use saved preference or first store
        const savedId = typeof window !== 'undefined' ? localStorage.getItem('activeStoreId') : null;
        const validSaved = savedId && userStores.some(s => s.id === savedId);
        setActiveStoreId(validSaved ? savedId : userStores[0].id);
      } else {
        setStores([]);
        setActiveStoreId(null);
      }
    } catch (err) {
      console.error('Error loading stores:', err);
    }
    setLoading(false);
  }

  // Load data for a specific store
  async function loadStoreData(storeId) {
    try {
      // Save preference
      if (typeof window !== 'undefined') localStorage.setItem('activeStoreId', storeId);

      const { data: themeData } = await supabase
        .from('store_themes')
        .select('*')
        .eq('store_id', storeId)
        .single();
      if (themeData) setTheme(themeData);
      else setTheme(null);

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('sort_order', { ascending: true });
      setProducts(productsData || []);

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Error loading store data:', err);
    }
  }

  // Switch active store
  function switchStore(storeId) {
    setActiveStoreId(storeId);
  }

  // Auth functions
  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async function signOut() {
    if (typeof window !== 'undefined') localStorage.removeItem('activeStoreId');
    await supabase.auth.signOut();
  }

  // Store CRUD
  async function createStore(storeData) {
    const { data, error } = await supabase
      .from('stores')
      .insert({ ...storeData, user_id: user.id })
      .select()
      .single();
    if (data) {
      // Create default theme
      const { data: themeData } = await supabase
        .from('store_themes')
        .insert({ store_id: data.id })
        .select()
        .single();
      if (themeData) setTheme(themeData);

      setStores(prev => [...prev, data]);
      setActiveStoreId(data.id);
    }
    return { data, error };
  }

  async function updateStore(updates) {
    if (!store) return;
    const { data, error } = await supabase
      .from('stores')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', store.id)
      .select()
      .single();
    if (data) setStores(prev => prev.map(s => s.id === data.id ? data : s));
    return { data, error };
  }

  async function updateTheme(updates) {
    if (!theme) return;
    const { data, error } = await supabase
      .from('store_themes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', theme.id)
      .select()
      .single();
    if (data) setTheme(data);
    return { data, error };
  }

  // Product CRUD
  async function addProduct(product) {
    if (!store) return;
    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, store_id: store.id, sort_order: products.length })
      .select()
      .single();
    if (data) setProducts(prev => [...prev, data]);
    return { data, error };
  }

  async function updateProduct(productId, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();
    if (data) setProducts(prev => prev.map(p => p.id === productId ? data : p));
    return { data, error };
  }

  async function deleteProduct(productId) {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (!error) setProducts(prev => prev.filter(p => p.id !== productId));
    return { error };
  }

  async function reorderProducts(newProducts) {
    setProducts(newProducts);
    for (let i = 0; i < newProducts.length; i++) {
      await supabase.from('products').update({ sort_order: i }).eq('id', newProducts[i].id);
    }
  }

  // Order CRUD
  async function addOrder(order) {
    if (!store) return;
    const { data, error } = await supabase
      .from('orders')
      .insert({ ...order, store_id: store.id })
      .select()
      .single();
    if (data) setOrders(prev => [data, ...prev]);
    return { data, error };
  }

  async function updateOrderStatus(orderId, status, extras = {}) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, ...extras, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    if (data) setOrders(prev => prev.map(o => o.id === orderId ? data : o));
    return { data, error };
  }

  async function confirmPayment(orderId, amount, savings) {
    await updateOrderStatus(orderId, 'completed', { confirmed_amount: amount, confirmed_savings: savings });
    if (store) {
      const newEarnings = (store.total_earnings || 0) + amount;
      const newSavings = (store.confirmed_savings || 0) + savings;
      await updateStore({ total_earnings: newEarnings, confirmed_savings: newSavings });
    }
  }

  // Image upload
  async function uploadImage(file, path) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${store?.id || 'temp'}/${path}-${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('store-images').upload(fileName, file);
    if (data) {
      const { data: urlData } = supabase.storage.from('store-images').getPublicUrl(data.path);
      return { url: urlData.publicUrl, error: null };
    }
    return { url: null, error };
  }

  return (
    <AppContext.Provider value={{
      // Auth
      user, loading, signUp, signIn, signOut,
      // Stores (multi)
      stores, activeStoreId, switchStore,
      // Active store
      store, createStore, updateStore,
      // Theme
      theme, updateTheme,
      // Products
      products, addProduct, updateProduct, deleteProduct, reorderProducts,
      // Orders
      orders, addOrder, updateOrderStatus, confirmPayment,
      // Images
      uploadImage,
      // Reload
      reload: () => user && loadUserStores(user.id),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
