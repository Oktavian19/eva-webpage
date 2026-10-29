import { useEffect, useState } from 'react'

export type FacilityType =
  | 'Rumah Sakit'
  | 'Klinik Utama'
  | 'Klinik Pratama'
  | 'Biro Psikologi'

export type PartnerStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export interface PartnerAccount {
  id: string
  // Required facility fields
  facilityName: string
  facilityType: FacilityType
  licenseNumber: string
  city: string
  address: string
  // Required PIC fields
  picName: string
  picRole: string
  phone: string
  // Required auth credentials
  email: string
  password: string
  // Optional fields
  website?: string
  operatingHours?: string
  estimatedPsychologists?: number
  bpjsSupported?: boolean
  notes?: string
  // Verification & operational metadata
  status: PartnerStatus
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
  isResubmitted?: boolean
  resubmittedAt?: string
  acceptingReferrals: boolean
}

export type PsychologistStatus = 'active' | 'on_leave' | 'inactive'

export const CLINICAL_SPECIALIZATIONS = [
  'Kecemasan & Panik',
  'Depresi & Mood',
  'Remaja & Mahasiswa',
  'Regulasi Emosi & Stres Akademik',
  'Trauma & Krisis',
  'Relasi & Keluarga',
] as const

export interface Psychologist {
  id: string
  partnerId: string
  // Required fields
  fullName: string
  sippNumber: string
  specializations: string[]
  practiceSchedule: string
  status: PsychologistStatus
  // Optional fields
  weeklyQuota?: number
  yearsExperience?: number
  education?: string
}

export type ReferralStatus = 'unassigned' | 'scheduled' | 'completed'
export type DassSeverity = 'Moderate' | 'Severe' | 'Extreme'

export interface PatientReferral {
  id: string
  partnerId: string
  patientCode: string
  age: number
  gender: 'Perempuan' | 'Laki-laki'
  submittedAt: string
  dass21: {
    depression: number
    anxiety: number
    stress: number
    severity: DassSeverity
  }
  clinicalSummary: string
  preferredSchedule: string
  assignedPsychologistId: string | null
  status: ReferralStatus
}

export interface PortalSession {
  role: 'admin' | 'partner'
  email: string
  partnerId?: string
  loginAt: string
}

interface PortalDatabase {
  partners: PartnerAccount[]
  psychologists: Psychologist[]
  referrals: PatientReferral[]
}

const STORAGE_KEY = 'eva_portal_db_v1'
const SESSION_KEY = 'eva_portal_session_v1'
const CHANGE_EVENT = 'eva:portal-db-updated'

export const ADMIN_ACCOUNT = {
  email: 'admin@eva.id',
  password: 'admin123',
  name: 'Administrator Verifikasi Faskes EVA',
}

const INITIAL_DB: PortalDatabase = {
  partners: [
    {
      id: 'partner-sardjito',
      facilityName: 'Instalasi Kesehatan Jiwa RSUP Dr. Sardjito',
      facilityType: 'Rumah Sakit',
      licenseNumber: '3471015/KEMENKES/RS-A/2024',
      city: 'Yogyakarta',
      address: 'Jl. Kesehatan No. 1, Sekip, Sinduadi, Mlati, Sleman, DI Yogyakarta',
      picName: 'dr. Hendra Wijaya, Sp.KJ (K)',
      picRole: 'Kepala Instalasi Pelayanan Kesehatan Jiwa',
      phone: '08112748200',
      email: 'mitra@rsup-sardjito.co.id',
      password: 'mitra123',
      website: 'https://sardjito.co.id',
      operatingHours: 'Senin – Sabtu, 08.00 – 16.00 WIB',
      estimatedPsychologists: 8,
      bpjsSupported: true,
      notes: 'Melayani rujukan klinis mahasiswa & dewasa muda wilayah DIY dan Jawa Tengah.',
      status: 'approved',
      submittedAt: '2026-09-12',
      reviewedAt: '2026-09-14',
      acceptingReferrals: true,
    },
    {
      id: 'partner-pulih',
      facilityName: 'Klinik Pratama Pulih Bersama',
      facilityType: 'Klinik Pratama',
      licenseNumber: '9120311092481/DINKES-DKI/2025',
      city: 'Jakarta Selatan',
      address: 'Jl. Cipete Raya No. 42, Cilandak, Jakarta Selatan',
      picName: 'Nadia Pramesti, M.Psi., Psikolog',
      picRole: 'Direktur Operasional Klinik',
      phone: '081288904412',
      email: 'klinik@pulihbersama.id',
      password: 'mitra123',
      website: 'https://pulihbersama.id',
      operatingHours: 'Senin – Minggu, 09.00 – 20.00 WIB',
      estimatedPsychologists: 5,
      bpjsSupported: false,
      notes: 'Pengajuan kemitraan untuk rujukan konseling tatap muka dan telekonsultasi klinis.',
      status: 'pending',
      submittedAt: '2026-10-27',
      acceptingReferrals: true,
    },
    {
      id: 'partner-empatia',
      facilityName: 'Biro Psikologi Klinis Empatia',
      facilityType: 'Biro Psikologi',
      licenseNumber: 'SIP-445/018-DINKES',
      city: 'Bandung',
      address: 'Jl. Ir. H. Juanda No. 118, Coblong, Kota Bandung',
      picName: 'Raka Mahendra, M.Psi., Psikolog',
      picRole: 'Psikolog Penanggung Jawab',
      phone: '081322198834',
      email: 'biro@empatia-bandung.id',
      password: 'mitra123',
      operatingHours: 'Senin – Jumat, 09.00 – 17.00 WIB',
      estimatedPsychologists: 3,
      bpjsSupported: false,
      notes: 'Fokus layanan konseling kecemasan akademik mahasiswa.',
      status: 'rejected',
      submittedAt: '2026-10-21',
      reviewedAt: '2026-10-23',
      rejectionReason:
        'Nomor Izin Operasional Faskes belum mencantumkan tahun penerbitan resmi dari Dinas Kesehatan / HIMPSI Wilayah. Mohon perbaiki format Nomor Izin Operasional dan lengkapi detail alamat praktik.',
      acceptingReferrals: false,
    },
  ],
  psychologists: [
    {
      id: 'psy-1',
      partnerId: 'partner-sardjito',
      fullName: 'Ayu Kartika Sari, M.Psi., Psikolog',
      sippNumber: '20190412-2024-02-0814',
      specializations: ['Kecemasan & Panik', 'Remaja & Mahasiswa'],
      practiceSchedule: 'Senin, Rabu, Jumat (08.30 – 15.00 WIB)',
      status: 'active',
      weeklyQuota: 12,
      yearsExperience: 7,
      education: 'Magister Profesi Psikologi Klinis UGM',
    },
    {
      id: 'psy-2',
      partnerId: 'partner-sardjito',
      fullName: 'Dimas Prasetyo, M.Psi., Psikolog',
      sippNumber: '20200819-2025-01-1142',
      specializations: ['Depresi & Mood', 'Regulasi Emosi & Stres Akademik'],
      practiceSchedule: 'Selasa, Kamis, Sabtu (09.00 – 15.30 WIB)',
      status: 'active',
      weeklyQuota: 10,
      yearsExperience: 6,
      education: 'Magister Profesi Psikologi Klinis UI',
    },
    {
      id: 'psy-3',
      partnerId: 'partner-sardjito',
      fullName: 'dr. Clara Shinta, M.Psi., Psikolog',
      sippNumber: '20171103-2023-03-0419',
      specializations: ['Trauma & Krisis', 'Relasi & Keluarga'],
      practiceSchedule: 'Senin – Kamis (10.00 – 14.00 WIB)',
      status: 'on_leave',
      weeklyQuota: 8,
      yearsExperience: 9,
      education: 'Magister Profesi Psikologi Klinis Unpad',
    },
    {
      id: 'psy-4',
      partnerId: 'partner-pulih',
      fullName: 'Nadia Pramesti, M.Psi., Psikolog',
      sippNumber: '20210214-2025-02-0931',
      specializations: ['Kecemasan & Panik', 'Regulasi Emosi & Stres Akademik'],
      practiceSchedule: 'Senin – Jumat (10.00 – 18.00 WIB)',
      status: 'active',
      weeklyQuota: 15,
      yearsExperience: 5,
      education: 'Magister Profesi Psikologi Klinis Unair',
    },
  ],
  referrals: [
    {
      id: 'ref-1',
      partnerId: 'partner-sardjito',
      patientCode: 'EVA-REF-8492',
      age: 21,
      gender: 'Perempuan',
      submittedAt: '2026-10-28',
      dass21: {
        depression: 18,
        anxiety: 22,
        stress: 26,
        severity: 'Severe',
      },
      clinicalSummary:
        'Pengguna melaporkan gangguan tidur selama 3 minggu terakhir dan serangan panik berulang menjelang sidang tugas akhir. Telah menyelesaikan 6 sesi latihan grounding di EVA dan menyetujui rujukan klinis.',
      preferredSchedule: 'Rabu / Jumat Pagi',
      assignedPsychologistId: null,
      status: 'unassigned',
    },
    {
      id: 'ref-2',
      partnerId: 'partner-sardjito',
      patientCode: 'EVA-REF-8410',
      age: 23,
      gender: 'Laki-laki',
      submittedAt: '2026-10-26',
      dass21: {
        depression: 24,
        anxiety: 14,
        stress: 20,
        severity: 'Severe',
      },
      clinicalSummary:
        'Indikasi kelelahan emosional persisten (burnout kerja tahun pertama) dan penurunan minat aktivitas harian. Tidak ditemukan indikasi krisis melukai diri.',
      preferredSchedule: 'Selasa / Kamis Siang',
      assignedPsychologistId: 'psy-2',
      status: 'scheduled',
    },
    {
      id: 'ref-3',
      partnerId: 'partner-sardjito',
      patientCode: 'EVA-REF-8305',
      age: 19,
      gender: 'Perempuan',
      submittedAt: '2026-10-20',
      dass21: {
        depression: 14,
        anxiety: 16,
        stress: 19,
        severity: 'Moderate',
      },
      clinicalSummary:
        'Kesulitan adaptasi perkuliahan semester awal dan kecemasan sosial. Sesi konsultasi awal telah terlaksana dengan baik.',
      preferredSchedule: 'Senin Pagi',
      assignedPsychologistId: 'psy-1',
      status: 'completed',
    },
  ],
}

export function loadPortalDb(): PortalDatabase {
  if (typeof window === 'undefined') return INITIAL_DB
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DB))
      return INITIAL_DB
    }
    return JSON.parse(raw) as PortalDatabase
  } catch {
    return INITIAL_DB
  }
}

function savePortalDb(db: PortalDatabase) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function getPortalSession(): PortalSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as PortalSession) : null
  } catch {
    return null
  }
}

export function setPortalSession(session: PortalSession | null) {
  if (typeof window === 'undefined') return
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY)
  } else {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export type AuthResult =
  | { ok: true; role: 'admin' }
  | { ok: true; role: 'partner'; partner: PartnerAccount }
  | { ok: false; error: string }

export function authenticateUser(emailInput: string, passwordInput: string): AuthResult {
  const email = emailInput.trim().toLowerCase()
  const password = passwordInput

  if (email === ADMIN_ACCOUNT.email.toLowerCase() && password === ADMIN_ACCOUNT.password) {
    setPortalSession({
      role: 'admin',
      email: ADMIN_ACCOUNT.email,
      loginAt: new Date().toISOString(),
    })
    return { ok: true, role: 'admin' }
  }

  const db = loadPortalDb()
  const partner = db.partners.find((p) => p.email.toLowerCase() === email)

  if (!partner || partner.password !== password) {
    return {
      ok: false,
      error: 'Email atau kata sandi tidak sesuai dengan data akun terdaftar.',
    }
  }

  if (partner.status === 'approved') {
    setPortalSession({
      role: 'partner',
      email: partner.email,
      partnerId: partner.id,
      loginAt: new Date().toISOString(),
    })
  }

  return { ok: true, role: 'partner', partner }
}

export type NewPartnerApplicationInput = Omit<
  PartnerAccount,
  'id' | 'status' | 'submittedAt' | 'reviewedAt' | 'rejectionReason' | 'isResubmitted' | 'resubmittedAt' | 'acceptingReferrals'
>

export function submitPartnerApplication(
  input: NewPartnerApplicationInput,
): { ok: true; partner: PartnerAccount } | { ok: false; error: string } {
  const db = loadPortalDb()
  const exists = db.partners.some((p) => p.email.toLowerCase() === input.email.trim().toLowerCase())
  if (exists || input.email.trim().toLowerCase() === ADMIN_ACCOUNT.email) {
    return {
      ok: false,
      error: 'Alamat email ini sudah terdaftar pada sistem. Gunakan email lain atau masuk ke akun Anda.',
    }
  }

  const today = new Date().toISOString().slice(0, 10)
  const newPartner: PartnerAccount = {
    ...input,
    id: `partner-${Date.now()}`,
    email: input.email.trim(),
    status: 'pending',
    submittedAt: today,
    acceptingReferrals: true,
  }

  db.partners.unshift(newPartner)
  savePortalDb(db)
  return { ok: true, partner: newPartner }
}

export function resubmitPartnerApplication(
  partnerId: string,
  updates: Partial<NewPartnerApplicationInput>,
): PartnerAccount | null {
  const db = loadPortalDb()
  const idx = db.partners.findIndex((p) => p.id === partnerId)
  if (idx === -1) return null

  const today = new Date().toISOString().slice(0, 10)
  const updated: PartnerAccount = {
    ...db.partners[idx],
    ...updates,
    status: 'pending',
    isResubmitted: true,
    resubmittedAt: today,
  }

  db.partners[idx] = updated
  savePortalDb(db)
  return updated
}

export function reviewPartnerApplication(
  partnerId: string,
  decision: 'approved' | 'rejected' | 'suspended',
  rejectionReason?: string,
) {
  const db = loadPortalDb()
  const idx = db.partners.findIndex((p) => p.id === partnerId)
  if (idx === -1) return

  const today = new Date().toISOString().slice(0, 10)
  db.partners[idx] = {
    ...db.partners[idx],
    status: decision,
    reviewedAt: today,
    rejectionReason: decision === 'rejected' ? rejectionReason?.trim() : db.partners[idx].rejectionReason,
    isResubmitted: decision === 'approved' ? false : db.partners[idx].isResubmitted,
  }
  savePortalDb(db)
}

export function updatePartnerFacilityProfile(
  partnerId: string,
  updates: Partial<
    Pick<
      PartnerAccount,
      | 'facilityName'
      | 'facilityType'
      | 'licenseNumber'
      | 'city'
      | 'address'
      | 'picName'
      | 'picRole'
      | 'phone'
      | 'website'
      | 'operatingHours'
      | 'bpjsSupported'
      | 'notes'
      | 'acceptingReferrals'
    >
  >,
) {
  const db = loadPortalDb()
  const idx = db.partners.findIndex((p) => p.id === partnerId)
  if (idx === -1) return
  db.partners[idx] = { ...db.partners[idx], ...updates }
  savePortalDb(db)
}

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

export function assignReferral(
  referralId: string,
  psychologistId: string | null,
  status: ReferralStatus,
) {
  const db = loadPortalDb()
  const idx = db.referrals.findIndex((r) => r.id === referralId)
  if (idx === -1) return
  db.referrals[idx] = {
    ...db.referrals[idx],
    assignedPsychologistId: psychologistId,
    status,
  }
  savePortalDb(db)
}

export function usePortalDb() {
  const [db, setDb] = useState<PortalDatabase>(() => loadPortalDb())
  const [session, setSession] = useState<PortalSession | null>(() => getPortalSession())

  useEffect(() => {
    const sync = () => {
      setDb(loadPortalDb())
      setSession(getPortalSession())
    }
    window.addEventListener(CHANGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { db, session }
}

