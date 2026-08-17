import { useEffect, useState } from 'react'
import {
  adminListContent, adminGetContent, adminCreateContent, adminUpdateContent, adminDeleteContent,
  adminAddContentFile, adminRemoveContentFile,
} from '../api/admin.js'
import { errorMessage, thumbnailUrl } from '../api/axiosClient.js'
import Loader from '../components/Loader.jsx'

const emptyForm = { title: '', description: '', price: '', contentType: 'VIDEO', active: true }

export default function AdminContentManage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [thumbFile, setThumbFile] = useState(null)
  const [contentFile, setContentFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Extra files (only relevant once a product exists, i.e. while editing)
  const [extraFiles, setExtraFiles] = useState([])
  const [newExtraType, setNewExtraType] = useState('PHOTO')
  const [newExtraLabel, setNewExtraLabel] = useState('')
  const [newExtraFile, setNewExtraFile] = useState(null)
  const [extraSubmitting, setExtraSubmitting] = useState(false)
  const [extraError, setExtraError] = useState('')

  function load() {
    setLoading(true)
    adminListContent()
      .then((res) => setItems(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setThumbFile(null)
    setContentFile(null)
    setFormError('')
    setExtraFiles([])
    setShowForm(true)
  }

  async function openEdit(item) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      description: item.description || '',
      price: item.price,
      contentType: item.contentType,
      active: item.active,
    })
    setThumbFile(null)
    setContentFile(null)
    setFormError('')
    setExtraError('')
    setShowForm(true)
    try {
      const res = await adminGetContent(item.id)
      setExtraFiles(res.data.extraFiles || [])
    } catch {
      setExtraFiles([])
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return
    try {
      await adminDeleteContent(item.id)
      load()
    } catch (err) {
      alert(errorMessage(err, 'Could not delete this item.'))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!form.title.trim()) return setFormError('Title is required.')
    if (!form.price || Number(form.price) <= 0) return setFormError('Enter a valid price.')
    if (!editingId && !thumbFile) return setFormError('Please choose a thumbnail image.')
    if (!editingId && !contentFile) return setFormError('Please choose the video/pdf/photo file.')

    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('description', form.description || '')
    fd.append('price', form.price)
    fd.append('contentType', form.contentType)
    if (editingId) fd.append('active', form.active)
    if (thumbFile) fd.append('thumbnail', thumbFile)
    if (contentFile) fd.append('file', contentFile)

    setSubmitting(true)
    try {
      if (editingId) {
        await adminUpdateContent(editingId, fd)
      } else {
        await adminCreateContent(fd)
      }
      setShowForm(false)
      load()
    } catch (err) {
      setFormError(errorMessage(err, 'Could not save this item.'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddExtraFile(e) {
    e.preventDefault()
    setExtraError('')
    if (!newExtraFile) {
      setExtraError('Choose a file first.')
      return
    }
    const fd = new FormData()
    fd.append('fileType', newExtraType)
    if (newExtraLabel.trim()) fd.append('label', newExtraLabel.trim())
    fd.append('file', newExtraFile)

    setExtraSubmitting(true)
    try {
      const res = await adminAddContentFile(editingId, fd)
      setExtraFiles(res.data.extraFiles || [])
      setNewExtraFile(null)
      setNewExtraLabel('')
      e.target.reset?.()
    } catch (err) {
      setExtraError(errorMessage(err, 'Could not add this file.'))
    } finally {
      setExtraSubmitting(false)
    }
  }

  async function handleRemoveExtraFile(fileId) {
    if (!window.confirm('Remove this file from the product?')) return
    try {
      const res = await adminRemoveContentFile(editingId, fileId)
      setExtraFiles(res.data.extraFiles || [])
    } catch (err) {
      alert(errorMessage(err, 'Could not remove this file.'))
    }
  }

  return (
    <div>
      <div className="page-header-row">
        <h1 className="page-title">Content</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add New Content</button>
      </div>

      {loading && <Loader label="Loading content..." />}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        items.length === 0 ? (
          <div className="empty-state"><p>Nothing uploaded yet. Click "Add New Content" to get started.</p></div>
        ) : (
          <div className="admin-content-grid">
            {items.map((item) => (
              <div className="admin-content-card" key={item.id}>
                <img src={thumbnailUrl(item.thumbnailUrl)} alt={item.title} />
                <div className="admin-content-body">
                  <span className="type-badge inline">{item.contentType}</span>
                  <h3>{item.title}</h3>
                  <p className="price-tag">₹{Number(item.price).toFixed(0)}</p>
                  <span className={'status-pill ' + (item.active ? 'unlocked' : 'locked')}>
                    {item.active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="admin-content-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Content' : 'Add New Content'}</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSubmit} className="admin-form">
              <label>Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

              <div className="form-row">
                <div>
                  <label>Price (₹)</label>
                  <input type="number" min="1" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div>
                  <label>Type</label>
                  <select value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })}>
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF</option>
                    <option value="PHOTO">Photo</option>
                  </select>
                </div>
              </div>

              <label>Thumbnail image {editingId && '(leave empty to keep current)'}</label>
              <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files[0])} />

              <label>{form.contentType === 'PDF' ? 'PDF file' : form.contentType === 'PHOTO' ? 'Photo file' : 'Video file'} (main file) {editingId && '(leave empty to keep current)'}</label>
              <input
                type="file"
                accept={form.contentType === 'PDF' ? 'application/pdf' : form.contentType === 'PHOTO' ? 'image/*' : 'video/*'}
                onChange={(e) => setContentFile(e.target.files[0])}
              />

              {editingId && (
                <label className="checkbox-row">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                  Active (visible to users)
                </label>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>

            {editingId && (
              <div className="extra-files-section">
                <h3>Additional files <span className="extra-files-hint">(up to 4 — mix of photos, PDFs, videos)</span></h3>

                {extraFiles.length > 0 && (
                  <ul className="extra-files-list">
                    {extraFiles.map((f) => (
                      <li key={f.id}>
                        <span className="type-badge inline">{f.fileType}</span>
                        <span className="extra-files-label">{f.label || `File #${f.id}`}</span>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveExtraFile(f.id)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}

                {extraError && <div className="alert alert-error">{extraError}</div>}

                {extraFiles.length < 4 ? (
                  <form onSubmit={handleAddExtraFile} className="admin-form extra-files-form">
                    <div className="form-row">
                      <div>
                        <label>File type</label>
                        <select value={newExtraType} onChange={(e) => setNewExtraType(e.target.value)}>
                          <option value="PHOTO">Photo</option>
                          <option value="PDF">PDF</option>
                          <option value="VIDEO">Video</option>
                        </select>
                      </div>
                      <div>
                        <label>Label (optional)</label>
                        <input type="text" placeholder="e.g. Photo 2" value={newExtraLabel} onChange={(e) => setNewExtraLabel(e.target.value)} />
                      </div>
                    </div>
                    <label>File</label>
                    <input
                      type="file"
                      accept={newExtraType === 'PDF' ? 'application/pdf' : newExtraType === 'PHOTO' ? 'image/*' : 'video/*'}
                      onChange={(e) => setNewExtraFile(e.target.files[0])}
                    />
                    <button type="submit" className="btn btn-secondary btn-block" disabled={extraSubmitting}>
                      {extraSubmitting ? 'Adding...' : '+ Add File'}
                    </button>
                  </form>
                ) : (
                  <p className="cart-note">Maximum of 4 extra files reached.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
