import { useState } from 'react'

export default function BookReader({ title, author, sampleText, fullText, isSample, onClose, onBuy, price }) {
  const [theme, setTheme] = useState('sepia') // 'light', 'sepia', 'dark'
  const [fontSize, setFontSize] = useState(17) // in px

  const rawText = fullText || sampleText || 'No reading content available.'
  const paragraphs = rawText.split('\n\n').filter(Boolean)

  return (
    <div className="reader-modal-overlay">
      <div className={`reader-modal-container reader-theme-${theme}`}>
        {/* Reader Toolbar */}
        <div className="reader-toolbar">
          <div className="reader-book-info">
            <span className="reader-badge">{isSample ? '📖 Look Inside Sample' : '📚 Full eBook'}</span>
            <strong className="reader-title">{title}</strong>
            <span className="reader-author">by {author || 'Abikumar Dharmaraj'}</span>
          </div>

          <div className="reader-controls">
            {/* Theme selector */}
            <div className="reader-theme-picker">
              <button
                type="button"
                className={`theme-btn light ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                title="Light Mode"
              >
                A
              </button>
              <button
                type="button"
                className={`theme-btn sepia ${theme === 'sepia' ? 'active' : ''}`}
                onClick={() => setTheme('sepia')}
                title="Parchment Sepia"
              >
                A
              </button>
              <button
                type="button"
                className={`theme-btn dark ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                title="Dark Mode"
              >
                A
              </button>
            </div>

            {/* Font size */}
            <div className="reader-font-controls">
              <button
                type="button"
                className="font-btn"
                onClick={() => setFontSize((f) => Math.max(14, f - 2))}
                title="Decrease Font Size"
              >
                A-
              </button>
              <span className="font-size-label">{fontSize}px</span>
              <button
                type="button"
                className="font-btn"
                onClick={() => setFontSize((f) => Math.min(26, f + 2))}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {isSample && onBuy && (
              <button type="button" className="btn btn-primary btn-sm reader-buy-btn" onClick={onBuy}>
                Buy eBook {price ? `₹${price}` : ''}
              </button>
            )}

            <button type="button" className="reader-close-btn" onClick={onClose} title="Close Reader">
              ✕
            </button>
          </div>
        </div>

        {/* Reader Body */}
        <div className="reader-content-scroll" style={{ fontSize: `${fontSize}px` }}>
          <div className="reader-manuscript-page">
            <header className="manuscript-header">
              <h1 className="manuscript-book-title">{title}</h1>
              <p className="manuscript-author-line">By {author || 'Abikumar Dharmaraj'}</p>
              <div className="manuscript-divider">❦</div>
            </header>

            <article className="manuscript-text-body">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="manuscript-paragraph">
                  {p}
                </p>
              ))}
            </article>

            {isSample && (
              <div className="sample-end-card">
                <div className="sample-end-icon">✨</div>
                <h3>End of Sample Preview</h3>
                <p>Unlock the complete unedited eBook with all chapters, actionable worksheets, and lifetime updates.</p>
                {onBuy && (
                  <button type="button" className="btn btn-primary btn-lg" onClick={onBuy}>
                    1-Click Buy eBook ({price ? `₹${price}` : 'Instant Access'})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
