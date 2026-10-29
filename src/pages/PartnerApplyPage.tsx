import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { LunaOrb } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  resubmitPartnerApplication,
  submitPartnerApplication,
  usePortalDb,
  type FacilityType,
  type PartnerAccount,
} from '@/lib/portalStore'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^(\+62|62|0)[0-9]{8,13}$/

const FACILITY_TYPES: FacilityType[] = [
  'Rumah Sakit',
  'Klinik Utama',
  'Klinik Pratama',
  'Biro Psikologi',
]

type WizardStep = 1 | 2 | 3

const STEP_META: Record<WizardStep, { title: string; shortLabel: string }> = {
  1: {
    title: 'Identitas & Izin Fasilitas Kesehatan',
    shortLabel: '1. Data Faskes',
  },
  2: {
    title: 'Penanggung Jawab & Operasional Layanan',
    shortLabel: '2. PIC & Layanan',
  },
  3: {
    title: 'Kredensial Login & Konfirmasi Pengajuan',
    shortLabel: '3. Akun & Kirim',
  },
}

const inputClass =
  'h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 text-sm text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-muted focus:border-primary focus:ring-3 focus:ring-primary/12'

const textareaClass =
  'w-full rounded-[8px] border border-[#CBD5E1] bg-white p-3.5 text-sm text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-muted focus:border-primary focus:ring-3 focus:ring-primary/12'

const inputErr = 'border-error focus:border-error focus:ring-error/12'

export function PartnerApplyPage() {
  const [searchParams] = useSearchParams()
  const revisionPartnerId = searchParams.get('revisi')
  const { db } = usePortalDb()

  const revisionTarget = useMemo(
    () =>
      revisionPartnerId
        ? db.partners.find((p) => p.id === revisionPartnerId) ?? null
        : null,
    [db.partners, revisionPartnerId],
  )

  const isRevisionMode = Boolean(revisionTarget)

  const [step, setStep] = useState<WizardStep>(1)
  const [highestReachedStep, setHighestReachedStep] = useState<WizardStep>(
    isRevisionMode ? 3 : 1,
  )

  // Step 1 fields: Facility identity & license
  const [facilityName, setFacilityName] = useState(revisionTarget?.facilityName ?? '')
  const [facilityType, setFacilityType] = useState<FacilityType>(
    revisionTarget?.facilityType ?? 'Rumah Sakit',
  )
  const [licenseNumber, setLicenseNumber] = useState(revisionTarget?.licenseNumber ?? '')
  const [city, setCity] = useState(revisionTarget?.city ?? '')
  const [address, setAddress] = useState(revisionTarget?.address ?? '')

  // Step 2 fields: PIC & operational details
  const [picName, setPicName] = useState(revisionTarget?.picName ?? '')
  const [picRole, setPicRole] = useState(revisionTarget?.picRole ?? '')
  const [phone, setPhone] = useState(revisionTarget?.phone ?? '')
  const [operatingHours, setOperatingHours] = useState(revisionTarget?.operatingHours ?? '')
  const [estimatedPsychologists, setEstimatedPsychologists] = useState(
    revisionTarget?.estimatedPsychologists !== undefined
      ? String(revisionTarget.estimatedPsychologists)
      : '',
  )
  const [website, setWebsite] = useState(revisionTarget?.website ?? '')
  const [bpjsSupported, setBpjsSupported] = useState(Boolean(revisionTarget?.bpjsSupported))

  // Step 3 fields: Credentials & notes
  const [email, setEmail] = useState(revisionTarget?.email ?? '')
  const [password, setPassword] = useState(revisionTarget?.password ?? '')
  const [showPassword, setShowPassword] = useState(false)
  const [notes, setNotes] = useState(revisionTarget?.notes ?? '')

  // Validation & submission state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submittedPartner, setSubmittedPartner] = useState<PartnerAccount | null>(null)

  const year = new Date().getFullYear()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const validateStep = (targetStep: WizardStep): boolean => {
    const nextErrors: Record<string, string> = {}

    if (targetStep === 1) {
      if (!facilityName.trim()) {
        nextErrors.facilityName = 'Nama fasilitas kesehatan wajib diisi.'
      }
      if (!licenseNumber.trim()) {
        nextErrors.licenseNumber = 'Nomor izin operasional / kode faskes wajib diisi.'
      }
      if (!city.trim()) {
        nextErrors.city = 'Kota / Kabupaten wajib diisi.'
      }
      if (!address.trim()) {
        nextErrors.address = 'Alamat lengkap instansi wajib diisi.'
      }
    }

    if (targetStep === 2) {
      if (!picName.trim()) {
        nextErrors.picName = 'Nama penanggung jawab (PIC) wajib diisi.'
      }
      if (!picRole.trim()) {
        nextErrors.picRole = 'Jabatan penanggung jawab wajib diisi.'
      }
      const cleanPhone = phone.trim().replace(/[\s-]/g, '')
      if (!PHONE_RE.test(cleanPhone)) {
        nextErrors.phone = 'Masukkan nomor telepon / WhatsApp instansi yang valid.'
      }
    }

    if (targetStep === 3) {
      if (!EMAIL_RE.test(email.trim())) {
        nextErrors.email = 'Masukkan alamat email resmi yang valid.'
      }
      if (!password || password.length < 6) {
        nextErrors.password = 'Kata sandi akun minimal 6 karakter.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleNextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    if (!validateStep(step)) return
    const next = (step + 1) as WizardStep
    setErrors({})
    setStep(next)
    if (next > highestReachedStep) {
      setHighestReachedStep(next)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setErrors({})
      setStep((step - 1) as WizardStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleJumpToStep = (target: WizardStep) => {
    if (target === step) return
    if (target < step || isRevisionMode || target <= highestReachedStep) {
      // If moving forward from current step in non-revision mode, validate current step first
      if (!isRevisionMode && target > step && !validateStep(step)) return
      setErrors({})
      setStep(target)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return

    if (step < 3) {
      handleNextStep()
      return
    }

    // Validate all steps before final submission
    if (!validateStep(1)) {
      setStep(1)
      return
    }
    if (!validateStep(2)) {
      setStep(2)
      return
    }
    if (!validateStep(3)) {
      return
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '')
    setSubmitting(true)

    window.setTimeout(() => {
      if (isRevisionMode && revisionTarget) {
        const updated = resubmitPartnerApplication(revisionTarget.id, {
          facilityName: facilityName.trim(),
          facilityType,
          licenseNumber: licenseNumber.trim(),
          city: city.trim(),
          address: address.trim(),
          picName: picName.trim(),
          picRole: picRole.trim(),
          phone: cleanPhone,
          email: email.trim(),
          password,
          website: website.trim() || undefined,
          operatingHours: operatingHours.trim() || undefined,
          estimatedPsychologists: estimatedPsychologists
            ? Number.parseInt(estimatedPsychologists, 10)
            : undefined,
          bpjsSupported,
          notes: notes.trim() || undefined,
        })
        setSubmitting(false)
        if (updated) {
          setSubmittedPartner(updated)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        return
      }

      const result = submitPartnerApplication({
        facilityName: facilityName.trim(),
        facilityType,
        licenseNumber: licenseNumber.trim(),
        city: city.trim(),
        address: address.trim(),
        picName: picName.trim(),
        picRole: picRole.trim(),
        phone: cleanPhone,
        email: email.trim(),
        password,
        website: website.trim() || undefined,
        operatingHours: operatingHours.trim() || undefined,
        estimatedPsychologists: estimatedPsychologists
          ? Number.parseInt(estimatedPsychologists, 10)
          : undefined,
        bpjsSupported,
        notes: notes.trim() || undefined,
      })

      setSubmitting(false)
      if (!result.ok) {
        setErrors({ email: result.error })
        return
      }
      setSubmittedPartner(result.partner)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 550)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col justify-between bg-[#F8F9FE] px-4 py-6 sm:px-6 sm:py-8">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Halaman Masuk</span>
        </Link>
        <Link to="/" className="text-xs font-medium text-ink-soft hover:text-primary">
          Beranda EVA
        </Link>
      </header>

      <main id="main-content" className="mx-auto my-6 w-full max-w-xl">
        {/* Compact Brand Title */}
        <div className="mb-5 flex flex-col items-center text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <LunaOrb className="size-10" />
            <span className="text-lg font-bold tracking-[-0.02em] text-ink">EVA</span>
          </Link>
          <h1 className="mt-2.5 text-[20px] font-semibold tracking-[-0.015em] text-ink">
            {isRevisionMode
              ? 'Perbaikan Pengajuan Mitra Faskes'
              : 'Pengajuan Mitra Fasilitas Kesehatan'}
          </h1>
          <p className="mt-1 max-w-md text-xs text-ink-soft">
            {isRevisionMode
              ? 'Perbarui data fasilitas kesehatan Anda sesuai catatan verifikasi Admin.'
              : 'Daftarkan Rumah Sakit, Klinik, atau Biro Psikologi Anda ke ekosistem EVA.'}
          </p>
        </div>

        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-7">
          {submittedPartner ? (
            <div role="status" className="py-2">
              <div className="flex items-start gap-3 rounded-[10px] border border-success/30 bg-success/5 p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                <div>
                  <h2 className="text-base font-semibold text-ink">
                    {isRevisionMode
                      ? 'Perbaikan Pengajuan Berhasil Dikirim Ulang'
                      : 'Pengajuan Kemitraan Berhasil Dikirim'}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    Data untuk{' '}
                    <strong className="font-semibold text-ink">
                      {submittedPartner.facilityName}
                    </strong>{' '}
                    telah masuk ke antrean verifikasi Admin EVA. Akun Anda akan aktif setelah izin
                    operasional faskes disetujui.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end">
                <Link
                  to="/login"
                  className="inline-flex h-10 items-center justify-center rounded-[8px] bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-[#464BB8]"
                >
                  Ke Halaman Masuk
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Step Selector Tabs */}
              <div className="mb-5 grid grid-cols-3 gap-1.5">
                {([1, 2, 3] as const).map((s) => {
                  const isCurrent = step === s
                  const isReachable = isRevisionMode || s <= highestReachedStep
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={!isReachable}
                      onClick={() => handleJumpToStep(s)}
                      className={cn(
                        'h-8 rounded-[6px] px-2 text-xs font-medium transition-colors',
                        isCurrent
                          ? 'bg-primary-container/70 font-semibold text-primary'
                          : isReachable
                            ? 'cursor-pointer bg-[#F8FAFC] text-ink-soft hover:bg-[#F1F5F9] hover:text-ink'
                            : 'cursor-not-allowed bg-[#F8FAFC] text-ink-muted/60',
                      )}
                    >
                      {STEP_META[s].shortLabel}
                    </button>
                  )
                })}
              </div>

              {/* Admin Rejection Notice (if in revision mode) */}
              {isRevisionMode && revisionTarget?.rejectionReason && (
                <div className="mb-5 flex items-start gap-2.5 rounded-[8px] border border-crisis-border bg-crisis-bg p-3 text-xs leading-relaxed text-crisis-text">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <span className="font-semibold">Catatan Admin: </span>
                    <span>{revisionTarget.rejectionReason}</span>
                  </div>
                </div>
              )}

              {/* STEP 1: IDENTITAS & IZIN FASKES (5 Inputs) */}
              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="facilityName"
                      className="mb-1.5 block text-xs font-medium text-ink"
                    >
                      Nama Instansi / Fasilitas Kesehatan <span className="text-error">*</span>
                    </label>
                    <input
                      id="facilityName"
                      type="text"
                      placeholder="Contoh: RSUP DR. SARDJITO / KLINIK PRATAMA SEHAT JIWA"
                      value={facilityName}
                      onChange={(e) => {
                        setFacilityName(e.target.value.toUpperCase())
                        clearError('facilityName')
                      }}
                      className={cn(
                        inputClass,
                        'uppercase placeholder:normal-case',
                        errors.facilityName && inputErr,
                      )}
                    />
                    {errors.facilityName && (
                      <p className="mt-1 text-xs text-error">{errors.facilityName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="facilityType"
                      className="mb-1.5 block text-xs font-medium text-ink"
                    >
                      Jenis Fasilitas Kesehatan <span className="text-error">*</span>
                    </label>
                    <select
                      id="facilityType"
                      value={facilityType}
                      onChange={(e) => setFacilityType(e.target.value as FacilityType)}
                      className={inputClass}
                    >
                      {FACILITY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-xs font-medium text-ink">
                      Kota / Kabupaten <span className="text-error">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Contoh: YOGYAKARTA / JAKARTA SELATAN"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value.toUpperCase())
                        clearError('city')
                      }}
                      className={cn(
                        inputClass,
                        'uppercase placeholder:normal-case',
                        errors.city && inputErr,
                      )}
                    />
                    {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="licenseNumber"
                      className="mb-1.5 block text-xs font-medium text-ink"
                    >
                      Nomor Izin Operasional / Kode Faskes Kemenkes{' '}
                      <span className="text-error">*</span>
                    </label>
                    <input
                      id="licenseNumber"
                      type="text"
                      placeholder="Contoh: 3471015/KEMENKES/RS-A/2024"
                      value={licenseNumber}
                      onChange={(e) => {
                        setLicenseNumber(e.target.value.toUpperCase())
                        clearError('licenseNumber')
                      }}
                      className={cn(
                        inputClass,
                        'uppercase placeholder:normal-case',
                        errors.licenseNumber && inputErr,
                      )}
                    />
                    {errors.licenseNumber && (
                      <p className="mt-1 text-xs text-error">{errors.licenseNumber}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="mb-1.5 block text-xs font-medium text-ink">
                      Alamat Lengkap Fasilitas Kesehatan <span className="text-error">*</span>
                    </label>
                    <input
                      id="address"
                      type="text"
                      placeholder="Nama jalan, nomor gedung, kecamatan, dan kode pos"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value)
                        clearError('address')
                      }}
                      className={cn(inputClass, errors.address && inputErr)}
                    />
                    {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
                  </div>
                </div>
              )}

              {/* STEP 2: PENANGGUNG JAWAB (PIC) & OPERASIONAL LAYANAN */}
              {step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="picName" className="mb-1.5 block text-xs font-medium text-ink">
                      Nama Lengkap &amp; Gelar PIC <span className="text-error">*</span>
                    </label>
                    <input
                      id="picName"
                      type="text"
                      placeholder="Contoh: dr. Hendra Wijaya, Sp.KJ"
                      value={picName}
                      onChange={(e) => {
                        setPicName(e.target.value)
                        clearError('picName')
                      }}
                      className={cn(inputClass, errors.picName && inputErr)}
                    />
                    {errors.picName && <p className="mt-1 text-xs text-error">{errors.picName}</p>}
                  </div>

                  <div>
                    <label htmlFor="picRole" className="mb-1.5 block text-xs font-medium text-ink">
                      Jabatan Struktural / Fungsional <span className="text-error">*</span>
                    </label>
                    <input
                      id="picRole"
                      type="text"
                      placeholder="Contoh: Kepala Poli Psikologi"
                      value={picRole}
                      onChange={(e) => {
                        setPicRole(e.target.value)
                        clearError('picRole')
                      }}
                      className={cn(inputClass, errors.picRole && inputErr)}
                    />
                    {errors.picRole && <p className="mt-1 text-xs text-error">{errors.picRole}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-ink">
                      Nomor Telepon / WhatsApp Resmi <span className="text-error">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        clearError('phone')
                      }}
                      className={cn(inputClass, errors.phone && inputErr)}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="estimatedPsychologists"
                      className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink"
                    >
                      <span>Estimasi Jumlah Psikolog</span>
                      <span className="font-normal text-ink-muted">(Opsional)</span>
                    </label>
                    <input
                      id="estimatedPsychologists"
                      type="number"
                      min={1}
                      max={200}
                      placeholder="Contoh: 5"
                      value={estimatedPsychologists}
                      onChange={(e) => setEstimatedPsychologists(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="operatingHours"
                      className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink"
                    >
                      <span>Jam Layanan Poli Psikologi</span>
                      <span className="font-normal text-ink-muted">(Opsional)</span>
                    </label>
                    <input
                      id="operatingHours"
                      type="text"
                      placeholder="Senin – Sabtu, 08.00 – 16.00"
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="website"
                      className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink"
                    >
                      <span>Situs Web Resmi Faskes</span>
                      <span className="font-normal text-ink-muted">(Opsional)</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      placeholder="https://nama-faskes.co.id"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2 pt-0.5">
                    <label
                      htmlFor="bpjsSupported"
                      className="inline-flex cursor-pointer select-none items-center gap-2 text-xs text-ink-soft"
                    >
                      <input
                        id="bpjsSupported"
                        type="checkbox"
                        checked={bpjsSupported}
                        onChange={(e) => setBpjsSupported(e.target.checked)}
                        className="size-3.5 cursor-pointer rounded-[4px] border-[#CBD5E1] accent-primary"
                      />
                      <span>
                        Fasilitas kesehatan melayani penjaminan BPJS Kesehatan{' '}
                        <span className="text-ink-muted">(Opsional)</span>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: KREDENSIAL AKUN LOGIN, CATATAN, & RINGKASAN SINGKAT */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Compact Summary of Step 1 & Step 2 */}
                  <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">
                        {facilityName.trim() || 'Nama Faskes'} ({facilityType})
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="cursor-pointer font-semibold text-primary hover:underline"
                      >
                        Ubah Data
                      </button>
                    </div>
                    <p className="mt-1 text-ink-soft">
                      Izin: {licenseNumber.trim() || '—'} · {city.trim() || '—'} · PIC:{' '}
                      {picName.trim() || '—'} ({phone.trim() || '—'})
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="apply-email"
                        className="mb-1.5 block text-xs font-medium text-ink"
                      >
                        Email Login Instansi <span className="text-error">*</span>
                      </label>
                      <input
                        id="apply-email"
                        type="email"
                        autoComplete="email"
                        placeholder="mitra@nama-rs.co.id"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          clearError('email')
                        }}
                        className={cn(inputClass, errors.email && inputErr)}
                      />
                      {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                    </div>

                    <div>
                      <label
                        htmlFor="apply-password"
                        className="mb-1.5 block text-xs font-medium text-ink"
                      >
                        Kata Sandi Akun <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="apply-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Minimal 6 karakter"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            clearError('password')
                          }}
                          className={cn(inputClass, 'pr-10', errors.password && inputErr)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={
                            showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                          }
                          className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-ink-soft hover:text-ink"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-error">{errors.password}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="notes"
                        className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink"
                      >
                        <span>Catatan Tambahan Layanan / Rujukan</span>
                        <span className="font-normal text-ink-muted">(Opsional)</span>
                      </label>
                      <textarea
                        id="notes"
                        rows={2}
                        placeholder="Informasi cakupan layanan konseling atau catatan untuk tim verifikasi EVA"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className={textareaClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Footer Actions */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#CBD5E1] bg-white px-4 text-xs font-semibold text-ink transition-colors hover:bg-[#F8FAFC]"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Sebelumnya</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-xs font-medium text-ink-soft transition-colors hover:text-ink"
                  >
                    Sudah mengajukan? Masuk
                  </Link>
                )}

                {step < 3 ? (
                  <button
                    key="wizard-next-btn"
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[8px] bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-[#464BB8]"
                  >
                    <span>Lanjutkan</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                ) : (
                  <button
                    key="wizard-submit-btn"
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[8px] bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-[#464BB8] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Menyimpan…</span>
                      </>
                    ) : (
                      <span>
                        {isRevisionMode
                          ? 'Simpan Perbaikan & Ajukan Ulang'
                          : 'Kirim Pengajuan Mitra'}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-4xl text-center text-xs text-ink-muted">
        © {year} EVA — Empathetic Vitality Assistant
      </footer>
    </div>
  )
}
