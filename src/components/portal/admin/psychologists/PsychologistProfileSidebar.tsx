import { AlertCircle, BookOpen, Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import type { PartnerAccount, Psychologist } from '@/types/portal'

interface PsychologistProfileSidebarProps {
  psy: Psychologist
  partner: PartnerAccount | null
}

export function PsychologistProfileSidebar({
  psy,
  partner,
}: PsychologistProfileSidebarProps) {
  const isMandiri = psy.practiceType === 'mandiri'

  return (
    <div className="space-y-3.5 text-xs">
      {/* Rejection Alert if rejected */}
      {psy.verificationStatus === 'rejected' && psy.rejectionReason && (
        <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3 text-[#991B1B]">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>Catatan Evaluasi / Penolakan Terakhir:</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed">{psy.rejectionReason}</p>
        </div>
      )}

      {/* Kredensial & Status Praktik */}
      <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
        <span className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">
          Kredensial &amp; Afiliasi
        </span>
        <div className="mt-2 space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">SIPP:</span>
            <span className="font-bold text-ink">{psy.sippNumber}</span>
          </div>
          {psy.strNumber && (
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">STR:</span>
              <span className="font-bold text-ink">{psy.strNumber}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2 pt-1 font-sans">
            <span className="shrink-0 text-ink-muted">Afiliasi:</span>
            <span
              className="max-w-[180px] truncate font-semibold text-primary"
              title={isMandiri ? 'Praktik Mandiri' : (partner?.facilityName ?? 'Faskes Mitra')}
            >
              {isMandiri ? 'Praktik Mandiri' : (partner?.facilityName ?? 'Faskes Mitra')}
            </span>
          </div>
        </div>
      </div>

      {/* Pendidikan & Pengalaman */}
      <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
        <span className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">
          Pendidikan &amp; Pengalaman
        </span>
        <div className="mt-2 flex items-start gap-2">
          <BookOpen className="size-4 shrink-0 text-primary mt-0.5" />
          <div>
            <p className="font-semibold text-ink leading-tight">
              {psy.education || 'Magister Psikologi Profesi Klinis'}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="size-3 text-[#16A34A]" /> {psy.yearsExperience ?? 5} Tahun Pengalaman
              </span>
              <span>·</span>
              <span>Kuota: {psy.weeklyQuota ?? 10} klien/mg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Jadwal & Kontak Praktik */}
      <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
        <span className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">
          Jadwal &amp; Kontak Praktik
        </span>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2 text-ink">
            <Clock className="size-3.5 shrink-0 text-ink-muted" />
            <span className="font-medium text-[11px]">{psy.practiceSchedule}</span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <MapPin className="size-3.5 shrink-0 text-ink-muted" />
            <span className="text-[11px] font-medium">{psy.city ?? 'Indonesia'}</span>
          </div>
          {psy.email && (
            <div className="flex items-center gap-2 text-ink-soft">
              <Mail className="size-3.5 shrink-0 text-ink-muted" />
              <span className="text-[11px] truncate">{psy.email}</span>
            </div>
          )}
          {psy.phone && (
            <div className="flex items-center gap-2 text-ink-soft">
              <Phone className="size-3.5 shrink-0 text-ink-muted" />
              <span className="text-[11px] font-mono">{psy.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Spesialisasi Klinis */}
      <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
        <span className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">
          Fokus Layanan Klinis
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {psy.specializations.map((spec) => (
            <span
              key={spec}
              className="rounded-[6px] border border-[#CBD5E1] bg-white px-2 py-0.5 text-[11px] font-medium text-ink shadow-2xs"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
