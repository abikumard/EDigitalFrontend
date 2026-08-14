import LegalPageLayout from '../components/LegalPageLayout.jsx'
import { BUSINESS_NAME, BUSINESS_LEGAL_NAME, BUSINESS_EMAIL } from '../businessInfo.js'

export default function TermsAndConditions() {
  return (
    <LegalPageLayout title="Terms & Conditions">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By creating an account or purchasing any product on {BUSINESS_NAME} ("we", "us", "our"),
        you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of
        these terms, please do not use this website.
      </p>

      <h2>2. About Our Products</h2>
      <p>
        {BUSINESS_NAME} sells digital products — including e-books, video courses, software and
        templates — for instant download or online access. All products are digital; no physical
        goods are shipped.
      </p>

      <h2>3. Account Registration</h2>
      <p>
        To purchase a product you must create an account using your email address or mobile number
        and a password. You're responsible for keeping your login credentials confidential and for
        all activity that happens under your account. Please let us know right away if you suspect
        unauthorised access to your account.
      </p>

      <h2>4. Pricing &amp; Payment</h2>
      <p>
        All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless
        stated otherwise. Payments are processed securely through Razorpay. We reserve the right to
        change product prices at any time; the price you pay is the price shown at checkout at the
        time of purchase.
      </p>

      <h2>5. License to Use Purchased Content</h2>
      <p>
        When you purchase a product, we grant you a limited, non-exclusive, non-transferable licence
        to access and use that product for your personal or internal business use only. You may not
        resell, redistribute, publicly share, sub-license, or upload our content to any other
        platform without our prior written permission.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All content on this website — including product files, text, graphics, logos and the
        {' '}{BUSINESS_NAME} name and branding — is owned by {BUSINESS_LEGAL_NAME} or its licensors
        and is protected by applicable intellectual property laws.
      </p>

      <h2>7. Prohibited Use</h2>
      <p>
        You agree not to misuse this website — including attempting unauthorised access to any
        account or system, uploading malicious code, or using automated means to scrape or copy our
        content or product catalogue.
      </p>

      <h2>8. Refunds &amp; Cancellations</h2>
      <p>
        Because our products are delivered digitally and instantly, all sales are generally final.
        See our full <a href="/refund-policy">Refund &amp; Cancellation Policy</a> for details and
        the limited exceptions we do make.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        {BUSINESS_NAME} is provided on an "as is" basis. To the maximum extent permitted by law, we
        are not liable for any indirect, incidental or consequential damages arising from your use
        of this website or its products.
      </p>

      <h2>10. Changes to These Terms</h2>
      <p>
        We may update these Terms &amp; Conditions from time to time. Continued use of this website
        after changes are posted means you accept the updated terms.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These terms are governed by the laws of India, and any disputes will be subject to the
        exclusive jurisdiction of the courts local to our registered business address.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        Questions about these terms? Reach us at{' '}
        <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a> or visit our{' '}
        <a href="/contact-us">Contact Us</a> page.
      </p>
    </LegalPageLayout>
  )
}
