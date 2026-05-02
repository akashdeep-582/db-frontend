import { useState } from 'react'
import { Modal, Button, Field, Form, ErrorMessage } from '@dropbroker/ui'
import { useRegister } from '../hooks/useRegister'
import { useVerify, useResendCode } from '../hooks/useVerify'
import { getApiError } from '../utils/errors'
import styles from './AuthForm.module.css'

type Step = 'form' | 'verify' | 'done'

interface Props {
  onClose: () => void
  onSwitchToLogin: () => void
}

interface FormFields {
  full_name: string
  email: string
  phone: string
  password: string
  role: 'tenant' | 'owner'
}

interface FormErrors {
  full_name: string
  email: string
  phone: string
  password: string
}

function validate(fields: FormFields): FormErrors {
  const e: FormErrors = { full_name: '', email: '', phone: '', password: '' }
  if (!fields.full_name || fields.full_name.length < 2) e.full_name = 'Full name must be at least 2 characters'
  if (!fields.email) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email'
  if (!fields.phone) e.phone = 'Phone is required'
  if (!fields.password || fields.password.length < 8) e.password = 'Password must be at least 8 characters'
  return e
}

export default function RegisterModal({ onClose, onSwitchToLogin }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState<FormFields>({
    full_name: '', email: '', phone: '', password: '', role: 'tenant',
  })
  const [errors, setErrors] = useState<FormErrors>({ full_name: '', email: '', phone: '', password: '' })

  const registerMutation = useRegister(() => setStep('verify'))

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return
    registerMutation.mutate(form)
  }

  if (step === 'verify') {
    return <VerifyStep email={form.email} onClose={onClose} onVerified={() => setStep('done')} />
  }

  if (step === 'done') {
    return (
      <Modal onClose={onClose}>
        <div className={styles.successIcon}>✅</div>
        <h2 className={styles.title}>Email verified!</h2>
        <p className={styles.subtitle}>Your account is active. Sign in to get started.</p>
        <Button block style={{ marginTop: 24 }} onClick={onSwitchToLogin}>Sign in</Button>
      </Modal>
    )
  }

  return (
    <Modal onClose={onClose}>
      <div className={styles.logo}>DropBroker</div>
      <h2 className={styles.title}>Create your account</h2>
      <p className={styles.subtitle}>Join as a tenant or property owner</p>

      <Form onSubmit={handleSubmit} noValidate>
        <Field label="Full name" id="reg-name" name="full_name" type="text"
          placeholder="Jane Smith" value={form.full_name} onChange={handleChange}
          error={errors.full_name} />
        <Field label="Email" id="reg-email" name="email" type="email"
          autoComplete="email" placeholder="you@example.com" value={form.email}
          onChange={handleChange} error={errors.email} />
        <Field label="Phone" id="reg-phone" name="phone" type="tel"
          placeholder="+61 400 000 000" value={form.phone} onChange={handleChange}
          error={errors.phone} />
        <Field label="Password" id="reg-password" name="password" type="password"
          autoComplete="new-password" placeholder="Min. 8 characters" value={form.password}
          onChange={handleChange} error={errors.password} />

        <div className="ui-field">
          <span className="ui-field-label">I am a</span>
          <div className={styles.roleToggle}>
            <button type="button"
              className={`${styles.roleBtn} ${form.role === 'tenant' ? styles.roleBtnActive : ''}`}
              onClick={() => setForm({ ...form, role: 'tenant' })}>Tenant</button>
            <button type="button"
              className={`${styles.roleBtn} ${form.role === 'owner' ? styles.roleBtnActive : ''}`}
              onClick={() => setForm({ ...form, role: 'owner' })}>Owner</button>
          </div>
        </div>

        <ErrorMessage>
          {registerMutation.error ? getApiError(registerMutation.error, 'Registration failed. Please try again.') : ''}
        </ErrorMessage>

        <Button type="submit" block loading={registerMutation.isPending}>Create account</Button>
      </Form>

      <p className={styles.footer}>
        Already have an account?{' '}
        <button className={styles.linkBtn} onClick={onSwitchToLogin}>Sign in</button>
      </p>
    </Modal>
  )
}

function VerifyStep({ email, onClose, onVerified }: { email: string; onClose: () => void; onVerified: () => void }) {
  const verify = useVerify(onVerified)
  const resend = useResendCode()
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code || code.length !== 6) { setCodeError('Enter the 6-digit code'); return }
    setCodeError('')
    verify.mutate({ email, code })
  }

  return (
    <Modal onClose={onClose}>
      <div className={styles.successIcon}>✉️</div>
      <h2 className={styles.title}>Check your email</h2>
      <p className={styles.subtitle}>Enter the 6-digit code sent to <strong>{email}</strong></p>

      <Form onSubmit={handleSubmit} noValidate>
        <Field label="Verification code" id="verify-code" name="code" type="text"
          inputMode="numeric" maxLength={6} placeholder="123456"
          value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          error={codeError} />

        <ErrorMessage>
          {verify.error ? getApiError(verify.error, 'Invalid or expired code.') : ''}
        </ErrorMessage>

        <Button type="submit" block loading={verify.isPending}>Verify email</Button>
      </Form>

      <p className={styles.footer}>
        Didn't receive it?{' '}
        <button className={styles.linkBtn} disabled={resend.isPending}
          onClick={() => resend.mutate({ email })}>
          {resend.isPending ? 'Sending…' : 'Resend code'}
        </button>
        {resend.isSuccess && <span style={{ color: '#16a34a', marginLeft: 6 }}>Sent!</span>}
      </p>
    </Modal>
  )
}
