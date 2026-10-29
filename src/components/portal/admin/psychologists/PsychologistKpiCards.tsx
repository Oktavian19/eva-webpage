import { Award, Building2, CheckCircle2, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/cn'

export type PsyFilterTab =
  | 'all'
  | 'pending_mandiri'
  | 'approved_mandiri'
  | 'faskes'
  | 'rejected_mandiri'

interface PsychologistKpiCardsProps {
  counts: {
    total: number
    pendingMandiri: number
    approvedMandiri: number
    faskes: number
  }
  activeFilter: PsyFilterTab
  onSelectFilter: (filter: PsyFilterTab) => void
}

export function PsychologistKpiCards({
  counts,
  activeFilter,
  onSelectFilter,
}: PsychologistKpiCardsProps) {
  const cards = [
    {
      id: 'all' as PsyFilterTab,
      label: 'Total Psikolog Terdaftar',
      value: counts.total,
      sublabel: `${counts.approvedMandiri} mandiri aktif · ${counts.faskes} faskes`,
      icon: <Stethoscope className="size-4 text-primary" />,
      accentBorder: 'hover:border-primary/50',
      activeClass: 'border-primary ring-1 ring-primary/20 bg-[#EEF0FF]/30',
    },
    {
      id: 'pending_mandiri' as PsyFilterTab,
      label: 'Menunggu Verifikasi Dokumen',
      value: counts.pendingMandiri,
      sublabel: counts.pendingMandiri > 0 ? 'Perlu tindakan review berkas SIPP/STR' : 'Semua berkas telah diperiksa',
      icon: <Award className="size-4 text-[#D97706]" />,
      valueClass: counts.pendingMandiri > 0 ? 'text-[#B45309]' : 'text-ink',
      accentBorder: 'hover:border-[#F59E0B]/50',
      activeClass: 'border-[#F59E0B] ring-1 ring-[#F59E0B]/20 bg-[#FEF3C7]/30',
    },
    {
      id: 'approved_mandiri' as PsyFilterTab,
      label: 'Mandiri Aktif Berpraktik',
      value: counts.approvedMandiri,
      sublabel: 'Terverifikasi & tampil di App Mobile',
      icon: <CheckCircle2 className="size-4 text-[#16A34A]" />,
      valueClass: 'text-[#166534]',
      accentBorder: 'hover:border-[#16A34A]/50',
      activeClass: 'border-[#16A34A] ring-1 ring-[#16A34A]/20 bg-[#F0FDF4]/40',
    },
    {
      id: 'faskes' as PsyFilterTab,
      label: 'Psikolog Naungan Faskes',
      value: counts.faskes,
      sublabel: 'Biro, Klinik & RS mitra terdaftar',
      icon: <Building2 className="size-4 text-primary" />,
      accentBorder: 'hover:border-primary/50',
      activeClass: 'border-primary ring-1 ring-primary/20 bg-[#EEF0FF]/30',
    },
  ]

  return (
    <div className="hidden gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const isActive = activeFilter === card.id
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={cn(
              'group flex cursor-pointer flex-col justify-between rounded-[12px] border border-[#E2E8F0] bg-white p-4 text-left transition-all',
              card.accentBorder,
              isActive ? card.activeClass : 'hover:bg-[#F8FAFC]',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted group-hover:text-ink">
                {card.label}
              </span>
              <span className="flex size-7 items-center justify-center rounded-[8px] bg-[#F8FAFC]">
                {card.icon}
              </span>
            </div>

            <div className="mt-2">
              <span className={cn('text-2xl font-bold tracking-tight text-ink', card.valueClass)}>
                {card.value}
              </span>
              <p className="mt-0.5 text-[11px] text-ink-muted">{card.sublabel}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

