import { InputHTMLAttributes } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export default function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  return (
    <div className={`ui-checkbox ${className}`}>
      <input id={id} type="checkbox" className="ui-checkbox-input" {...props} />
      <label htmlFor={id} className="ui-checkbox-label">{label}</label>
    </div>
  )
}
