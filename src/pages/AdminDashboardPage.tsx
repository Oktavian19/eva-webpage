import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { LunaOrb } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  ADMIN_ACCOUNT,
  reviewPartnerApplication,
  setPortalSession,
  usePortalDb,
  type PartnerStatus,
} from '@/lib/portalStore'

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected'

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const { db, session } = usePortalDb()

  const [filter, setFilter] = useState<FilterTab>('pending')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(
    () => db.partners.find((p) => p.status === 'pending')?.id ?? db.partners[0]?.id ?? null,
  )

  // Rejection modal/box state
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState<string | null>(null)
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const counts = useMemo(() => {
    return {
      all: db.partners.length,
      pending: db.partners.filter((p) => p.status === 'pending').length,
      approved: db.partners.filter((p) => p.status === 'approved').length,
      rejected: db.partners.filter((p) => p.status === 'rejected').length,
      psychologists: db.psychologists.length,
    }
  }, [db])

  const filteredPartners = useMemo(() => {
    const q = search.trim().toLowerCase()
    return db.partners.filter((p) => {
      if (filter !== 'all' && p.status !== filter) return false
      if (!q) return true
      return (
        p.facilityName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.licenseNumber.toLowerCase().includes(q) ||
        p.picName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      )
    })
  }, [db.partners, filter, search])

  const selectedPartner = useMemo(
    () => db.partners.find((p) => p.id === selectedId) ?? filteredPartners[0] ?? null,
    [db.partners, selectedId, filteredPartners],
  )

  const partnerPsychologists = useMemo(
    () =>
      selectedPartner
        ? db.psychologists.filter((psy) => psy.partnerId === selectedPartner.id)
        : [],
    [db.psychologists, selectedPartner],
  )

  const handleSelectPartner = (id: string) => {
    setSelectedId(id)
    setShowRejectBox(false)
    setRejectReason('')
    setRejectError(null)
  }

  const handleApprove = (partnerId: string, facilityName: string) => {
    reviewPartnerApplication(partnerId, 'approved')
    setShowRejectBox(false)
    setFeedbackBanner(
      `Pengajuan "${facilityName}" telah disetujui. Akun faskes kini aktif dan dapat login ke Dasbor Mitra.`,
    )
  }

  const handleConfirmReject = (partnerId: string, facilityName: string) => {
    if (!rejectReason.trim() || rejectReason.trim().length < 10) {
      setRejectError('Mohon tuliskan alasan penolakan yang jelas (minimal 10 karakter) sebagai acuan perbaikan mitra.')
      return
    }
    reviewPartnerApplication(partnerId, 'rejected', rejectReason.trim())
    setShowRejectBox(false)
    setRejectReason('')
    setRejectError(null)
    setFeedbackBanner(
      `Pengajuan "${facilityName}" ditolak dengan catatan perbaikan. Mitra dapat memperbaiki data saat login.`,
    )
  }

  const handleSuspend = (partnerId: string, facilityName: string) => {
    reviewPartnerApplication(partnerId, 'suspended')
    setFeedbackBanner(`Akses akun "${facilityName}" telah dinonaktifkan sementara.`)
  }

  const handleLogout = () => {
    setPortalSession(null)
    navigate('/login')
  }

  return (
    <div className="min-h-[100dvh] bg-[#F8F9FE] text-ink">
      {/* Top Formal Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <LunaOrb className="size-8" />
              <span className="text-lg font-bold tracking-[-0.02em] text-ink">EVA</span>
            </Link>
            <span className="h-4 w-[1px] bg-[#CBD5E1]" />
            <span className="rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-ink">
              Portal Admin Verifikasi
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-ink">{ADMIN_ACCOUNT.name}</p>
              <p className="text-[11px] text-ink-muted">{session?.email ?? ADMIN_ACCOUNT.email}</p>
            </div>
            <Link
              to="/"
              className="hidden rounded-[8px] border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-[#F8FAFC] sm:inline-flex"
            >
              Lihat Landing Page
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-ink transition-colors hover:bg-[#F8FAFC]"
            >
              <LogOut className="size-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.015em] text-ink">
              Verifikasi &amp; Manajemen Mitra Fasilitas Kesehatan
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Tinjau permohonan kerja sama Rumah Sakit, Klinik, dan Biro Psikologi agar akun mitra
              dapat mengakses sistem EVA.
            </p>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackBanner && (
          <div
            role="status"
            className="mt-5 flex items-center justify-between gap-3 rounded-[10px] border border-primary/25 bg-primary-container/50 px-4 py-3 text-xs font-medium text-ink"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
              {feedbackBanner}
            </span>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="cursor-pointer text-xs font-semibold text-primary hover:underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between text-xs font-medium text-ink-soft">
              <span>Menunggu Verifikasi</span>
              <Clock className="size-4 text-warning" />
            </div>
            <p className="mt-2 text-2xl font-bold text-ink">{counts.pending}</p>
            <p className="mt-0.5 text-[11px] text-ink-muted">Permohonan perlu ditinjau</p>
          </div>

          <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between text-xs font-medium text-ink-soft">
              <span>Mitra Faskes Aktif</span>
              <ShieldCheck className="size-4 text-success" />
            </div>
            <p className="mt-2 text-2xl font-bold text-ink">{counts.approved}</p>
            <p className="mt-0.5 text-[11px] text-ink-muted">Terverifikasi &amp; dapat login</p>
          </div>

          <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between text-xs font-medium text-ink-soft">
              <span>Ditolak / Perlu Revisi</span>
              <AlertTriangle className="size-4 text-error" />
            </div>
            <p className="mt-2 text-2xl font-bold text-ink">{counts.rejected}</p>
            <p className="mt-0.5 text-[11px] text-ink-muted">Menunggu perbaikan mitra</p>
          </div>

          <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between text-xs font-medium text-ink-soft">
              <span>Total Psikolog Mitra</span>
              <Stethoscope className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-ink">{counts.psychologists}</p>
            <p className="mt-0.5 text-[11px] text-ink-muted">Terdaftar di seluruh faskes</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col justify-between gap-3 rounded-[12px] border border-[#E2E8F0] bg-white p-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist">
            {(
              [
                { id: 'pending', label: 'Menunggu Verifikasi', count: counts.pending },
                { id: 'approved', label: 'Disetujui (Aktif)', count: counts.approved },
                { id: 'rejected', label: 'Ditolak', count: counts.rejected },
                { id: 'all', label: 'Semua Faskes', count: counts.all },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    'inline-flex h-9 cursor-pointer items-center gap-2 rounded-[8px] px-3 text-xs font-semibold transition-colors',
                    active
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-ink-soft hover:bg-[#F8FAFC] hover:text-ink',
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      'rounded-[5px] px-1.5 py-0.5 text-[11px]',
                      active ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-ink-soft',
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              placeholder="Cari nama RS/Klinik, kota, izin…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white pr-3 pl-9 text-xs text-ink outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Main Master-Detail Grid */}
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[0.95fr_1.25fr]">
          {/* Left Column: Partner List */}
          <div className="overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white">
            <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-xs font-semibold text-ink-soft">
              Daftar Pengajuan Faskes ({filteredPartners.length})
            </div>

            {filteredPartners.length === 0 ? (
              <div className="p-8 text-center text-xs text-ink-muted">
                Tidak ada data fasilitas kesehatan pada kategori ini.
              </div>
            ) : (
              <ul className="divide-y divide-[#E2E8F0]">
                {filteredPartners.map((p) => {
                  const isSelected = selectedPartner?.id === p.id
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectPartner(p.id)}
                        className={cn(
                          'flex w-full cursor-pointer flex-col items-start gap-2 p-4 text-left transition-colors',
                          isSelected
                            ? 'bg-primary-container/35'
                            : 'bg-white hover:bg-[#F8FAFC]',
                        )}
                      >
                        <div className="flex w-full items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-sm font-semibold text-ink">
                                {p.facilityName}
                              </span>
                              {p.isResubmitted && (
                                <span className="inline-flex items-center gap-1 rounded-[5px] border border-primary/30 bg-primary-container px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                  <RefreshCw className="size-2.5" /> Perbaikan Data
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-ink-soft">
                              {p.facilityType} · {p.city}
                            </p>
                          </div>

                          <StatusBadge status={p.status} />
                        </div>

                        <div className="flex w-full flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted">
                          <span>Izin: {p.licenseNumber}</span>
                          <span>
                            {p.resubmittedAt
                              ? `Diperbaiki: ${p.resubmittedAt}`
                              : `Diajukan: ${p.submittedAt}`}
                          </span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Right Column: Detailed Inspection & Verification Actions */}
          {selectedPartner ? (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-[6px] bg-[#F1F5F9] px-2 py-0.5 text-xs font-semibold text-ink-soft">
                      {selectedPartner.facilityType}
                    </span>
                    {selectedPartner.isResubmitted && (
                      <span className="inline-flex items-center gap-1 rounded-[6px] border border-primary/30 bg-primary-container px-2 py-0.5 text-xs font-semibold text-primary">
                        <RefreshCw className="size-3" /> Pengajuan Ulang (Sudah Diperbaiki Mitra)
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-ink">
                    {selectedPartner.facilityName}
                  </h2>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Email Login Mitra: <strong className="text-ink">{selectedPartner.email}</strong>
                  </p>
                </div>

                <StatusBadge status={selectedPartner.status} />
              </div>

              {/* Action Bar for Admin Verification */}
              <div className="mt-5 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold text-ink">Keputusan Verifikasi Admin</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {selectedPartner.status === 'pending' &&
                    'Periksa kesesuaian Nomor Izin Operasional Faskes dan data PIC sebelum mengaktifkan akses login mitra.'}
                  {selectedPartner.status === 'approved' &&
                    'Akun fasilitas kesehatan ini sudah aktif dan dapat masuk ke Dasbor Mitra (/mitra).'}
                  {selectedPartner.status === 'rejected' &&
                    'Pengajuan ini berstatus ditolak. Mitra dapat memperbaiki data saat login atau Anda dapat langsung menyetujuinya.'}
                  {selectedPartner.status === 'suspended' &&
                    'Akun fasilitas kesehatan ini sedang dinonaktifkan sementara.'}
                </p>

                <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                  {selectedPartner.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleApprove(selectedPartner.id, selectedPartner.facilityName)
                      }
                      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] bg-success px-4 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                    >
                      <CheckCircle2 className="size-4" />
                      <span>Setujui &amp; Aktifkan Mitra</span>
                    </button>
                  )}

                  {selectedPartner.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowRejectBox((v) => !v)
                        setRejectError(null)
                      }}
                      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] border border-crisis-border bg-white px-3.5 text-xs font-semibold text-crisis-text transition-colors hover:bg-crisis-bg"
                    >
                      <XCircle className="size-4" />
                      <span>Tolak / Minta Perbaikan</span>
                    </button>
                  )}

                  {selectedPartner.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSuspend(selectedPartner.id, selectedPartner.facilityName)
                      }
                      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-[#F1F5F9] hover:text-ink"
                    >
                      Nonaktifkan Sementara
                    </button>
                  )}
                </div>

                {/* Rejection Reason Input Box */}
                {showRejectBox && (
                  <div className="mt-4 border-t border-[#E2E8F0] pt-4">
                    <label
                      htmlFor="reject-reason-input"
                      className="mb-1.5 block text-xs font-semibold text-ink"
                    >
                      Catatan Alasan Penolakan / Instruksi Perbaikan untuk Mitra{' '}
                      <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="reject-reason-input"
                      rows={3}
                      placeholder="Contoh: Nomor Izin Operasional Faskes belum mencantumkan tahun penerbitan resmi. Mohon perbarui nomor izin."
                      value={rejectReason}
                      onChange={(e) => {
                        setRejectReason(e.target.value)
                        if (rejectError) setRejectError(null)
                      }}
                      className="w-full rounded-[8px] border border-[#CBD5E1] bg-white p-3 text-xs text-ink outline-none focus:border-error"
                    />
                    {rejectError && <p className="mt-1 text-xs text-error">{rejectError}</p>}
                    <div className="mt-2.5 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRejectBox(false)}
                        className="h-8 cursor-pointer rounded-[6px] border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-ink-soft hover:text-ink"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleConfirmReject(selectedPartner.id, selectedPartner.facilityName)
                        }
                        className="h-8 cursor-pointer rounded-[6px] bg-error px-3.5 text-xs font-semibold text-white hover:opacity-95"
                      >
                        Kirim Penolakan
                      </button>
                    </div>
                  </div>
                )}

                {selectedPartner.status === 'rejected' && selectedPartner.rejectionReason && (
                  <div className="mt-3 rounded-[8px] border border-crisis-border bg-crisis-bg p-3 text-xs text-crisis-text">
                    <strong>Alasan Penolakan Saat Ini:</strong> {selectedPartner.rejectionReason}
                  </div>
                )}
              </div>

              {/* Complete Institution Data Grid */}
              <div className="mt-6">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ink-muted uppercase">
                  <Building2 className="size-3.5" /> Rincian Data Fasilitas Kesehatan
                </h3>

                <dl className="mt-3 grid gap-3.5 rounded-[10px] border border-[#E2E8F0] p-4 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-ink-muted">Nomor Izin Operasional / Kode Faskes</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {selectedPartner.licenseNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Kota / Kabupaten</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{selectedPartner.city}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-ink-muted">Alamat Lengkap</dt>
                    <dd className="mt-0.5 font-medium text-ink">{selectedPartner.address}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Penanggung Jawab (PIC)</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {selectedPartner.picName}
                    </dd>
                    <dd className="text-[11px] text-ink-soft">{selectedPartner.picRole}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Kontak Resmi Faskes</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{selectedPartner.phone}</dd>
                    <dd className="text-[11px] text-ink-soft">{selectedPartner.email}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Jam Operasional Poli Psikologi</dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      {selectedPartner.operatingHours || '— (Tidak dicantumkan)'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Estimasi Psikolog &amp; BPJS</dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      {selectedPartner.estimatedPsychologists
                        ? `${selectedPartner.estimatedPsychologists} Psikolog`
                        : '—'}{' '}
                      · {selectedPartner.bpjsSupported ? 'Menerima BPJS' : 'Non-BPJS / Umum'}
                    </dd>
                  </div>
                  {selectedPartner.website && (
                    <div className="sm:col-span-2">
                      <dt className="text-ink-muted">Situs Web Resmi</dt>
                      <dd className="mt-0.5">
                        <a
                          href={selectedPartner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          {selectedPartner.website}
                          <ExternalLink className="size-3" />
                        </a>
                      </dd>
                    </div>
                  )}
                  {selectedPartner.notes && (
                    <div className="sm:col-span-2">
                      <dt className="text-ink-muted">Catatan Instansi</dt>
                      <dd className="mt-0.5 rounded-[6px] bg-[#F8FAFC] p-2.5 text-ink-soft">
                        {selectedPartner.notes}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Psychologists under this partner */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ink-muted uppercase">
                    <Users className="size-3.5" /> Daftar Psikolog di Faskes Ini (
                    {partnerPsychologists.length})
                  </h3>
                </div>

                {partnerPsychologists.length === 0 ? (
                  <p className="mt-2.5 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs text-ink-muted">
                    Belum ada psikolog yang didaftarkan oleh fasilitas kesehatan ini.
                  </p>
                ) : (
                  <div className="mt-2.5 divide-y divide-[#E2E8F0] rounded-[10px] border border-[#E2E8F0]">
                    {partnerPsychologists.map((psy) => (
                      <div
                        key={psy.id}
                        className="flex flex-col justify-between gap-2 p-3.5 text-xs sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="font-semibold text-ink">{psy.fullName}</p>
                          <p className="mt-0.5 text-[11px] text-ink-soft">
                            SIPP: {psy.sippNumber} · {psy.practiceSchedule}
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {psy.specializations.map((sp) => (
                              <span
                                key={sp}
                                className="rounded-[4px] bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-medium text-ink-soft"
                              >
                                {sp}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span
                          className={cn(
                            'w-fit rounded-[5px] px-2 py-0.5 text-[11px] font-semibold',
                            psy.status === 'active' && 'bg-success/10 text-success',
                            psy.status === 'on_leave' && 'bg-warning/15 text-[#B45309]',
                            psy.status === 'inactive' && 'bg-[#F1F5F9] text-ink-muted',
                          )}
                        >
                          {psy.status === 'active'
                            ? 'Aktif Praktik'
                            : psy.status === 'on_leave'
                              ? 'Sedang Cuti'
                              : 'Nonaktif'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-8 text-center text-xs text-ink-muted">
              Pilih salah satu fasilitas kesehatan di sebelah kiri untuk melihat detail pengajuan.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: PartnerStatus }) {
  if (status === 'pending') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-[#B45309]">
        <Clock className="size-3" /> Menunggu Verifikasi
      </span>
    )
  }
  if (status === 'approved') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
        <CheckCircle2 className="size-3" /> Disetujui
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-crisis-border bg-crisis-bg px-2 py-0.5 text-[11px] font-semibold text-crisis-text">
        <XCircle className="size-3" /> Ditolak
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#CBD5E1] bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
      Nonaktif
    </span>
  )
}

