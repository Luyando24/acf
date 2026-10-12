import Link from 'next/link'
import { Shield, Lock, Eye, FileText } from 'lucide-react'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Privacy Policy & Data Protection | ACF Zambia',
  description:
    "Agricultural Consultative Forum's privacy policy and compliance statement under Zambia's Data Protection Act, 2021.",
  pathname: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0f1d14] via-[#142d1f] to-[#175432] text-white py-16 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            Compliance & Transparency
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy & Consent Notice
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
            Our commitment to safeguarding personal data in adherence to Zambia&apos;s Data Protection Act, 2021.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-4xl pt-16">
        <div className="bg-white rounded-3xl border border-[#e2ebe4] p-8 sm:p-12 shadow-xs space-y-8 prose-acf">
          <h2>1. Introduction & Statutory Context</h2>
          <p>
            The Agricultural Consultative Forum (&ldquo;ACF&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), registered as an NGO in Lusaka, Zambia, operates this institutional website (acfzambia.org). We are committed to processing personal information lawfully, transparently, and securely in full compliance with the <strong>Data Protection Act, No. 3 of 2021 of the Laws of Zambia</strong>.
          </p>

          <h2>2. Personal Information We Collect</h2>
          <p>We strictly limit the collection of personal data to what is directly necessary for our legitimate institutional activities:</p>
          <ul>
            <li><strong>Contact Enquiries:</strong> Name, official email address, phone number, and message content submitted through our contact form.</li>
            <li><strong>Membership Applications:</strong> Organisation name, contact person name, email, phone number, provincial location, and area of agricultural interest.</li>
            <li><strong>Newsletter Subscriptions:</strong> Email address provided voluntarily with affirmative consent.</li>
          </ul>

          <h2>3. Lawful Basis and Purpose of Processing</h2>
          <p>
            Under the Data Protection Act, 2021, we process your personal data primarily on the basis of <em>Consent</em> and for our legitimate mandate to convene agricultural dialogues:
          </p>
          <ul>
            <li>To respond directly to public enquiries, submissions, and research requests.</li>
            <li>To evaluate and communicate regarding membership caucus participation.</li>
            <li>To distribute periodic agricultural policy briefs, newsletters, and symposium invitations.</li>
          </ul>

          <h2>4. Storage, Security & Retention</h2>
          <p>
            All submitted data is stored on secure databases with encrypted transmission (HTTPS/TLS) and strict access controls (Row Level Security). We never sell, rent, or lease personal information to commercial third parties. Data is retained only for as long as necessary to fulfill the purpose for which it was collected.
          </p>

          <h2>5. Your Rights as a Data Subject</h2>
          <p>Under the Data Protection Act, 2021, you have the right to:</p>
          <ul>
            <li>Request access to the personal data we hold about you.</li>
            <li>Request rectification of inaccurate or outdated information.</li>
            <li>Withdraw your consent at any time (e.g. unsubscribing from newsletters).</li>
            <li>Request erasure of your records where there is no statutory obligation for retention.</li>
          </ul>

          <h2>6. Contacting the Data Controller</h2>
          <p>
            For any questions, requests, or concerns regarding your personal data, please contact the ACF Secretariat:
          </p>
          <div className="not-prose p-6 rounded-2xl bg-[#f6f9f6] border border-[#e2ebe4] text-xs space-y-2 text-[#3b4d41]">
            <p><strong>Agricultural Consultative Forum (ACF)</strong></p>
            <p>24 Elm Rd, Woodlands, Lusaka, Zambia</p>
            <p>Email: <a href="mailto:info@acfzambia.org" className="text-[#175432] font-bold underline">info@acfzambia.org</a></p>
            <p>Phone: +260 95 4755071</p>
          </div>
        </div>
      </div>
    </div>
  )
}
