import { useState } from 'react'
import { Modal, Button, Field, Form, ErrorMessage } from '@dropbroker/ui'
import { useLogin } from '../hooks/useLogin'
import { getApiError } from '../utils/errors'
import styles from './AuthForm.module.css'

interface Props {
  onClose: () => void
  onSwitchToRegister: () => void
}

function validate(email: string, password: string) {
  const errors = { email: '', password: '' }
  if (!email) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email'
  if (!password) errors.password = 'Password is required'
  return errors
}

export default function LoginModal({ onClose, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const { mutate, isPending, error } = useLogin(onClose)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(email, password)
    setErrors(errs)
    if (errs.email || errs.password) return
    mutate({ email, password })
  }

  return (
    <Modal onClose={onClose}>
      <div className={styles.logo}>DropBroker</div>
      <h2 className={styles.title}>Welcome back</h2>
      <p className={styles.subtitle}>Sign in to your account</p>

      <Form onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Field
          label="Password"
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <ErrorMessage>
          {error ? getApiError(error, 'Invalid email or password.') : ''}
        </ErrorMessage>

        <Button type="submit" block loading={isPending}>
          Sign in
        </Button>
      </Form>

      <p className={styles.footer}>
        Don't have an account?{' '}
        <button className={styles.linkBtn} onClick={onSwitchToRegister}>
          Register
        </button>
      </p>
    </Modal>
  )
}
