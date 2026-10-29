import { FileCheck2, Search, Smartphone } from 'lucide-react'
import { useMemo, useState } from 'react'
import { VerificationBadge } from '@/components/portal/PortalBadges'
import { CertificatePreviewModal } from '@/components/portal/admin/CertificatePreviewModal'
import { PsychologistDetailPanel } from '@/components/portal/admin/PsychologistDetailPanel'
import { SimulateMobilePsyModal } from '@/components/portal/admin/SimulateMobilePsyModal'
import { cn } from '@/lib/cn'
import {
  reviewIndependentPsychologist,
  type PartnerAccount,
  type Psychologist,
} from '@/lib/portalStore'

type PsyFilterTab = 'pending_mandiri' | 'approved_mandiri' | 'faskes' | 'rejected_mandiri' | 'all'

export function AdminPsychologistsModule({
  psychologists,
  partners,
  onFeedback,
}: {
  psychologists: Psychologist[]
  partners: PartnerAccount[]
  onFeedback: (msg: string) => void
}) {
  const [psyFilter, setPsyFilter] = useState<PsyFilterTab>('pending_mandiri')
  const [psySearch, setPsySearch] = useState('')
  const [selectedPsyId, setSelectedPsyId] = useState<string | null>(
    () =>
      psychologists.find(
        (p) => p.practiceType === 'mandiri' && p.verificationStatus === 'pending',
      )?.id ??
      psychologists[0]?.id ??
      null,
  )
  const [certModalOpen, setCertModalOpen] = useState(false)
  const [activeCertId, setActiveCertId] = useState<string | null>(null)
  const [simModalOpen, setSimModalOpen] = useState(false)

  const counts = useMemo(
    () => ({
      pendingMandiri: psychologists.filter(
        (p) => p.practiceType === 'mandiri' && p.verificationStatus === 'pending',
      ).length,
      approvedMandiri: psychologists.filter(
        (p) => p.practiceType === 'mandiri' && p.verificationStatus === 'approved',
      ).length,
      faskesPsy: psychologists.filter((p) => p.practiceType !== 'mandiri').length,
    }),
    [psychologists],
  )

  const filteredPsychologists = useMemo(() => {
    const q = psySearch.trim().toLowerCase()
    return psychologists.filter((p) => {
      const isMandiri = p.practiceType === 'mandiri'
      const vStatus = p.verificationStatus ?? 'approved'
      if (psyFilter === 'pending_mandiri' && (!isMandiri || vStatus !== 'pending')) return false
      if (psyFilter === 'approved_mandiri' && (!isMandiri || vStatus !== 'approved')) return false
      if (psyFilter === 'faskes' && isMandiri) return false
      if (
        psyFilter === 'rejected_mandiri' &&
        (!isMandiri || (vStatus !== 'rejected' && vStatus !== 'suspended'))
      ) {
        return false
      }
      if (!q) return true
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.sippNumber.toLowerCase().includes(q) ||
        (p.strNumber?.toLowerCase().includes(q) ?? false) ||
        (p.city?.toLowerCase().includes(q) ?? false) ||
        p.specializations.some((s) => s.toLowerCase().includes(q))
      )
    })
  }, [psychologists, psyFilter, psySearch])

  const selectedPsy = useMemo(
    () => psychologists.find((p) => p.id === selectedPsyId) ?? filteredPsychologists[0] ?? null,
    [psychologists, selectedPsyId, filteredPsychologists],
  )

  const selectedPsyPartner = useMemo(
    () => (selectedPsy?.partnerId ? partners.find((p) => p.id === selectedPsy.partnerId) : null),
    [partners, selectedPsy],
  )

  const handleApproveMandiri = (psyId: string, fullName: string) => {
    reviewIndependentPsychologist(psyId, 'approved')
    setCertModalOpen(false)
    onFeedback(
      `Kredensial Psikolog Mandiri "${fullName}" telah disetujui. Akun psikolog kini aktif di Aplikasi Mobile Psikolog.`,
    )
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-[-0.02em] text-ink">
            Verifikasi &amp; Manajemen Psikolog (Mandiri &amp; Faskes)
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Tinjau unggahan sertifikat SIPP, STR HIMPSI, dan Ijazah dari pendaftar Psikolog Mandiri
            di Aplikasi Mobile Psikolog.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSimModalOpen(true)}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-[8px] bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Smartphone className="size-4" />
          Simulasikan Pendaftaran Mobile
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="rounded-[12px] border border-[#E2E8F0] bg-white">
            <div className="border-b border-[#E2E8F0] p-3">
              <div className="flex flex-wrap gap-1 rounded-[8px] bg-[#F1F5F9] p-1">
                {(
                  [
                    { id: 'pending_mandiri', label: `Antrean Mandiri (${counts.pendingMandiri})` },
                    { id: 'approved_mandiri', label: `Mandiri Aktif (${counts.approvedMandiri})` },
                    { id: 'faskes', label: `Mitra Faskes (${counts.faskesPsy})` },
                    { id: 'rejected_mandiri', label: 'Ditolak/Nonaktif' },
                    { id: 'all', label: 'Semua' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPsyFilter(tab.id)}
                    className={cn(
                      'cursor-pointer rounded-[6px] px-2.5 py-1.5 text-[11px] font-semibold transition-colors',
                      psyFilter === tab.id
                        ? 'bg-white text-ink shadow-2xs'
                        : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="relative mt-2.5">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-muted" />
                <input
                  type="search"
                  value={psySearch}
                  onChange={(e) => setPsySearch(e.target.value)}
                  placeholder="Cari nama psikolog, SIPP, STR, atau kota..."
                  className="h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] pr-3 pl-8 text-xs text-ink placeholder:text-ink-muted/70 focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="max-h-[600px] divide-y divide-[#E2E8F0] overflow-y-auto">
              {filteredPsychologists.length === 0 ? (
                <div className="p-8 text-center text-xs font-medium text-ink-muted">
                  Tidak ada data psikolog pada kategori ini.
                </div>
              ) : (
                filteredPsychologists.map((psy) => {
                  const isSelected = selectedPsy?.id === psy.id
                  const isMandiri = psy.practiceType === 'mandiri'
                  return (
                    <button
                      key={psy.id}
                      type="button"
                      onClick={() => setSelectedPsyId(psy.id)}
                      className={cn(
                        'flex w-full cursor-pointer flex-col gap-1.5 p-4 text-left transition-colors',
                        isSelected ? 'bg-[#EEF0FF]/70' : 'bg-white hover:bg-[#F8FAFC]',
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-ink">{psy.fullName}</p>
                        {isMandiri ? (
                          <VerificationBadge status={psy.verificationStatus ?? 'approved'} />
                        ) : (
                          <span className="inline-flex shrink-0 items-center rounded-[6px] border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
                            Naungan Faskes
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-ink-muted">SIPP: {psy.sippNumber}</p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-ink-muted">
                        <span>
                          {isMandiri ? 'Praktik Mandiri (App Mobile)' : 'Mitra Faskes'} ·{' '}
                          {psy.city ?? 'INDONESIA'}
                        </span>
                        {isMandiri && psy.documents && (
                          <span className="inline-flex items-center gap-1 font-semibold text-primary">
                            <FileCheck2 className="size-3" /> {psy.documents.length} Sertifikat
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <PsychologistDetailPanel
            selectedPsy={selectedPsy}
            selectedPsyPartner={selectedPsyPartner}
            onOpenCertModal={(docId) => {
              setActiveCertId(docId ?? selectedPsy?.documents?.[0]?.id ?? null)
              setCertModalOpen(true)
            }}
            onApproveMandiri={handleApproveMandiri}
            onFeedback={onFeedback}
          />
        </div>
      </div>

      <CertificatePreviewModal
        psychologist={selectedPsy}
        activeCertId={activeCertId}
        isOpen={certModalOpen}
        onSelectCert={setActiveCertId}
        onClose={() => setCertModalOpen(false)}
        onApproveAll={handleApproveMandiri}
      />

      <SimulateMobilePsyModal
        isOpen={simModalOpen}
        onClose={() => setSimModalOpen(false)}
        onCreated={(created) => {
          setSimModalOpen(false)
          setPsyFilter('pending_mandiri')
          setSelectedPsyId(created.id)
          onFeedback(
            `Simulasi berhasil: Pengajuan Psikolog Mandiri "${created.fullName}" beserta 3 dokumen sertifikat masuk ke antrean verifikasi.`,
          )
        }}
      />
    </div>
  )
}
