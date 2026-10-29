import { Users, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { simulateMobilePsychologistSubmission } from './simulateSubmission'
import { CLINICAL_SPECIALIZATIONS } from '@/constants/portal'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { cn } from '@/lib/cn'
import type { Psychologist } from '@/types/portal'

interface SimulateMobilePsyModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (created: Psychologist) => void
}

export function SimulateMobilePsyModal({
  isOpen,
  onClose,
  onCreated,
}: SimulateMobilePsyModalProps) {
  useBodyScrollLock(isOpen)

  const [simFullName, setSimFullName] = useState('')
  const [simSipp, setSimSipp] = useState('')
  const [simStr, setSimStr] = useState('')
  const [simCity, setSimCity] = useState('')
  const [simEducation, setSimEducation] = useState('')
  const [simEmail, setSimEmail] = useState('')
  const [simPhone, setSimPhone] = useState('')
  const [simSchedule, setSimSchedule] = useState('Senin – Jumat (17.00 – 21.00 WIB)')
  const [simValidUntil, setSimValidUntil] = useState('2029-12-31')
  const [simSpecs, setSimSpecs] = useState<string[]>(['Kecemasan & Panik', 'Remaja & Mahasiswa'])
  const [simError, setSimError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!simFullName.trim() || !simSipp.trim() || !simStr.trim() || !simCity.trim()) {
      setSimError('Nama lengkap, Nomor SIPP, Nomor STR, dan Kota wajib diisi.')
      return
    }
    const created = simulateMobilePsychologistSubmission({
      fullName: simFullName,
      sippNumber: simSipp.toUpperCase(),
      strNumber: simStr.toUpperCase(),
      city: simCity.toUpperCase(),
      education: simEducation || 'Magister Profesi Psikologi Klinis Universitas Gadjah Mada',
      email: simEmail || 'psikolog.baru@praktikmandiri.id',
      phone: simPhone || '081299887766',
      practiceSchedule: simSchedule,
      specializations: simSpecs.length > 0 ? simSpecs : ['Kecemasan & Panik'],
      sippValidUntil: simValidUntil,
    })
    setSimFullName('')
    setSimSipp('')
    setSimStr('')
    setSimCity('')
    setSimEducation('')
    setSimEmail('')
    setSimPhone('')
    setSimError(null)
    onCreated(created)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sim-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <div className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-[5px] bg-[#EEF0FF] px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
              Simulasi Aplikasi Mobile Psikolog
            </span>
            <h2 id="sim-modal-title" className="mt-1 text-base font-bold text-ink">
              Simulasikan Pendaftaran Psikolog Mandiri Baru
            </h2>
            <p className="text-xs text-ink-muted">
              Mengirimkan data pendaftaran psikolog mandiri beserta 3 berkas sertifikat (SIPP, STR,
              Ijazah) ke antrean Admin.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal simulasi"
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-[8px] border border-[#CBD5E1] text-ink-muted hover:bg-slate-100"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {simError && (
            <div className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs font-medium text-[#B91C1C]">
              {simError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-ink">Nama Lengkap &amp; Gelar Profesi *</label>
              <input
                type="text"
                value={simFullName}
                onChange={(e) => setSimFullName(e.target.value)}
                placeholder="Contoh: Rania Putri Maharani, M.Psi., Psikolog"
                className="mt-1 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink">Nomor SIPP (Otomatis Kapital) *</label>
              <input
                type="text"
                value={simSipp}
                onChange={(e) => setSimSipp(e.target.value.toUpperCase())}
                placeholder="20240812-2029-01-0992"
                className="mt-1 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 font-mono uppercase text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink">Nomor STR HIMPSI / IPK (Kapital) *</label>
              <input
                type="text"
                value={simStr}
                onChange={(e) => setSimStr(e.target.value.toUpperCase())}
                placeholder="STR-PK-2024-991023"
                className="mt-1 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 font-mono uppercase text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink">Kota Domisili Praktik (Kapital) *</label>
              <input
                type="text"
                value={simCity}
                onChange={(e) => setSimCity(e.target.value.toUpperCase())}
                placeholder="SEMARANG"
                className="mt-1 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 uppercase text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink">Masa Berlaku SIPP Sampai</label>
              <input
                type="date"
                value={simValidUntil}
                onChange={(e) => setSimValidUntil(e.target.value)}
                className="mt-1 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-ink">Asal Universitas Magister Profesi</label>
              <input
                type="text"
                value={simEducation}
                onChange={(e) => setSimEducation(e.target.value)}
                placeholder="Magister Profesi Psikologi Klinis Universitas Diponegoro"
                className="mt-1 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink">Email Akun Mobile</label>
              <input
                type="email"
                value={simEmail}
                onChange={(e) => setSimEmail(e.target.value)}
                placeholder="rania.psi@praktikmandiri.id"
                className="mt-1 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink">Nomor WhatsApp</label>
              <input
                type="tel"
                value={simPhone}
                onChange={(e) => setSimPhone(e.target.value)}
                placeholder="081234567890"
                className="mt-1 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-ink">Jadwal Praktik Mandiri</label>
              <input
                type="text"
                value={simSchedule}
                onChange={(e) => setSimSchedule(e.target.value)}
                placeholder="Senin – Jumat (17.00 – 21.00 WIB)"
                className="mt-1 h-9 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-ink">Spesialisasi Klinis</label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {CLINICAL_SPECIALIZATIONS.map((spec) => {
                const active = simSpecs.includes(spec)
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() =>
                      setSimSpecs((prev) =>
                        prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec],
                      )
                    }
                    className={cn(
                      'cursor-pointer rounded-[6px] border px-2.5 py-1 text-[11px] font-semibold transition-colors',
                      active
                        ? 'border-primary bg-[#EEF0FF] text-primary'
                        : 'border-[#CBD5E1] bg-white text-ink-soft',
                    )}
                  >
                    {spec}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 cursor-pointer items-center rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 font-semibold text-ink"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] bg-primary px-4 font-semibold text-white hover:bg-primary-hover"
            >
              <Users className="size-3.5" /> Kirim Pengajuan Mobile &amp; Sertifikat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

