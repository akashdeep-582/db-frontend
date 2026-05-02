import { ReactNode } from 'react'

export interface ModalProps {
  onClose: () => void
  children: ReactNode
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div className="ui-modal-backdrop" onClick={onClose}>
      <div className="ui-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="ui-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
