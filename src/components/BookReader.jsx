import { useState } from 'react'

export default function BookReader({ title, author, sampleText, fullText, isSample, onClose, onBuy, price }) {
  const [theme, setTheme] = useState('obsidian') // 'obsidian', 'sepia', 'clean-white'
  const [fontSize, setFontSize] = useState(18)

  const rawText = fullText || sampleText || 'No reading content available.'
  const paragraphs = rawText.split('\n\n').filter(Boolean)

  return (
    <div className="modern-reader-overlay">
      <div className={`modern-reader-frame theme-${theme}`}>
        {/* Reader Header */}
        <header className="reader-header">
          <div className="reader-meta">
            <span className="reader-mode-pill">{isSample ? '✦ Free Preview' : '✓ Full Access'}</span>
            <div className="reader-headings">
              <h2 className="reader-book-title">{title}</h2>
              <span className="reader-book-author">By {author || 'Abikumar Dharmaraj'}</span>
            </div>
          </div>

          <div className="reader-actions">
            {/* Theme switcher */}
            <div className="reader-theme-selector">
              <button
                type="button"
                className={`theme-dot obsidian ${theme === 'obsidian' ? 'active' : ''}`}
                onClick={() => setTheme('obsidian')}
                title="Obsidian Dark"
              />
              <button
                type="button"
                className={`theme-dot sepia ${theme === 'sepia' ? 'active' : ''}`}
                onClick={() => setTheme('sepia')}
                title="Warm Sepia"
              />
              <button
                type="button"
                className={`theme-dot white ${theme === 'clean-white' ? 'active' : ''}`}
                onClick={() => setTheme('clean-white')}
                title="Paper White"
              />
            </div>

            {/* Font Scaler */}
            <div className="reader-font-scaler">
              <button type="button" onClick={() => setFontSize(f => Math.max(14, f - 2))}>A-</button>
              <span>{fontSize}px</span>
              <button type="button" onClick={() => setFontSize(f => Math.min(26, f + 2))}>A+</button>
            </div>

            {isSample && onBuy && (
              <button type="button" className="reader-unlock-btn" onClick={onBuy}>
                Unlock Full eBook (₹{price || '399'})
              </button>
            )}

            <button type="button" className="reader-exit-btn" onClick={onClose} title="Exit Reader">
              ✕
            </button>
          </div>
        </header>

        {/* Reader Content Body */}
        <main className="reader-scroll-viewport" style={{ fontSize: `${fontSize}px` }}>
          <div className="reader-reading-canvas">
            <div className="canvas-title-card">
              <h1>{title}</h1>
              <p className="canvas-byline">Written by {author || 'Abikumar Dharmaraj'}</p>
              <div className="canvas-ornament">✦ ✦ ✦</div>
            </div>

            <div className="canvas-text">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {isSample && (
              <div className="preview-end-banner">
                <div className="sparkle-icon">✨</div>
                <h3>End of Free Sample Preview</h3>
                <p>Unlock the complete unedited eBook with all 5 income blueprints, prompt templates, and lifetime updates.</p>
                {onBuy && (
                  <button type="button" className="preview-buy-now-btn" onClick={onBuy}>
                    1-Click Buy Now (₹{price || '399'})
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
