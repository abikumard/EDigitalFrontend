import LegalPageLayout from '../components/LegalPageLayout.jsx'
import { BUSINESS_NAME, BUSINESS_EMAIL } from '../businessInfo.js'

export default function RefundPolicy() {
  return (
    <LegalPageLayout title="Refund & Cancellation Policy">
      <h2>1. All Digital Sales Are Final</h2>
      <p>
        Due to the nature of digital products, all sales on {BUSINESS_NAME} are final and
        non-refundable once a purchase is completed. Because content is delivered instantly and can
        be accessed, downloaded or viewed immediately, we're unable to accept "returns" the way a
        physical product could be returned.
      </p>

      <h2>2. Order Cancellation</h2>
      <p>
        You can cancel an order any time before completing payment on the checkout page. Once
        payment is successful and the product is unlocked in your account, the order cannot be
        cancelled.
      </p>

      <h2>3. Exceptions — When We Do Refund</h2>
      <p>We will review a refund request if:</p>
      <ul>
        <li>You were charged but the purchase did not unlock in your account due to a technical error on our end.</li>
        <li>You were charged more than once for the same order (duplicate payment).</li>
        <li>The product file is genuinely corrupted, inaccessible, or materially different from its listing, and we're unable to fix it.</li>
      </ul>

      <h2>4. How to Request a Refund</h2>
      <p>
        Contact us at <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a> within 7 days of your
        purchase with your order details and the issue you're facing. We aim to respond within 2
        business days.
      </p>

      <h2>5. Refund Processing Time</h2>
      <p>
        Approved refunds are issued to your original payment method via Razorpay and typically
        reflect within 5–7 business days, depending on your bank or payment provider.
      </p>

      <h2>6. Questions</h2>
      <p>
        If you're unsure whether your situation qualifies, reach out — we're happy to take a look.
        See our <a href="/contact-us">Contact Us</a> page for all the ways to reach us.
      </p>
    </LegalPageLayout>
  )
}
