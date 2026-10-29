import { useMemo } from 'react'
import type { PortalDatabase } from '@/types/portal'
import type {
  ActionSummary,
  DailyPoint,
  DashboardRange,
  DassDistributionItem,
  KpiMetric,
  PsychologistCompositionItem,
  QueueItem,
  SparkPoint,
} from '@/types/adminDashboard'
import {
  BASELINE_DASS,
  BASELINE_USERS,
  buildHistorySeed,
} from '@/demo/data/dashboardHistorySeed'

export function useAdminDashboardMetrics(db: PortalDatabase, range: DashboardRange) {
  return useMemo(() => {
    // 1. Combine deterministic 60-day seed with real store events
    const basePoints = buildHistorySeed()
    const pointMap = new Map<string, DailyPoint>()
    basePoints.forEach((p) => pointMap.set(p.date, { ...p }))

    // Add real users from db to matching date point
    db.generalUsers.forEach((u) => {
      const dateKey = u.joinedAt?.slice(0, 10)
      if (dateKey && pointMap.has(dateKey)) {
        const pt = pointMap.get(dateKey)!
        pt.newUsers += 1
      }
    })

    // Add real referrals from db to matching date point
    db.referrals.forEach((r) => {
      const dateKey = r.submittedAt?.slice(0, 10)
      if (dateKey && pointMap.has(dateKey)) {
        const pt = pointMap.get(dateKey)!
        pt.referrals += 1
      }
    })

    const fullSeries = Array.from(pointMap.values())
    const currentSlice = fullSeries.slice(-range)
    const prevSlice = fullSeries.slice(-range * 2, -range)

    // Helper for percentage delta
    const calcDelta = (curr: number, prev: number): number | null => {
      if (prev <= 0) return null
      return Math.round(((curr - prev) / prev) * 1000) / 10
    }

    // 2. Metrics calculation
    const totalUsers = BASELINE_USERS + db.generalUsers.length
    const currNewUsers = currentSlice.reduce((s, p) => s + p.newUsers, 0)
    const prevNewUsers = prevSlice.reduce((s, p) => s + p.newUsers, 0)
    const usersDelta = calcDelta(currNewUsers, prevNewUsers)

    const approvedMandiri = db.psychologists.filter(
      (p) => p.practiceType === 'mandiri' && p.verificationStatus === 'approved',
    ).length
    const faskesPsy = db.psychologists.filter((p) => p.practiceType !== 'mandiri').length
    const verifiedPsyTotal = approvedMandiri + faskesPsy
    const pendingMandiri = db.psychologists.filter(
      (p) => p.practiceType === 'mandiri' && p.verificationStatus === 'pending',
    ).length

    const approvedPartners = db.partners.filter((p) => p.status === 'approved').length
    const pendingPartners = db.partners.filter((p) => p.status === 'pending').length

    const currReferrals = currentSlice.reduce((s, p) => s + p.referrals, 0)
    const prevReferrals = prevSlice.reduce((s, p) => s + p.referrals, 0)
    const referralsDelta = calcDelta(currReferrals, prevReferrals)

    // Sparklines (range-based)
    let cumulativeUsers = totalUsers - currNewUsers
    const usersSpark: SparkPoint[] = currentSlice.map((p) => {
      cumulativeUsers += p.newUsers
      return { date: p.date, value: cumulativeUsers }
    })

    const psySpark: SparkPoint[] = currentSlice.map((p, idx) => ({
      date: p.date,
      value: Math.max(1, verifiedPsyTotal - Math.max(0, Math.floor((range - idx) / 8))),
    }))

    const partnersSpark: SparkPoint[] = currentSlice.map((p, idx) => ({
      date: p.date,
      value: Math.max(1, approvedPartners - Math.max(0, Math.floor((range - idx) / 14))),
    }))

    const referralsSpark: SparkPoint[] = currentSlice.map((p) => ({
      date: p.date,
      value: p.referrals,
    }))

    const kpis: KpiMetric[] = [
      {
        id: 'users',
        label: 'Total Pengguna App',
        value: totalUsers,
        formattedValue: totalUsers.toLocaleString('id-ID'),
        deltaPct: usersDelta,
        sublabel: `+${currNewUsers} pengguna baru (${range} hari)`,
        spark: usersSpark,
        targetModule: 'users_referrals',
      },
      {
        id: 'psychologists',
        label: 'Psikolog Terverifikasi',
        value: verifiedPsyTotal,
        formattedValue: String(verifiedPsyTotal),
        deltaPct: approvedMandiri > 0 ? 12.5 : 0,
        sublabel: `${approvedMandiri} Mandiri · ${faskesPsy} Faskes`,
        spark: psySpark,
        targetModule: 'psychologists',
      },
      {
        id: 'partners',
        label: 'Mitra Faskes Aktif',
        value: approvedPartners,
        formattedValue: String(approvedPartners),
        deltaPct: null,
        sublabel: `${pendingPartners} pengajuan menunggu`,
        spark: partnersSpark,
        targetModule: 'partners',
      },
      {
        id: 'referrals',
        label: `Rujukan Masuk (${range}H)`,
        value: currReferrals,
        formattedValue: String(currReferrals),
        deltaPct: referralsDelta,
        sublabel: `${db.referrals.filter((r) => r.status === 'unassigned').length} belum ditugaskan`,
        spark: referralsSpark,
        targetModule: 'users_referrals',
      },
    ]

    // 3. DASS-21 Distribution
    const dassCounts = { ...BASELINE_DASS }
    db.generalUsers.forEach((u) => {
      if (u.lastDassSeverity && dassCounts[u.lastDassSeverity] !== undefined) {
        dassCounts[u.lastDassSeverity] += 1
      }
    })
    const totalDass = Object.values(dassCounts).reduce((a, b) => a + b, 0)

    const dassDistribution: DassDistributionItem[] = [
      { key: 'Normal', label: 'Normal', count: dassCounts.Normal, pct: Math.round((dassCounts.Normal / totalDass) * 100), color: '#2e7d32' },
      { key: 'Mild', label: 'Ringan', count: dassCounts.Mild, pct: Math.round((dassCounts.Mild / totalDass) * 100), color: '#fbc02d' },
      { key: 'Moderate', label: 'Sedang', count: dassCounts.Moderate, pct: Math.round((dassCounts.Moderate / totalDass) * 100), color: '#f57c00' },
      { key: 'Severe', label: 'Berat', count: dassCounts.Severe, pct: Math.round((dassCounts.Severe / totalDass) * 100), color: '#e65100' },
      { key: 'Extreme', label: 'Sangat Berat', count: dassCounts.Extreme, pct: Math.round((dassCounts.Extreme / totalDass) * 100), color: '#d32f2f' },
    ]

    // 4. Psychologist Composition
    const psychologistComposition: PsychologistCompositionItem[] = [
      { name: 'Mandiri Terverifikasi', value: approvedMandiri, color: '#5358cb' },
      { name: 'Naungan Faskes', value: faskesPsy, color: '#10b981' },
      { name: 'Menunggu Verifikasi', value: pendingMandiri, color: '#f59e0b' },
    ]

    // 5. Action Summary
    const crisisUsers = db.generalUsers.filter(
      (u) => u.crisisProtocolTriggered || u.accountStatus === 'flagged_crisis',
    ).length
    const unassignedRefs = db.referrals.filter((r) => r.status === 'unassigned').length

    const actionSummary: ActionSummary = {
      mandiri: pendingMandiri,
      faskes: pendingPartners,
      crisisAndReferral: crisisUsers + unassignedRefs,
      total: pendingMandiri + pendingPartners + crisisUsers + unassignedRefs,
    }

    // 6. Recent Action Queue (max 5 items, mixed types)
    const queue: QueueItem[] = []

    db.psychologists
      .filter((p) => p.practiceType === 'mandiri' && p.verificationStatus === 'pending')
      .forEach((p) => {
        queue.push({
          id: `psy-${p.id}`,
          kind: 'mandiri',
          title: p.fullName,
          subtitle: `${p.city ?? 'Indonesia'} · ${p.documents?.length ?? 0} berkas sertifikat SIPP/STR`,
          date: p.submittedAt ?? '2026-10-29',
          timeAgo: 'Hari ini',
          badgeLabel: 'Psikolog Mandiri',
          targetModule: 'psychologists',
        })
      })

    db.partners
      .filter((p) => p.status === 'pending')
      .forEach((p) => {
        queue.push({
          id: `partner-${p.id}`,
          kind: 'faskes',
          title: p.facilityName,
          subtitle: `${p.facilityType} · ${p.city} · Izin: ${p.licenseNumber}`,
          date: p.submittedAt,
          timeAgo: p.isResubmitted ? 'Perbaikan' : 'Menunggu',
          badgeLabel: 'Mitra Faskes',
          targetModule: 'partners',
        })
      })

    db.referrals
      .filter((r) => r.status === 'unassigned')
      .forEach((r) => {
        queue.push({
          id: `ref-${r.id}`,
          kind: 'referral',
          title: `Rujukan Pasien ${r.patientCode} (${r.gender}, ${r.age} th)`,
          subtitle: `DASS-21: ${r.dass21.severity} (D:${r.dass21.depression} / A:${r.dass21.anxiety} / S:${r.dass21.stress})`,
          date: r.submittedAt,
          timeAgo: 'Prioritas',
          badgeLabel: 'Rujukan Baru',
          targetModule: 'users_referrals',
        })
      })

    // Sort by date descending and take top 5
    queue.sort((a, b) => b.date.localeCompare(a.date))
    const recentQueue = queue.slice(0, 5)

    return {
      rangeSeries: currentSlice,
      kpis,
      dassDistribution,
      psychologistComposition,
      actionSummary,
      recentQueue,
    }
  }, [db, range])
}

