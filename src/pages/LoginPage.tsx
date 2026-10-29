import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { LunaOrb } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  ADMIN_ACCOUNT,
  authenticateUser,
  usePortalDb,
  type PartnerAccount,
} from '@/lib/portalStore'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ViewMode = 'login' | 'forgot'
type SubmitState = 'idle' | 'submitting' | 'success'

const inputBaseClass =
  'h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 text-sm text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-muted focus:border-primary focus:ring-3 focus:ring-primary/12'

const inputErrorClass = 'border-error focus:border-error focus:ring-error/12'

const primaryBtnClass =
  'inline-flex h-10 w-full cursor-pointer select-none items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#464BB8] active:bg-[#3B3E99] disabled:pointer-events-none disabled:opacity-60'

const secondaryBtnClass =
  'inline-flex h-9 cursor-pointer select-none items-center justify-center gap-2 rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 text-xs font-semibold text-ink transition-colors duration-150 hover:bg-[#F8FAFC]'

export function LoginPage() {
  const navigate = useNavigate()
  const { db } = usePortalDb()

  const [mode, setMode] = useState<ViewMode>('login')

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Validation & submission state
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  // Modal state for Pending / Rejected / Suspended partner
  const [statusModalPartner, setStatusModalPartner] = useState<PartnerAccount | null>(null)
  const [demoMenuOpen, setDemoMenuOpen] = useState(false)

  const year = new Date().getFullYear()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Close status modal on Escape
  useEffect(() => {
    if (!statusModalPartner) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStatusModalPartner(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [statusModalPartner])

  const switchMode = (nextMode: ViewMode) => {
    setMode(nextMode)
    setEmailError(null)
    setPasswordError(null)
    setAuthError(null)
    setSubmitState('idle')
  }

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setMode('login')
    setEmail(demoEmail)
    setPassword(demoPassword)
    setEmailError(null)
    setPasswordError(null)
    setAuthError(null)
    setStatusModalPartner(null)
    setDemoMenuOpen(false)
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
    } else {
      setPasswordError(null)
    }

    if (!valid) return

    setAuthError(null)
    setSubmitState('submitting')

    window.setTimeout(() => {
      const result = authenticateUser(trimmedEmail, password)
      setSubmitState('idle')

      if (!result.ok) {
        setAuthError(result.error)
        return
      }

      if (result.role === 'admin') {
        navigate('/admin')
        return
      }

      const partner = result.partner
      if (partner.status === 'approved') {
        navigate('/mitra')
        return
      }

      // Show clean modal for pending, rejected, or suspended partner
      setStatusModalPartner(partner)
    }, 400)
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
    }, 600)
  }

  const approvedDemo = db.partners.find((p) => p.status === 'approved') ?? db.partners[0]
  const pendingDemo = db.partners.find((p) => p.status === 'pending')
  const rejectedDemo = db.partners.find((p) => p.status === 'rejected')

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

      {/* Main Centered Container (Always fixed 400px width) */}
      <main id="main-content" className="mx-auto my-8 w-full max-w-[400px]">
        {/* Brand Header with LunaOrb above card */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link to="/" aria-label="EVA — Beranda" className="inline-flex flex-col items-center gap-3">
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

              {authError && (
                <div
                  role="alert"
                  className="mt-5 rounded-[8px] border border-crisis-border bg-crisis-bg px-3.5 py-3 text-xs font-medium text-crisis-text"
                >
                  {authError}
                </div>
              )}

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
                      if (authError) setAuthError(null)
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
                        if (authError) setAuthError(null)
                      }}
                      className={cn(inputBaseClass, 'pr-10', passwordError && inputErrorClass)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:text-ink"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                  className={cn(primaryBtnClass, 'mt-2')}
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

              <div className="mt-5 border-t border-[#E2E8F0] pt-4 text-center text-xs text-ink-soft">
                Instansi kesehatan belum terdaftar?{' '}
                <Link
                  to="/pengajuan-mitra"
                  className="font-semibold text-primary hover:text-primary-deep"
                >
                  Ajukan kemitraan faskes
                </Link>
              </div>
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
                    className={cn(secondaryBtnClass, 'mt-4 w-full')}
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
                    className={primaryBtnClass}
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

      {/* Clean Focused Modal for Pending / Rejected / Suspended Partner */}
      {statusModalPartner && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-status-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            onClick={() => setStatusModalPartner(null)}
            className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-[2px]"
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-[420px] rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-[10px] border',
                  statusModalPartner.status === 'pending' &&
                    'border-warning/30 bg-warning/10 text-[#B45309]',
                  statusModalPartner.status === 'rejected' &&
                    'border-crisis-border bg-crisis-bg text-crisis-text',
                  statusModalPartner.status === 'suspended' &&
                    'border-[#CBD5E1] bg-[#F1F5F9] text-ink-soft',
                )}
              >
                {statusModalPartner.status === 'pending' ? (
                  <Clock className="size-5" />
                ) : (
                  <AlertTriangle className="size-5" />
                )}
              </span>

              <button
                type="button"
                onClick={() => setStatusModalPartner(null)}
                aria-label="Tutup peringatan"
                className="flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-ink-soft transition-colors hover:bg-[#F1F5F9] hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4">
              <h2
                id="partner-status-modal-title"
                className="text-base font-semibold tracking-[-0.01em] text-ink"
              >
                {statusModalPartner.status === 'pending' && 'Pengajuan Sedang Diverifikasi'}
                {statusModalPartner.status === 'rejected' && 'Pengajuan Membutuhkan Perbaikan'}
                {statusModalPartner.status === 'suspended' && 'Akses Akun Dinonaktifkan'}
              </h2>
              <p className="mt-0.5 text-xs font-medium text-ink-soft">
                {statusModalPartner.facilityName}
              </p>

              {statusModalPartner.status === 'pending' && (
                <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                  Permohonan kemitraan fasilitas kesehatan Anda saat ini sedang ditinjau oleh tim
                  Admin EVA. Anda dapat masuk ke Dasbor Mitra segera setelah izin operasional faskes
                  selesai diverifikasi.
                </p>
              )}

              {statusModalPartner.status === 'rejected' && (
                <>
                  <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                    Mohon perbaiki data pengajuan fasilitas kesehatan Anda berdasarkan catatan
                    verifikasi Admin berikut:
                  </p>
                  <div className="mt-2.5 rounded-[8px] border border-crisis-border bg-crisis-bg p-3 text-xs leading-relaxed text-crisis-text">
                    {statusModalPartner.rejectionReason ||
                      'Data izin operasional fasilitas kesehatan belum lengkap.'}
                  </div>
                </>
              )}

              {statusModalPartner.status === 'suspended' && (
                <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                  Akses akun mitra untuk fasilitas kesehatan ini sedang dinonaktifkan sementara oleh
                  administrator sistem EVA.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#E2E8F0] pt-4">
              {statusModalPartner.status === 'rejected' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setStatusModalPartner(null)}
                    className={secondaryBtnClass}
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const id = statusModalPartner.id
                      setStatusModalPartner(null)
                      navigate(`/pengajuan-mitra?revisi=${encodeURIComponent(id)}`)
                    }}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-[#464BB8]"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>Perbaiki Pengajuan</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setStatusModalPartner(null)}
                  className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-[8px] bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-[#464BB8]"
                >
                  Mengerti
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Demo Accounts Button & Menu (Bottom-Right) */}
      <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end">
        {demoMenuOpen && (
          <div
            role="dialog"
            aria-label="Menu Akun Demo Cepat"
            className="mb-2.5 w-72 rounded-[12px] border border-[#E2E8F0] bg-white p-3.5 shadow-[0_10px_25px_rgba(15,23,42,0.1)]"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div>
                <p className="text-xs font-semibold text-ink">Akun Demo (Isi Otomatis)</p>
                <p className="text-[11px] text-ink-muted">Klik untuk mengisi form login</p>
              </div>
              <button
                type="button"
                onClick={() => setDemoMenuOpen(false)}
                aria-label="Tutup menu akun demo"
                className="flex size-6 cursor-pointer items-center justify-center rounded-[6px] text-ink-soft hover:bg-[#F1F5F9] hover:text-ink"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="mt-2.5 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => fillDemoCredentials(ADMIN_ACCOUNT.email, ADMIN_ACCOUNT.password)}
                className="flex w-full cursor-pointer flex-col items-start rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-left transition-colors hover:border-primary/50 hover:bg-primary-container/25"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <span className="size-2 rounded-full bg-primary" /> Admin Website EVA
                </span>
                <span className="mt-0.5 text-[11px] text-ink-soft">{ADMIN_ACCOUNT.email}</span>
              </button>

              {approvedDemo && (
                <button
                  type="button"
                  onClick={() => fillDemoCredentials(approvedDemo.email, approvedDemo.password)}
                  className="flex w-full cursor-pointer flex-col items-start rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-left transition-colors hover:border-primary/50 hover:bg-primary-container/25"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <span className="size-2 rounded-full bg-success" /> Mitra Faskes (Terverifikasi)
                  </span>
                  <span className="mt-0.5 w-full truncate text-[11px] text-ink-soft">
                    {approvedDemo.email}
                  </span>
                </button>
              )}

              {pendingDemo && (
                <button
                  type="button"
                  onClick={() => fillDemoCredentials(pendingDemo.email, pendingDemo.password)}
                  className="flex w-full cursor-pointer flex-col items-start rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-left transition-colors hover:border-primary/50 hover:bg-primary-container/25"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <span className="size-2 rounded-full bg-warning" /> Mitra Faskes (Pending)
                  </span>
                  <span className="mt-0.5 w-full truncate text-[11px] text-ink-soft">
                    {pendingDemo.email}
                  </span>
                </button>
              )}

              {rejectedDemo && (
                <button
                  type="button"
                  onClick={() => fillDemoCredentials(rejectedDemo.email, rejectedDemo.password)}
                  className="flex w-full cursor-pointer flex-col items-start rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-left transition-colors hover:border-primary/50 hover:bg-primary-container/25"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <span className="size-2 rounded-full bg-error" /> Mitra Faskes (Ditolak / Revisi)
                  </span>
                  <span className="mt-0.5 w-full truncate text-[11px] text-ink-soft">
                    {rejectedDemo.email}
                  </span>
                </button>
              )}
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-[#E2E8F0] pt-2 text-[11px] text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3" /> {db.partners.length} Faskes
              </span>
              <Link
                to="/pengajuan-mitra"
                onClick={() => setDemoMenuOpen(false)}
                className="font-semibold text-primary hover:underline"
              >
                + Pengajuan Baru
              </Link>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setDemoMenuOpen((v) => !v)}
          aria-expanded={demoMenuOpen}
          aria-label="Buka daftar akun demo"
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-4 text-xs font-semibold text-ink shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-colors hover:border-primary/50 hover:text-primary"
        >
          <KeyRound className="size-3.5 text-primary" />
          <span>Akun Demo</span>
        </button>
      </div>

      {/* Minimal footer */}
      <footer className="mx-auto w-full max-w-5xl text-center text-xs text-ink-muted">
        © {year} EVA — Empathetic Vitality Assistant
      </footer>
    </div>
  )
}
