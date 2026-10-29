import { CheckCircle2, FileCheck2, XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { VerificationStatus } from '@/types/portal'

interface PsychologistModalFooterProps {
  isMandiri: boolean
  verificationStatus?: VerificationStatus
  documentsCount: number
  verifiedCount: number
  onClose: () => void
  onOpenReject: () => void
  onApprove: () => void
  onSuspend: () => void
}

export function PsychologistModalFooter({
  isMandiri,
  verificationStatus,
  documentsCount,
  verifiedCount,
  onClose,
  onOpenReject,
  onApprove,
  onSuspend,
}: PsychologistModalFooterProps) {
  const allVerified = documentsCount > 0 && verifiedCount === documentsCount
  const isApproved = verificationStatus === 'approved'
  const isRejected = verificationStatus === 'rejected'

  return (
    <div className="flex flex-col gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 sm:px-6 sm:py-3.5 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side: Validation summary indicator */}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-full',
            allVerified
              ? 'bg-[#DCFCE7] text-[#16A34A]'
              : verifiedCount > 0
                ? 'bg-[#FEF3C7] text-[#B45309]'
                : 'bg-slate-200 text-slate-600',
          )}
        >
          <FileCheck2 className="size-4" />
        </span>
        <div className="text-xs">
          <span className="font-bold text-ink">
            {isMandiri
              ? `${verifiedCount} dari ${documentsCount} Dokumen Terverifikasi`
              : 'Terdaftar via Kemitraan Faskes'}
          </span>
          <span className="text-ink-muted block text-[11px]">
            {allVerified
              ? 'Seluruh persyaratan sertifikat klinis telah memenuhi standar.'
              : isMandiri
                ? 'Periksa kesesuaian nomor registrasi & masa berlaku berkas.'
                : 'Status operasional dikelola via portal faskes.'}
          </span>
        </div>
      </div>

      {/* Right side: Decision buttons (Mobile-optimized layout) */}
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        {/* If pending/rejected: Primary approval button sits full-width at top on mobile */}
        {isMandiri && !isApproved && (
          <button
            type="button"
            onClick={onApprove}
            className="order-1 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] bg-[#16A34A] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#15803D] sm:order-3 sm:h-9 sm:w-auto"
          >
            <CheckCircle2 className="size-4" />
            <span>Setujui &amp; Aktifkan Akun</span>
          </button>
        )}

        {/* Secondary buttons container: 50:50 grid on mobile, inline on desktop */}
        <div
          className={cn(
            'w-full sm:w-auto sm:flex sm:items-center sm:gap-2',
            isMandiri && !isApproved && !isRejected
              ? 'order-2 grid grid-cols-2 gap-2 sm:order-1 sm:grid-cols-none'
              : isMandiri && isApproved
                ? 'grid grid-cols-2 gap-2 sm:grid-cols-none'
                : 'flex'
          )}
        >
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-slate-100 sm:h-9 sm:w-auto"
          >
            Tutup
          </button>

          {isMandiri && !isApproved && !isRejected && (
            <button
              type="button"
              onClick={onOpenReject}
              className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-3.5 text-xs font-semibold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2] sm:h-9 sm:w-auto"
            >
              <XCircle className="size-3.5" />
              <span className="truncate">Tolak Berkas...</span>
            </button>
          )}

          {isMandiri && isApproved && (
            <button
              type="button"
              onClick={onSuspend}
              className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-slate-100 sm:h-9 sm:w-auto"
            >
              <span className="truncate">Nonaktifkan Sementara</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
