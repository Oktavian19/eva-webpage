import { generateCertificateSvgUri } from '@/demo/data/certificateSvgTemplates'
import { loadPortalDb, savePortalDb } from '@/services/portal/storage'
import type { Psychologist } from '@/types/portal'

export interface SimulateMobilePsychologistInput {
  fullName: string
  sippNumber: string
  strNumber: string
  city: string
  education: string
  email: string
  phone: string
  practiceSchedule: string
  specializations: string[]
  sippValidUntil?: string
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

  const sippNumber = input.sippNumber.trim().toUpperCase()
  const strNumber = input.strNumber.trim().toUpperCase()
  const city = input.city.trim().toUpperCase()
  const validUntil = input.sippValidUntil || '2029-12-31'

  const created: Psychologist = {
    id: `psy-mandiri-${Date.now()}`,
    partnerId: null,
    practiceType: 'mandiri',
    verificationStatus: 'pending',
    fullName: input.fullName.trim(),
    sippNumber,
    strNumber,
    city,
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
        title: `Surat Izin Praktik Psikologi (SIPP) — ${city}`,
        documentNumber: sippNumber,
        issuedBy: `HIMPSI Wilayah ${city}`,
        issuedYear: '2024',
        validUntil,
        fileName: `SIPP_${slug}.pdf`,
        fileSize: '1.3 MB',
        verified: false,
        imageUrl: generateCertificateSvgUri({
          docType: 'SIPP',
          title: `Surat Izin Praktik Psikologi (SIPP) — ${city}`,
          documentNumber: sippNumber,
          issuedBy: `HIMPSI Wilayah ${city}`,
          holderName: input.fullName.trim(),
          validUntil,
        }),
      },
      {
        id: `doc-str-${Date.now() + 1}`,
        docType: 'STR HIMPSI',
        title: 'Surat Tanda Registrasi Psikolog Klinis (STR-PK)',
        documentNumber: strNumber,
        issuedBy: 'Ikatan Psikolog Klinis (IPK) Indonesia / Kemenkes RI',
        issuedYear: '2024',
        validUntil,
        fileName: `STR_PK_${slug}.pdf`,
        fileSize: '940 KB',
        verified: false,
        imageUrl: generateCertificateSvgUri({
          docType: 'STR HIMPSI',
          title: 'Surat Tanda Registrasi Psikolog Klinis (STR-PK)',
          documentNumber: strNumber,
          issuedBy: 'Ikatan Psikolog Klinis (IPK) Indonesia / Kemenkes RI',
          holderName: input.fullName.trim(),
          validUntil,
        }),
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
        imageUrl: generateCertificateSvgUri({
          docType: 'Ijazah Profesi',
          title: `Ijazah & Sertifikat Profesi — ${input.education.trim()}`,
          documentNumber: `IJZ-PSI-${Math.floor(1000 + Math.random() * 9000)}`,
          issuedBy: input.education.trim(),
          holderName: input.fullName.trim(),
          validUntil: 'Seumur Hidup',
        }),
      },
    ],
  }

  db.psychologists.unshift(created)
  savePortalDb(db)
  return created
}

