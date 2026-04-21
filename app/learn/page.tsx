// @ts-nocheck
'use client';
import { useRouter } from 'next/navigation';
import { NavBar } from '../components';
import learnArticles from './articles';

// ====================== DESIGN TOKENS ======================
const C = {
  cream: '#FEF3C7',
  creamCool: '#FDF8E1',
  cardBg: '#FFFBEB',
  ink: '#1C1917',
  inkMuted: '#57534E',
  inkFaint: '#78716C',
  inkGhost: '#A8A29E',
  border: '#1C191720',
  borderFaint: '#1C191714',
  amberAccent: '#D97706',
};
const font = {
  sans: "'Poppins', sans-serif",
};

// ---------- STAGES (unchanged structure, emojis removed) ----------
const stages = [
  {
    id: '1. Brainstorm',
    num: 1,
    title: 'Brainstorm',
    color: 'amber',
    tagline: 'Figure out what to sell',
    description:
      "Every great business starts with an idea. Find the perfect product based on what you love and what people want.",
  },
  {
    id: '2. Plan',
    num: 2,
    title: 'Plan',
    color: 'blue',
    tagline: 'Get your business ready',
    description:
      "Before you start selling, you need a plan. Learn how to price your products and set goals.",
  },
  {
    id: '3. Build',
    num: 3,
    title: 'Build',
    color: 'green',
    tagline: 'Set up your store',
    description:
      "Make your store look amazing, take great photos, and create a brand people remember.",
  },
  {
    id: '4. Launch',
    num: 4,
    title: 'Launch',
    color: 'purple',
    tagline: 'Get your first customers',
    description:
      "Your store is ready. Time to tell the world and land your first sale.",
  },
  {
    id: '5. Grow',
    num: 5,
    title: 'Grow',
    color: 'pink',
    tagline: 'Keep getting better',
    description:
      "Keep customers happy, get great reviews, and add new products to earn even more.",
  },
];

// ---------- PHASE COLOR THEMES ----------
// Each phase gets a tinted background + accent color for its number, count chip, timeline line and dot.
// Subtle on the backgrounds (80 alpha) to harmonize with cream; saturated on dots/numbers for wayfinding.
const themeFor = (color) => {
  switch (color) {
    case 'amber':
      return {
        headBg: '#FEF3C7',
        headBorder: '#F59E0B33',
        numBg: '#FCD34D',
        chipText: '#92400E',
        chipBg: '#FDE68A',
        chipBorder: '#F59E0B22',
        line: '#F59E0B55',
        dot: '#F59E0B',
      };
    case 'blue':
      return {
        headBg: '#DBEAFE80',
        headBorder: '#3B82F633',
        numBg: '#93C5FD',
        chipText: '#1E3A8A',
        chipBg: '#BFDBFE',
        chipBorder: '#3B82F622',
        line: '#93C5FD80',
        dot: '#3B82F6',
      };
    case 'green':
      return {
        headBg: '#D1FAE580',
        headBorder: '#10B98133',
        numBg: '#6EE7B7',
        chipText: '#065F46',
        chipBg: '#A7F3D0',
        chipBorder: '#10B98122',
        line: '#6EE7B780',
        dot: '#10B981',
      };
    case 'purple':
      return {
        headBg: '#EDE9FE80',
        headBorder: '#8B5CF633',
        numBg: '#C4B5FD',
        chipText: '#4C1D95',
        chipBg: '#DDD6FE',
        chipBorder: '#8B5CF622',
        line: '#C4B5FD80',
        dot: '#8B5CF6',
      };
    case 'pink':
      return {
        headBg: '#FCE7F380',
        headBorder: '#EC489933',
        numBg: '#F9A8D4',
        chipText: '#831843',
        chipBg: '#FBCFE8',
        chipBorder: '#EC489922',
        line: '#F9A8D480',
        dot: '#EC4899',
      };
    default:
      return themeFor('amber');
  }
};

// ---------- DIFFICULTY PILL STYLES ----------
const diffStyle = (level) => {
  if (level === 'Intermediate') {
    return {
      color: '#92400E',
      backgroundColor: '#FEF3C7',
      border: '1px solid #F59E0B22',
    };
  }
  // Beginner (default)
  return {
    color: '#065F46',
    backgroundColor: '#D1FAE5',
    border: '1px solid #10B98122',
  };
};

export default function LearnHub() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      <NavBar active="learn" />

      <main className="max-w-3xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-10">

        {/* ============ HEADER ============ */}
        <div className="text-center mb-10 sm:mb-14">
          <p
            className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: C.amberAccent }}
          >
            The Kids MBA
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl tracking-[-0.025em] leading-[1.02] max-w-2xl mx-auto"
            style={{ fontWeight: 800, color: C.ink }}
          >
            Business, in <span style={{ color: C.amberAccent }}>bite-sized lessons.</span>
          </h1>
          <p
            className="mt-5 text-base sm:text-lg leading-relaxed max-w-lg mx-auto"
            style={{ color: C.inkMuted }}
          >
            Short lessons that take you from first idea to first sale. Pick up where you left off.
          </p>
        </div>

        {/* ============ PHASES ============ */}
        <div className="space-y-10">
          {stages.map((stage) => {
            const t = themeFor(stage.color);
            const articles = learnArticles.filter((a) => a.category === stage.id);

            return (
              <div key={stage.id}>
                {/* Phase header card */}
                <div
                  className="flex gap-4 sm:gap-5 items-start"
                  style={{
                    backgroundColor: t.headBg,
                    border: `1px solid ${t.headBorder}`,
                    borderRadius: '20px',
                    padding: '22px',
                    boxShadow: `2px 2px 0 ${C.ink}12`,
                  }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: t.numBg,
                      border: `1.5px solid ${C.ink}`,
                      fontWeight: 800,
                      fontSize: '19px',
                      color: C.ink,
                    }}
                  >
                    {stage.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2
                        className="text-xl sm:text-2xl"
                        style={{ fontWeight: 800, color: C.ink, letterSpacing: '-0.01em', margin: 0 }}
                      >
                        {stage.title}
                      </h2>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: t.chipText,
                          backgroundColor: t.chipBg,
                          border: `1px solid ${t.chipBorder}`,
                          padding: '3px 10px',
                          borderRadius: '999px',
                        }}
                      >
                        {articles.length} Lesson{articles.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: C.ink,
                        margin: '2px 0 3px',
                      }}
                    >
                      {stage.tagline}
                    </p>
                    <p style={{ fontSize: '13px', color: C.inkMuted, lineHeight: 1.5, margin: 0 }}>
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Lessons */}
                <div
                  className="mt-4 ml-4 sm:ml-6 pl-5 sm:pl-6 relative"
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  {/* Timeline line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '8px',
                      bottom: '8px',
                      width: '2px',
                      borderRadius: '2px',
                      backgroundColor: t.line,
                    }}
                    aria-hidden="true"
                  />

                  {articles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => router.push(`/learn/${article.id}`)}
                      className="text-left w-full transition-all"
                      style={{
                        backgroundColor: C.cardBg,
                        border: `1px solid ${C.border}`,
                        borderRadius: '18px',
                        padding: '16px 18px',
                        boxShadow: `2px 2px 0 ${C.ink}12`,
                        fontFamily: font.sans,
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translate(-1px, -1px)';
                        e.currentTarget.style.boxShadow = `3px 3px 0 ${C.ink}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translate(0, 0)';
                        e.currentTarget.style.boxShadow = `2px 2px 0 ${C.ink}12`;
                      }}
                    >
                      {/* Timeline dot */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-28px',
                          top: '26px',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: t.dot,
                          border: `2px solid ${C.cream}`,
                        }}
                        aria-hidden="true"
                      />

                      <div className="flex-1 min-w-0">
                        <h3
                          style={{
                            fontSize: '16px',
                            fontWeight: 800,
                            color: C.ink,
                            margin: '0 0 4px',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {article.title}
                        </h3>
                        <p
                          className="line-clamp-2"
                          style={{
                            fontSize: '13px',
                            color: C.inkMuted,
                            lineHeight: 1.5,
                            margin: '0 0 8px',
                          }}
                        >
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-2.5">
                          <span style={{ fontSize: '11px', color: C.inkFaint, fontWeight: 500 }}>
                            {article.readTime} read
                          </span>
                          <span style={{ color: C.inkGhost, fontSize: '11px' }}>·</span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              padding: '3px 9px',
                              borderRadius: '999px',
                              ...diffStyle(article.difficulty),
                            }}
                          >
                            {article.difficulty}
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          color: C.inkGhost,
                          fontSize: '18px',
                          flexShrink: 0,
                          alignSelf: 'center',
                        }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ============ COMING SOON ============ */}
        <div
          className="mt-12 text-center mx-auto"
          style={{
            maxWidth: '560px',
            padding: '32px 28px',
            backgroundColor: C.creamCool,
            border: `1px solid ${C.borderFaint}`,
            borderRadius: '20px',
          }}
        >
          <p
            className="uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.25em',
              color: C.amberAccent,
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            More on the way
          </p>
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: C.ink,
              margin: '0 0 8px',
              letterSpacing: '-0.01em',
            }}
          >
            New lessons added all the time.
          </h3>
          <p style={{ fontSize: '14px', color: C.inkMuted, margin: 0, lineHeight: 1.5 }}>
            We are always adding new lessons to help you become a better business owner.
          </p>
        </div>
      </main>
    </div>
  );
}
