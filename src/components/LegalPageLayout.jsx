import { Link } from 'react-router-dom'

export default function LegalPageLayout({ title, updatedDate, children }) {
  return (
    <div className="page-container legal-page">
      <Link to="/" className="legal-back-link">← Back to home</Link>
      <h1 className="page-title">{title}</h1>
      {updatedDate && <p className="legal-updated">Last updated: {updatedDate}</p>}
      <div className="legal-content">
        {children}
      </div>
    </div>
  )
}
