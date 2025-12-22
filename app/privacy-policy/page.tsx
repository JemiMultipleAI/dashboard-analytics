import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - Unified Analytics',
  description: 'Privacy Policy for Unified Analytics',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          href="/" 
          className="text-primary hover:underline mb-8 inline-block"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            <strong>Effective Date:</strong> September 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-foreground">
              Multiple AI ("we", "our", "us") values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and disclose information when you use our website (https://multipleai.com.au/) and our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-foreground mb-2">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Personal details:</strong> name, email, phone number, company name</li>
              <li><strong>Account details:</strong> login credentials if you register with us</li>
              <li><strong>Payment details:</strong> billing address and transaction data (processed securely via third-party providers)</li>
              <li><strong>Usage data:</strong> IP address, device information, browser type, pages visited</li>
              <li><strong>Communications:</strong> feedback, inquiries, and support messages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Collect Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Directly from you via forms, sign-ups, or communication</li>
              <li>Automatically through cookies and analytics tools</li>
              <li>From trusted third-party services (e.g., payment gateways, analytics)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Use of Information</h2>
            <p className="text-foreground mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Provide and manage our services</li>
              <li>Improve website performance and user experience</li>
              <li>Process transactions and deliver purchased services</li>
              <li>Send service updates, promotions, and marketing (if you opt in)</li>
              <li>Ensure website security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Sharing of Information</h2>
            <p className="text-foreground mb-2">We may share information with:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Service providers (hosting, payments, analytics, marketing)</li>
              <li>Legal authorities where required</li>
              <li>Business partners or affiliates when delivering services</li>
              <li>Successors in the event of a merger, sale, or acquisition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies & Tracking</h2>
            <p className="text-foreground">
              We use cookies and similar technologies for functionality, analytics, and marketing. You can control cookies through your browser settings, though disabling cookies may affect certain features of the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
            <p className="text-foreground">
              We apply reasonable technical and organisational measures—including encryption, access control, and monitoring—to protect your data against unauthorised access, disclosure, alteration, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-foreground">
              We retain personal data only as long as necessary to fulfil the purposes outlined in this policy, or to comply with business, legal, or contractual requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Your Rights</h2>
            <p className="text-foreground">
              Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal information, as well as the right to object to marketing communications. To exercise these rights, contact us using the details below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. International Users</h2>
            <p className="text-foreground">
              If you access our website from outside Australia, you acknowledge and agree to the transfer of your information to Australia or other jurisdictions where our service providers operate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Updates to This Privacy Policy</h2>
            <p className="text-foreground">
              We may update this Privacy Policy from time to time. When we do, we will post the revised policy on this page with an updated "Effective Date." Continued use of our website or services after changes become effective constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-foreground mb-2">
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-none space-y-1 text-foreground">
              <li><strong>Email:</strong> <a href="mailto:[email protected]" className="text-primary hover:underline">[email protected]</a></li>
              <li><strong>Address:</strong> Perth, WA</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

