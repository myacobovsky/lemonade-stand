// @ts-nocheck
// FILE: app/dashboard/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Pencil,
  Eye,
  PiggyBank,
  ShoppingCart,
  MessageSquare,
  Copy,
  Share2,
  Check,
} from 'lucide-react';
import { NavBar, ParentGate } from '../components';
import { useApp } from '../../lib/context';

// ====================== DESIGN TOKENS ======================
// Parent zone — same cream palette, deeper amber accent for serious tone.
const C = {
  cream: '#FEF3C7',
  creamWarm: '#FEF0B8',
  cardBg: '#FFFBEB',
  ink: '#1C1917',
  inkMuted: '#57534E',
  inkFaint: '#78716C',
  inkGhost: '#A8A29E',
  border: '#1C19171F',
  borderFaint: '#1C191714',
  borderInput: '#1C19172B',
  amberAccent: '#D97706',
  amberDeep: '#92400E',
  amberBtn: '#FCD34D',
  successBg: '#ECFDF5',
  successBorder: '#10B98140',
  successInk: '#047857',
  successInkSoft: '#057857BB',
  danger: '#A32D2D',
  dangerBorder: '#A32D2D40',
};

const font = { sans: "'Poppins', sans-serif" };

// Avatar generator — first letter of kid name in chunky amber circle
function StoreAvatar({ name, isActive }) {
  const letter = (name || '?').charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        backgroundColor: isActive ? C.amberBtn : C.cardBg,
        border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '14px',
        color: isActive ? C.ink : C.inkMuted,
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    loading,
    store: storeData,
    stores,
    products,
    orders,
    updateOrderStatus,
    confirmPayment,
    updateProduct,
    deleteStore,
    switchStore,
  } = useApp();

  // Derived
  const totalEarnings = storeData?.total_earnings || 0;
  const confirmedSavings = storeData?.confirmed_savings || 0;
  const storeName = storeData?.store_name || 'My Store';
  const kidName = storeData?.kid_name || 'Kid';
  const parentName = storeData?.parent_name || 'Parent';
  const savingsPercentConfig = storeData?.savings_percent || 50;
  const savingsGoalAmount = storeData?.savings_amount || 100;
  const savingsGoalLabel = storeData?.savings_goal || 'New goal';

  // UI state
  const [completingOrder, setCompletingOrder] = useState(null);
  const [confirmAmount, setConfirmAmount] = useState('');
  const [confirmSavings, setConfirmSavings] = useState('');
  const [deletingStore, setDeletingStore] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [copied, setCopied] = useState(false);

  // Order buckets
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const acceptedOrders = orders.filter((o) => o.status === 'accepted');
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const pendingProducts = products.filter((p) => p.status === 'pending_review');
  const totalActionItems = pendingProducts.length + pendingOrders.length + acceptedOrders.length;

  // Handlers
  const handleStartComplete = (order) => {
    const totalAmount = order.items
      ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : order.price;
    setCompletingOrder(order);
    setConfirmAmount(totalAmount.toFixed(2));
    setConfirmSavings((totalAmount * (savingsPercentConfig / 100)).toFixed(2));
  };

  const handleConfirmComplete = () => {
    if (completingOrder) {
      updateOrderStatus(completingOrder.id, 'completed');
      confirmPayment(completingOrder.id, parseFloat(confirmAmount), parseFloat(confirmSavings));
      setCompletingOrder(null);
      setConfirmAmount('');
      setConfirmSavings('');
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(`https://getlemonadestand.com/store/${storeData?.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Early redirects
  if (!loading && !storeData) {
    router.push('/setup');
    return null;
  }
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: C.cream, fontFamily: font.sans }}
      >
        <p style={{ color: C.inkFaint, fontSize: '14px' }}>Loading…</p>
      </div>
    );
  }

  return (
    <ParentGate onCancel={() => router.push('/biz')}>
      <div
        className="min-h-screen"
        style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
      >
        <NavBar active="dashboard" />

        <main className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-8">

          {/* ===== HEADER ===== */}
          <p
            className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
            style={{ color: C.amberDeep }}
          >
            Parent zone
          </p>
          <h1
            className="text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.05]"
            style={{ fontWeight: 800, color: C.ink }}
          >
            Welcome back, <span style={{ color: C.amberDeep }}>{parentName}.</span>
          </h1>
          <p style={{ fontSize: '13px', color: C.inkMuted, marginTop: '4px' }}>
            Managing {storeName}{stores.length > 1 ? ` · ${stores.length} stores` : ''}
          </p>

          {/* ===== ACTION ITEMS ===== */}
          {totalActionItems > 0 ? (
            <>
              <SectionLabel
                label="Needs your attention"
                rightElement={
                  <span
                    style={{
                      backgroundColor: C.ink,
                      color: C.amberBtn,
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      padding: '3px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    {totalActionItems} {totalActionItems === 1 ? 'item' : 'items'}
                  </span>
                }
              />

              {/* Pending products */}
              {pendingProducts.length > 0 && (
                <ActionCard
                  title={`${pendingProducts.length} product${pendingProducts.length !== 1 ? 's' : ''} to review`}
                  meta={`${kidName} is waiting`}
                >
                  {pendingProducts.map((p, i) => (
                    <ProductReviewRow
                      key={p.id}
                      product={p}
                      isLast={i === pendingProducts.length - 1}
                      onApprove={() => updateProduct(p.id, { status: 'approved' })}
                      onChanges={() => updateProduct(p.id, { status: 'changes_requested' })}
                    />
                  ))}
                </ActionCard>
              )}

              {/* Pending orders */}
              {pendingOrders.length > 0 && (
                <ActionCard
                  title={`${pendingOrders.length} new order${pendingOrders.length !== 1 ? 's' : ''}`}
                  meta="Review & respond"
                >
                  {pendingOrders.map((order, i) => (
                    <PendingOrderRow
                      key={order.id}
                      order={order}
                      isLast={i === pendingOrders.length - 1}
                      onAccept={() => updateOrderStatus(order.id, 'accepted')}
                      onDecline={() => updateOrderStatus(order.id, 'declined')}
                    />
                  ))}
                </ActionCard>
              )}

              {/* In-progress orders */}
              {acceptedOrders.length > 0 && (
                <ActionCard
                  title={`${acceptedOrders.length} order${acceptedOrders.length !== 1 ? 's' : ''} in progress`}
                  meta="Arrange delivery"
                >
                  {acceptedOrders.map((order, i) => (
                    <AcceptedOrderRow
                      key={order.id}
                      order={order}
                      isLast={i === acceptedOrders.length - 1}
                      onComplete={() => handleStartComplete(order)}
                    />
                  ))}
                </ActionCard>
              )}
            </>
          ) : (
            /* All caught up */
            <div
              className="mt-6 mb-2"
              style={{
                backgroundColor: C.successBg,
                border: `1px solid ${C.successBorder}`,
                borderRadius: '14px',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#10B98120',
                  border: `1.5px solid ${C.successBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Check size={20} strokeWidth={3} color={C.successInk} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: C.successInk }}>
                  All caught up.
                </div>
                <div style={{ fontSize: '12px', color: C.successInkSoft, marginTop: '2px' }}>
                  No items need your attention right now. Nice work.
                </div>
              </div>
            </div>
          )}

          {/* ===== OVERVIEW ===== */}
          <SectionLabel label="Overview" />

          <div className="grid grid-cols-3 gap-3 mb-3">
            <StatCard
              label="Total earned"
              value={`$${totalEarnings.toFixed(2)}`}
              meta={`${completedOrders.length} ${completedOrders.length === 1 ? 'sale' : 'sales'}`}
              valueColor={C.amberDeep}
            />
            <StatCard
              label="In savings"
              value={`$${confirmedSavings.toFixed(2)}`}
              meta={`${savingsPercentConfig}% of earnings`}
              valueColor={C.ink}
            />
            <StatCard
              label="Orders"
              value={String(orders.length)}
              meta={`${completedOrders.length} completed`}
              valueColor={C.ink}
            />
          </div>

          {/* Savings progress */}
          <div
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: '14px',
              padding: '16px 18px',
              boxShadow: `2px 2px 0 ${C.ink}12`,
            }}
          >
            <div className="flex justify-between items-baseline mb-3">
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: C.ink }}>
                  Saving for: {savingsGoalLabel}
                </div>
                <div style={{ fontSize: '11px', color: C.inkFaint, marginTop: '2px', fontWeight: 600 }}>
                  ${confirmedSavings.toFixed(2)} of ${savingsGoalAmount} saved
                  {confirmedSavings < savingsGoalAmount && ` · $${(savingsGoalAmount - confirmedSavings).toFixed(2)} to go`}
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: C.amberDeep, letterSpacing: '-0.02em' }}>
                {Math.min(Math.round((confirmedSavings / savingsGoalAmount) * 100), 100)}%
              </div>
            </div>
            <div
              style={{
                height: '8px',
                backgroundColor: C.cream,
                border: `1px solid ${C.borderFaint}`,
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min((confirmedSavings / savingsGoalAmount) * 100, 100)}%`,
                  backgroundColor: C.amberBtn,
                  borderRadius: '999px',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
            {confirmedSavings >= savingsGoalAmount && (
              <p style={{ fontSize: '12px', color: C.successInk, fontWeight: 700, marginTop: '8px' }}>
                Goal reached! Time to set a new one.
              </p>
            )}
          </div>


          {/* ===== QUICK ACTIONS ===== */}
          <SectionLabel label="Quick actions" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <QuickActionButton
              icon={<Pencil size={20} strokeWidth={1.75} />}
              label="Edit store"
              onClick={() => router.push('/editor')}
            />
            <QuickActionButton
              icon={<Eye size={20} strokeWidth={1.75} />}
              label="View store"
              onClick={() => router.push(`/store/${storeData?.id}`)}
            />
            <QuickActionButton
              icon={<PiggyBank size={20} strokeWidth={1.75} />}
              label="Savings"
              onClick={() => router.push('/savings')}
            />
            <QuickActionButton
              icon={<ShoppingCart size={20} strokeWidth={1.75} />}
              label="Marketplace"
              onClick={() => router.push('/shop')}
            />
          </div>

          {/* ===== SHARE STORE ===== */}
          <SectionLabel label={`Share ${kidName}'s store`} />

          <div
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: '14px',
              padding: '16px 18px',
              boxShadow: `2px 2px 0 ${C.ink}12`,
            }}
          >
            <div className="flex gap-2 items-center mb-3">
              <div
                style={{
                  flex: 1,
                  backgroundColor: C.cream,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: C.inkMuted,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                getlemonadestand.com/store/{storeData?.id}
              </div>
              <button
                onClick={handleCopyLink}
                className="transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: copied ? C.successBg : C.amberBtn,
                  color: copied ? C.successInk : C.ink,
                  border: `1.5px solid ${C.ink}`,
                  boxShadow: `2px 2px 0 ${C.ink}`,
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <ShareButton
                icon={<MessageSquare size={16} strokeWidth={2} />}
                label="Text"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(`sms:?body=Check out ${kidName}'s store on Lemonade Stand! https://getlemonadestand.com/store/${storeData?.id}`);
                  }
                }}
              />
              <ShareButton
                icon={<Copy size={16} strokeWidth={2} />}
                label="Copy link"
                onClick={handleCopyLink}
              />
              <ShareButton
                icon={<Share2 size={16} strokeWidth={2} />}
                label="Share"
                onClick={() => {
                  if (typeof window !== 'undefined' && navigator.share) {
                    navigator.share({
                      title: `${kidName}'s Store`,
                      text: `Check out ${kidName}'s store on Lemonade Stand!`,
                      url: `https://getlemonadestand.com/store/${storeData?.id}`,
                    });
                  } else {
                    handleCopyLink();
                  }
                }}
              />
            </div>
          </div>

          {/* ===== YOUR STORES ===== */}
          <SectionLabel label="Your stores" />

          <div
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: '14px',
              padding: '16px 18px',
              boxShadow: `2px 2px 0 ${C.ink}12`,
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <span style={{ fontSize: '14px', fontWeight: 800, color: C.ink }}>
                {stores.length} {stores.length === 1 ? 'store' : 'stores'}
              </span>
              <button
                onClick={() => router.push('/setup')}
                className="transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: C.amberBtn,
                  color: C.ink,
                  border: `1.5px solid ${C.ink}`,
                  boxShadow: `1.5px 1.5px 0 ${C.ink}`,
                  padding: '7px 12px',
                  borderRadius: '9px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                + Add store
              </button>
            </div>
            <div className="space-y-2">
              {stores.map((s) => {
                const isActive = storeData?.id === s.id;
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: C.cream,
                      border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.border}`,
                      boxShadow: isActive ? `2px 2px 0 ${C.ink}` : 'none',
                      borderRadius: '12px',
                      transform: isActive ? 'translate(-1px, -1px)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <StoreAvatar name={s.kid_name} isActive={isActive} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5" style={{ flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: C.ink }}>
                            {s.store_name}
                          </span>
                          {isActive && (
                            <span
                              style={{
                                backgroundColor: C.ink,
                                color: C.amberBtn,
                                fontSize: '9px',
                                fontWeight: 800,
                                letterSpacing: '0.05em',
                                padding: '2px 7px',
                                borderRadius: '999px',
                                textTransform: 'uppercase',
                              }}
                            >
                              Active
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: C.inkFaint, marginTop: '2px', fontWeight: 600 }}>
                          {s.kid_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {!isActive && (
                        <button
                          onClick={() => switchStore(s.id)}
                          style={{
                            backgroundColor: 'white',
                            color: C.ink,
                            border: `1px solid ${C.ink}`,
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Switch
                        </button>
                      )}
                      <button
                        onClick={() => setDeletingStore(s)}
                        style={{
                          backgroundColor: 'white',
                          color: C.danger,
                          border: `1px solid ${C.dangerBorder}`,
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== COMPLETED ORDERS ===== */}
          {completedOrders.length > 0 && (
            <>
              <SectionLabel label="Completed orders" />
              <div
                style={{
                  backgroundColor: C.cardBg,
                  border: `1px solid ${C.border}`,
                  borderRadius: '14px',
                  padding: '12px 14px',
                  boxShadow: `2px 2px 0 ${C.ink}12`,
                }}
              >
                {completedOrders.map((order, i) => (
                  <div
                    key={order.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: C.cream,
                      border: `1px solid ${C.border}`,
                      borderRadius: '10px',
                      marginBottom: i === completedOrders.length - 1 ? 0 : '6px',
                    }}
                  >
                    <div className="min-w-0">
                      <div style={{ fontSize: '12px', fontWeight: 800, color: C.ink }}>
                        {order.buyer_name || 'Customer'}
                      </div>
                      <div style={{ fontSize: '11px', color: C.inkFaint, marginTop: '1px' }}>
                        {order.items ? order.items.map((it) => it.name).join(', ') : 'Order'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: C.ink }}>
                        ${(order.confirmed_amount || order.total_amount || 0).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '10px', color: C.inkFaint, marginTop: '1px' }}>
                        Completed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ===== COMMUNITY STANDARDS ===== */}
          <div className="mt-6">
            <div
              style={{
                backgroundColor: C.creamWarm,
                border: `1px solid ${C.border}`,
                borderRadius: '14px',
                padding: '18px 20px',
              }}
            >
              <p
                className="text-xs uppercase tracking-[0.16em] font-bold mb-2"
                style={{ color: C.amberDeep, letterSpacing: '0.16em' }}
              >
                For parents
              </p>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: C.ink, marginBottom: '12px', letterSpacing: '-0.005em' }}>
                Community standards
              </h3>
              <div style={{ fontSize: '12px', color: C.inkMuted, lineHeight: 1.6 }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong style={{ color: C.ink, fontWeight: 700 }}>Parent responsibility:</strong>{' '}
                  You are responsible for supervising your kid's activity, reviewing and approving all products, and overseeing all orders, payments, and customer interactions.
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong style={{ color: C.ink, fontWeight: 700 }}>Safe content:</strong>{' '}
                  All store names, product listings, descriptions, and images must be appropriate for a family audience.
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong style={{ color: C.ink, fontWeight: 700 }}>Privacy & safety:</strong>{' '}
                  Never share personal information in store listings. No photos of children permitted. All customer communications handled by a parent.
                </p>
                <p>
                  <strong style={{ color: C.ink, fontWeight: 700 }}>Respect & moderation:</strong>{' '}
                  Treat all community members with kindness. Lemonade Stand reserves the right to review or remove content that violates these standards.
                </p>
              </div>
              <a
                href="/privacy"
                style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  fontSize: '12px',
                  color: C.amberDeep,
                  fontWeight: 700,
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                Read our full privacy & data practices →
              </a>
            </div>
          </div>

        </main>

        {/* ===== DELETE STORE MODAL ===== */}
        {deletingStore && (
          <DeleteStoreModal
            store={deletingStore}
            confirmText={deleteConfirmText}
            onChangeText={setDeleteConfirmText}
            onCancel={() => {
              setDeletingStore(null);
              setDeleteConfirmText('');
            }}
            onConfirm={async () => {
              if (deleteConfirmText.toLowerCase() === deletingStore.kid_name.toLowerCase()) {
                await deleteStore(deletingStore.id);
                setDeletingStore(null);
                setDeleteConfirmText('');
              }
            }}
          />
        )}

        {/* ===== PAYMENT CONFIRM MODAL ===== */}
        {completingOrder && (
          <PaymentConfirmModal
            kidName={kidName}
            confirmAmount={confirmAmount}
            confirmSavings={confirmSavings}
            savingsPercentConfig={savingsPercentConfig}
            onChangeAmount={(v) => {
              setConfirmAmount(v);
              setConfirmSavings((parseFloat(v || 0) * (savingsPercentConfig / 100)).toFixed(2));
            }}
            onChangeSavings={setConfirmSavings}
            onCancel={() => setCompletingOrder(null)}
            onConfirm={handleConfirmComplete}
          />
        )}

      </div>
    </ParentGate>
  );
}

// =====================================================================
// SECTION LABEL — uppercase eyebrow with optional right element
// =====================================================================
function SectionLabel({ label, rightElement }) {
  return (
    <div
      className="flex items-center justify-between mt-6 mb-2.5"
      style={{ paddingLeft: '4px' }}
    >
      <span
        style={{
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: C.inkFaint,
          fontWeight: 700,
        }}
      >
        {label}
      </span>
      {rightElement}
    </div>
  );
}

// =====================================================================
// ACTION CARD — wrapper for action item groupings
// =====================================================================
function ActionCard({ title, meta, children }) {
  return (
    <div
      className="mb-2.5"
      style={{
        backgroundColor: C.cardBg,
        border: `1px solid ${C.border}`,
        borderRadius: '14px',
        padding: '14px 16px',
        boxShadow: `2px 2px 0 ${C.ink}12`,
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <span style={{ fontSize: '14px', fontWeight: 800, color: C.ink, letterSpacing: '-0.005em' }}>
          {title}
        </span>
        <span style={{ fontSize: '11px', color: C.inkFaint, fontWeight: 600 }}>
          {meta}
        </span>
      </div>
      {children}
    </div>
  );
}

// =====================================================================
// PRODUCT REVIEW ROW
// =====================================================================
function ProductReviewRow({ product, isLast, onApprove, onChanges }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: C.cream,
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        marginBottom: isLast ? 0 : '8px',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          backgroundColor: C.cardBg,
          border: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {product.image_url ? (
          <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          product.emoji || '🎁'
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: C.ink, lineHeight: 1.2 }}>
          {product.name}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: C.inkFaint,
            marginTop: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.description || 'No description'}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 800, color: C.amberDeep, marginTop: '4px' }}>
          ${Number(product.price).toFixed(2)}
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={onApprove}
          className="transition-all hover:-translate-y-0.5"
          style={{
            backgroundColor: C.amberBtn,
            color: C.ink,
            border: `1.5px solid ${C.ink}`,
            boxShadow: `1.5px 1.5px 0 ${C.ink}`,
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Approve
        </button>
        <button
          onClick={onChanges}
          style={{
            backgroundColor: 'white',
            color: C.inkMuted,
            border: `1px solid ${C.border}`,
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Changes
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// PENDING ORDER ROW
// =====================================================================
function PendingOrderRow({ order, isLast, onAccept, onDecline }) {
  const total = order.total_amount || (order.items ? order.items.reduce((s, i) => s + i.price * i.quantity, 0) : 0);
  return (
    <div
      style={{
        padding: '12px',
        backgroundColor: C.cream,
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        marginBottom: isLast ? 0 : '8px',
      }}
    >
      <div className="flex justify-between items-start mb-1.5">
        <div className="min-w-0">
          <div style={{ fontSize: '13px', fontWeight: 800, color: C.ink }}>
            {order.buyer_name || 'Customer'}
          </div>
          {order.buyer_contact && (
            <div style={{ fontSize: '11px', color: C.amberDeep, marginTop: '2px' }}>
              {order.buyer_contact}
            </div>
          )}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 800, color: C.ink, flexShrink: 0, marginLeft: '12px' }}>
          ${total.toFixed(2)}
        </div>
      </div>
      {order.items && (
        <div style={{ fontSize: '11px', color: C.inkFaint, margin: '6px 0' }}>
          {order.items.map((item, i) => (
            <span key={i}>
              {item.name} × {item.quantity}
              {i < order.items.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}
      {order.buyer_note && (
        <div style={{ fontSize: '11px', color: C.inkFaint, fontStyle: 'italic', margin: '4px 0 8px' }}>
          "{order.buyer_note}"
        </div>
      )}
      <div className="flex gap-1.5">
        <button
          onClick={onAccept}
          className="transition-all hover:-translate-y-0.5"
          style={{
            flex: 1,
            backgroundColor: C.amberBtn,
            color: C.ink,
            border: `1.5px solid ${C.ink}`,
            boxShadow: `1.5px 1.5px 0 ${C.ink}`,
            padding: '8px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Accept order
        </button>
        <button
          onClick={onDecline}
          style={{
            backgroundColor: 'white',
            color: C.inkMuted,
            border: `1px solid ${C.border}`,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// ACCEPTED ORDER ROW (in progress, needs completion)
// =====================================================================
function AcceptedOrderRow({ order, isLast, onComplete }) {
  return (
    <div
      style={{
        padding: '12px',
        backgroundColor: C.cream,
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        marginBottom: isLast ? 0 : '8px',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0">
          <div style={{ fontSize: '13px', fontWeight: 800, color: C.ink }}>
            {order.buyer_name || 'Customer'}
          </div>
          {order.buyer_contact && (
            <div style={{ fontSize: '11px', color: C.amberDeep, marginTop: '2px' }}>
              {order.buyer_contact}
            </div>
          )}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 800, color: C.ink, flexShrink: 0, marginLeft: '12px' }}>
          ${(order.total_amount || 0).toFixed(2)}
        </div>
      </div>
      <div
        style={{
          backgroundColor: C.cardBg,
          border: `1px solid ${C.border}`,
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          color: C.inkMuted,
          marginBottom: '8px',
        }}
      >
        Contact {order.buyer_name || 'the customer'} to arrange pickup or delivery.
      </div>
      <button
        onClick={onComplete}
        className="transition-all hover:-translate-y-0.5"
        style={{
          width: '100%',
          backgroundColor: C.amberBtn,
          color: C.ink,
          border: `1.5px solid ${C.ink}`,
          boxShadow: `1.5px 1.5px 0 ${C.ink}`,
          padding: '8px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Mark complete & confirm payment
      </button>
    </div>
  );
}

// =====================================================================
// STAT CARD
// =====================================================================
function StatCard({ label, value, meta, valueColor }) {
  return (
    <div
      style={{
        backgroundColor: C.cardBg,
        border: `1px solid ${C.border}`,
        borderRadius: '14px',
        padding: '14px 16px',
        boxShadow: `2px 2px 0 ${C.ink}12`,
      }}
    >
      <div
        style={{
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.inkFaint,
          fontWeight: 700,
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 'clamp(20px, 5vw, 26px)',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: valueColor || C.ink,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '11px', color: C.inkFaint, marginTop: '2px', fontWeight: 600 }}>
        {meta}
      </div>
    </div>
  );
}

// =====================================================================
// QUICK ACTION BUTTON
// =====================================================================
function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="transition-all hover:-translate-y-0.5"
      style={{
        backgroundColor: C.cardBg,
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        padding: '14px 10px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: `2px 2px 0 ${C.ink}12`,
        fontFamily: 'inherit',
      }}
    >
      <div style={{ width: '24px', height: '24px', margin: '0 auto 6px', color: C.amberDeep }}>
        {icon}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 800, color: C.ink }}>
        {label}
      </div>
    </button>
  );
}

// =====================================================================
// SHARE BUTTON
// =====================================================================
function ShareButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: C.cream,
        border: `1px solid ${C.border}`,
        borderRadius: '10px',
        padding: '10px',
        textAlign: 'center',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ width: '16px', height: '16px', margin: '0 auto 4px', color: C.inkMuted }}>
        {icon}
      </div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: C.inkMuted }}>
        {label}
      </div>
    </button>
  );
}

// =====================================================================
// DELETE STORE MODAL
// =====================================================================
function DeleteStoreModal({ store, confirmText, onChangeText, onCancel, onConfirm }) {
  const canDelete = confirmText.toLowerCase() === store.kid_name.toLowerCase();
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        padding: '16px',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: C.cardBg,
          border: `1.5px solid ${C.ink}`,
          borderRadius: '18px',
          boxShadow: `4px 4px 0 ${C.ink}`,
          padding: '24px',
          maxWidth: '420px',
          width: '100%',
          fontFamily: font.sans,
          color: C.ink,
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.2em] font-bold"
          style={{ color: C.danger, marginBottom: '6px' }}
        >
          Permanent action
        </p>
        <h3 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '12px' }}>
          Delete {store.store_name}?
        </h3>
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: `1px solid ${C.dangerBorder}`,
            borderRadius: '12px',
            padding: '14px 16px',
            fontSize: '12px',
            color: C.danger,
            marginBottom: '16px',
            lineHeight: 1.6,
          }}
        >
          <p style={{ marginBottom: '4px' }}>This will permanently delete:</p>
          <p style={{ margin: 0 }}>• All products in this store</p>
          <p style={{ margin: 0 }}>• All order history</p>
          <p style={{ margin: 0 }}>• Store design and settings</p>
          <p style={{ margin: 0 }}>• Savings tracking data</p>
          <p style={{ marginTop: '8px', fontWeight: 800 }}>This cannot be undone.</p>
        </div>
        <label style={{ display: 'block', fontSize: '12px', color: C.inkMuted, marginBottom: '8px' }}>
          Type <strong style={{ color: C.ink }}>{store.kid_name}</strong> to confirm:
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={store.kid_name}
          className="focus:outline-none"
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '10px',
            border: `1.5px solid ${C.borderInput}`,
            backgroundColor: C.cream,
            fontSize: '14px',
            fontWeight: 600,
            color: C.ink,
            fontFamily: 'inherit',
            marginBottom: '16px',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
        />
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              backgroundColor: 'white',
              color: C.inkMuted,
              border: `1px solid ${C.border}`,
              padding: '12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canDelete}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              flex: 1,
              backgroundColor: canDelete ? '#DC2626' : '#E7E5E4',
              color: canDelete ? 'white' : C.inkGhost,
              border: `1.5px solid ${canDelete ? '#7F1D1D' : C.border}`,
              boxShadow: canDelete ? `2px 2px 0 #7F1D1D` : 'none',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: canDelete ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
            }}
          >
            Delete forever
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// PAYMENT CONFIRM MODAL
// =====================================================================
function PaymentConfirmModal({ kidName, confirmAmount, confirmSavings, savingsPercentConfig, onChangeAmount, onChangeSavings, onCancel, onConfirm }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        padding: '16px',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: C.cardBg,
          border: `1.5px solid ${C.ink}`,
          borderRadius: '18px',
          boxShadow: `4px 4px 0 ${C.ink}`,
          padding: '24px',
          maxWidth: '420px',
          width: '100%',
          fontFamily: font.sans,
          color: C.ink,
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.2em] font-bold"
          style={{ color: C.amberDeep, marginBottom: '6px' }}
        >
          Confirm payment
        </p>
        <h3 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '8px' }}>
          Payment received?
        </h3>
        <p style={{ fontSize: '13px', color: C.inkMuted, marginBottom: '16px', lineHeight: 1.5 }}>
          How much did you receive for this order? {kidName}'s savings will be updated.
        </p>
        <div className="space-y-3 mb-5">
          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.amberDeep, fontWeight: 800, marginBottom: '6px' }}>
              Amount received ($)
            </label>
            <input
              type="number"
              value={confirmAmount}
              onChange={(e) => onChangeAmount(e.target.value)}
              className="focus:outline-none"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: `1.5px solid ${C.borderInput}`,
                backgroundColor: C.cream,
                fontSize: '15px',
                fontWeight: 700,
                color: C.ink,
                fontFamily: 'inherit',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.amberDeep, fontWeight: 800, marginBottom: '6px' }}>
              To savings ({savingsPercentConfig}%)
            </label>
            <input
              type="number"
              value={confirmSavings}
              onChange={(e) => onChangeSavings(e.target.value)}
              className="focus:outline-none"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: `1.5px solid ${C.borderInput}`,
                backgroundColor: C.cream,
                fontSize: '15px',
                fontWeight: 700,
                color: C.ink,
                fontFamily: 'inherit',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = C.ink; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = C.borderInput; }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              backgroundColor: 'white',
              color: C.inkMuted,
              border: `1px solid ${C.border}`,
              padding: '12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="transition-all hover:-translate-y-0.5"
            style={{
              flex: 1,
              backgroundColor: C.amberBtn,
              color: C.ink,
              border: `1.5px solid ${C.ink}`,
              boxShadow: `2px 2px 0 ${C.ink}`,
              padding: '12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
