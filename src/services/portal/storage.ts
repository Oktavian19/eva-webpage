import { DEMO_CONFIG } from '@/config/demoConfig'
import { INITIAL_DEMO_DB } from '@/demo/data/demoDatabase'
import { EMPTY_PORTAL_DATABASE } from './emptyDatabase'
import type { PortalDatabase, PortalSession } from '@/types/portal'

export const STORAGE_KEY = DEMO_CONFIG.useDummySeedData
  ? 'eva_portal_db_demo_v2'
  : 'eva_portal_db_prod_v1'
export const SESSION_KEY = DEMO_CONFIG.useDummySeedData
  ? 'eva_portal_session_demo_v1'
  : 'eva_portal_session_prod_v1'
export const CHANGE_EVENT = 'eva:portal-db-updated'

export const INITIAL_DB: PortalDatabase = DEMO_CONFIG.useDummySeedData
  ? INITIAL_DEMO_DB
  : EMPTY_PORTAL_DATABASE

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

export function resetPortalDbToDefault() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DB))
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
