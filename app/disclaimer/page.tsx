import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

const SITE_NAME = "Trendly";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app";
const CONTACT_EMAIL = "hello@trendly.com";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Disclaimer for ${SITE_NAME} — important information about our AI-generated content and editorial policies.`,
  alternates: { canonical: `${SITE_URL}/disclaimer` },
  robots: { index: true, follow: true },
};

export default function Disclaimer() {
  return (
    <LegalLayout
      title="Disclaimer"
      description={`Important information about the content published on ${SITE_NAME} and the limitations of our editorial process.`}
      lastUpdated="January 1, 2025"
    >
      <h2>1. General Disclaimer</h2>
      <p>The information provided on {SITE_NAME} is for general informational and educational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.</p>

      <h2>2. AI-Generated Content</h2>
      <p>{SITE_NAME} uses artificial intelligence (AI) technology, specifically Google Gemini, to generate article content based on trending topics. You should be aware of the following:</p>
      <ul>
        <li>Articles are generated automatically using AI and may not reflect the views of any human editor</li>
        <li>AI-generated content may contain factual errors, outdated information, or inaccuracies</li>
        <li>Content is generated based on publicly available information and AI training data</li>
        <li>We do not guarantee the accuracy, completeness, or timeliness of any AI-generated article</li>
        <li>AI-generated content should not be used as the sole basis for any decision</li>
      </ul>
      <p>We are committed to transparency about our use of AI. Articles on this site are AI-assisted publications intended to inform and spark discussion, not to serve as authoritative references.</p>

      <h2>3. Not Professional Advice</h2>
      <p>Nothing on this website constitutes professional advice of any kind, including but not limited to:</p>
      <ul>
        <li><strong>Legal advice:</strong> Content is not a substitute for advice from a qualified attorney</li>
        <li><strong>Financial advice:</strong> Content is not investment, tax, or financial advice</li>
        <li><strong>Medical advice:</strong> Content is not a substitute for professional medical advice</li>
        <li><strong>Technical advice:</strong> Implementation details may vary; always consult documentation</li>
      </ul>
      <p>Always seek the advice of qualified professionals before making decisions based on information found on this website.</p>

      <h2>4. Affiliate and Advertising Disclosure</h2>
      <p>{SITE_NAME} participates in advertising programs including Google AdSense. This means:</p>
      <ul>
        <li>We may earn revenue from advertisements displayed on our website</li>
        <li>Advertisements are served by Google and are not endorsements by {SITE_NAME}</li>
        <li>We may participate in affiliate programs where we earn a commission on purchases made through links on our site</li>
        <li>Affiliate relationships do not influence our editorial content</li>
      </ul>
      <p>In accordance with FTC guidelines, we disclose that some links on this website may be affiliate links.</p>

      <h2>5. External Links</h2>
      <p>Our website contains links to external websites. These links are provided for convenience and informational purposes only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them. The inclusion of any link does not imply endorsement of the linked site.</p>

      <h2>6. Copyright and Intellectual Property</h2>
      <p>All original content on {SITE_NAME} is protected by copyright. AI-generated content published on this site is owned by {SITE_NAME}. Unauthorized reproduction, distribution, or use of our content without prior written permission is prohibited.</p>

      <h2>7. Limitation of Liability</h2>
      <p>In no event shall {SITE_NAME}, its operators, or contributors be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of this website or its content.</p>

      <h2>8. Contact Us</h2>
      <p>If you have concerns about any content on our website or wish to report inaccuracies, please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We take accuracy seriously and will review all reports promptly.</p>
    </LegalLayout>
  );
}
