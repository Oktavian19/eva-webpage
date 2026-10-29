import { Eye, FileCheck2, ShieldCheck, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { PartnerAccount, Psychologist } from '@/types/portal'
import { VerificationBadge } from '@/components/portal/PortalBadges'

interface PsychologistCardListProps {
  psychologists: Psychologist[]
  partners: PartnerAccount[]
  onSelectPsychologist: (psy: Psychologist) => void
}

export function PsychologistCardList({
  psychologists,
  partners,
  onSelectPsychologist,
}: PsychologistCardListProps) {
  const getPartnerName = (partnerId: string | null) => {
    if (!partnerId) return null
    return partners.find((p) => p.id === partnerId)?.facilityName ?? null
  }

  if (psychologists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#E2E8F0] bg-white p-8 text-center text-ink-muted">
        <Stethoscope className="size-8 text-ink-muted/50" />
        <p className="mt-2 text-xs font-semibold text-ink">Tidak ada psikolog yang sesuai</p>
        <p className="text-[11px] text-ink-muted">Coba ubah kata kunci atau tab filter di atas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {psychologists.map((psy) => {
        const isMandiri = psy.practiceType === 'mandiri'
        const partnerName = getPartnerName(psy.partnerId)
        const docCount = psy.documents?.length ?? 0
        const verifiedDocCount = psy.documents?.filter((d) => d.verified).length ?? 0

        return (
          <div
            key={psy.id}
            onClick={() => onSelectPsychologist(psy)}
            className="flex cursor-pointer flex-col justify-between rounded-[12px] border border-[#E2E8F0] bg-white p-4 shadow-2xs transition-all hover:border-primary/40 active:scale-[0.99]"
          >
            {/* Card Header: Name, City & Practice Badge */}
            <div className="flex items-start justify-between gap-2 border-b border-[#E2E8F0] pb-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-bold leading-snug text-ink">{psy.fullName}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{psy.city ?? 'Indonesia'}</p>
              </div>

              {isMandiri ? (
                <span className="shrink-0 rounded-[5px] border border-primary/25 bg-[#EEF0FF] px-2 py-0.5 text-[10px] font-bold text-primary">
                  Mandiri
                </span>
              ) : (
                <span className="shrink-0 rounded-[5px] border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
                  Faskes
                </span>
              )}
            </div>

            {/* Card Body: SIPP, Partner info & Status */}
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Nomor SIPP:</span>
                <span className="font-mono font-semibold text-ink">{psy.sippNumber}</span>
              </div>

              {!isMandiri && partnerName && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Instansi:</span>
                  <span className="font-medium text-primary line-clamp-1 text-right">{partnerName}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Kelengkapan Berkas:</span>
                {isMandiri ? (
                  docCount > 0 ? (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-[5px] px-2 py-0.5 text-[10px] font-semibold',
                        verifiedDocCount === docCount
                          ? 'border border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
                          : 'border border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]',
                      )}
                    >
                      <FileCheck2 className="size-3" />
                      {verifiedDocCount}/{docCount} Valid
                    </span>
                  ) : (
                    <span className="text-[11px] text-ink-muted">Belum ada</span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-soft">
                    <ShieldCheck className="size-3.5 text-primary" /> Valid via Faskes
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-ink-muted">Status Akun:</span>
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
                    {psy.status === 'active' ? 'Aktif Praktik' : psy.status === 'on_leave' ? 'Sedang Cuti' : 'Nonaktif'}
                  </span>
                )}
              </div>
            </div>

            {/* Card Action Button */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectPsychologist(psy)
                }}
                className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[8px] bg-primary text-xs font-semibold text-white shadow-2xs hover:bg-primary-hover active:scale-[0.99]"
              >
                <Eye className="size-3.5" />
                <span>Tinjau Berkas &amp; Detail</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

