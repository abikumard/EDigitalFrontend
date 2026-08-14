import LegalPageLayout from '../components/LegalPageLayout.jsx'
import { BUSINESS_NAME, BUSINESS_EMAIL } from '../businessInfo.js'

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how {BUSINESS_NAME} collects, uses and protects your
        information when you use this website.
      </p>

      <h2>2. Information We Collect</h2>
      <ul>
        <li>Account details: your email address or mobile number, and a securely hashed password.</li>
        <li>Purchase history: the products you've bought and your order/payment status.</li>
        <li>Usage data: pages visited and basic device/browser information, used to keep the site working reliably.</li>
      </ul>
      <p>
        We never see or store your card, UPI or bank details — payments are handled entirely by our
        payment partner, Razorpay.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>
        We use your information to create and manage your account, process and deliver your
        purchases, provide customer support, and send you important account or order updates.
      </p>

      <h2>4. Payment Processing</h2>
      <p>
        All payments are processed by Razorpay, a PCI-DSS compliant payment gateway. Your payment
        details are entered directly on Razorpay's secure checkout and are never stored on our
        servers.
      </p>

      <h2>5. Sharing of Information</h2>
      <p>
        We do not sell your personal information. We share the minimum necessary data with trusted
        service providers — such as Razorpay for payments — solely to operate this website and
        fulfil your orders.
      </p>

      <h2>6. Data Security</h2>
      <p>
        Passwords are stored using industry-standard one-way hashing, and account access is
        protected using secure, signed session tokens. We take reasonable technical measures to
        protect your data, though no online service can guarantee absolute security.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        You can request access to, correction of, or deletion of your personal data at any time by
        contacting us. You can also request account deletion, though we may retain order records as
        required for accounting and legal purposes.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        This website is not directed at, and we do not knowingly collect information from, anyone
        under the age of 18.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy occasionally. Material changes will be reflected by
        updating the "last updated" date on this page.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        For any privacy-related questions or requests, email us at{' '}
        <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a> or visit our{' '}
        <a href="/contact-us">Contact Us</a> page.
      </p>
    </LegalPageLayout>
  )
}
