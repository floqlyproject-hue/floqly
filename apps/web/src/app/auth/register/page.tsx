import { Suspense } from 'react'
import { AuthForm } from '../components/auth-form'

export const metadata = {
  title: 'Регистрация — Floqly',
  description: 'Создайте аккаунт Floqly',
}

export default function RegisterPage() {
  return (
    <Suspense>
      <AuthForm mode="register" />
    </Suspense>
  )
}
