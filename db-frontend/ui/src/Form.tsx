import { FormHTMLAttributes, ReactNode } from 'react'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
}

export default function Form({ children, className = '', ...props }: FormProps) {
  return (
    <form className={`ui-form ${className}`} {...props}>
      {children}
    </form>
  )
}
