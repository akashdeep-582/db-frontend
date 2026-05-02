export interface ToggleOption {
  value: string
  label: string
}

export interface ToggleGroupProps {
  label?: string
  options: ToggleOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  stretch?: boolean
}

export default function ToggleGroup({ label, options, value, onChange, error, stretch = false }: ToggleGroupProps) {
  return (
    <div className="ui-field">
      {label && <span className="ui-field-label">{label}</span>}
      <div className={`ui-toggle-group${stretch ? ' ui-toggle-group--stretch' : ''}`}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`ui-toggle-btn${value === o.value ? ' ui-toggle-btn--active' : ''}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {error && (
        <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}
