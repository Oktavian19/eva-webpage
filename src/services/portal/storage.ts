import {
  INITIAL_COPING_QUESTS,
  INITIAL_CRISIS_CONFIG,
  INITIAL_FAQS,
  INITIAL_GENERAL_USERS,
  INITIAL_REFERRAL_LIST,
  INITIAL_WAITLIST,
} from './initialEcosystemData'
import { INITIAL_PARTNERS, INITIAL_PSYCHOLOGISTS } from './initialSeedData'
import type { PortalDatabase, PortalSession } from '@/types/portal'

export const STORAGE_KEY = 'eva_portal_db_v2'
export const SESSION_KEY = 'eva_portal_session_v1'
export const CHANGE_EVENT = 'eva:portal-db-updated'

export const INITIAL_DB: PortalDatabase = {
  partners: INITIAL_PARTNERS,
  psychologists: INITIAL_PSYCHOLOGISTS,
  referrals: INITIAL_REFERRAL_LIST,
  generalUsers: INITIAL_GENERAL_USERS,
  copingQuests: INITIAL_COPING_QUESTS,
  crisisConfig: INITIAL_CRISIS_CONFIG,
  waitlistEntries: INITIAL_WAITLIST,
  faqs: INITIAL_FAQS,
}

export function loadPortalDb(): PortalDatabase {
  if (typeof window === 'undefined') return INITIAL_DB
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DB))
      return INITIAL_DB
    }
    const parsed = JSON.parse(raw) as Partial<PortalDatabase>
    return {
      partners: parsed.partners ?? INITIAL_DB.partners,
      psychologists: parsed.psychologists ?? INITIAL_DB.psychologists,
      referrals: parsed.referrals ?? INITIAL_DB.referrals,
      generalUsers: parsed.generalUsers ?? INITIAL_DB.generalUsers,
      copingQuests: parsed.copingQuests ?? INITIAL_DB.copingQuests,
      crisisConfig: parsed.crisisConfig ?? INITIAL_DB.crisisConfig,
      waitlistEntries: parsed.waitlistEntries ?? INITIAL_DB.waitlistEntries,
      faqs: parsed.faqs ?? INITIAL_DB.faqs,
    }
  } catch {
    return INITIAL_DB
  }
}

export function savePortalDb(db: PortalDatabase) {
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

