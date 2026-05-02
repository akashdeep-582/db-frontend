import { InputHTMLAttributes, forwardRef } from 'react'

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, id, error, className = '', ...inputProps }, ref) => {
    return (
      <div className={`ui-field ${className}`}>
        {label && (
          <label className="ui-field-label" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`ui-field-input${error ? ' ui-field-input--error' : ''}`}
          {...inputProps}
        />
        {error && <span className="ui-field-error">{error}</span>}
      </div>
    )
  }
)

Field.displayName = 'Field'
export default Field
