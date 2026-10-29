import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { LunaOrb } from '@/components/ui'
import { cn } from '@/lib/cn'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ViewMode = 'login' | 'forgot'
type SubmitState = 'idle' | 'submitting' | 'success'

const inputBaseClass =
  'h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 text-sm text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-muted focus:border-primary focus:ring-3 focus:ring-primary/12'

const inputErrorClass = 'border-error focus:border-error focus:ring-error/12'

const primaryBtnClass =
  'inline-flex h-10 w-full select-none items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#464BB8] active:bg-[#3B3E99] disabled:pointer-events-none disabled:opacity-60'

const secondaryBtnClass =
  'inline-flex h-9 select-none items-center justify-center gap-2 rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 text-xs font-semibold text-ink transition-colors duration-150 hover:bg-[#F8FAFC]'

export function LoginPage() {
  const [mode, setMode] = useState<ViewMode>('login')

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Validation & submission state
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const year = new Date().getFullYear()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const switchMode = (nextMode: ViewMode) => {
    setMode(nextMode)
    setEmailError(null)
    setPasswordError(null)
    setSubmitState('idle')
  }

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitState === 'submitting') return

    const trimmedEmail = email.trim()
    let valid = true

    if (!EMAIL_RE.test(trimmedEmail)) {
      setEmailError('Masukkan alamat email yang valid.')
      valid = false
    } else {
      setEmailError(null)
    }

    if (!password) {
      setPasswordError('Kata sandi wajib diisi.')
      valid = false
    } else if (password.length < 6) {
      setPasswordError('Kata sandi minimal 6 karakter.')
      valid = false
    } else {
      setPasswordError(null)
    }

    if (!valid) return

    setSubmitState('submitting')
    // Frontend simulation — replace with backend auth API call when ready
    window.setTimeout(() => {
      setSubmitState('success')
    }, 700)
  }

  const handleForgotSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitState === 'submitting') return

    const trimmedEmail = email.trim()
    if (!EMAIL_RE.test(trimmedEmail)) {
      setEmailError('Masukkan alamat email terdaftar yang valid.')
      return
    }

    setEmailError(null)
    setSubmitState('submitting')
    window.setTimeout(() => {
      setSubmitState('success')
    }, 700)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col justify-between bg-[#F8F9FE] px-4 py-6 sm:px-6 sm:py-8">
      {/* Minimal top navigation */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Centered Single-Column Auth Container */}
      <main id="main-content" className="mx-auto my-10 w-full max-w-[400px]">
        {/* Brand Header with LunaOrb above card */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link
            to="/"
            aria-label="EVA — Beranda"
            className="inline-flex flex-col items-center gap-3"
          >
            <LunaOrb className="size-12" />
            <span className="text-xl font-bold tracking-[-0.02em] text-ink">EVA</span>
          </Link>
        </div>

        {/* Formal Solid Card */}
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-8">
          {mode === 'login' ? (
            <>
              <div>
                <h1 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
                  Masuk ke EVA
                </h1>
                <p className="mt-1 text-sm text-ink-soft">
                  Masukkan email dan kata sandi akun Anda.
                </p>
              </div>

              {submitState === 'success' ? (
                <div
                  role="status"
                  className="mt-6 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-success" />
                    <div>
                      <p className="text-sm font-semibold text-ink">Kredensial terverifikasi</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                        Masuk sebagai <strong className="font-semibold text-ink">{email.trim()}</strong>.
                        Pengalihan ke dasbor akan aktif setelah autentikasi backend terhubung.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubmitState('idle')}
                      className={secondaryBtnClass}
                    >
                      Ubah Akun
                    </button>
                    <Link to="/" className={secondaryBtnClass}>
                      Ke Beranda
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} noValidate className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-1.5 block text-xs font-medium text-ink"
                    >
                      Email
                    </label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="nama@institusi.id"
                      value={email}
                      aria-invalid={Boolean(emailError) || undefined}
                      aria-describedby={emailError ? 'login-email-error' : undefined}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) setEmailError(null)
                      }}
                      className={cn(inputBaseClass, emailError && inputErrorClass)}
                    />
                    {emailError && (
                      <p id="login-email-error" className="mt-1.5 text-xs text-error">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label htmlFor="login-password" className="text-xs font-medium text-ink">
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="cursor-pointer text-xs font-medium text-primary transition-colors hover:text-primary-deep"
                      >
                        Lupa kata sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Masukkan kata sandi"
                        value={password}
                        aria-invalid={Boolean(passwordError) || undefined}
                        aria-describedby={passwordError ? 'login-password-error' : undefined}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (passwordError) setPasswordError(null)
                        }}
                        className={cn(inputBaseClass, 'pr-10', passwordError && inputErrorClass)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:text-ink"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p id="login-password-error" className="mt-1.5 text-xs text-error">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center pt-0.5">
                    <label
                      htmlFor="login-remember"
                      className="inline-flex cursor-pointer select-none items-center gap-2 text-xs text-ink-soft"
                    >
                      <input
                        id="login-remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="size-3.5 cursor-pointer rounded-[4px] border-[#CBD5E1] accent-primary"
                      />
                      <span>Ingat saya di perangkat ini</span>
                    </label>
                  </div>

                  <button
                    id="login-submit"
                    type="submit"
                    disabled={submitState === 'submitting'}
                    className={cn(primaryBtnClass, 'mt-2 cursor-pointer')}
                  >
                    {submitState === 'submitting' ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Memverifikasi…</span>
                      </>
                    ) : (
                      <span>Masuk</span>
                    )}
                  </button>
                </form>
              )}
            </>
          ) : (
            /* Forgot Password View */
            <>
              <div>
                <h1 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
                  Atur ulang kata sandi
                </h1>
                <p className="mt-1 text-sm text-ink-soft">
                  Masukkan alamat email terdaftar untuk menerima tautan pemulihan.
                </p>
              </div>

              {submitState === 'success' ? (
                <div
                  role="status"
                  className="mt-6 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-success" />
                    <div>
                      <p className="text-sm font-semibold text-ink">Tautan pemulihan dikirim</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                        Instruksi pengaturan ulang kata sandi telah dikirim ke{' '}
                        <strong className="font-semibold text-ink">{email.trim()}</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className={cn(secondaryBtnClass, 'mt-4 w-full cursor-pointer')}
                  >
                    Kembali ke Halaman Masuk
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} noValidate className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="mb-1.5 block text-xs font-medium text-ink"
                    >
                      Email Terdaftar
                    </label>
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="nama@institusi.id"
                      value={email}
                      aria-invalid={Boolean(emailError) || undefined}
                      aria-describedby={emailError ? 'forgot-email-error' : undefined}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) setEmailError(null)
                      }}
                      className={cn(inputBaseClass, emailError && inputErrorClass)}
                    />
                    {emailError && (
                      <p id="forgot-email-error" className="mt-1.5 text-xs text-error">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <button
                    id="forgot-submit"
                    type="submit"
                    disabled={submitState === 'submitting'}
                    className={cn(primaryBtnClass, 'cursor-pointer')}
                  >
                    {submitState === 'submitting' ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Mengirim…</span>
                      </>
                    ) : (
                      <span>Kirim Tautan Pemulihan</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="flex w-full cursor-pointer items-center justify-center py-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-ink"
                  >
                    Kembali ke halaman masuk
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="mx-auto w-full max-w-5xl text-center text-xs text-ink-muted">
        © {year} EVA — Empathetic Vitality Assistant
      </footer>
    </div>
  )
}
