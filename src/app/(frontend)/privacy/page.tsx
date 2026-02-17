import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Gallery 1882',
  description: 'Privacy policy for Gallery 1882 website.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="container py-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-navy/70 mb-8 text-sm">Last updated: February 2026</p>

      <div className="prose prose-navy max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3">1. Who We Are</h2>
          <p>
            Gallery 1882 is a contemporary art gallery located in the Indiana Dunes region. This
            website is operated by Gallery 1882. If you have questions about this policy, contact us
            at{' '}
            <a href="mailto:info@gallery1882.org" className="text-lake hover:text-bright-lake">
              info@gallery1882.org
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Data We Collect</h2>
          <p>We collect minimal personal data:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Email address</strong> — only when you voluntarily subscribe to our newsletter.
            </li>
          </ul>
          <p className="mt-2">
            We do not collect names, payment information, browsing history, or any other personal
            data through this website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. How We Use Your Data</h2>
          <p>
            Email addresses are used solely to send newsletter updates about exhibitions, events,
            and gallery news. We will never sell or share your email address with third parties for
            marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Cookies</h2>
          <p>
            This site uses a small number of functional cookies. For full details, see our{' '}
            <Link href="/cookies" className="text-lake hover:text-bright-lake">
              Cookie Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Third-Party Services</h2>
          <p>This website uses the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Vercel</strong> — website hosting and serverless functions.
            </li>
            <li>
              <strong>Cloudflare Stream</strong> — video content delivery.
            </li>
            <li>
              <strong>Open-Meteo</strong> — weather data (no personal data is sent).
            </li>
            <li>
              <strong>Resend</strong> — transactional email delivery for newsletter subscriptions.
            </li>
          </ul>
          <p className="mt-2">
            These services may process data in accordance with their own privacy policies. We do not
            use analytics, advertising, or social media tracking services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Data Retention</h2>
          <p>
            Newsletter email addresses are retained until you unsubscribe or request deletion. Cookie
            consent preferences are stored for one year.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Request access to your personal data.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Withdraw consent at any time (e.g., unsubscribe from the newsletter).</li>
            <li>Lodge a complaint with a data protection authority.</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, email us at{' '}
            <a href="mailto:info@gallery1882.org" className="text-lake hover:text-bright-lake">
              info@gallery1882.org
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page with an
            updated date.
          </p>
        </section>
      </div>
    </main>
  )
}
