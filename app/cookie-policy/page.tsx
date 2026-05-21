import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { getSiteUrl } from "@/lib/seoHelper";

const SITE_NAME = "Trendly";
const SITE_URL = getSiteUrl();
const CONTACT_EMAIL = "hello@trendly.com";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Cookie Policy for ${SITE_NAME} — how we use cookies and similar tracking technologies.`,
  alternates: { canonical: `${SITE_URL}/cookie-policy` },
  robots: { index: true, follow: true },
};

export default function CookiePolicy() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description={`This Cookie Policy explains how ${SITE_NAME} uses cookies and similar technologies when you visit our website.`}
      lastUpdated="January 1, 2025"
    >
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies help us remember your preferences and understand how you use our website.</p>

      <h2>2. Types of Cookies We Use</h2>

      <h3>Essential Cookies</h3>
      <p>These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as setting your privacy preferences or logging in.</p>
      <ul>
        <li><strong>Theme preference:</strong> Remembers your dark/light mode setting</li>
        <li><strong>Session cookies:</strong> Maintain your session while browsing</li>
      </ul>

      <h3>Analytics Cookies</h3>
      <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</p>
      <ul>
        <li><strong>Google Analytics (_ga, _gid, _gat):</strong> Used to distinguish users and throttle request rate. Data is anonymized and aggregated. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
        <li><strong>Vercel Analytics:</strong> Performance and usage analytics. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></li>
      </ul>

      <h3>Advertising Cookies</h3>
      <p>These cookies are set by Google AdSense to build a profile of your interests and show you relevant advertisements on other sites.</p>
      <ul>
        <li><strong>Google AdSense (IDE, DSID, FLC, AID, TAID):</strong> Used to serve personalized advertisements. <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google Ads Policy</a></li>
        <li><strong>DoubleClick:</strong> Used to record user activity and measure ad effectiveness</li>
      </ul>

      <h3>Functional Cookies</h3>
      <p>These cookies enable enhanced functionality and personalization.</p>
      <ul>
        <li><strong>Visitor ID:</strong> Anonymous identifier to track likes on articles (stored in localStorage)</li>
        <li><strong>Saved articles:</strong> Remembers articles you have bookmarked</li>
      </ul>

      <h2>3. Third-Party Cookies</h2>
      <p>Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. The third parties that may set cookies include:</p>
      <ul>
        <li>Google (Analytics, AdSense, Fonts)</li>
        <li>Vercel (Hosting, Analytics)</li>
        <li>Supabase (Database services)</li>
      </ul>

      <h2>4. How to Control Cookies</h2>
      <p>You can control and manage cookies in several ways:</p>
      <ul>
        <li><strong>Browser settings:</strong> Most browsers allow you to refuse or delete cookies. Visit your browser's help section for instructions</li>
        <li><strong>Google opt-out:</strong> Visit <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
        <li><strong>Ad personalization:</strong> Visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
        <li><strong>Industry opt-out:</strong> Visit <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">aboutads.info</a> or <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">youronlinechoices.eu</a></li>
      </ul>
      <p>Please note that disabling certain cookies may affect the functionality of our website.</p>

      <h2>5. Cookie Retention</h2>
      <p>Different cookies have different retention periods:</p>
      <ul>
        <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
        <li><strong>Google Analytics:</strong> Up to 2 years</li>
        <li><strong>Google AdSense:</strong> Up to 13 months</li>
        <li><strong>Preference cookies:</strong> Up to 1 year</li>
      </ul>

      <h2>6. Updates to This Policy</h2>
      <p>We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. We encourage you to review this page periodically.</p>

      <h2>7. Contact Us</h2>
      <p>If you have questions about our use of cookies, please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </LegalLayout>
  );
}
