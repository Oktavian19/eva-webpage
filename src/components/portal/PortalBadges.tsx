import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { PartnerStatus, PsychologistStatus, VerificationStatus } from '@/types/portal'

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === 'pending') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#FDE68A] bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-semibold text-[#92400E]">
        <Clock className="size-3" /> Menunggu Verifikasi Sertifikat
      </span>
    )
  }
  if (status === 'approved') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 text-[11px] font-semibold text-[#166534]">
        <CheckCircle2 className="size-3" /> Mandiri Terverifikasi
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] px-2 py-0.5 text-[11px] font-semibold text-[#991B1B]">
        <XCircle className="size-3" /> Berkas Ditolak
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#CBD5E1] bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
      Nonaktif
    </span>
  )
}

export function PartnerStatusBadge({
  status,
  isResubmitted,
}: {
  status: PartnerStatus
  isResubmitted?: boolean
}) {
  if (status === 'pending') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#FDE68A] bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-semibold text-[#92400E]">
        <Clock className="size-3" />
        {isResubmitted ? 'Perbaikan Menunggu' : 'Menunggu Verifikasi'}
      </span>
    )
  }
  if (status === 'approved') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 text-[11px] font-semibold text-[#166534]">
        <CheckCircle2 className="size-3" />
        Disetujui
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] px-2 py-0.5 text-[11px] font-semibold text-[#991B1B]">
        <XCircle className="size-3" />
        Ditolak
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#CBD5E1] bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
      Dinonaktifkan
    </span>
  )
}

export function PracticeStatusBadge({ status }: { status: PsychologistStatus }) {
  return (
    <span
      className={cn(
        'rounded-[6px] px-2 py-0.5 text-[11px] font-semibold',
        status === 'active'
          ? 'bg-[#F0FDF4] text-[#166534]'
          : status === 'on_leave'
            ? 'bg-[#FEF3C7] text-[#92400E]'
            : 'bg-[#F1F5F9] text-ink-muted',
      )}
    >
      {status === 'active'
        ? 'Aktif Praktik'
        : status === 'on_leave'
          ? 'Sedang Cuti'
          : 'Nonaktif'}
    </span>
  )
}

