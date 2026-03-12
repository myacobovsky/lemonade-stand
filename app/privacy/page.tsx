
// @ts-nocheck
'use client';
import { useRouter } from 'next/navigation';
import { NavBar, Logo } from '../components';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <NavBar active="" />

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex justify-center mb-4"><Logo size="lg" /></div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">Privacy & Data Practices</h1>
          <p className="text-center text-gray-500">How Lemonade Stand protects your family</p>
        </div>

        {/* Placeholder notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Note:</strong> This privacy overview is a summary of our practices written in plain language. A full legal privacy policy is being prepared with legal counsel and will be published here when complete. If you have questions in the meantime, contact us at privacy@getlemonadestand.com.
        </div>

        <div className="space-y-8">
          {/* What we collect */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">What We Collect</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">👤</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Parent account info</div>
                  <p className="text-sm text-gray-600">Email address and password (encrypted). Used to create and manage your account. We never share this with anyone.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">🏪</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Store info</div>
                  <p className="text-sm text-gray-600">Store name, child's first name, product listings, prices, and store design preferences. This is the content your child creates to run their store.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">📦</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Order info</div>
                  <p className="text-sm text-gray-600">Buyer name, contact info, items ordered, and order notes. This is provided by customers when they place an order.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">📸</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Product images</div>
                  <p className="text-sm text-gray-600">Photos uploaded for product listings and store banners. Photos of children are strictly prohibited.</p>
                </div>
              </div>
            </div>
          </section>

          {/* What we do NOT collect */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">What We Do NOT Collect</h2>
            <div className="bg-emerald-50 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <span className="text-emerald-500 font-bold">✗</span>
                <span>We do not collect your child's age, birthday, last name, or school</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <span className="text-emerald-500 font-bold">✗</span>
                <span>We do not collect location data or GPS coordinates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <span className="text-emerald-500 font-bold">✗</span>
                <span>We do not collect photos of children (strictly prohibited)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <span className="text-emerald-500 font-bold">✗</span>
                <span>We do not use cookies for advertising or tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <span className="text-emerald-500 font-bold">✗</span>
                <span>We do not sell, share, or give your data to third parties</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <span className="text-emerald-500 font-bold">✗</span>
                <span>We do not show ads to children or adults</span>
              </div>
            </div>
          </section>

          {/* Where data is stored */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Where Your Data Lives</h2>
            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600 space-y-2">
              <p>All data is stored on <strong>Supabase</strong>, a secure cloud database platform. Supabase uses industry-standard encryption for data in transit (TLS) and at rest (AES-256).</p>
              <p>Product images are stored in a secure cloud storage bucket. Only publicly listed products are visible to other users.</p>
              <p>Passwords are hashed and salted. We cannot see your password, and neither can anyone on our team.</p>
            </div>
          </section>

          {/* Who can see what */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Who Can See What</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">👁️</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Public (anyone)</div>
                  <p className="text-sm text-gray-600">Store name, child's first name, product listings, prices, and store design. This is what customers see when they visit a store.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">🔒</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Parent only</div>
                  <p className="text-sm text-gray-600">Order details, buyer contact info, earnings, savings data, and account settings. Only the parent who created the account can access this.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">🛡️</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Lemonade Stand team</div>
                  <p className="text-sm text-gray-600">We can view store content and order data for moderation and support purposes only. We review content to ensure community standards are met and to keep the platform safe for children.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Parent controls */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Your Controls</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">✅</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Product approval</div>
                  <p className="text-sm text-gray-600">Every product your child creates requires your approval before it goes live on the store. You review the name, description, price, and image.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">📋</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Full visibility</div>
                  <p className="text-sm text-gray-600">Your parent dashboard shows every order, every product, and all earnings. You see everything your child does on the platform.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">🗑️</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Data deletion</div>
                  <p className="text-sm text-gray-600">You can request complete deletion of your account and all associated data at any time by contacting privacy@getlemonadestand.com. We will process deletion requests within 30 days.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Child safety */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Child Safety Measures</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">🔢</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Parent gate</div>
                  <p className="text-sm text-gray-600">The parent dashboard requires solving a math challenge that is easy for adults but difficult for young children. This prevents kids from accidentally accessing parent functions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">📷</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">No photos of children</div>
                  <p className="text-sm text-gray-600">Photos of children or children's faces are strictly prohibited in store listings, product images, and banners. This rule is part of our community standards and is enforced through content moderation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">💬</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">No direct messaging</div>
                  <p className="text-sm text-gray-600">There is no direct messaging between buyers and sellers on the platform. All customer communication happens off-platform through the parent's email or phone.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">👀</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Content moderation</div>
                  <p className="text-sm text-gray-600">All store content, product listings, and order notes are subject to review by the Lemonade Stand team. Content that violates community standards will be removed.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Questions or Concerns</h2>
            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
              <p>If you have any questions about how we handle your family's data, or if you want to request data access or deletion, contact us at:</p>
              <p className="mt-2 font-semibold text-gray-800">privacy@getlemonadestand.com</p>
            </div>
          </section>
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => router.back()} className="text-amber-600 font-medium hover:underline">← Go back</button>
        </div>
      </main>
    </div>
  );
}
