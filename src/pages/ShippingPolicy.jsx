import LegalPageLayout from '../components/LegalPageLayout.jsx'
import { BUSINESS_NAME, BUSINESS_EMAIL } from '../businessInfo.js'

export default function ShippingPolicy() {
  return (
    <LegalPageLayout title="Shipping & Delivery Policy">
      <h2>1. Digital Delivery Only</h2>
      <p>
        {BUSINESS_NAME} sells only digital products — e-books, video courses, software and
        templates. Nothing is physically shipped, so there are no shipping charges, couriers, or
        delivery addresses involved.
      </p>

      <h2>2. How Delivery Works</h2>
      <p>
        As soon as your payment is confirmed by Razorpay, the product is unlocked instantly on your
        account. You can access it any time by logging in and going to{' '}
        <strong>My Library</strong>.
      </p>

      <h2>3. Delivery Timeframe</h2>
      <p>
        Delivery is instant in almost all cases. If a product doesn't appear in your Library within
        30 minutes of a successful payment, please contact us — this is rare and usually resolved
        quickly.
      </p>

      <h2>4. Accessing Your Purchase</h2>
      <p>
        Log in to your account, open <strong>My Library</strong>, and select the product to view,
        stream or download it, depending on the product type.
      </p>

      <h2>5. Need Help?</h2>
      <p>
        If you're having trouble accessing a purchase, email us at{' '}
        <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a> with your order details, or visit
        our <a href="/contact-us">Contact Us</a> page.
      </p>
    </LegalPageLayout>
  )
}
