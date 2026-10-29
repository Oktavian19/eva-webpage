import { Search, Smartphone } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  PsychologistKpiCards,
  type PsyFilterTab,
} from './psychologists/PsychologistKpiCards'
import { PsychologistTable } from './psychologists/PsychologistTable'
import { PsychologistDetailModal } from './psychologists/PsychologistDetailModal'
import { DEMO_CONFIG } from '@/config/demoConfig'
import { SimulateMobilePsyModal } from '@/demo/features/SimulateMobilePsyModal'
import { cn } from '@/lib/cn'
import { reviewIndependentPsychologist, type PartnerAccount, type Psychologist } from '@/lib/portalStore'

interface AdminPsychologistsModuleProps {
  psychologists: Psychologist[]
  partners: PartnerAccount[]
  onFeedback: (msg: string) => void
}

export function AdminPsychologistsModule({
  psychologists,
  partners,
  onFeedback,
}: AdminPsychologistsModuleProps) {
  const [activeFilter, setActiveFilter] = useState<PsyFilterTab>('all')
  const [search, setSearch] = useState('')
  const [selectedPsy, setSelectedPsy] = useState<Psychologist | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isSimModalOpen, setIsSimModalOpen] = useState(false)

  // Compute counts for KPI cards
  const counts = useMemo(() => {
    const pendingMandiri = psychologists.filter(
      (p) => p.practiceType === 'mandiri' && p.verificationStatus === 'pending',
    ).length
    const approvedMandiri = psychologists.filter(
      (p) => p.practiceType === 'mandiri' && p.verificationStatus === 'approved',
    ).length
    const faskes = psychologists.filter((p) => p.practiceType !== 'mandiri').length
    return {
      total: psychologists.length,
      pendingMandiri,
      approvedMandiri,
      faskes,
    }
  }, [psychologists])

  // Filter psychologists based on tab and search
  const filteredPsychologists = useMemo(() => {
    const q = search.trim().toLowerCase()
    return psychologists.filter((p) => {
      const isMandiri = p.practiceType === 'mandiri'
      const vStatus = p.verificationStatus ?? 'approved'

      if (activeFilter === 'pending_mandiri' && (!isMandiri || vStatus !== 'pending')) return false
      if (activeFilter === 'approved_mandiri' && (!isMandiri || vStatus !== 'approved')) return false
      if (activeFilter === 'faskes' && isMandiri) return false
      if (activeFilter === 'rejected_mandiri' && (!isMandiri || (vStatus !== 'rejected' && vStatus !== 'suspended'))) {
        return false
      }

      if (!q) return true
      const partner = p.partnerId ? partners.find((pt) => pt.id === p.partnerId) : null
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.sippNumber.toLowerCase().includes(q) ||
        (p.strNumber?.toLowerCase().includes(q) ?? false) ||
        (p.city?.toLowerCase().includes(q) ?? false) ||
        (partner?.facilityName.toLowerCase().includes(q) ?? false) ||
        p.specializations.some((s) => s.toLowerCase().includes(q))
      )
    })
  }, [psychologists, partners, activeFilter, search])

  const handleOpenDetail = (psy: Psychologist) => {
    setSelectedPsy(psy)
    setIsDetailModalOpen(true)
  }

  const handleApproveMandiri = (psyId: string, fullName: string) => {
    reviewIndependentPsychologist(psyId, 'approved')
    onFeedback(
      `Kredensial Psikolog Mandiri "${fullName}" telah disetujui. Akun psikolog kini aktif di Aplikasi Mobile Psikolog.`,
    )
  }

  const selectedPsyPartner = useMemo(() => {
    if (!selectedPsy?.partnerId) return null
    return partners.find((p) => p.id === selectedPsy.partnerId) ?? null
  }, [partners, selectedPsy])

  const filterTabs: Array<{ id: PsyFilterTab; label: string }> = [
    { id: 'all', label: `Semua (${counts.total})` },
    { id: 'pending_mandiri', label: `Antrean Mandiri (${counts.pendingMandiri})` },
    { id: 'approved_mandiri', label: `Mandiri Aktif (${counts.approvedMandiri})` },
    { id: 'faskes', label: `Mitra Faskes (${counts.faskes})` },
    { id: 'rejected_mandiri', label: 'Ditolak / Nonaktif' },
  ]

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-[-0.02em] text-ink sm:text-2xl">
            Direktori &amp; Verifikasi Psikolog
          </h1>
          <p className="mt-0.5 text-xs text-ink-muted">
            Kelola pendaftaran Psikolog Mandiri via aplikasi mobile dan psikolog binaan fasilitas kesehatan mitra.
          </p>
        </div>
        {DEMO_CONFIG.showSimulateMobileRegistration && (
          <button
            type="button"
            onClick={() => setIsSimModalOpen(true)}
            className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-[8px] bg-primary px-3.5 text-xs font-semibold text-white shadow-btn transition-colors hover:bg-primary-hover"
          >
            <Smartphone className="size-4" />
            <span>Simulasikan Pendaftaran Mobile</span>
          </button>
        )}
      </div>

      {/* 4 KPI Metric Cards (Aligned with Dashboard Style) */}
      <PsychologistKpiCards
        counts={counts}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Search & Filter Controls (Responsive Dropdown on Mobile, Pills on Desktop) */}
      <div className="flex flex-col gap-3 rounded-[12px] border border-[#E2E8F0] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama psikolog, nomor SIPP, STR, instansi faskes, atau kota domisili..."
            className="h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] pr-3 pl-8 text-xs text-ink placeholder:text-ink-muted/70 focus:border-primary focus:bg-white focus:outline-none"
          />
        </div>

        {/* Mobile View (< sm): Compact Dropdown Select */}
        <div className="block sm:hidden">
          <label htmlFor="mobile-psy-filter" className="sr-only">Filter Kategori Psikolog</label>
          <select
            id="mobile-psy-filter"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as PsyFilterTab)}
            className="h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-xs font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none"
          >
            {filterTabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop View (>= sm): Horizontal Pills */}
        <div className="hidden shrink-0 gap-1 rounded-[8px] bg-[#F1F5F9] p-1 sm:flex">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                'cursor-pointer rounded-[6px] px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors',
                activeFilter === tab.id
                  ? 'bg-white text-ink shadow-2xs'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full Data Table */}
      <PsychologistTable
        psychologists={filteredPsychologists}
        partners={partners}
        onSelectPsychologist={handleOpenDetail}
      />

      {/* Integrated Detail & Certificate Verification Modal */}
      <PsychologistDetailModal
        isOpen={isDetailModalOpen}
        psy={selectedPsy}
        partner={selectedPsyPartner}
        onClose={() => setIsDetailModalOpen(false)}
        onApproveMandiri={handleApproveMandiri}
        onFeedback={onFeedback}
      />

      {/* Simulation Modal (Demo feature) */}
      {DEMO_CONFIG.showSimulateMobileRegistration && (
        <SimulateMobilePsyModal
          isOpen={isSimModalOpen}
          onClose={() => setIsSimModalOpen(false)}
          onCreated={(created) => {
            setIsSimModalOpen(false)
            onFeedback(`Simulasi pendaftaran berhasil! Berkas "${created.fullName}" kini masuk antrean verifikasi.`)
          }}
        />
      )}
    </div>
  )
}
