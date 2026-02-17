import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy | Gallery 1882',
  description: 'Cookie policy for Gallery 1882 website.',
}

export default function CookiePolicyPage() {
  return (
    <main className="container py-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
      <p className="text-navy/70 mb-8 text-sm">Last updated: February 2026</p>

      <div className="prose prose-navy max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3">What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help
            websites remember your preferences and improve your experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-navy/20">
                  <th className="text-left py-2 pr-4 font-bold">Cookie Name</th>
                  <th className="text-left py-2 pr-4 font-bold">Purpose</th>
                  <th className="text-left py-2 pr-4 font-bold">Duration</th>
                  <th className="text-left py-2 font-bold">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-navy/10">
                  <td className="py-2 pr-4 font-mono text-xs">cookie_consent</td>
                  <td className="py-2 pr-4">
                    Stores your cookie consent preference (accepted or declined).
                  </td>
                  <td className="py-2 pr-4">1 year</td>
                  <td className="py-2">Functional</td>
                </tr>
                <tr className="border-b border-navy/10">
                  <td className="py-2 pr-4 font-mono text-xs">newsletter_signup_status</td>
                  <td className="py-2 pr-4">
                    Remembers that you have signed up for the newsletter to avoid showing the signup
                    prompt again.
                  </td>
                  <td className="py-2 pr-4">1 year</td>
                  <td className="py-2">Functional</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            We do not use analytics cookies, advertising cookies, or any third-party tracking
            cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Local Storage</h2>
          <p>
            We also use browser local storage to remember your newsletter signup status for faster
            page loads. This data stays on your device and is not sent to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Managing Cookies</h2>
          <p>
            You can control and delete cookies through your browser settings. Note that disabling
            cookies may affect the functionality of this website. Here is how to manage cookies in
            common browsers:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Chrome</strong>: Settings &gt; Privacy and security &gt; Cookies and other
              site data
            </li>
            <li>
              <strong>Firefox</strong>: Settings &gt; Privacy &amp; Security &gt; Cookies and Site
              Data
            </li>
            <li>
              <strong>Safari</strong>: Preferences &gt; Privacy &gt; Manage Website Data
            </li>
            <li>
              <strong>Edge</strong>: Settings &gt; Cookies and site permissions &gt; Cookies and
              site data
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">More Information</h2>
          <p>
            For more details about how we handle your data, see our{' '}
            <Link href="/privacy" className="text-lake hover:text-bright-lake">
              Privacy Policy
            </Link>
            . If you have questions, contact us at{' '}
            <a href="mailto:info@gallery1882.org" className="text-lake hover:text-bright-lake">
              info@gallery1882.org
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
