import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Unified Analytics',
  description: 'Terms and Conditions for Unified Analytics',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          href="/" 
          className="text-primary hover:underline mb-8 inline-block"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            <strong>Effective Date:</strong> September 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement</h2>
            <p className="text-foreground">
              By using https://multipleai.com.au/ (the "Website") and our services, you agree to these Terms & Conditions. If you do not agree, please discontinue use of the Website and our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
            <p className="text-foreground">
              Multiple AI provides AI-driven automation, data solutions, and related services. Specific service deliverables or performance obligations may be detailed in separate agreements or statements of work.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Use of Website</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>You must use the Website lawfully and must not disrupt or harm others.</li>
              <li>You must not attempt to hack, copy, or misuse Website content, trademarks, or intellectual property.</li>
              <li>Content provided is for general information and marketing purposes; we do not guarantee uninterrupted availability or that the content is error-free.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>If you create an account, you are responsible for safeguarding your login details.</li>
              <li>You agree to provide accurate, current, and complete information.</li>
              <li>We may suspend or terminate accounts that breach these Terms.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Prices are displayed in Australian dollars unless otherwise stated.</li>
              <li>Payments must be made securely through our approved methods.</li>
              <li>Refunds (if applicable) follow our stated refund policy or applicable consumer law.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-foreground">
              All Website content, including text, graphics, software, and branding, is owned by Multiple AI or its licensors. You may not reproduce, distribute, or modify any content without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>We provide the Website and our services on an "as is" basis.</li>
              <li>To the extent permitted by law, we are not liable for indirect or consequential damages, including loss of profits or business interruption.</li>
              <li>Our total liability is capped at the amount paid by you for our services in the 12 months preceding the claim.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
            <p className="text-foreground">
              The Website may contain links to third-party sites. We are not responsible for the content, security, or privacy practices of those sites. Accessing third-party sites is at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-foreground">
              We may suspend or terminate your access to the Website or our services if you breach these Terms or engage in conduct that we deem harmful to our business or users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p className="text-foreground">
              These Terms are governed by the laws of Western Australia, Australia. You agree to submit to the exclusive jurisdiction of the courts located in Western Australia for the resolution of any disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Updates to These Terms</h2>
            <p className="text-foreground">
              We may update these Terms from time to time. When we do, we will post the revised Terms on this page with an updated "Effective Date." Continued use of the Website after changes take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-foreground mb-2">
              For questions about these Terms, contact us at:
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

