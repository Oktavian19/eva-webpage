import { loadPortalDb, savePortalDb } from './storage'
import type {
  Psychologist,
  PsychologistStatus,
  SimulateMobilePsychologistInput,
} from '@/types/portal'

export function upsertPsychologist(
  input: Omit<Psychologist, 'id'> & { id?: string },
): Psychologist {
  const db = loadPortalDb()
  if (input.id) {
    const idx = db.psychologists.findIndex((p) => p.id === input.id)
    if (idx !== -1) {
      const updated: Psychologist = { ...db.psychologists[idx], ...input, id: input.id }
      db.psychologists[idx] = updated
      savePortalDb(db)
      return updated
    }
  }

  const created: Psychologist = {
    practiceType: input.partnerId ? 'faskes' : 'mandiri',
    verificationStatus: input.partnerId ? 'approved' : 'pending',
    ...input,
    id: `psy-${Date.now()}`,
  }
  db.psychologists.unshift(created)
  savePortalDb(db)
  return created
}

export function updatePsychologistStatus(id: string, status: PsychologistStatus) {
  const db = loadPortalDb()
  const idx = db.psychologists.findIndex((p) => p.id === id)
  if (idx === -1) return
  db.psychologists[idx] = { ...db.psychologists[idx], status }
  savePortalDb(db)
}

export function deletePsychologist(id: string) {
  const db = loadPortalDb()
  db.psychologists = db.psychologists.filter((p) => p.id !== id)
  db.referrals = db.referrals.map((r) =>
    r.assignedPsychologistId === id
      ? { ...r, assignedPsychologistId: null, status: 'unassigned' }
      : r,
  )
  savePortalDb(db)
}

export function togglePsychologistDocumentVerified(psychologistId: string, docId: string) {
  const db = loadPortalDb()
  const idx = db.psychologists.findIndex((p) => p.id === psychologistId)
  if (idx === -1) return
  const docs = db.psychologists[idx].documents ?? []
  db.psychologists[idx] = {
    ...db.psychologists[idx],
    documents: docs.map((d) => (d.id === docId ? { ...d, verified: !d.verified } : d)),
  }
  savePortalDb(db)
}

export function reviewIndependentPsychologist(
  psychologistId: string,
  decision: 'approved' | 'rejected' | 'suspended',
  rejectionReason?: string,
) {
  const db = loadPortalDb()
  const idx = db.psychologists.findIndex((p) => p.id === psychologistId)
  if (idx === -1) return

  const today = new Date().toISOString().slice(0, 10)
  const currentDocs = db.psychologists[idx].documents ?? []

  db.psychologists[idx] = {
    ...db.psychologists[idx],
    verificationStatus: decision,
    status: decision === 'approved' ? 'active' : 'inactive',
    reviewedAt: today,
    rejectionReason:
      decision === 'rejected' ? rejectionReason?.trim() : db.psychologists[idx].rejectionReason,
    documents:
      decision === 'approved'
        ? currentDocs.map((d) => ({ ...d, verified: true }))
        : currentDocs,
  }
  savePortalDb(db)
}

export function simulateMobilePsychologistSubmission(
  input: SimulateMobilePsychologistInput,
): Psychologist {
  const db = loadPortalDb()
  const today = new Date().toISOString().slice(0, 10)
  const slug = input.fullName
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .slice(0, 24)

  const created: Psychologist = {
    id: `psy-mandiri-${Date.now()}`,
    partnerId: null,
    practiceType: 'mandiri',
    verificationStatus: 'pending',
    fullName: input.fullName.trim(),
    sippNumber: input.sippNumber.trim().toUpperCase(),
    strNumber: input.strNumber.trim().toUpperCase(),
    city: input.city.trim().toUpperCase(),
    education: input.education.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    practiceSchedule: input.practiceSchedule.trim(),
    specializations: input.specializations,
    status: 'inactive',
    weeklyQuota: 12,
    yearsExperience: 5,
    submittedAt: today,
    documents: [
      {
        id: `doc-sipp-${Date.now()}`,
        docType: 'SIPP',
        title: `Surat Izin Praktik Psikologi (SIPP) — ${input.city.trim().toUpperCase()}`,
        documentNumber: input.sippNumber.trim().toUpperCase(),
        issuedBy: `HIMPSI Wilayah ${input.city.trim().toUpperCase()}`,
        issuedYear: '2024',
        validUntil: input.sippValidUntil || '2029-12-31',
        fileName: `SIPP_${slug}.pdf`,
        fileSize: '1.3 MB',
        verified: false,
      },
      {
        id: `doc-str-${Date.now() + 1}`,
        docType: 'STR HIMPSI',
        title: 'Surat Tanda Registrasi Psikolog Klinis (STR-PK)',
        documentNumber: input.strNumber.trim().toUpperCase(),
        issuedBy: 'Ikatan Psikolog Klinis (IPK) Indonesia / Kemenkes RI',
        issuedYear: '2024',
        validUntil: input.sippValidUntil || '2029-12-31',
        fileName: `STR_PK_${slug}.pdf`,
        fileSize: '940 KB',
        verified: false,
      },
      {
        id: `doc-ijz-${Date.now() + 2}`,
        docType: 'Ijazah Profesi',
        title: `Ijazah & Sertifikat Profesi — ${input.education.trim()}`,
        documentNumber: `IJZ-PSI-${Math.floor(1000 + Math.random() * 9000)}`,
        issuedBy: input.education.trim(),
        issuedYear: '2021',
        validUntil: 'Seumur Hidup',
        fileName: `Ijazah_Profesi_${slug}.pdf`,
        fileSize: '1.8 MB',
        verified: false,
      },
    ],
  }

  db.psychologists.unshift(created)
  savePortalDb(db)
  return created
}

