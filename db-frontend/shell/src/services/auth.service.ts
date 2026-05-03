import api from '../api/axios'
import type { Role, AuthResult } from '../types/auth'

// ── DTOs — raw API response shapes ───────────────────────────────────────────

interface LoginResponseDTO {
  tokens: {
    accessToken: string
    idToken: string
    refreshToken: string
  }
  user: {
    id: string
    email: string
    full_name: string
    role: Role
  }
}

// ── Request payloads ──────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  full_name: string
  email: string
  phone: string
  password: string
  role: 'tenant' | 'owner'
}

export interface VerifyPayload {
  email: string
  code: string
}

export interface ResendCodePayload {
  email: string
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapLoginResponse(dto: LoginResponseDTO): AuthResult {
  return {
    token: dto.tokens.accessToken,
    user: {
      email: dto.user.email,
      name: dto.user.full_name,
    },
    role: dto.user.role,
  }
}

// ── Service functions ─────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthResult> {
  const { data } = await api.post<LoginResponseDTO>('/api/auth/login', payload)
  return mapLoginResponse(data)
}

export async function register(payload: RegisterPayload): Promise<void> {
  await api.post('/api/auth/register', payload)
}

export async function verify(payload: VerifyPayload): Promise<void> {
  await api.post('/api/auth/verify', payload)
}

export async function resendCode(payload: ResendCodePayload): Promise<void> {
  await api.post('/api/auth/resend-code', payload)
}
