import { CheckCircle2, FileText, UserCheck, X } from 'lucide-react'
import { useState } from 'react'
import { CertificatePreviewCard } from './CertificatePreviewCard'
import { PsychologistModalFooter } from './PsychologistModalFooter'
import { PsychologistProfileSidebar } from './PsychologistProfileSidebar'
import { PsychologistRejectModal } from './PsychologistRejectModal'
import { VerificationBadge } from '@/components/portal/PortalBadges'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { cn } from '@/lib/cn'
import {
  reviewIndependentPsychologist,
  togglePsychologistDocumentVerified,
  updatePsychologistStatus,
} from '@/lib/portalStore'
import type { PartnerAccount, Psychologist, PsychologistCertificate } from '@/types/portal'

interface PsychologistDetailModalProps {
  isOpen: boolean
  psy: Psychologist | null
  partner: PartnerAccount | null
  onClose: () => void
  onApproveMandiri: (psyId: string, fullName: string) => void
  onFeedback: (msg: string) => void
}

export function PsychologistDetailModal({
  isOpen,
  psy,
  partner,
  onClose,
  onApproveMandiri,
  onFeedback,
}: PsychologistDetailModalProps) {
  useBodyScrollLock(isOpen && Boolean(psy))

  const [activeDocId, setActiveDocId] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<'documents' | 'profile'>('documents')
  const [isRejectOpen, setIsRejectOpen] = useState(false)

  if (!isOpen || !psy) return null

  const isMandiri = psy.practiceType === 'mandiri'
  const documents: PsychologistCertificate[] = psy.documents ?? []
  const activeDoc = documents.find((d) => d.id === activeDocId) ?? documents[0] ?? null
  const verifiedCount = documents.filter((d) => d.verified).length

  const handleToggleDoc = (docId: string) => {
    togglePsychologistDocumentVerified(psy.id, docId)
    onFeedback('Status validitas dokumen sertifikat berhasil diperbarui.')
  }

  const handleSuspend = () => {
    reviewIndependentPsychologist(psy.id, 'suspended')
    onFeedback(`Akun Psikolog Mandiri "${psy.fullName}" dinonaktifkan sementara.`)
  }

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="psy-detail-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-3 sm:p-6"
      >
        <div className="flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-2xl">
          {/* 1. Modal Top Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 py-3.5 sm:px-6 sm:py-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="psy-detail-title"
                  className="line-clamp-1 text-base font-bold text-ink sm:line-clamp-2 sm:text-lg"
                  title={psy.fullName}
                >
                  {psy.fullName}
                </h2>
                {isMandiri && (
                  <span className="shrink-0">
                    <VerificationBadge status={psy.verificationStatus ?? 'pending'} />
                  </span>
                )}
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
                Pemeriksaan kelayakan berkas sertifikat praktik klinis dan validasi dokumen.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal"
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#CBD5E1] text-ink-muted transition-colors hover:bg-slate-100"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* 2. Segmented Tab Switch (Mobile Only, < lg) */}
          <div className="flex border-b border-[#E2E8F0] bg-[#F8FAFC] p-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileTab('documents')}
              className={cn(
                'flex-1 cursor-pointer rounded-[8px] py-2 text-center text-xs font-semibold transition-colors',
                mobileTab === 'documents'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-3.5" /> Berkas Sertifikat ({documents.length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('profile')}
              className={cn(
                'flex-1 cursor-pointer rounded-[8px] py-2 text-center text-xs font-semibold transition-colors',
                mobileTab === 'profile'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <UserCheck className="size-3.5" /> Biodata &amp; Profil
              </span>
            </button>
          </div>

          {/* 3. Modal Body: 2-Column Studio Grid */}
          <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
            {/* Left Column: Sidebar Profil Psikolog (Col-span 4) */}
            <div
              className={cn(
                'border-b border-[#E2E8F0] bg-[#F8FAFC]/50 p-5 lg:col-span-4 lg:border-r lg:border-b-0 lg:block',
                mobileTab === 'profile' ? 'block' : 'hidden',
              )}
            >
              <PsychologistProfileSidebar psy={psy} partner={partner} />
            </div>

            {/* Right Column: Focus Document Canvas (Col-span 8) */}
            <div
              className={cn(
                'flex flex-col space-y-4 p-5 lg:col-span-8 lg:p-6 lg:block',
                mobileTab === 'documents' ? 'block' : 'hidden',
              )}
            >
              {isMandiri && documents.length > 0 ? (
                <>
                  {/* Document Selector Pills Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-wider text-ink-muted uppercase">
                        Pilih Dokumen Sertifikat ({documents.length})
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        {verifiedCount}/{documents.length} Dokumen Valid
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {documents.map((doc) => {
                        const isSelected = activeDoc?.id === doc.id
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setActiveDocId(doc.id)}
                            className={cn(
                              'inline-flex cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-1.5 text-xs font-semibold transition-all',
                              isSelected
                                ? 'border-primary bg-primary text-white shadow-2xs'
                                : 'border-[#CBD5E1] bg-white text-ink hover:bg-[#F8FAFC]',
                            )}
                          >
                            <span>{doc.docType}</span>
                            {doc.verified ? (
                              <CheckCircle2
                                className={cn('size-3.5', isSelected ? 'text-white' : 'text-[#16A34A]')}
                              />
                            ) : (
                              <span
                                className={cn('size-2 rounded-full', isSelected ? 'bg-white' : 'bg-[#F59E0B]')}
                              />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Focus Document Preview Card */}
                  {activeDoc && (
                    <CertificatePreviewCard activeDoc={activeDoc} onToggleDoc={handleToggleDoc} />
                  )}
                </>
              ) : (
                /* Faskes status configuration or empty documents */
                <div className="flex h-full flex-col justify-center rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
                  <FileText className="mx-auto size-12 text-[#94A3B8]" />
                  <h4 className="mt-2 text-sm font-bold text-ink">
                    Psikolog Faskes Terafiliasi
                  </h4>
                  <p className="mt-1 text-xs text-ink-muted">
                    Psikolog ini didaftarkan oleh faskes mitra ({partner?.facilityName ?? 'Mitra'}).
                    Verifikasi berkas dijamin melalui penjaminan mutu instansi terkait.
                  </p>
                  <div className="mx-auto mt-4 w-full max-w-xs">
                    <label className="block text-left text-xs font-semibold text-ink">
                      Status Praktik
                    </label>
                    <select
                      value={psy.status}
                      onChange={(e) => {
                        updatePsychologistStatus(
                          psy.id,
                          e.target.value as 'active' | 'on_leave' | 'inactive',
                        )
                        onFeedback(`Status praktik "${psy.fullName}" berhasil diperbarui.`)
                      }}
                      className="mt-1.5 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-ink"
                    >
                      <option value="active">Aktif Menerima Rujukan</option>
                      <option value="on_leave">Sedang Cuti</option>
                      <option value="inactive">Nonaktif</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Sticky Footer Action Bar */}
          <PsychologistModalFooter
            isMandiri={isMandiri}
            verificationStatus={psy.verificationStatus}
            documentsCount={documents.length}
            verifiedCount={verifiedCount}
            onClose={onClose}
            onOpenReject={() => setIsRejectOpen(true)}
            onApprove={() => {
              onApproveMandiri(psy.id, psy.fullName)
              onClose()
            }}
            onSuspend={handleSuspend}
          />
        </div>
      </div>

      {/* Pop-up Dialog Penolakan Terpisah */}
      <PsychologistRejectModal
        isOpen={isRejectOpen}
        psyId={psy.id}
        psyFullName={psy.fullName}
        initialReason={psy.rejectionReason}
        onClose={() => setIsRejectOpen(false)}
        onFeedback={onFeedback}
        onSuccess={() => onClose()}
      />
    </>
  )
}
