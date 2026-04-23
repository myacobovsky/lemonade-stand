// @ts-nocheck
// FILE: app/biz/marketing/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar, Logo } from '../../components';
import { useApp } from '../../../lib/context';

// ====================== DESIGN TOKENS ======================
const C = {
  cream: '#FEF3C7',
  creamWarm: '#FEF0B8',
  creamCool: '#FDF8E1',
  cardBg: '#FFFBEB',
  ink: '#1C1917',
  inkMuted: '#57534E',
  inkFaint: '#78716C',
  inkGhost: '#A8A29E',
  border: '#1C19171F',
  borderFaint: '#1C191714',
  borderInput: '#1C19172B',
  amberAccent: '#D97706',
  amberBtn: '#FCD34D',
  amberDeep: '#92400E',
  successBg: '#D1FAE5',
  successInk: '#059669',
};
const font = {
  sans: "'Poppins', sans-serif",
};

export default function MarketingPage() {
  const router = useRouter();
  const { loading, store: storeData, theme: storeTheme } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showFlyer, setShowFlyer] = useState(false);

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
        <p style={{ color: C.inkFaint, fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  const kidName = storeData?.kid_name || 'Kid';
  const storeName = storeData?.store_name || 'My Store';
  const storeBio = storeData?.bio || '';
  const storeId = storeData?.id;

  const storeUrlPath = storeId ? `/store/${storeId}` : '/store';
  const storeUrlFull = `getlemonadestand.com${storeUrlPath}`;
  const storeUrlWithProtocol = `https://${storeUrlFull}`;

  const hasAnnouncement = storeTheme?.announcementOn && storeTheme?.announcement;
  const announcementText = hasAnnouncement ? storeTheme.announcement : null;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(storeUrlWithProtocol);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      try {
        window.prompt('Copy this link:', storeUrlWithProtocol);
      } catch {
        /* give up gracefully */
      }
    }
  }

  function handleShareText() {
    const body = `Check out ${kidName}'s store on Lemonade Stand! ${storeUrlWithProtocol}`;
    window.location.href = `sms:?&body=${encodeURIComponent(body)}`;
  }

  function handleShareEmail() {
    const subject = `Check out ${kidName}'s store!`;
    const body = `Hi!\n\n${kidName} just opened a store on Lemonade Stand. Come take a look:\n\n${storeUrlWithProtocol}\n\nThanks for supporting young entrepreneurs!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handlePrint() {
    if (!showFlyer) setShowFlyer(true);
    setTimeout(() => {
      window.print();
    }, 100);
  }

  const sectionLabel = {
    fontSize: '11px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: C.inkFaint,
    fontWeight: 700,
    paddingLeft: '4px',
    marginBottom: '10px',
  };

  const chunkyCardStyle = {
    backgroundColor: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: '14px',
    padding: '16px 18px',
    boxShadow: `2px 2px 0 ${C.ink}12`,
  };

  const shareBtnStyle = (copied = false) => ({
    backgroundColor: copied ? C.successBg : C.cardBg,
    border: `1.5px solid ${copied ? C.successInk : C.ink}`,
    borderRadius: '14px',
    boxShadow: `3px 3px 0 ${copied ? C.successInk : C.ink}`,
    padding: '16px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'center',
    fontFamily: 'inherit',
    width: '100%',
  });

  return (
    <>
      <style jsx global>{`
        @media print {
          body > * { visibility: hidden; }
          #flyer-printable, #flyer-printable * { visibility: visible; }
          #flyer-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 40px !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div
        className="min-h-screen"
        style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
      >
        <div className="no-print">
          <NavBar active="biz" />
        </div>

        <main className="max-w-2xl mx-auto px-4 sm:px-8 pt-8 pb-16">
          <Link
            href="/biz"
            className="no-print inline-flex items-center gap-1.5 mb-4 transition-colors"
            style={{ fontSize: '13px', color: C.inkFaint, fontWeight: 500 }}
          >
            {'\u2190'} Back to My Biz
          </Link>

          <div className="no-print">
            <p
              className="text-xs uppercase tracking-[0.25em] font-bold mb-3"
              style={{ color: C.amberAccent }}
            >
              Marketing
            </p>
            <h1
              className="text-4xl sm:text-5xl tracking-[-0.025em] leading-[1.02] mb-3"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Tell people{' '}
              <span style={{ color: C.amberAccent }}>your store is open.</span>
            </h1>
            <p
              className="mb-8"
              style={{
                fontSize: '15px',
                color: C.inkMuted,
                lineHeight: 1.6,
                maxWidth: '460px',
              }}
            >
              The fastest way to your first sale is to share your store link with people you know. Start with friends and family.
            </p>

            <div style={sectionLabel}>Share your store</div>
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <button
                onClick={handleCopyLink}
                className="transition-all hover:-translate-y-0.5"
                style={shareBtnStyle(copiedLink)}
              >
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                  {copiedLink ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.successInk}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: '100%', height: '100%' }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.ink}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: '100%', height: '100%' }}
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: copiedLink ? C.successInk : C.ink,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {copiedLink ? 'Copied!' : 'Copy link'}
                </div>
              </button>

              <button
                onClick={handleShareText}
                className="transition-all hover:-translate-y-0.5"
                style={shareBtnStyle()}
              >
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={C.ink}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: '100%', height: '100%' }}
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: C.ink,
                    letterSpacing: '-0.005em',
                  }}
                >
                  Text
                </div>
              </button>

              <button
                onClick={handleShareEmail}
                className="transition-all hover:-translate-y-0.5"
                style={shareBtnStyle()}
              >
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={C.ink}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: '100%', height: '100%' }}
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: C.ink,
                    letterSpacing: '-0.005em',
                  }}
                >
                  Email
                </div>
              </button>
            </div>

            <div style={{ ...chunkyCardStyle, marginBottom: '32px' }}>
              <div
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.inkFaint,
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                Your store link
              </div>
              <div
                style={{
                  backgroundColor: C.cream,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  fontSize: '13px',
                  color: C.ink,
                  fontWeight: 600,
                  wordBreak: 'break-all',
                }}
              >
                {storeUrlFull}
              </div>
            </div>

            <div style={sectionLabel}>Announcement on your store</div>
            <div style={{ ...chunkyCardStyle, marginBottom: '32px' }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: C.ink,
                  letterSpacing: '-0.005em',
                  marginBottom: '4px',
                }}
              >
                Top banner message
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: hasAnnouncement ? C.inkMuted : C.inkGhost,
                  fontStyle: hasAnnouncement ? 'normal' : 'italic',
                  lineHeight: 1.5,
                  marginBottom: '12px',
                }}
              >
                {hasAnnouncement ? `"${announcementText}"` : 'No announcement set.'}
              </div>
              <button
                onClick={() => router.push('/editor')}
                className="inline-flex items-center gap-1 transition-colors hover:opacity-80"
                style={{
                  color: C.amberAccent,
                  fontWeight: 700,
                  fontSize: '13px',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {hasAnnouncement
                  ? 'Edit announcement in the editor \u2192'
                  : 'Add an announcement in the editor \u2192'}
              </button>
            </div>

            <div style={sectionLabel}>Print a flyer</div>
            <button
              onClick={() => setShowFlyer(!showFlyer)}
              className="w-full transition-all hover:-translate-y-0.5 mb-3"
              style={{
                backgroundColor: C.cardBg,
                border: `1px solid ${C.border}`,
                borderRadius: '14px',
                padding: '16px 18px',
                boxShadow: `2px 2px 0 ${C.ink}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: C.ink,
                    letterSpacing: '-0.005em',
                    marginBottom: '2px',
                  }}
                >
                  Make a flyer for your lobby
                </div>
                <div style={{ fontSize: '12px', color: C.inkMuted }}>
                  Print and post in your building or neighborhood.
                </div>
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: C.inkFaint,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginLeft: '12px',
                  transform: showFlyer ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                +
              </div>
            </button>
          </div>

          {showFlyer && (
            <div
              id="flyer-printable"
              style={{
                ...chunkyCardStyle,
                padding: '24px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  background: 'white',
                  border: `2px dashed ${C.ink}3D`,
                  borderRadius: '12px',
                  padding: '40px 24px',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
              >
                <div
                  className="mx-auto"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: C.amberBtn,
                    border: `2px solid ${C.ink}`,
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Logo size="md" />
                </div>
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    color: C.ink,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    marginBottom: '4px',
                    fontFamily: storeTheme?.headerFont
                      ? `'${storeTheme.headerFont}', cursive`
                      : "'Poppins', sans-serif",
                  }}
                >
                  {storeName}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: C.inkMuted,
                    marginBottom: storeBio ? '14px' : '18px',
                  }}
                >
                  by {kidName}
                </div>
                {storeBio && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: C.inkMuted,
                      fontStyle: 'italic',
                      lineHeight: 1.45,
                      marginBottom: '18px',
                      maxWidth: '280px',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    "{storeBio}"
                  </div>
                )}
                <div
                  className="mx-auto"
                  style={{
                    backgroundColor: C.cream,
                    border: `1.5px solid ${C.ink}`,
                    borderRadius: '10px',
                    padding: '14px 12px',
                    maxWidth: '320px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: C.inkFaint,
                      fontWeight: 700,
                      marginBottom: '6px',
                    }}
                  >
                    Shop now
                  </div>
                  <div
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: C.ink,
                      wordBreak: 'break-all',
                      lineHeight: 1.3,
                    }}
                  >
                    {storeUrlFull}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: C.inkFaint,
                    marginTop: '18px',
                  }}
                >
                  Type the link in any web browser to shop.
                </div>
              </div>
              <div className="no-print" style={{ textAlign: 'center' }}>
                <button
                  onClick={handlePrint}
                  className="transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: C.amberBtn,
                    border: `1.5px solid ${C.ink}`,
                    boxShadow: `3px 3px 0 ${C.ink}`,
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    color: C.ink,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Print this flyer \u2192
                </button>
              </div>
            </div>
          )}

          <div className="no-print">
            <div
              style={{
                backgroundColor: C.creamWarm,
                border: `1px solid #F59E0B33`,
                borderRadius: '16px',
                padding: '20px 22px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.amberDeep,
                  fontWeight: 800,
                  marginBottom: '12px',
                }}
              >
                Sharing ideas
              </div>
              {[
                "Post on your building's group chat or Slack",
                'Ask grandparents to share with their friends',
                'Put a flyer in the lobby or mailroom',
                'Tell neighbors in the elevator',
              ].map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5"
                  style={{ marginBottom: i < 3 ? '10px' : 0 }}
                >
                  <div
                    style={{
                      width: '5px',
                      height: '5px',
                      backgroundColor: C.amberAccent,
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginTop: '8px',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '13px',
                      color: C.ink,
                      lineHeight: 1.5,
                    }}
                  >
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

