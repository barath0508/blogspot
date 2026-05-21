import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/seoHelper";

const SITE_NAME = "Trendly";
const SITE_URL = getSiteUrl();
const CONTACT_EMAIL = "hello@trendly.com";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME} — how we collect, use, and protect your personal information.`,
  url: `${SITE_URL}/privacy-policy`,
  keywords: ["privacy policy", "data protection", "Trendly", "cookies"],
});

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description={`This Privacy Policy explains how ${SITE_NAME} collects, uses, and protects your information when you visit our website.`}
      lastUpdated="January 1, 2025"
    >
      <h2>1. Information We Collect</h2>
      <h3>Information You Provide</h3>
      <p>We collect information you voluntarily provide, including:</p>
      <ul>
        <li>Email address when you subscribe to our newsletter</li>
        <li>Name and comments when you post a comment on an article</li>
        <li>Contact information when you reach out to us</li>
      </ul>

      <h3>Automatically Collected Information</h3>
      <p>When you visit our website, we automatically collect certain information, including:</p>
      <ul>
        <li>IP address and approximate geographic location</li>
        <li>Browser type, version, and operating system</li>
        <li>Pages visited, time spent, and referring URLs</li>
        <li>Device identifiers and cookie data</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Deliver and improve our content and services</li>
        <li>Send newsletters and updates you have subscribed to</li>
        <li>Respond to your comments and inquiries</li>
        <li>Analyze website traffic and user behavior to improve user experience</li>
        <li>Display relevant advertisements through Google AdSense</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. Cookies and Tracking Technologies</h2>
      <p>We use cookies and similar tracking technologies to enhance your experience. These include:</p>
      <ul>
        <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
        <li><strong>Analytics cookies:</strong> Google Analytics to understand how visitors use our site</li>
        <li><strong>Advertising cookies:</strong> Google AdSense to serve relevant advertisements</li>
        <li><strong>Preference cookies:</strong> To remember your settings such as dark/light mode</li>
      </ul>
      <p>You can control cookies through your browser settings. Please see our <a href="/cookie-policy">Cookie Policy</a> for more details.</p>

      <h2>4. Google AdSense and Advertising</h2>
      <p>We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website and other sites on the internet. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the internet.</p>
      <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</p>

      <h2>5. Third-Party Services</h2>
      <p>We use the following third-party services that may collect data:</p>
      <ul>
        <li><strong>Google Analytics:</strong> Website analytics — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
        <li><strong>Google AdSense:</strong> Advertising — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
        <li><strong>Vercel:</strong> Hosting and analytics — <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
        <li><strong>Supabase:</strong> Database — <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>We retain your personal data only as long as necessary for the purposes outlined in this policy. Newsletter subscribers' data is retained until you unsubscribe. Comment data is retained until you request deletion.</p>

      <h2>7. Your Rights (GDPR / CCPA)</h2>
      <p>Depending on your location, you may have the following rights:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
        <li><strong>Correction:</strong> Request correction of inaccurate data</li>
        <li><strong>Deletion:</strong> Request deletion of your personal data</li>
        <li><strong>Opt-out:</strong> Opt out of newsletter communications at any time</li>
        <li><strong>Data portability:</strong> Request your data in a portable format</li>
      </ul>
      <p>To exercise any of these rights, contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>

      <h2>8. Children's Privacy</h2>
      <p>Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.</p>

      <h2>9. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Your continued use of the website after changes constitutes acceptance of the updated policy.</p>

      <h2>10. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us:</p>
      <ul>
        <li>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
        <li>Website: <a href={SITE_URL}>{SITE_URL}</a></li>
      </ul>
    </LegalLayout>
  );
}
