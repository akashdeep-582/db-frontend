import { ReactNode } from 'react'

export interface ErrorMessageProps {
  children?: ReactNode
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  if (!children) return null
  return <p className="ui-error-msg">{children}</p>
}
