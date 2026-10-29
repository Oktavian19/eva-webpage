import { Eye, FileCheck2, ShieldCheck, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { PartnerAccount, Psychologist } from '@/types/portal'
import { VerificationBadge } from '@/components/portal/PortalBadges'
import { PsychologistCardList } from './PsychologistCardList'

interface PsychologistTableProps {
  psychologists: Psychologist[]
  partners: PartnerAccount[]
  onSelectPsychologist: (psy: Psychologist) => void
}

export function PsychologistTable({
  psychologists,
  partners,
  onSelectPsychologist,
}: PsychologistTableProps) {
  const getPartnerName = (partnerId: string | null) => {
    if (!partnerId) return null
    return partners.find((p) => p.id === partnerId)?.facilityName ?? null
  }

  return (
    <div>
      {/* 1. Mobile Card View (< md) */}
      <div className="block md:hidden">
        <PsychologistCardList
          psychologists={psychologists}
          partners={partners}
          onSelectPsychologist={onSelectPsychologist}
        />
      </div>

      {/* 2. Desktop Full-Width Data Table (>= md) */}
      <div className="hidden overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold tracking-wider text-ink-muted uppercase">
                <th className="px-5 py-3.5">Psikolog &amp; Domisili</th>
                <th className="px-5 py-3.5">Jenis Praktik</th>
                <th className="px-5 py-3.5">Nomor Legalitas</th>
                <th className="px-5 py-3.5">Kelengkapan Berkas</th>
                <th className="px-5 py-3.5">Status Verifikasi</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {psychologists.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-muted">
                    <div className="flex flex-col items-center justify-center">
                      <Stethoscope className="size-8 text-ink-muted/50" />
                      <p className="mt-2 text-xs font-semibold text-ink">
                        Tidak ada psikolog yang sesuai dengan filter
                      </p>
                      <p className="text-[11px] text-ink-muted">
                        Coba sesuaikan kata kunci pencarian atau tab filter di atas.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                psychologists.map((psy) => {
                  const partnerName = getPartnerName(psy.partnerId)
                  const isMandiri = psy.practiceType === 'mandiri'
                  const docCount = psy.documents?.length ?? 0
                  const verifiedDocCount = psy.documents?.filter((d) => d.verified).length ?? 0

                  return (
                    <tr
                      key={psy.id}
                      className="cursor-pointer transition-colors hover:bg-[#F8FAFC]"
                      onClick={() => onSelectPsychologist(psy)}
                    >
                      {/* Column 1: Psikolog & Domisili (Clean, no text stacking) */}
                      <td className="max-w-[220px] px-5 py-4">
                        <p className="truncate font-semibold text-ink" title={psy.fullName}>
                          {psy.fullName}
                        </p>
                        <p className="text-[11px] text-ink-muted">{psy.city ?? 'Indonesia'}</p>
                      </td>

                      {/* Column 2: Jenis Praktik */}
                      <td className="px-5 py-4">
                        {isMandiri ? (
                          <span className="inline-flex items-center gap-1 rounded-[5px] border border-primary/25 bg-[#EEF0FF] px-2 py-0.5 text-[10px] font-bold text-primary">
                            Mandiri (App Mobile)
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex rounded-[5px] border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
                              Naungan Faskes
                            </span>
                            {partnerName && (
                              <p className="line-clamp-1 font-semibold text-primary text-[11px]">
                                {partnerName}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Column 3: Legalitas (SIPP & STR) */}
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-semibold text-ink">
                          SIPP: {psy.sippNumber}
                        </p>
                        {psy.strNumber ? (
                          <p className="font-mono text-[11px] text-ink-muted">
                            STR: {psy.strNumber}
                          </p>
                        ) : (
                          <p className="text-[10px] text-ink-muted">STR via Faskes</p>
                        )}
                      </td>

                      {/* Column 4: Kelengkapan Berkas */}
                      <td className="px-5 py-4">
                        {isMandiri ? (
                          docCount > 0 ? (
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-[5px] px-2.5 py-0.5 text-[10px] font-semibold',
                                verifiedDocCount === docCount
                                  ? 'border border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
                                  : 'border border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]',
                              )}
                            >
                              <FileCheck2 className="size-3" />
                              {verifiedDocCount}/{docCount} Dokumen Valid
                            </span>
                          ) : (
                            <span className="text-[11px] text-ink-muted">Belum ada berkas</span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-soft">
                            <ShieldCheck className="size-3.5 text-primary" /> Valid via Faskes
                          </span>
                        )}
                      </td>

                      {/* Column 5: Status Verifikasi */}
                      <td className="px-5 py-4">
                        {isMandiri ? (
                          <VerificationBadge status={psy.verificationStatus ?? 'pending'} />
                        ) : (
                          <span
                            className={cn(
                              'inline-flex rounded-[6px] px-2 py-0.5 text-[11px] font-semibold',
                              psy.status === 'active'
                                ? 'bg-[#F0FDF4] text-[#166534]'
                                : psy.status === 'on_leave'
                                  ? 'bg-[#FEF3C7] text-[#92400E]'
                                  : 'bg-[#F1F5F9] text-ink-muted',
                            )}
                          >
                            {psy.status === 'active'
                              ? 'Aktif Praktik'
                              : psy.status === 'on_leave'
                                ? 'Sedang Cuti'
                                : 'Nonaktif'}
                          </span>
                        )}
                      </td>

                      {/* Column 6: Aksi */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectPsychologist(psy)
                          }}
                          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[6px] border border-primary/30 bg-[#EEF0FF] px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                        >
                          <Eye className="size-3.5" />
                          <span>Tinjau Berkas</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
