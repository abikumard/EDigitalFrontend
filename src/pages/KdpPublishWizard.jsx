import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { publishBook } from '../api/seller.js'
import { errorMessage } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function KdpPublishWizard() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [step, setStep] = useState(1) // 1: Details, 2: Content & Cover, 3: Pricing
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Book Details
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [authorName, setAuthorName] = useState(user?.name || 'Abikumar Dharmaraj')
  const [category, setCategory] = useState('AI & Technology')
  const [keywords, setKeywords] = useState('AI, Side Hustle, Automation, ChatGPT, Passive Income')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('English')
  const [printLength, setPrintLength] = useState(36)

  // Step 2: Content & Cover
  const [sampleText, setSampleText] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [manuscriptFile, setManuscriptFile] = useState(null)

  // Step 3: Pricing
  const [price, setPrice] = useState('399')
  const [paperbackPrice, setPaperbackPrice] = useState('699')

  // Live Royalty Math
  const numPrice = Number(price) || 0
  const platformFee = (numPrice * 0.03).toFixed(2)
  const publisherRoyalty = (numPrice * 0.97).toFixed(2)

  function handleCoverChange(e) {
    const file = e.target.files[0]
    if (file) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  async function handlePublish(e) {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim()) {
      return setError('Book Title and Description are required.')
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('subtitle', subtitle.trim())
      formData.append('authorName', authorName.trim())
      formData.append('description', description.trim())
      formData.append('category', category)
      formData.append('keywords', keywords.trim())
      formData.append('language', language)
      formData.append('printLength', printLength)
      formData.append('sampleText', sampleText.trim())
      formData.append('price', price)
      if (paperbackPrice) formData.append('paperbackPrice', paperbackPrice)

      if (coverFile) formData.append('coverImage', coverFile)
      if (manuscriptFile) formData.append('manuscript', manuscriptFile)

      await publishBook(formData)
      navigate('/kdp')
    } catch (err) {
      setError(errorMessage(err, 'Failed to publish eBook. Please try again.'))
      setSubmitting(false)
    }
  }

  return (
    <div className="wizard-page-container">
      <div className="wizard-header">
        <h1>🚀 Amazon KDP 3-Step Publishing Wizard</h1>
        <p>Publish your manuscript, generate 3D covers, and start earning 97% royalties instantly.</p>
      </div>

      {/* Stepper Navigation */}
      <div className="wizard-stepper">
        <div className={`step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} onClick={() => setStep(1)}>
          <span className="step-number">1</span>
          <span className="step-label">Book Details &amp; Keywords</span>
        </div>
        <div className="step-line" />
        <div className={`step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} onClick={() => setStep(2)}>
          <span className="step-number">2</span>
          <span className="step-label">Manuscript &amp; Cover</span>
        </div>
        <div className="step-line" />
        <div className={`step-item ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
          <span className="step-number">3</span>
          <span className="step-label">Pricing &amp; 97% Royalty</span>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* STEP 1: Details */}
      {step === 1 && (
        <div className="wizard-card">
          <h2>Step 1: Book Details &amp; Search Keywords</h2>
          <p className="wizard-sub">Enter the metadata readers will see in the Kindle Store.</p>

          <div className="wizard-form-group">
            <label>Book Title *</label>
            <input
              type="text"
              placeholder="e.g. THE 2-HOUR AI SIDE HUSTLE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="wizard-form-group">
            <label>Subtitle</label>
            <input
              type="text"
              placeholder="e.g. A Step-by-Step Blueprint to Build 5 Automated Income Streams"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <div className="wizard-form-group">
              <label>Primary Author / Pen Name *</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>

            <div className="wizard-form-group">
              <label>Primary Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="AI & Technology">AI &amp; Technology</option>
                <option value="Health & Mindset">Health &amp; Mindset</option>
                <option value="Self-Help & Wellness">Self-Help &amp; Wellness</option>
                <option value="Psychology & Healing">Psychology &amp; Healing</option>
                <option value="Business & Finance">Business &amp; Finance</option>
              </select>
            </div>
          </div>

          <div className="wizard-form-group">
            <label>7 Search Keywords (Comma-separated) *</label>
            <input
              type="text"
              placeholder="AI, Side Hustle, ChatGPT, Passive Income, Productivity, Mindset"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <span className="input-hint">Used by the search algorithm to recommend your book to readers.</span>
          </div>

          <div className="wizard-form-group">
            <label>Book Description / Editorial Review *</label>
            <textarea
              rows={6}
              placeholder="Provide a compelling hook, bullet points of key lessons, and call-to-action."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="wizard-form-group">
              <label>Language</label>
              <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} />
            </div>
            <div className="wizard-form-group">
              <label>Estimated Print Length (Pages)</label>
              <input type="number" min="1" value={printLength} onChange={(e) => setPrintLength(Number(e.target.value))} />
            </div>
          </div>

          <div className="wizard-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
              Continue to Step 2: Uploads →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Manuscript & Cover */}
      {step === 2 && (
        <div className="wizard-card">
          <h2>Step 2: Manuscript &amp; 300 DPI Cover Upload</h2>
          <p className="wizard-sub">Upload your book cover image and manuscript file.</p>

          <div className="cover-upload-section">
            <div className="cover-preview-box">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover Preview" className="preview-img" />
              ) : (
                <div className="cover-placeholder">
                  <span>📖</span>
                  <p>300 DPI Cover Preview</p>
                </div>
              )}
            </div>

            <div className="cover-file-inputs">
              <label>Book Cover Image (JPG/PNG - 300 DPI recommended)</label>
              <input type="file" accept="image/*" onChange={handleCoverChange} />

              <label style={{ marginTop: 16 }}>Manuscript File (PDF / EPUB / DOCX)</label>
              <input type="file" accept=".pdf,.epub,.docx" onChange={(e) => setManuscriptFile(e.target.files[0])} />
            </div>
          </div>

          <div className="wizard-form-group" style={{ marginTop: 24 }}>
            <label>Sample Preview Text (Look Inside Excerpt)</label>
            <textarea
              rows={6}
              placeholder="Paste Chapter 1 or Introduction sample text for readers to preview in the In-Browser Kindle Reader."
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
            />
          </div>

          <div className="wizard-actions space-between">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
              ← Back to Details
            </button>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep(3)}>
              Continue to Step 3: Pricing →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Pricing & Royalty Calculator */}
      {step === 3 && (
        <div className="wizard-card">
          <h2>Step 3: Pricing &amp; Royalty Calculator</h2>
          <p className="wizard-sub">Set your retail price. KDP Cloud delivers a flat 97% royalty directly to you.</p>

          <div className="form-row-2">
            <div className="wizard-form-group">
              <label>Kindle eBook List Price (₹) *</label>
              <input
                type="number"
                min="49"
                max="9999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="wizard-form-group">
              <label>Paperback List Price (₹) (Optional)</label>
              <input
                type="number"
                min="99"
                max="9999"
                value={paperbackPrice}
                onChange={(e) => setPaperbackPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Interactive Live Royalty Breakdown Box */}
          <div className="royalty-calculator-card">
            <h3>⚡ Live Royalty Breakdown (97% Model)</h3>
            <div className="calc-row">
              <span>Customer Retail Price:</span>
              <strong>₹{numPrice.toFixed(2)}</strong>
            </div>
            <div className="calc-row fee-row">
              <span>Platform Service Fee (3%):</span>
              <strong className="fee-text">- ₹{platformFee}</strong>
            </div>
            <div className="calc-divider" />
            <div className="calc-row final-royalty-row">
              <div>
                <strong>Your Net Author Royalty Per Sale (97%):</strong>
                <p className="royalty-sub">Credited immediately to your publisher digital wallet on purchase</p>
              </div>
              <strong className="royalty-number">₹{publisherRoyalty}</strong>
            </div>
          </div>

          <div className="wizard-actions space-between" style={{ marginTop: 32 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
              ← Back to Uploads
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg publish-now-btn"
              onClick={handlePublish}
              disabled={submitting}
            >
              {submitting ? 'Publishing Book to KDP Cloud...' : '🚀 Publish eBook & Go LIVE'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
