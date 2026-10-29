import { Award, CheckCircle2, UserCheck, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  togglePsychologistDocumentVerified,
  type Psychologist,
  type PsychologistCertificate,
} from '@/lib/portalStore'

interface CertificatePreviewModalProps {
  psychologist: Psychologist | null
  activeCertId: string | null
  isOpen: boolean
  onSelectCert: (id: string) => void
  onClose: () => void
  onApproveAll: (psyId: string, fullName: string) => void
}

export function CertificatePreviewModal({
  psychologist,
  activeCertId,
  isOpen,
  onSelectCert,
  onClose,
  onApproveAll,
}: CertificatePreviewModalProps) {
  if (!isOpen || !psychologist) return null

  const docs = psychologist.documents ?? []
  const activeCertificate: PsychologistCertificate | null =
    docs.find((d) => d.id === activeCertId) ?? docs[0] ?? null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <div className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <div>
            <h2 id="cert-modal-title" className="text-base font-bold text-ink">
              Verifikasi Sertifikat &amp; Kredensial Psikolog Mandiri
            </h2>
            <p className="text-xs text-ink-muted">
              Pemohon: <strong>{psychologist.fullName}</strong> · SIPP: {psychologist.sippNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-[8px] border border-[#CBD5E1] text-ink-muted hover:bg-[#F8FAFC]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-12">
          <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] p-4 md:col-span-4 md:border-r md:border-b-0">
            <p className="text-[11px] font-bold tracking-wider text-ink-muted uppercase">
              Dokumen Diunggah ({docs.length})
            </p>
            <div className="mt-2.5 space-y-2">
              {docs.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => onSelectCert(doc.id)}
                  className={cn(
                    'flex w-full cursor-pointer flex-col gap-1 rounded-[8px] border p-3 text-left text-xs transition-colors',
                    activeCertificate?.id === doc.id
                      ? 'border-primary bg-white shadow-2xs'
                      : 'border-[#E2E8F0] bg-white/70 hover:bg-white',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{doc.docType}</span>
                    {doc.verified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#166534]">
                        <CheckCircle2 className="size-3" /> Valid
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#B45309]">Belum Dicek</span>
                    )}
                  </div>
                  <p className="line-clamp-1 font-medium text-ink">{doc.title}</p>
                  <p className="font-mono text-[10px] text-ink-muted">{doc.fileName}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:col-span-8">
            {activeCertificate ? (
              <div>
                <div className="rounded-[10px] border-2 border-[#CBD5E1] bg-[#FCFDFE] p-6">
                  <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase">
                        SALINAN DIGITAL TERVERIFIKASI — {activeCertificate.docType}
                      </p>
                      <h3 className="mt-1 text-base font-bold text-ink">
                        {activeCertificate.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        Diterbitkan oleh: {activeCertificate.issuedBy}
                      </p>
                    </div>
                    <Award className="size-8 shrink-0 text-primary" />
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-ink-muted">Nama Pemegang Sertifikat</dt>
                      <dd className="font-bold text-ink">{psychologist.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-muted">Nomor Registrasi Dokumen</dt>
                      <dd className="font-mono font-bold text-ink">
                        {activeCertificate.documentNumber}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-muted">Tahun Penerbitan</dt>
                      <dd className="font-semibold text-ink">{activeCertificate.issuedYear}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-muted">Masa Berlaku Sampai</dt>
                      <dd className="font-semibold text-ink">{activeCertificate.validUntil}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex items-center justify-between rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-[11px]">
                    <span className="font-mono text-ink-soft">
                      Berkas: {activeCertificate.fileName} ({activeCertificate.fileSize})
                    </span>
                    <span className="font-semibold text-[#166534]">
                      Pindai PDF Asli · Resolusi Tinggi
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                  <div className="text-xs">
                    <p className="font-semibold text-ink">Status Pemeriksaan Dokumen Ini</p>
                    <p className="text-[11px] text-ink-muted">
                      Pastikan nomor registrasi sesuai dengan pangkalan data HIMPSI / Kemenkes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      togglePsychologistDocumentVerified(psychologist.id, activeCertificate.id)
                    }
                    className={cn(
                      'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] border px-3.5 text-xs font-semibold transition-colors',
                      activeCertificate.verified
                        ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
                        : 'border-primary bg-primary text-white',
                    )}
                  >
                    <CheckCircle2 className="size-4" />
                    {activeCertificate.verified ? 'Terverifikasi Valid' : 'Tandai Dokumen Valid'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-3.5">
          <span className="text-xs text-ink-muted">
            {docs.filter((d) => d.verified).length} dari {docs.length} dokumen telah ditandai
            valid.
          </span>
          <div className="flex items-center gap-2">
            {psychologist.verificationStatus !== 'approved' && (
              <button
                type="button"
                onClick={() => onApproveAll(psychologist.id, psychologist.fullName)}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] bg-[#16A34A] px-4 text-xs font-semibold text-white hover:bg-[#15803D]"
              >
                <UserCheck className="size-4" />
                Setujui Seluruh Berkas &amp; Aktifkan Psikolog
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 cursor-pointer items-center rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 text-xs font-semibold text-ink"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

