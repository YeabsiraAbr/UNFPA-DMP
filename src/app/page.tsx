'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heart, Eye, EyeOff, ArrowLeft, Phone } from 'lucide-react'
import { authService } from '@/services'
import { useTranslation } from '@/lib/i18n'

type View = 'login' | 'forgot' | 'otp' | 'newPassword'

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [view, setView] = useState<View>('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Forgot / Reset password state
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!phone || !password) {
      setError(t('login.validationPhonePassword'))
      return
    }
    setIsLoading(true)
    try {
      await authService.login({ phone, password })
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!phone) {
      setError(t('login.validationPhone'))
      return
    }
    setIsLoading(true)
    try {
      await authService.forgotPassword({ phone })
      setSuccess(t('login.forgotOtpSuccess'))
      setView('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.sendOtpFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!otpCode || !newPassword) {
      setError(t('login.validationOtpPassword'))
      return
    }
    if (newPassword !== confirmPassword) {
      setError(t('login.passwordsNoMatch'))
      return
    }
    if (newPassword.length < 4) {
      setError(t('login.passwordMinLength'))
      return
    }
    setIsLoading(true)
    try {
      await authService.resetPassword({ phone, otpCode, newPassword })
      setSuccess(t('login.resetSuccess'))
      setView('login')
      setPassword('')
      setOtpCode('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.invalidOtp'))
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    setError('')
    setSuccess('')
    if (view === 'otp') setView('forgot')
    else setView('login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-50 via-white to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-xl shadow-brand-500/30 mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{t('login.brandTitle')}</h1>
          <p className="text-slate-600 mt-2">{t('login.brandSubtitle')}</p>
          <p className="text-sm text-slate-500 mt-1">{t('login.brandLocation')}</p>
        </div>

        <Card variant="elevated" className="p-8 animate-slide-up backdrop-blur-sm bg-white/80">
          {/* ---- LOGIN VIEW ---- */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-slate-900">{t('login.welcomeBack')}</h2>
                <p className="text-sm text-slate-500 mt-1">{t('login.signInDescription')}</p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-shake">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label={t('login.phoneLabel')}
                  type="tel"
                  placeholder={t('login.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={Phone}
                />
                <div className="relative">
                  <Input
                    label={t('login.passwordLabel')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    defaultChecked
                  />
                  <span className="text-slate-600">{t('login.rememberMe')}</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setView('forgot'); setError(''); setSuccess('') }}
                  className="text-brand-600 hover:text-brand-700 font-medium"
                >
                  {t('login.forgotPassword')}
                </button>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                {t('login.signIn')}
              </Button>
            </form>
          )}

          {/* ---- FORGOT PASSWORD VIEW ---- */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <button type="button" onClick={goBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
                  <ArrowLeft className="w-4 h-4" /> {t('login.backToSignIn')}
                </button>
                <h2 className="text-xl font-semibold text-slate-900">{t('login.forgotPasswordTitle')}</h2>
                <p className="text-sm text-slate-500 mt-1">{t('login.forgotPasswordDescription')}</p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <Input
                label={t('login.phoneLabel')}
                type="tel"
                placeholder={t('login.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={Phone}
              />

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                {t('login.sendOtpCode')}
              </Button>
            </form>
          )}

          {/* ---- OTP + NEW PASSWORD VIEW ---- */}
          {view === 'otp' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <button type="button" onClick={goBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
                  <ArrowLeft className="w-4 h-4" /> {t('login.back')}
                </button>
                <h2 className="text-xl font-semibold text-slate-900">{t('login.resetPasswordTitle')}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {t('login.resetPasswordDescriptionPrefix')}{' '}
                  <span className="font-medium text-slate-700">{phone}</span>
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}
              {success && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{success}</div>
              )}

              <div className="space-y-4">
                <Input
                  label={t('login.otpCodeLabel')}
                  type="text"
                  placeholder={t('login.otpPlaceholder')}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
                <div className="relative">
                  <Input
                    label={t('login.newPasswordLabel')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.newPasswordPlaceholder')}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <Input
                  label={t('login.confirmNewPasswordLabel')}
                  type="password"
                  placeholder={t('login.confirmNewPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                {t('login.resetPasswordButton')}
              </Button>
            </form>
          )}
        </Card>

        <div className="text-center mt-8 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p>{t('login.footerVersion')}</p>
          <p className="mt-1">{t('login.footerCopyright')}</p>
        </div>
      </div>
    </div>
  )
}
