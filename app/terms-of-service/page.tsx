import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

const SITE_NAME = "Trendly";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app";
const CONTACT_EMAIL = "hello@trendly.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_NAME} — the rules and guidelines for using our website.`,
  alternates: { canonical: `${SITE_URL}/terms-of-service` },
  robots: { index: true, follow: true },
};

export default function TermsOfService() {
  return (
    <LegalLayout
      title="Terms of Service"
      description={`By accessing and using ${SITE_NAME}, you agree to be bound by these Terms of Service. Please read them carefully.`}
      lastUpdated="January 1, 2025"
    >
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using {SITE_NAME} ("the Website"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this website.</p>

      <h2>2. Use of Content</h2>
      <p>All content published on {SITE_NAME}, including articles, images, graphics, and other materials, is the intellectual property of {SITE_NAME} or its content suppliers and is protected by applicable copyright laws.</p>
      <ul>
        <li>You may read and share articles for personal, non-commercial use</li>
        <li>You may share links to our articles on social media and other platforms</li>
        <li>You may not reproduce, republish, or redistribute our content without prior written permission</li>
        <li>You may not scrape, crawl, or use automated tools to extract our content in bulk</li>
      </ul>

      <h2>3. AI-Generated Content Disclosure</h2>
      <p>{SITE_NAME} uses artificial intelligence (AI) technology, including Google Gemini, to assist in generating article content. While we strive for accuracy, AI-generated content may contain errors, inaccuracies, or outdated information. All content is published for informational purposes only and should not be relied upon as professional advice.</p>
      <p>We make no warranties about the completeness, reliability, or accuracy of AI-generated content. Always verify important information from authoritative sources.</p>

      <h2>4. User Comments</h2>
      <p>By posting a comment on our website, you agree that:</p>
      <ul>
        <li>Your comment does not violate any applicable laws or regulations</li>
        <li>Your comment is not defamatory, abusive, threatening, or harassing</li>
        <li>Your comment does not contain spam, advertisements, or promotional material</li>
        <li>You grant us a non-exclusive license to display your comment on our website</li>
      </ul>
      <p>We reserve the right to remove any comment at our sole discretion without notice.</p>

      <h2>5. Newsletter</h2>
      <p>By subscribing to our newsletter, you consent to receive periodic emails from us. You may unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us directly. We will not sell or share your email address with third parties for marketing purposes.</p>

      <h2>6. Third-Party Links</h2>
      <p>Our website may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.</p>

      <h2>7. Advertising</h2>
      <p>We display advertisements through Google AdSense and may participate in other advertising programs. We are not responsible for the content of advertisements displayed on our website. The presence of an advertisement does not constitute an endorsement of the advertised product or service.</p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>The website and its content are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.</p>

      <h2>9. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, {SITE_NAME} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website or its content, even if we have been advised of the possibility of such damages.</p>

      <h2>10. Governing Law</h2>
      <p>These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts.</p>

      <h2>11. Changes to Terms</h2>
      <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after any changes constitutes your acceptance of the new terms.</p>

      <h2>12. Contact Us</h2>
      <p>If you have any questions about these Terms of Service, please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </LegalLayout>
  );
}
