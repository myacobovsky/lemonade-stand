// @ts-nocheck
'use client';
import { useRouter } from 'next/navigation';
import { NavBar, Logo } from '../components';

// ====================== DESIGN TOKENS ======================
const C = {
  cream: '#FEF3C7',
  creamCool: '#FDF8E1',
  creamWarm: '#FEF0B8',
  cardBg: '#FFFBEB',
  ink: '#1C1917',
  inkMuted: '#57534E',
  inkFaint: '#78716C',
  border: '#1C191720',
  borderFaint: '#1C191714',
  amberAccent: '#D97706',
  amberBtn: '#FCD34D',
  // Semantic colors for the "do not collect" section
  emerald: '#059669',
  emeraldBg: '#D1FAE5',
  emeraldBorder: '#10B98133',
};
const font = {
  sans: "'Poppins', sans-serif",
};

// ====================== SECTION WRAPPER ======================
// Reusable section card — eyebrow + heading + content block with chunky shadow
function Section({ eyebrow, title, titleAccent, children }) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        {eyebrow && (
          <p
            className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
            style={{ color: C.amberAccent }}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className="text-2xl sm:text-3xl tracking-[-0.02em] leading-[1.1]"
          style={{ fontWeight: 800, color: C.ink }}
        >
          {title}
          {titleAccent && <span style={{ color: C.amberAccent }}> {titleAccent}</span>}
        </h2>
      </div>
      <div
        style={{
          backgroundColor: C.cardBg,
          border: `1px solid ${C.border}`,
          borderRadius: '18px',
          boxShadow: `2px 2px 0 ${C.ink}12`,
          padding: '24px',
        }}
      >
        {children}
      </div>
    </section>
  );
}

// ====================== LABELED ROW ======================
// Used in "What We Collect", "Who Can See What", "Your Controls", "Child Safety"
function LabeledRow({ label, description, isLast }) {
  return (
    <div
      className="py-3"
      style={isLast ? {} : { borderBottom: `1px dashed ${C.ink}18` }}
    >
      <div style={{ fontSize: '15px', fontWeight: 700, color: C.ink, marginBottom: '4px' }}>
        {label}
      </div>
      <p style={{ fontSize: '14px', color: C.inkMuted, lineHeight: 1.55, margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

export default function PrivacyPage() {
  const router = useRouter();

  // Button style shared across the page
  const btnPrimary = {
    backgroundColor: C.amberBtn,
    color: C.ink,
    border: `1.5px solid ${C.ink}`,
    boxShadow: `3px 3px 0 ${C.ink}`,
    borderRadius: '12px',
    fontWeight: 700,
    transition: 'all 0.15s ease',
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.cream, fontFamily: font.sans, color: C.ink }}
    >
      <NavBar active="" />

      <main className="max-w-3xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-12">

        {/* ============ HEADER ============ */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <Logo size="lg" />
          </div>
          <p
            className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: C.amberAccent }}
          >
            Privacy & data practices
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl tracking-[-0.025em] leading-[1.02]"
            style={{ fontWeight: 800, color: C.ink }}
          >
            How we protect <span style={{ color: C.amberAccent }}>your family.</span>
          </h1>
          <p
            className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: C.inkMuted }}
          >
            Plain-language answers to the questions parents actually ask about kid data online.
          </p>
        </div>

        {/* ============ PLACEHOLDER NOTICE ============ */}
        <div
          className="mb-10"
          style={{
            backgroundColor: C.creamWarm,
            border: `1px solid ${C.ink}22`,
            borderRadius: '14px',
            padding: '16px 20px',
            fontSize: '14px',
            color: C.ink,
            lineHeight: 1.55,
          }}
        >
          <strong style={{ fontWeight: 700 }}>A note on this page:</strong> This is a plain-language summary of our practices. A full legal privacy policy is being prepared with legal counsel and will be published here when complete. Questions in the meantime:{' '}
          <a
            href="mailto:privacy@getlemonadestand.com"
            style={{ color: C.amberAccent, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            privacy@getlemonadestand.com
          </a>
          .
        </div>

        {/* ============ WHAT WE COLLECT ============ */}
        <Section title="What we" titleAccent="collect.">
          <LabeledRow
            label="Parent account info"
            description="Email address and password (encrypted). Used to create and manage your account. We never share this with anyone."
          />
          <LabeledRow
            label="Store info"
            description="Store name, child's first name, product listings, prices, and store design preferences. This is the content your child creates to run their store."
          />
          <LabeledRow
            label="Order info"
            description="Buyer name, contact info, items ordered, and order notes. This is provided by customers when they place an order."
          />
          <LabeledRow
            label="Product images"
            description="Photos uploaded for product listings and store banners. Photos of children are strictly prohibited."
            isLast
          />
        </Section>

        {/* ============ WHAT WE DO NOT COLLECT ============ */}
        {/* Distinct visual treatment: green-tinted card to reinforce "what we DON'T do" */}
        <section className="mb-10">
          <div className="mb-4">
            <p
              className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
              style={{ color: C.amberAccent }}
            >
              Just as important
            </p>
            <h2
              className="text-2xl sm:text-3xl tracking-[-0.02em] leading-[1.1]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              What we{' '}
              <span style={{ color: C.amberAccent }}>don't collect.</span>
            </h2>
          </div>
          <div
            style={{
              backgroundColor: C.emeraldBg,
              border: `1px solid ${C.emeraldBorder}`,
              borderRadius: '18px',
              boxShadow: `2px 2px 0 ${C.ink}12`,
              padding: '20px 24px',
            }}
          >
            {[
              "Your child's age, birthday, or last name",
              'Location data or GPS coordinates',
              'Photos of children (strictly prohibited)',
              'Cookies for advertising or tracking',
              'No selling, sharing, or giving your data to third parties',
              'No ads shown to children or adults',
            ].map((text, i, arr) => (
              <div
                key={i}
                className="flex items-start gap-3 py-2.5"
                style={i < arr.length - 1 ? { borderBottom: `1px dashed ${C.emerald}33` } : {}}
              >
                {/* Simple dot — no emoji, no checkmark icon */}
                <div
                  className="shrink-0"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: C.emerald,
                    marginTop: '7px',
                  }}
                />
                <p style={{ fontSize: '14px', color: '#065F46', lineHeight: 1.55, margin: 0 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ WHERE DATA LIVES ============ */}
        <Section title="Where your data" titleAccent="actually lives.">
          <div style={{ fontSize: '14px', color: C.inkMuted, lineHeight: 1.65 }}>
            <p className="mb-3">
              All data is stored on <strong style={{ color: C.ink, fontWeight: 700 }}>Supabase</strong>, a secure cloud database platform. Supabase uses industry-standard encryption for data in transit (TLS) and at rest (AES-256).
            </p>
            <p className="mb-3">
              Product images are stored in a secure cloud storage bucket. Only publicly listed products are visible to other users.
            </p>
            <p style={{ margin: 0 }}>
              Passwords are hashed and salted. We cannot see your password, and neither can anyone on our team.
            </p>
          </div>
        </Section>

        {/* ============ WHO CAN SEE WHAT ============ */}
        <Section title="Who can see" titleAccent="what.">
          <LabeledRow
            label="Public (anyone)"
            description="Store name, child's first name, product listings, prices, and store design. This is what customers see when they visit a store."
          />
          <LabeledRow
            label="Parent only"
            description="Order details, buyer contact info, earnings, savings data, and account settings. Only the parent who created the account can access this."
          />
          <LabeledRow
            label="Lemonade Stand team"
            description="We can view store content and order data for moderation and support purposes only. We review content to ensure community standards are met and to keep the platform safe for children."
            isLast
          />
        </Section>

        {/* ============ YOUR CONTROLS ============ */}
        <Section title="Your" titleAccent="controls.">
          <LabeledRow
            label="Product approval"
            description="Every product your child creates requires your approval before it goes live on the store. You review the name, description, price, and image."
          />
          <LabeledRow
            label="Full visibility"
            description="Your parent dashboard shows every order, every product, and all earnings. You see everything your child does on the platform."
          />
          <LabeledRow
            label="Data deletion"
            description="You can request complete deletion of your account and all associated data at any time by contacting privacy@getlemonadestand.com. We will process deletion requests within 30 days."
            isLast
          />
        </Section>

        {/* ============ CHILD SAFETY ============ */}
        <Section title="Child safety" titleAccent="measures.">
          <LabeledRow
            label="Parent gate"
            description="The parent dashboard requires solving a math challenge that is easy for adults but difficult for young children. This prevents kids from accidentally accessing parent functions."
          />
          <LabeledRow
            label="No photos of children"
            description="Photos of children or children's faces are strictly prohibited in store listings, product images, and banners. This rule is part of our community standards and is enforced through content moderation."
          />
          <LabeledRow
            label="No direct messaging"
            description="There is no direct messaging between buyers and sellers on the platform. All customer communication happens off-platform through the parent's email or phone."
          />
          <LabeledRow
            label="Content moderation"
            description="All store content, product listings, and order notes are subject to review by the Lemonade Stand team. Content that violates community standards will be removed."
            isLast
          />
        </Section>

        {/* ============ QUESTIONS / CONTACT ============ */}
        <section className="mb-12">
          <div className="mb-4">
            <p
              className="text-xs uppercase tracking-[0.25em] font-bold mb-2"
              style={{ color: C.amberAccent }}
            >
              Still have questions?
            </p>
            <h2
              className="text-2xl sm:text-3xl tracking-[-0.02em] leading-[1.1]"
              style={{ fontWeight: 800, color: C.ink }}
            >
              Reach out <span style={{ color: C.amberAccent }}>anytime.</span>
            </h2>
          </div>
          <div
            style={{
              backgroundColor: C.creamCool,
              border: `1px solid ${C.border}`,
              borderRadius: '18px',
              boxShadow: `2px 2px 0 ${C.ink}12`,
              padding: '24px',
            }}
          >
            <p style={{ fontSize: '14px', color: C.inkMuted, lineHeight: 1.65, margin: '0 0 12px' }}>
              If you have any questions about how we handle your family's data, or if you want to request data access or deletion, contact us at:
            </p>
            <a
              href="mailto:privacy@getlemonadestand.com"
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: C.amberAccent,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              privacy@getlemonadestand.com
            </a>
          </div>
        </section>

        {/* ============ GO BACK ============ */}
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 transition-all hover:-translate-y-0.5"
            style={{ ...btnPrimary, fontSize: '14px' }}
          >
            ← Go back
          </button>
        </div>
      </main>
    </div>
  );
}
