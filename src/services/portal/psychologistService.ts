import { loadPortalDb, savePortalDb } from './storage'
import type { Psychologist, PsychologistStatus } from '@/types/portal'

export { simulateMobilePsychologistSubmission } from '@/demo/features/simulateSubmission'

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
