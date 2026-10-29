import {
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Edit3,
  LogOut,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { LunaOrb } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  assignReferral,
  CLINICAL_SPECIALIZATIONS,
  deletePsychologist,
  setPortalSession,
  updatePartnerFacilityProfile,
  updatePsychologistStatus,
  upsertPsychologist,
  usePortalDb,
  type FacilityType,
  type Psychologist,
  type PsychologistStatus,
  type ReferralStatus,
} from '@/lib/portalStore'

type PartnerTab = 'psychologists' | 'referrals' | 'profile'

const inputClass =
  'h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 text-sm text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-muted focus:border-primary focus:ring-3 focus:ring-primary/12'

export function PartnerDashboardPage() {
  const navigate = useNavigate()
  const { db, session } = usePortalDb()

  // Resolve active partner (from session, or fallback to first approved partner for direct preview)
  const partner = useMemo(() => {
    if (session?.partnerId) {
      const found = db.partners.find((p) => p.id === session.partnerId)
      if (found) return found
    }
    return db.partners.find((p) => p.status === 'approved') ?? db.partners[0]
  }, [db.partners, session])

  const [activeTab, setActiveTab] = useState<PartnerTab>('psychologists')
  const [banner, setBanner] = useState<string | null>(null)

  // Psychologist management filter/search state
  const [psySearch, setPsySearch] = useState('')
  const [psyStatusFilter, setPsyStatusFilter] = useState<'all' | PsychologistStatus>('all')

  // Psychologist modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPsy, setEditingPsy] = useState<Psychologist | null>(null)
  const [fullName, setFullName] = useState('')
  const [sippNumber, setSippNumber] = useState('')
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [practiceSchedule, setPracticeSchedule] = useState('')
  const [psyStatus, setPsyStatus] = useState<PsychologistStatus>('active')
  const [weeklyQuota, setWeeklyQuota] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [education, setEducation] = useState('')
  const [psyErrors, setPsyErrors] = useState<Record<string, string>>({})

  // Facility profile state
  const [profFacilityName, setProfFacilityName] = useState(partner?.facilityName ?? '')
  const [profFacilityType, setProfFacilityType] = useState<FacilityType>(
    partner?.facilityType ?? 'Rumah Sakit',
  )
  const [profLicense, setProfLicense] = useState(partner?.licenseNumber ?? '')
  const [profCity, setProfCity] = useState(partner?.city ?? '')
  const [profAddress, setProfAddress] = useState(partner?.address ?? '')
  const [profPicName, setProfPicName] = useState(partner?.picName ?? '')
  const [profPicRole, setProfPicRole] = useState(partner?.picRole ?? '')
  const [profPhone, setProfPhone] = useState(partner?.phone ?? '')
  const [profOperatingHours, setProfOperatingHours] = useState(partner?.operatingHours ?? '')
  const [profWebsite, setProfWebsite] = useState(partner?.website ?? '')
  const [profBpjs, setProfBpjs] = useState(Boolean(partner?.bpjsSupported))
  const [profAccepting, setProfAccepting] = useState(Boolean(partner?.acceptingReferrals))
  const [profNotes, setProfNotes] = useState(partner?.notes ?? '')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const psychologists = useMemo(
    () => (partner ? db.psychologists.filter((p) => p.partnerId === partner.id) : []),
    [db.psychologists, partner],
  )

  const filteredPsychologists = useMemo(() => {
    const q = psySearch.trim().toLowerCase()
    return psychologists.filter((p) => {
      if (psyStatusFilter !== 'all' && p.status !== psyStatusFilter) return false
      if (!q) return true
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.sippNumber.toLowerCase().includes(q) ||
        p.specializations.some((s) => s.toLowerCase().includes(q))
      )
    })
  }, [psychologists, psySearch, psyStatusFilter])

  const referrals = useMemo(
    () => (partner ? db.referrals.filter((r) => r.partnerId === partner.id) : []),
    [db.referrals, partner],
  )

  const openAddModal = () => {
    setEditingPsy(null)
    setFullName('')
    setSippNumber('')
    setSelectedSpecs([CLINICAL_SPECIALIZATIONS[0]])
    setPracticeSchedule('')
    setPsyStatus('active')
    setWeeklyQuota('')
    setYearsExperience('')
    setEducation('')
    setPsyErrors({})
    setModalOpen(true)
  }

  const openEditModal = (psy: Psychologist) => {
    setEditingPsy(psy)
    setFullName(psy.fullName)
    setSippNumber(psy.sippNumber)
    setSelectedSpecs(psy.specializations)
    setPracticeSchedule(psy.practiceSchedule)
    setPsyStatus(psy.status)
    setWeeklyQuota(psy.weeklyQuota !== undefined ? String(psy.weeklyQuota) : '')
    setYearsExperience(psy.yearsExperience !== undefined ? String(psy.yearsExperience) : '')
    setEducation(psy.education ?? '')
    setPsyErrors({})
    setModalOpen(true)
  }

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec],
    )
    if (psyErrors.specializations) {
      setPsyErrors((prev) => {
        const next = { ...prev }
        delete next.specializations
        return next
      })
    }
  }

  const handleSavePsychologist = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!partner) return

    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = 'Nama lengkap dan gelar psikolog wajib diisi.'
    if (!sippNumber.trim()) errs.sippNumber = 'Nomor SIPP / STR HIMPSI wajib diisi.'
    if (selectedSpecs.length === 0) errs.specializations = 'Pilih minimal 1 spesialisasi klinis.'
    if (!practiceSchedule.trim()) errs.practiceSchedule = 'Hari dan jam praktik wajib diisi.'

    if (Object.keys(errs).length > 0) {
      setPsyErrors(errs)
      return
    }

    upsertPsychologist({
      id: editingPsy?.id,
      partnerId: partner.id,
      fullName: fullName.trim(),
      sippNumber: sippNumber.trim(),
      specializations: selectedSpecs,
      practiceSchedule: practiceSchedule.trim(),
      status: psyStatus,
      weeklyQuota: weeklyQuota ? Number.parseInt(weeklyQuota, 10) : undefined,
      yearsExperience: yearsExperience ? Number.parseInt(yearsExperience, 10) : undefined,
      education: education.trim() || undefined,
    })

    setModalOpen(false)
    setBanner(
      editingPsy
        ? `Data psikolog "${fullName.trim()}" berhasil diperbarui.`
        : `Psikolog "${fullName.trim()}" berhasil ditambahkan ke daftar praktik faskes.`,
    )
  }

  const handleDeletePsychologist = (psy: Psychologist) => {
    deletePsychologist(psy.id)
    setBanner(`Data psikolog "${psy.fullName}" telah dihapus dari daftar faskes.`)
  }

  const handleSaveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!partner) return

    updatePartnerFacilityProfile(partner.id, {
      facilityName: profFacilityName.trim() || partner.facilityName,
      facilityType: profFacilityType,
      licenseNumber: profLicense.trim() || partner.licenseNumber,
      city: profCity.trim() || partner.city,
      address: profAddress.trim() || partner.address,
      picName: profPicName.trim() || partner.picName,
      picRole: profPicRole.trim() || partner.picRole,
      phone: profPhone.trim() || partner.phone,
      operatingHours: profOperatingHours.trim() || undefined,
      website: profWebsite.trim() || undefined,
      bpjsSupported: profBpjs,
      acceptingReferrals: profAccepting,
      notes: profNotes.trim() || undefined,
    })
    setBanner('Profil dan status operasional fasilitas kesehatan berhasil disimpan.')
  }

  const handleLogout = () => {
    setPortalSession(null)
    navigate('/login')
  }

  if (!partner) {
    return null
  }

  const activeCount = psychologists.filter((p) => p.status === 'active').length
  const leaveCount = psychologists.filter((p) => p.status === 'on_leave').length
  const unassignedReferrals = referrals.filter((r) => r.status === 'unassigned').length

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
              Portal Mitra Faskes
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-ink">{partner.facilityName}</p>
              <p className="text-[11px] text-ink-muted">
                {partner.facilityType} · {partner.city}
              </p>
            </div>
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
        {/* Facility Header Summary */}
        <div className="flex flex-col justify-between gap-4 rounded-[12px] border border-[#E2E8F0] bg-white p-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-[5px] bg-primary-container px-2 py-0.5 text-xs font-semibold text-primary">
                {partner.facilityType}
              </span>
              <span className="text-xs text-ink-muted">Izin: {partner.licenseNumber}</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-[5px] px-2 py-0.5 text-xs font-semibold',
                  partner.acceptingReferrals
                    ? 'bg-success/10 text-success'
                    : 'bg-[#F1F5F9] text-ink-muted',
                )}
              >
                {partner.acceptingReferrals
                  ? '● Menerima Rujukan Pasien EVA'
                  : '○ Rujukan Baru Dijeda'}
              </span>
            </div>
            <h1 className="mt-1.5 text-xl font-semibold tracking-[-0.015em] text-ink">
              {partner.facilityName}
            </h1>
            <p className="mt-0.5 text-xs text-ink-soft">
              PIC: {partner.picName} ({partner.picRole}) · {partner.address}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-center">
              <p className="text-lg font-bold text-ink">{activeCount}</p>
              <p className="text-[11px] text-ink-soft">Psikolog Aktif</p>
            </div>
            <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-center">
              <p className="text-lg font-bold text-ink">{leaveCount}</p>
              <p className="text-[11px] text-ink-soft">Sedang Cuti</p>
            </div>
            <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-center">
              <p className="text-lg font-bold text-primary">{unassignedReferrals}</p>
              <p className="text-[11px] text-ink-soft">Rujukan Baru</p>
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {banner && (
          <div
            role="status"
            className="mt-5 flex items-center justify-between gap-3 rounded-[10px] border border-primary/25 bg-primary-container/50 px-4 py-3 text-xs font-medium text-ink"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
              {banner}
            </span>
            <button
              type="button"
              onClick={() => setBanner(null)}
              className="cursor-pointer text-xs font-semibold text-primary hover:underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          className="mt-6 flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'psychologists'}
            onClick={() => setActiveTab('psychologists')}
            className={cn(
              'inline-flex h-10 cursor-pointer items-center gap-2 rounded-[8px] px-4 text-xs font-semibold transition-colors',
              activeTab === 'psychologists'
                ? 'bg-primary text-white'
                : 'bg-white text-ink-soft border border-[#E2E8F0] hover:text-ink',
            )}
          >
            <Stethoscope className="size-4" />
            <span>Manajemen Psikolog ({psychologists.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'referrals'}
            onClick={() => setActiveTab('referrals')}
            className={cn(
              'inline-flex h-10 cursor-pointer items-center gap-2 rounded-[8px] px-4 text-xs font-semibold transition-colors',
              activeTab === 'referrals'
                ? 'bg-primary text-white'
                : 'bg-white text-ink-soft border border-[#E2E8F0] hover:text-ink',
            )}
          >
            <ClipboardList className="size-4" />
            <span>Rujukan Pasien EVA ({referrals.length})</span>
            {unassignedReferrals > 0 && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  activeTab === 'referrals'
                    ? 'bg-white text-primary'
                    : 'bg-primary text-white',
                )}
              >
                {unassignedReferrals} baru
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            className={cn(
              'inline-flex h-10 cursor-pointer items-center gap-2 rounded-[8px] px-4 text-xs font-semibold transition-colors',
              activeTab === 'profile'
                ? 'bg-primary text-white'
                : 'bg-white text-ink-soft border border-[#E2E8F0] hover:text-ink',
            )}
          >
            <Building2 className="size-4" />
            <span>Profil &amp; Operasional Faskes</span>
          </button>
        </div>

        {/* TAB 1: MANAJEMEN PSIKOLOG */}
        {activeTab === 'psychologists' && (
          <section className="mt-6" aria-label="Manajemen Psikolog">
            <div className="flex flex-col justify-between gap-3 rounded-[12px] border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { id: 'all', label: 'Semua Status' },
                    { id: 'active', label: 'Aktif Praktik' },
                    { id: 'on_leave', label: 'Sedang Cuti' },
                    { id: 'inactive', label: 'Nonaktif' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPsyStatusFilter(item.id)}
                    className={cn(
                      'h-8 cursor-pointer rounded-[6px] px-3 text-xs font-semibold transition-colors',
                      psyStatusFilter === item.id
                        ? 'bg-[#191C1F] text-white'
                        : 'bg-[#F1F5F9] text-ink-soft hover:text-ink',
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative flex-1 sm:w-64">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="search"
                    placeholder="Cari nama, SIPP, spesialisasi…"
                    value={psySearch}
                    onChange={(e) => setPsySearch(e.target.value)}
                    className="h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white pr-3 pl-9 text-xs text-ink outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-[#464BB8]"
                >
                  <Plus className="size-4" />
                  <span>Tambah Psikolog</span>
                </button>
              </div>
            </div>

            {filteredPsychologists.length === 0 ? (
              <div className="mt-4 rounded-[12px] border border-[#E2E8F0] bg-white p-10 text-center">
                <p className="text-sm font-semibold text-ink">Belum ada data psikolog yang sesuai</p>
                <p className="mt-1 text-xs text-ink-soft">
                  Tambahkan psikolog klinis yang berpraktik di fasilitas kesehatan Anda.
                </p>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-4 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] bg-primary px-4 text-xs font-semibold text-white hover:bg-[#464BB8]"
                >
                  <Plus className="size-4" /> Tambah Psikolog Pertama
                </button>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold tracking-wider text-ink-muted uppercase">
                        <th className="px-4 py-3.5">Nama &amp; Pendidikan</th>
                        <th className="px-4 py-3.5">Nomor SIPP / STR</th>
                        <th className="px-4 py-3.5">Spesialisasi Klinis</th>
                        <th className="px-4 py-3.5">Jadwal &amp; Kuota</th>
                        <th className="px-4 py-3.5">Status Praktik</th>
                        <th className="px-4 py-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filteredPsychologists.map((psy) => (
                        <tr key={psy.id} className="hover:bg-[#F8FAFC]/70">
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-ink">{psy.fullName}</p>
                            <p className="mt-0.5 text-[11px] text-ink-soft">
                              {psy.education || 'Psikolog Klinis'}
                              {psy.yearsExperience ? ` · ${psy.yearsExperience} thn praktik` : ''}
                            </p>
                          </td>
                          <td className="px-4 py-4 align-top font-mono text-xs text-ink">
                            {psy.sippNumber}
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex max-w-xs flex-wrap gap-1">
                              {psy.specializations.map((sp) => (
                                <span
                                  key={sp}
                                  className="rounded-[5px] border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[11px] font-medium text-ink-soft"
                                >
                                  {sp}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <p className="inline-flex items-center gap-1 font-medium text-ink">
                              <Calendar className="size-3.5 text-ink-muted" />
                              {psy.practiceSchedule}
                            </p>
                            {psy.weeklyQuota && (
                              <p className="mt-0.5 text-[11px] text-ink-muted">
                                Kuota rujukan: {psy.weeklyQuota} pasien/minggu
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4 align-top">
                            <select
                              aria-label={`Ubah status ${psy.fullName}`}
                              value={psy.status}
                              onChange={(e) =>
                                updatePsychologistStatus(
                                  psy.id,
                                  e.target.value as PsychologistStatus,
                                )
                              }
                              className={cn(
                                'h-8 cursor-pointer rounded-[6px] border px-2.5 text-xs font-semibold outline-none',
                                psy.status === 'active' &&
                                  'border-success/30 bg-success/10 text-success',
                                psy.status === 'on_leave' &&
                                  'border-warning/30 bg-warning/10 text-[#B45309]',
                                psy.status === 'inactive' &&
                                  'border-[#CBD5E1] bg-[#F1F5F9] text-ink-soft',
                              )}
                            >
                              <option value="active">Aktif Praktik</option>
                              <option value="on_leave">Sedang Cuti</option>
                              <option value="inactive">Nonaktif</option>
                            </select>
                          </td>
                          <td className="px-4 py-4 align-top text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditModal(psy)}
                                aria-label={`Edit ${psy.fullName}`}
                                className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-[6px] border border-[#CBD5E1] bg-white px-2.5 text-xs font-semibold text-ink hover:bg-[#F8FAFC]"
                              >
                                <Edit3 className="size-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePsychologist(psy)}
                                aria-label={`Hapus ${psy.fullName}`}
                                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-[6px] border border-[#CBD5E1] bg-white text-ink-soft transition-colors hover:border-crisis-border hover:bg-crisis-bg hover:text-crisis-text"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: RUJUKAN PASIEN EVA (CLINICAL INTAKE SUMMARY DASS-21) */}
        {activeTab === 'referrals' && (
          <section className="mt-6 space-y-4" aria-label="Rujukan Pasien EVA">
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-4">
              <h2 className="text-sm font-semibold text-ink">
                Daftar Rujukan Klinis Pasien EVA (DASS-21 Intake Summary)
              </h2>
              <p className="mt-0.5 text-xs text-ink-soft">
                Ringkasan kondisi awal di bawah ini dikirim atas persetujuan pengguna aplikasi EVA
                tanpa menyertakan transkrip obrolan pribadi. Tugaskan psikolog aktif untuk
                menjadwalkan sesi konsultasi.
              </p>
            </div>

            {referrals.length === 0 ? (
              <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-10 text-center text-xs text-ink-muted">
                Belum ada rujukan pasien yang masuk ke fasilitas kesehatan Anda.
              </div>
            ) : (
              <div className="grid gap-4">
                {referrals.map((ref) => {
                  const assignedPsy = psychologists.find(
                    (p) => p.id === ref.assignedPsychologistId,
                  )
                  return (
                    <div
                      key={ref.id}
                      className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E2E8F0] pb-3.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-ink">
                              {ref.patientCode}
                            </span>
                            <span className="rounded-[5px] bg-[#F1F5F9] px-2 py-0.5 text-xs font-medium text-ink-soft">
                              {ref.gender}, {ref.age} tahun
                            </span>
                            <span
                              className={cn(
                                'rounded-[5px] px-2 py-0.5 text-xs font-semibold',
                                ref.dass21.severity === 'Severe' ||
                                  ref.dass21.severity === 'Extreme'
                                  ? 'border border-crisis-border bg-crisis-bg text-crisis-text'
                                  : 'border border-warning/30 bg-warning/10 text-[#B45309]',
                              )}
                            >
                              DASS-21: {ref.dass21.severity}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-ink-muted">
                            Tanggal Rujukan: {ref.submittedAt} · Preferensi Jadwal:{' '}
                            <strong className="text-ink">{ref.preferredSchedule}</strong>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1">
                            Depresi: <strong>{ref.dass21.depression}</strong>
                          </span>
                          <span className="rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1">
                            Kecemasan: <strong>{ref.dass21.anxiety}</strong>
                          </span>
                          <span className="rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1">
                            Stres: <strong>{ref.dass21.stress}</strong>
                          </span>
                        </div>
                      </div>

                      <p className="mt-3.5 text-xs leading-relaxed text-ink-soft">
                        <strong className="text-ink">Ringkasan Pra-Konseling: </strong>
                        {ref.clinicalSummary}
                      </p>

                      <div className="mt-4 flex flex-col justify-between gap-3 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2 text-xs">
                          <UserCheck className="size-4 text-primary" />
                          <span className="text-ink-soft">Psikolog Penanggung Jawab:</span>
                          <span className="font-semibold text-ink">
                            {assignedPsy ? assignedPsy.fullName : 'Belum ditugaskan'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            aria-label={`Pilih psikolog untuk ${ref.patientCode}`}
                            value={ref.assignedPsychologistId ?? ''}
                            onChange={(e) => {
                              const nextPsyId = e.target.value || null
                              const nextStatus: ReferralStatus = nextPsyId
                                ? ref.status === 'unassigned'
                                  ? 'scheduled'
                                  : ref.status
                                : 'unassigned'
                              assignReferral(ref.id, nextPsyId, nextStatus)
                              setBanner(
                                `Penugasan psikolog untuk rujukan ${ref.patientCode} diperbarui.`,
                              )
                            }}
                            className="h-8 rounded-[6px] border border-[#CBD5E1] bg-white px-2.5 text-xs font-medium text-ink outline-none focus:border-primary"
                          >
                            <option value="">— Pilih Psikolog Faskes —</option>
                            {psychologists
                              .filter((p) => p.status === 'active')
                              .map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.fullName}
                                </option>
                              ))}
                          </select>

                          <select
                            aria-label={`Status rujukan ${ref.patientCode}`}
                            value={ref.status}
                            onChange={(e) => {
                              assignReferral(
                                ref.id,
                                ref.assignedPsychologistId,
                                e.target.value as ReferralStatus,
                              )
                            }}
                            className={cn(
                              'h-8 rounded-[6px] border px-2.5 text-xs font-semibold outline-none',
                              ref.status === 'unassigned' &&
                                'border-warning/30 bg-warning/10 text-[#B45309]',
                              ref.status === 'scheduled' &&
                                'border-primary/30 bg-primary-container text-primary',
                              ref.status === 'completed' &&
                                'border-success/30 bg-success/10 text-success',
                            )}
                          >
                            <option value="unassigned">Menunggu Penugasan</option>
                            <option value="scheduled">Terjadwal</option>
                            <option value="completed">Sesi Selesai</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: PROFIL & OPERASIONAL FASKES */}
        {activeTab === 'profile' && (
          <section className="mt-6" aria-label="Profil dan Operasional Faskes">
            <form
              onSubmit={handleSaveProfile}
              className="rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-8"
            >
              <div className="border-b border-[#E2E8F0] pb-4">
                <h2 className="text-base font-semibold text-ink">
                  Pengaturan Profil &amp; Operasional Fasilitas Kesehatan
                </h2>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Perbarui informasi layanan poli psikologi dan status penerimaan rujukan pasien dari
                  aplikasi EVA.
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-ink">
                    Nama Fasilitas Kesehatan <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={profFacilityName}
                    onChange={(e) => setProfFacilityName(e.target.value.toUpperCase())}
                    className={cn(inputClass, 'uppercase placeholder:normal-case')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink">
                    Jenis Fasilitas Kesehatan
                  </label>
                  <select
                    value={profFacilityType}
                    onChange={(e) => setProfFacilityType(e.target.value as FacilityType)}
                    className={inputClass}
                  >
                    <option value="Rumah Sakit">Rumah Sakit</option>
                    <option value="Klinik Utama">Klinik Utama</option>
                    <option value="Klinik Pratama">Klinik Pratama</option>
                    <option value="Biro Psikologi">Biro Psikologi</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink">
                    Nomor Izin Operasional / Kode Faskes
                  </label>
                  <input
                    type="text"
                    value={profLicense}
                    onChange={(e) => setProfLicense(e.target.value.toUpperCase())}
                    className={cn(inputClass, 'uppercase placeholder:normal-case')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink">
                    Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    value={profCity}
                    onChange={(e) => setProfCity(e.target.value.toUpperCase())}
                    className={cn(inputClass, 'uppercase placeholder:normal-case')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink">
                    Nomor Telepon / WhatsApp Pendaftaran
                  </label>
                  <input
                    type="tel"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-ink">
                    Alamat Lengkap Fasilitas Kesehatan
                  </label>
                  <input
                    type="text"
                    value={profAddress}
                    onChange={(e) => setProfAddress(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    value={profPicName}
                    onChange={(e) => setProfPicName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink">Jabatan PIC</label>
                  <input
                    type="text"
                    value={profPicRole}
                    onChange={(e) => setProfPicRole(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink">
                    <span>Jam Operasional Poli Psikologi</span>
                    <span className="font-normal text-ink-muted">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Senin – Sabtu, 08.00 – 16.00 WIB"
                    value={profOperatingHours}
                    onChange={(e) => setProfOperatingHours(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink">
                    <span>Situs Web Resmi Faskes</span>
                    <span className="font-normal text-ink-muted">(Opsional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://nama-faskes.co.id"
                    value={profWebsite}
                    onChange={(e) => setProfWebsite(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2 space-y-2.5 pt-1">
                  <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs text-ink">
                    <input
                      type="checkbox"
                      checked={profAccepting}
                      onChange={(e) => setProfAccepting(e.target.checked)}
                      className="size-4 cursor-pointer rounded-[4px] border-[#CBD5E1] accent-primary"
                    />
                    <span className="font-medium">
                      Fasilitas kesehatan aktif menerima rujukan pasien baru dari aplikasi EVA
                    </span>
                  </label>

                  <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs text-ink-soft">
                    <input
                      type="checkbox"
                      checked={profBpjs}
                      onChange={(e) => setProfBpjs(e.target.checked)}
                      className="size-4 cursor-pointer rounded-[4px] border-[#CBD5E1] accent-primary"
                    />
                    <span>Melayani penjaminan BPJS Kesehatan (Opsional)</span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink">
                    <span>Catatan Layanan Faskes</span>
                    <span className="font-normal text-ink-muted">(Opsional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={profNotes}
                    onChange={(e) => setProfNotes(e.target.value)}
                    className="w-full rounded-[8px] border border-[#CBD5E1] bg-white p-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-[#E2E8F0] pt-4">
                <button
                  type="submit"
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[8px] bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#464BB8]"
                >
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      {/* Modal Tambah / Edit Psikolog */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="psy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 p-4"
        >
          <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
              <h2 id="psy-modal-title" className="text-base font-semibold text-ink">
                {editingPsy ? 'Edit Data Psikolog Klinis' : 'Tambah Psikolog Klinis Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Tutup modal"
                className="flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-ink-soft hover:bg-[#F1F5F9] hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSavePsychologist} noValidate className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Nama Lengkap &amp; Gelar Psikolog <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ayu Kartika Sari, M.Psi., Psikolog"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (psyErrors.fullName) setPsyErrors((p) => ({ ...p, fullName: '' }))
                  }}
                  className={inputClass}
                />
                {psyErrors.fullName && (
                  <p className="mt-1 text-xs text-error">{psyErrors.fullName}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink">
                    Nomor SIPP / STR (HIMPSI) <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 20190412-2024-02-0814"
                    value={sippNumber}
                    onChange={(e) => {
                      setSippNumber(e.target.value.toUpperCase())
                      if (psyErrors.sippNumber) setPsyErrors((p) => ({ ...p, sippNumber: '' }))
                    }}
                    className={cn(inputClass, 'uppercase placeholder:normal-case')}
                  />
                  {psyErrors.sippNumber && (
                    <p className="mt-1 text-xs text-error">{psyErrors.sippNumber}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink">
                    Status Praktik <span className="text-error">*</span>
                  </label>
                  <select
                    value={psyStatus}
                    onChange={(e) => setPsyStatus(e.target.value as PsychologistStatus)}
                    className={inputClass}
                  >
                    <option value="active">Aktif Praktik</option>
                    <option value="on_leave">Sedang Cuti</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Spesialisasi Klinis <span className="text-error">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CLINICAL_SPECIALIZATIONS.map((spec) => {
                    const active = selectedSpecs.includes(spec)
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={cn(
                          'cursor-pointer rounded-[6px] border px-2.5 py-1 text-xs font-medium transition-colors',
                          active
                            ? 'border-primary bg-primary text-white'
                            : 'border-[#CBD5E1] bg-white text-ink-soft hover:text-ink',
                        )}
                      >
                        {spec}
                      </button>
                    )
                  })}
                </div>
                {psyErrors.specializations && (
                  <p className="mt-1 text-xs text-error">{psyErrors.specializations}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Hari &amp; Jam Praktik <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Senin, Rabu, Jumat (08.30 – 15.00 WIB)"
                  value={practiceSchedule}
                  onChange={(e) => {
                    setPracticeSchedule(e.target.value)
                    if (psyErrors.practiceSchedule)
                      setPsyErrors((p) => ({ ...p, practiceSchedule: '' }))
                  }}
                  className={inputClass}
                />
                {psyErrors.practiceSchedule && (
                  <p className="mt-1 text-xs text-error">{psyErrors.practiceSchedule}</p>
                )}
              </div>

              <div className="grid gap-4 border-t border-[#E2E8F0] pt-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink">
                    <span>Kuota Rujukan / Minggu</span>
                    <span className="font-normal text-ink-muted">(Opsional)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Contoh: 10"
                    value={weeklyQuota}
                    onChange={(e) => setWeeklyQuota(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink">
                    <span>Pengalaman Praktik (Tahun)</span>
                    <span className="font-normal text-ink-muted">(Opsional)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    placeholder="Contoh: 5"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink">
                    <span>Pendidikan Profesi Terakhir</span>
                    <span className="font-normal text-ink-muted">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Magister Profesi Psikologi Klinis UGM"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-[#E2E8F0] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-9 cursor-pointer rounded-[8px] border border-[#CBD5E1] bg-white px-4 text-xs font-semibold text-ink hover:bg-[#F8FAFC]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 cursor-pointer rounded-[8px] bg-primary px-5 text-xs font-semibold text-white hover:bg-[#464BB8]"
                >
                  {editingPsy ? 'Simpan Perubahan' : 'Tambahkan Psikolog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

