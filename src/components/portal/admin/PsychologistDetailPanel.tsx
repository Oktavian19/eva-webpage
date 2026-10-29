import { CheckCircle2, Eye, FileText, XCircle } from 'lucide-react'
import { useState } from 'react'
import { VerificationBadge } from '@/components/portal/PortalBadges'
import { cn } from '@/lib/cn'
import {
  reviewIndependentPsychologist,
  togglePsychologistDocumentVerified,
  updatePsychologistStatus,
  type PartnerAccount,
  type Psychologist,
} from '@/lib/portalStore'

interface PsychologistDetailPanelProps {
  selectedPsy: Psychologist | null
  selectedPsyPartner: PartnerAccount | null | undefined
  onOpenCertModal: (docId?: string) => void
  onApproveMandiri: (psyId: string, fullName: string) => void
  onFeedback: (msg: string) => void
}

export function PsychologistDetailPanel({
  selectedPsy,
  selectedPsyPartner,
  onOpenCertModal,
  onApproveMandiri,
  onFeedback,
}: PsychologistDetailPanelProps) {
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState<string | null>(null)

  if (!selectedPsy) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[12px] border border-[#E2E8F0] bg-white p-6 text-center text-sm text-ink-muted">
        Pilih salah satu psikolog di sebelah kiri untuk meninjau kredensial &amp; sertifikat.
      </div>
    )
  }

  const handleRejectMandiri = () => {
    if (!rejectReason.trim() || rejectReason.trim().length < 10) {
      setRejectError(
        'Mohon tuliskan alasan penolakan berkas/sertifikat (minimal 10 karakter) agar psikolog dapat mengunggah ulang di aplikasi.',
      )
      return
    }
    reviewIndependentPsychologist(selectedPsy.id, 'rejected', rejectReason.trim())
    setShowRejectBox(false)
    setRejectReason('')
    setRejectError(null)
    onFeedback(
      `Pengajuan Psikolog Mandiri "${selectedPsy.fullName}" ditolak dengan catatan perbaikan dokumen.`,
    )
  }

  return (
    <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <span
            className={cn(
              'rounded-[6px] border px-2 py-0.5 text-[11px] font-semibold',
              selectedPsy.practiceType === 'mandiri'
                ? 'border-primary/30 bg-[#EEF0FF] text-primary'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-ink-soft',
            )}
          >
            {selectedPsy.practiceType === 'mandiri'
              ? 'Psikolog Mandiri (Aplikasi Mobile)'
              : 'Psikolog Naungan Faskes'}
          </span>
          <h2 className="mt-2 text-lg font-bold text-ink">{selectedPsy.fullName}</h2>
          <p className="mt-0.5 font-mono text-xs text-ink-soft">
            Nomor SIPP: {selectedPsy.sippNumber}
            {selectedPsy.strNumber ? ` · STR: ${selectedPsy.strNumber}` : ''}
          </p>
        </div>
        {selectedPsy.practiceType === 'mandiri' ? (
          <VerificationBadge status={selectedPsy.verificationStatus ?? 'pending'} />
        ) : (
          <span className="inline-flex items-center gap-1 rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 text-xs font-semibold text-[#166534]">
            <CheckCircle2 className="size-3.5" /> Terdaftar via Mitra Faskes
          </span>
        )}
      </div>

      {selectedPsy.verificationStatus === 'rejected' && selectedPsy.rejectionReason && (
        <div className="mt-4 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs text-[#991B1B]">
          <p className="font-semibold">Catatan Penolakan Dokumen:</p>
          <p className="mt-1 leading-relaxed">{selectedPsy.rejectionReason}</p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-xs">
          <p className="text-[11px] font-bold tracking-wider text-ink-muted uppercase">
            Pendidikan &amp; Pengalaman
          </p>
          <p className="mt-2 font-semibold text-ink">
            {selectedPsy.education || 'Magister Profesi Psikologi Klinis'}
          </p>
          <p className="mt-1 text-ink-muted">
            Pengalaman: {selectedPsy.yearsExperience ?? 5} thn · Kuota:{' '}
            {selectedPsy.weeklyQuota ?? 10}/minggu
          </p>
        </div>
        <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-xs">
          <p className="text-[11px] font-bold tracking-wider text-ink-muted uppercase">
            Jadwal &amp; Kontak
          </p>
          <p className="mt-2 font-semibold text-ink">{selectedPsy.practiceSchedule}</p>
          <p className="mt-1 text-ink-muted">
            {selectedPsy.email ?? selectedPsyPartner?.facilityName ?? selectedPsy.city}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-bold tracking-wider text-ink-muted uppercase">
          Spesialisasi Klinis
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedPsy.specializations.map((spec) => (
            <span
              key={spec}
              className="rounded-[6px] border border-[#CBD5E1] bg-white px-2.5 py-1 text-xs font-medium text-ink"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {selectedPsy.practiceType === 'mandiri' && (
        <div className="mt-6 border-t border-[#E2E8F0] pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-wider text-ink uppercase">
              Berkas Sertifikat Unggahan ({selectedPsy.documents?.length ?? 0})
            </h3>
            {(selectedPsy.documents?.length ?? 0) > 0 && (
              <button
                type="button"
                onClick={() => onOpenCertModal(selectedPsy.documents?.[0]?.id)}
                className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[8px] border border-primary/30 bg-[#EEF0FF] px-3 text-xs font-semibold text-primary hover:bg-primary hover:text-white"
              >
                <Eye className="size-3.5" /> Pratinjau Semua Sertifikat
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2.5">
            {(selectedPsy.documents ?? []).map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col justify-between gap-3 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 sm:flex-row sm:items-center"
              >
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[5px] bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {doc.docType}
                    </span>
                    <span className="font-semibold text-ink">{doc.title}</span>
                  </div>
                  <p className="font-mono text-[11px] text-ink-muted">
                    No: {doc.documentNumber} · Berlaku s/d: {doc.validUntil}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => togglePsychologistDocumentVerified(selectedPsy.id, doc.id)}
                    className={cn(
                      'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[6px] border px-2.5 text-[11px] font-semibold',
                      doc.verified
                        ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
                        : 'border-[#CBD5E1] bg-white text-ink-soft',
                    )}
                  >
                    <CheckCircle2 className="size-3.5" />
                    {doc.verified ? 'Valid' : 'Tandai Valid'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenCertModal(doc.id)}
                    className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-[6px] border border-[#CBD5E1] bg-white px-2.5 text-[11px] font-semibold text-ink"
                  >
                    <FileText className="size-3.5 text-primary" /> Lihat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-[#E2E8F0] pt-5">
        {selectedPsy.practiceType === 'mandiri' ? (
          !showRejectBox ? (
            <div className="flex flex-wrap items-center gap-2.5">
              {selectedPsy.verificationStatus !== 'approved' && (
                <button
                  type="button"
                  onClick={() => onApproveMandiri(selectedPsy.id, selectedPsy.fullName)}
                  className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[8px] bg-[#16A34A] px-4 text-xs font-semibold text-white hover:bg-[#15803D]"
                >
                  <CheckCircle2 className="size-4" /> Setujui &amp; Aktifkan Akun Mobile
                </button>
              )}
              {selectedPsy.verificationStatus !== 'rejected' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectBox(true)
                    setRejectReason(selectedPsy.rejectionReason ?? '')
                    setRejectError(null)
                  }}
                  className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 text-xs font-semibold text-[#B91C1C]"
                >
                  <XCircle className="size-4" /> Tolak Berkas dengan Catatan
                </button>
              )}
              {selectedPsy.verificationStatus === 'approved' && (
                <button
                  type="button"
                  onClick={() => {
                    reviewIndependentPsychologist(selectedPsy.id, 'suspended')
                    onFeedback(
                      `Akun Psikolog Mandiri "${selectedPsy.fullName}" telah dinonaktifkan sementara.`,
                    )
                  }}
                  className="inline-flex h-10 cursor-pointer items-center rounded-[8px] border border-[#CBD5E1] bg-white px-4 text-xs font-semibold text-ink-soft"
                >
                  Nonaktifkan Sementara
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2]/60 p-4">
              <label className="block text-xs font-semibold text-[#991B1B]">
                Catatan Perbaikan Sertifikat / Dokumen (Wajib diisi)
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value)
                  if (rejectError) setRejectError(null)
                }}
                className="mt-2 w-full rounded-[8px] border border-[#FCA5A5] bg-white p-2.5 text-xs text-ink"
              />
              {rejectError && (
                <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{rejectError}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRejectMandiri}
                  className="inline-flex h-9 cursor-pointer items-center rounded-[8px] bg-[#DC2626] px-3.5 text-xs font-semibold text-white"
                >
                  Konfirmasi Tolak
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectBox(false)}
                  className="inline-flex h-9 cursor-pointer items-center rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-ink"
                >
                  Batal
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">
              Kontrol Status Praktik Psikolog Faskes
            </span>
            <select
              aria-label="Status praktik psikolog"
              value={selectedPsy.status}
              onChange={(e) => {
                updatePsychologistStatus(
                  selectedPsy.id,
                  e.target.value as 'active' | 'on_leave' | 'inactive',
                )
                onFeedback(`Status praktik "${selectedPsy.fullName}" berhasil diperbarui.`)
              }}
              className="h-9 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-ink"
            >
              <option value="active">Aktif Menerima Rujukan</option>
              <option value="on_leave">Sedang Cuti</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

