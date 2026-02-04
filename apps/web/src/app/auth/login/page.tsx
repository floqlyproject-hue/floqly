import { Suspense } from 'react'
import { AuthForm } from '../components/auth-form'

export const metadata = {
  title: 'Вход — Floqly',
  description: 'Войдите в личный кабинет Floqly',
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  )
}
