import { useRef, useState } from 'react'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 5
const MAX_COUNT = 10

interface Props {
  files: File[]
  onChange: (files: File[]) => void
  error?: string
}

function validateFiles(incoming: File[], existing: File[]): { valid: File[]; error: string } {
  const valid: File[] = []
  const slotsLeft = MAX_COUNT - existing.length

  for (const file of incoming) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: [], error: `${file.name}: only JPEG, PNG, and WebP are allowed` }
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return { valid: [], error: `${file.name}: exceeds ${MAX_SIZE_MB}MB limit` }
    }
    valid.push(file)
  }

  if (valid.length > slotsLeft) {
    return { valid: [], error: `Maximum ${MAX_COUNT} images allowed` }
  }

  return { valid, error: '' }
}

export default function ImageUpload({ files, onChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [validationError, setValidationError] = useState('')

  function handleFiles(incoming: FileList | null) {
    if (!incoming) return
    const { valid, error } = validateFiles(Array.from(incoming), files)
    setValidationError(error)
    if (valid.length > 0) onChange([...files, ...valid])
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  function handleRemove(index: number) {
    onChange(files.filter((_, i) => i !== index))
    setValidationError('')
  }

  const displayError = validationError || error

  return (
    <div className="ui-field">
      <span className="ui-field-label">Property Images</span>

      <div
        className={`ui-upload-zone${dragActive ? ' ui-upload-zone--active' : ''}${displayError ? ' ui-upload-zone--error' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <div className="ui-upload-icon">🖼</div>
        <div className="ui-upload-label">
          {files.length === 0 ? 'Click or drag images here' : `${files.length} image${files.length > 1 ? 's' : ''} selected`}
        </div>
        <div className="ui-upload-hint">
          JPEG, PNG, WebP · Max {MAX_SIZE_MB}MB each · Up to {MAX_COUNT} images
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {displayError && <span className="ui-field-error">{displayError}</span>}

      {files.length > 0 && (
        <div className="ui-upload-previews">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="ui-upload-thumb">
              <img src={URL.createObjectURL(file)} alt={file.name} />
              <button
                type="button"
                className="ui-upload-thumb-remove"
                onClick={() => handleRemove(i)}
              >
                ×
              </button>
              {i === 0 && <span className="ui-upload-primary-badge">Primary</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
