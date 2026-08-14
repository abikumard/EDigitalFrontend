import LegalPageLayout from '../components/LegalPageLayout.jsx'
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_ADDRESS,
  SUPPORT_HOURS,
} from '../businessInfo.js'

export default function ContactUs() {
  return (
    <LegalPageLayout title="Contact Us">
      <p>
        We're happy to help with any questions about your orders, purchases, or account.
      </p>

      <h2>Business Name</h2>
      <p>{BUSINESS_LEGAL_NAME}</p>

      <h2>Email</h2>
      <p><a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a></p>

      <h2>Phone</h2>
      <p><a href={`tel:${BUSINESS_PHONE}`}>{BUSINESS_PHONE}</a></p>

      <h2>Registered Address</h2>
      <p>{BUSINESS_ADDRESS}</p>

      <h2>Support Hours</h2>
      <p>{SUPPORT_HOURS}</p>
    </LegalPageLayout>
  )
}
