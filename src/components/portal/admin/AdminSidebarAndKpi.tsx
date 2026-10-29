import {
  Building2,
  Globe,
  LayoutDashboard,
  Smartphone,
  Stethoscope,
} from 'lucide-react'
import { cn } from '@/lib/cn'

export type AdminModule =
  | 'dashboard'
  | 'psychologists'
  | 'partners'
  | 'users_referrals'
  | 'content_config'

export interface AdminSummaryCounts {
  pendingMandiri: number
  approvedMandiri: number
  faskesPsy: number
  pendingPartners: number
  approvedPartners: number
  crisisUsers: number
  unassignedRefs: number
  newWaitlist: number
  totalGeneralUsers: number
  activeQuestsCount: number
  totalWaitlistCount: number
  hotlineNumber: string
}

export function AdminSidebar({
  activeModule,
  counts,
  onSelectModule,
}: {
  activeModule: AdminModule
  counts: AdminSummaryCounts
  onSelectModule: (mod: AdminModule) => void
}) {
  const totalAttention =
    counts.pendingMandiri +
    counts.pendingPartners +
    counts.crisisUsers +
    counts.unassignedRefs

  return (
    <aside className="w-full shrink-0 rounded-[12px] border border-[#E2E8F0] bg-white p-3.5 lg:sticky lg:top-22 lg:w-64">
      <p className="px-2.5 text-[11px] font-bold tracking-wider text-ink-muted uppercase">
        Menu Ekosistem EVA
      </p>
      <nav className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
        <button
          type="button"
          onClick={() => onSelectModule('dashboard')}
          className={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-xs font-semibold transition-colors',
            activeModule === 'dashboard'
              ? 'bg-primary text-white'
              : 'text-ink-soft hover:bg-[#F8FAFC] hover:text-ink',
          )}
        >
          <span className="inline-flex items-center gap-2.5">
            <LayoutDashboard className="size-4 shrink-0" />
            <span>Dashboard Utama</span>
          </span>
          {totalAttention > 0 && (
            <span
              className={cn(
                'rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold',
                activeModule === 'dashboard'
                  ? 'bg-white text-primary'
                  : 'bg-[#EEF0FF] text-primary',
              )}
            >
              {totalAttention}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectModule('psychologists')}
          className={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-xs font-semibold transition-colors',
            activeModule === 'psychologists'
              ? 'bg-primary text-white'
              : 'text-ink-soft hover:bg-[#F8FAFC] hover:text-ink',
          )}
        >
          <span className="inline-flex items-center gap-2.5">
            <Stethoscope className="size-4 shrink-0" />
            <span>Psikolog Mandiri &amp; Faskes</span>
          </span>
          {counts.pendingMandiri > 0 && (
            <span
              className={cn(
                'rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold',
                activeModule === 'psychologists'
                  ? 'bg-white text-primary'
                  : 'bg-[#FEF3C7] text-[#92400E]',
              )}
            >
              {counts.pendingMandiri}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectModule('partners')}
          className={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-xs font-semibold transition-colors',
            activeModule === 'partners'
              ? 'bg-primary text-white'
              : 'text-ink-soft hover:bg-[#F8FAFC] hover:text-ink',
          )}
        >
          <span className="inline-flex items-center gap-2.5">
            <Building2 className="size-4 shrink-0" />
            <span>Verifikasi Mitra Faskes</span>
          </span>
          {counts.pendingPartners > 0 && (
            <span
              className={cn(
                'rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold',
                activeModule === 'partners'
                  ? 'bg-white text-primary'
                  : 'bg-[#FEF3C7] text-[#92400E]',
              )}
            >
              {counts.pendingPartners}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectModule('users_referrals')}
          className={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-xs font-semibold transition-colors',
            activeModule === 'users_referrals'
              ? 'bg-primary text-white'
              : 'text-ink-soft hover:bg-[#F8FAFC] hover:text-ink',
          )}
        >
          <span className="inline-flex items-center gap-2.5">
            <Smartphone className="size-4 shrink-0" />
            <span>User General &amp; Rujukan</span>
          </span>
          {(counts.crisisUsers > 0 || counts.unassignedRefs > 0) && (
            <span
              className={cn(
                'rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold',
                activeModule === 'users_referrals'
                  ? 'bg-white text-primary'
                  : 'bg-[#FEE2E2] text-[#991B1B]',
              )}
            >
              {counts.crisisUsers + counts.unassignedRefs}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectModule('content_config')}
          className={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-xs font-semibold transition-colors',
            activeModule === 'content_config'
              ? 'bg-primary text-white'
              : 'text-ink-soft hover:bg-[#F8FAFC] hover:text-ink',
          )}
        >
          <span className="inline-flex items-center gap-2.5">
            <Globe className="size-4 shrink-0" />
            <span>Konten Mobile &amp; Website</span>
          </span>
          {counts.newWaitlist > 0 && (
            <span
              className={cn(
                'rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold',
                activeModule === 'content_config'
                  ? 'bg-white text-primary'
                  : 'bg-[#EEF0FF] text-primary',
              )}
            >
              {counts.newWaitlist}
            </span>
          )}
        </button>
      </nav>
    </aside>
  )
}
