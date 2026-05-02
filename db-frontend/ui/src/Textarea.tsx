import { TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, error, className = '', ...props }, ref) => {
    return (
      <div className={`ui-field ${className}`}>
        {label && (
          <label className="ui-field-label" htmlFor={id}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`ui-field-input ui-textarea${error ? ' ui-field-input--error' : ''}`}
          {...props}
        />
        {error && <span className="ui-field-error">{error}</span>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
