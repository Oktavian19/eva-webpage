/**
 * Placeholder app screens rendered inside <PhoneFrame>.
 * They mimic the EVA mobile UI using the shared design tokens and can be
 * replaced 1:1 by real screenshots later (see PhoneFrame `screenshot` prop).
 */
import {
  BookOpen,
  Check,
  Flame,
  Home,
  Lightbulb,
  MessageCircle,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Play,
  Plus,
  Quote,
  Siren,
  User,
  Wind,
} from 'lucide-react'
import type { ComponentType, CSSProperties } from 'react'
import { LunaOrb } from '@/components/ui'
import type { FeatureId } from '@/content/landing'
import { cn } from '@/lib/cn'

const glassMini = 'glass rounded-[18px]'

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */
function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-5 pt-3">
      {subtitle && <p className="text-[10px] font-extrabold tracking-[0.12em] text-primary uppercase">{subtitle}</p>}
      <p className="mt-0.5 text-[17px] font-bold text-ink">{title}</p>
    </div>
  )
}

function FloatingNav({ active = 0 }: { active?: number }) {
  const items = [Home, MessageCircle, null, BookOpen, User]
  return (
    <div className="absolute inset-x-3 bottom-3 flex h-[54px] items-center justify-around rounded-pill border border-white/80 bg-white/95 shadow-nav">
      {items.map((Icon, i) =>
        Icon ? (
          <span
            key={i}
            className={cn(
              'flex h-9 w-11 items-center justify-center rounded-[14px] transition-colors',
              i === active ? 'bg-primary-container text-primary' : 'text-ink-muted',
            )}
          >
            <Icon className="size-[18px]" strokeWidth={i === active ? 2.4 : 1.8} />
          </span>
        ) : (
          <span
            key={i}
            className="-mt-6 flex size-[46px] items-center justify-center rounded-full border-[3px] border-white bg-luna-fab text-white shadow-fab"
          >
            <Mic className="size-5" />
          </span>
        ),
      )}
    </div>
  )
}

export function Waveform({ bars = 28, className }: { bars?: number; className?: string }) {
  return (
    <div className={cn('flex h-10 items-center justify-center gap-[3px]', className)} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 30 + Math.abs(Math.sin(i * 1.7)) * 70
        return (
          <span
            key={i}
            className="w-[3px] origin-center animate-wave rounded-full bg-linear-to-t from-primary to-primary-light"
            style={{ height: `${h}%`, animationDelay: `${(i % 7) * 110}ms` } as CSSProperties}
          />
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Home (Hero)                                                         */
/* ------------------------------------------------------------------ */
export function HomeScreen() {
  const moods = ['😌 Tenang', '😮‍💨 Lelah', '😟 Cemas', '🙂 Baik']
  return (
    <div className="h-full">
      <div className="flex items-center justify-between px-5 pt-3">
        <div>
          <p className="text-[11px] font-semibold text-ink-muted">Selamat malam,</p>
          <p className="text-[17px] font-bold text-ink">Raka 🌙</p>
        </div>
        <span className="flex items-center gap-1 rounded-pill bg-white/80 px-2.5 py-1 text-[10px] font-bold text-[#E2683C] shadow-subtle">
          <Flame className="size-3" /> 7 hari
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <LunaOrb className="size-[104px]" />
        <p className="mt-5 text-[13px] font-semibold text-ink">Bagaimana perasaanmu hari ini?</p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5 px-4">
          {moods.map((m, i) => (
            <span
              key={m}
              className={cn(
                'rounded-pill px-2.5 py-1 text-[10px] font-semibold',
                i === 0 ? 'bg-primary text-white shadow-btn' : 'border border-border-subtle bg-white text-ink-soft',
              )}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 px-4">
        <div className={cn(glassMini, 'p-3')}>
          <span className="flex size-7 items-center justify-center rounded-[10px] bg-tertiary/50 text-tertiary-dark">
            <Wind className="size-3.5" />
          </span>
          <p className="mt-2 text-[11px] font-semibold text-ink">Napas 4-7-8</p>
          <p className="text-[9px] text-ink-muted">3 menit</p>
        </div>
        <div className={cn(glassMini, 'p-3')}>
          <span className="flex size-7 items-center justify-center rounded-[10px] bg-secondary text-secondary-dark">
            <BookOpen className="size-3.5" />
          </span>
          <p className="mt-2 text-[11px] font-semibold text-ink">Diari Hari Ini</p>
          <p className="text-[9px] text-ink-muted">Siap dibaca</p>
        </div>
      </div>

      <div className="mx-4 mt-2.5 rounded-[18px] bg-luna-insight p-3">
        <p className="flex items-center gap-1 text-[9px] font-extrabold tracking-[0.1em] text-primary uppercase">
          <Lightbulb className="size-3" /> Catatan EVA
        </p>
        <p className="mt-1 text-[10.5px] leading-snug text-secondary-dark">
          Kamu sudah jujur pada perasaanmu minggu ini. Itu langkah yang berani. 💜
        </p>
      </div>

      <FloatingNav active={0} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Feature screens                                                     */
/* ------------------------------------------------------------------ */
function VoiceScreen() {
  return (
    <div className="flex h-full flex-col items-center bg-[linear-gradient(180deg,#EEF0FF_0%,#E3E6FF_60%,#F3F5FF_100%)] px-5 pt-6">
      <p className="text-[10px] font-extrabold tracking-[0.14em] text-primary uppercase">Sedang mendengarkan</p>
      <p className="mt-1 text-[12px] font-semibold text-ink-soft">04:12</p>
      <div className="relative mt-10 flex items-center justify-center">
        <span className="absolute size-[190px] animate-ping rounded-full border border-primary-light/30 [animation-duration:3.2s]" />
        <span className="absolute size-[160px] rounded-full border border-primary-light/40" />
        <LunaOrb className="size-[130px]" />
      </div>
      <Waveform className="mt-12" />
      <div className={cn(glassMini, 'mt-4 w-full p-3 text-center text-[11px] leading-snug text-ink-soft')}>
        “Aku dengar napasmu agak berat. Mau kita pelan-pelan dulu, tarik napas bareng?”
      </div>
      <div className="mt-auto mb-8 flex items-center gap-6">
        <span className="flex size-12 items-center justify-center rounded-full bg-white text-ink-soft shadow-subtle">
          <MicOff className="size-5" />
        </span>
        <span className="flex size-14 items-center justify-center rounded-full bg-error text-white shadow-[0_6px_20px_rgba(186,26,26,0.4)]">
          <PhoneOff className="size-6" />
        </span>
        <span className="flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-subtle">
          <MessageCircle className="size-5" />
        </span>
      </div>
    </div>
  )
}

function QuestScreen() {
  const quests = [
    { t: '3 Menit Grounding', d: 'Teknik 5-4-3-2-1', c: 'bg-tertiary/50 text-tertiary-dark', done: true },
    { t: 'Napas Diafragma', d: '2 menit • Relaksasi', c: 'bg-primary-container text-primary', done: false },
    { t: 'Lepaskan Pikiran Kalut', d: '5 menit • Refleksi', c: 'bg-secondary text-secondary-dark', done: false },
  ]
  return (
    <div className="h-full">
      <ScreenHeader subtitle="Misi Hari Ini" title="Resilience Quests" />
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-[18px] bg-luna-fab p-3.5 text-white shadow-btn">
        <span className="flex size-10 items-center justify-center rounded-[12px] bg-white/20">
          <Flame className="size-5" />
        </span>
        <div className="flex-1">
          <p className="text-[12px] font-bold">Streak welas asih: 7 hari</p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-white/25">
            <span className="block h-full w-2/3 rounded-pill bg-white" />
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-2.5 px-4">
        {quests.map((q) => (
          <div key={q.t} className={cn(glassMini, 'flex items-center gap-3 p-3')}>
            <span className={cn('flex size-9 items-center justify-center rounded-[12px]', q.c)}>
              <Wind className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-ink">{q.t}</p>
              <p className="text-[10px] text-ink-muted">{q.d}</p>
            </div>
            <span
              className={cn(
                'flex size-8 items-center justify-center rounded-full',
                q.done ? 'bg-success/15 text-success' : 'bg-primary text-white shadow-btn',
              )}
            >
              {q.done ? <Check className="size-4" /> : <Play className="size-3.5 translate-x-px fill-current" />}
            </span>
          </div>
        ))}
      </div>
      <FloatingNav active={1} />
    </div>
  )
}

function AvatarScreen() {
  const poses = [
    { label: 'Cemas', face: '😮‍💨', bg: 'from-tertiary to-primary-light', hint: 'Ayo bernapas bareng' },
    { label: 'Mendengar', face: '🥹', bg: 'from-secondary to-primary-light', hint: 'Aku di sini' },
    { label: 'Cerah', face: '😊', bg: 'from-blush to-[#FFD8A8]', hint: 'Kamu hebat hari ini!' },
  ]
  return (
    <div className="h-full">
      <ScreenHeader subtitle="Mood Avatar" title="Perjalanan Emosimu" />
      <div className="mt-6 flex flex-col items-center">
        <div className="relative flex size-[130px] items-center justify-center rounded-full bg-linear-to-br from-blush via-secondary to-tertiary shadow-halo">
          <span className="animate-breath text-[56px]">😊</span>
        </div>
        <p className="mt-3 rounded-pill bg-white/85 px-3 py-1 text-[11px] font-semibold text-primary shadow-subtle">
          “Kamu hebat hari ini!” ✨
        </p>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 px-4">
        {poses.map((p) => (
          <div key={p.label} className={cn(glassMini, 'flex flex-col items-center p-2.5')}>
            <span className={cn('flex size-10 items-center justify-center rounded-full bg-linear-to-br text-[20px]', p.bg)}>
              {p.face}
            </span>
            <p className="mt-1.5 text-[10px] font-semibold text-ink">{p.label}</p>
            <p className="text-center text-[8.5px] leading-tight text-ink-muted">{p.hint}</p>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-3 flex h-14 items-end gap-1.5 rounded-[18px] bg-white/70 p-2.5">
        {[40, 55, 35, 60, 72, 66, 85].map((h, i) => (
          <span key={i} className="flex-1 rounded-t-[4px] bg-linear-to-t from-primary-light/60 to-blush/70" style={{ height: `${h}%` }} />
        ))}
      </div>
      <FloatingNav active={4} />
    </div>
  )
}

function DiaryScreen() {
  return (
    <div className="h-full">
      <ScreenHeader subtitle="Diari Otomatis" title="Selasa, 26 Okt" />
      <div className={cn(glassMini, 'mx-4 mt-3 p-3.5')}>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-[8px] bg-secondary px-2 py-0.5 text-[9.5px] font-semibold text-secondary-dark">😮‍💨 Lelah</span>
          <span className="rounded-[8px] bg-tertiary/50 px-2 py-0.5 text-[9.5px] font-semibold text-tertiary-dark">Akademik</span>
          <span className="rounded-[8px] bg-primary-container px-2 py-0.5 text-[9.5px] font-semibold text-primary">Sesi suara • 12 mnt</span>
        </div>
        <p className="mt-2.5 text-[11.5px] leading-snug text-ink-soft">
          Hari ini kamu bercerita tentang tekanan skripsi dan rasa takut mengecewakan orang tua…
        </p>
      </div>
      <div className="mx-4 mt-2.5 rounded-[18px] bg-luna-insight p-3.5">
        <p className="flex items-center gap-1 text-[9px] font-extrabold tracking-[0.1em] text-primary uppercase">
          <Lightbulb className="size-3" /> Key insight
        </p>
        <p className="mt-1 text-[11px] leading-snug text-secondary-dark">
          Pola “all-or-nothing”: satu revisi terasa seperti kegagalan total.
        </p>
      </div>
      <div className={cn(glassMini, 'mx-4 mt-2.5 p-3.5')}>
        <Quote className="size-4 text-primary-light" />
        <p className="mt-1 text-[11px] leading-snug font-medium text-ink italic">
          Kemajuan kecil tetaplah kemajuan.
        </p>
      </div>
      <div className="mx-4 mt-2.5 flex items-center gap-2.5 rounded-[18px] border border-success/25 bg-success/10 p-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-success text-white">
          <Check className="size-3.5" />
        </span>
        <p className="text-[10.5px] font-semibold text-[#0F7A57]">Langkah nyata: kerjakan 1 sub-bab, lalu istirahat 10 menit.</p>
      </div>
      <FloatingNav active={3} />
    </div>
  )
}

function ScreeningScreen() {
  const scales = [
    { k: 'Stres', v: 38, c: 'bg-dass-mild', l: 'Ringan' },
    { k: 'Kecemasan', v: 62, c: 'bg-dass-moderate', l: 'Sedang' },
    { k: 'Depresi', v: 22, c: 'bg-dass-normal', l: 'Normal' },
  ]
  return (
    <div className="h-full">
      <ScreenHeader subtitle="Skrining DASS-21" title="Hasil Minggu Ini" />
      <div className={cn(glassMini, 'mx-4 mt-3 space-y-3.5 p-4')}>
        {scales.map((s) => (
          <div key={s.k}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-ink">{s.k}</span>
              <span className="font-bold text-ink-soft">{s.l}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-pill bg-primary-container/70">
              <span className={cn('block h-full rounded-pill', s.c)} style={{ width: `${s.v}%` }} />
            </div>
          </div>
        ))}
        <div className="flex gap-1 pt-1">
          {['bg-dass-normal', 'bg-dass-mild', 'bg-dass-moderate', 'bg-dass-severe', 'bg-dass-extreme'].map((c) => (
            <span key={c} className={cn('h-1 flex-1 rounded-pill', c)} />
          ))}
        </div>
      </div>
      <div className="mx-4 mt-2.5 rounded-[18px] bg-luna-insight p-3.5">
        <p className="text-[11.5px] font-bold text-ink">Jembatan ke Psikolog</p>
        <p className="mt-1 text-[10.5px] leading-snug text-secondary-dark">
          Intake Summary siap dibagikan — tanpa isi obrolan pribadimu.
        </p>
        <span className="mt-2.5 inline-flex h-8 items-center rounded-pill bg-primary px-3.5 text-[10.5px] font-semibold text-white shadow-btn">
          Hubungkan dengan psikolog HIMPSI
        </span>
      </div>
      <FloatingNav active={4} />
    </div>
  )
}

function SafetyScreen() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 opacity-60 blur-[2px]">
        <ScreenHeader subtitle="Sesi curhat" title="EVA" />
        <div className="mt-4 space-y-2 px-4">
          <div className="ml-auto w-3/4 rounded-[16px] rounded-br-[4px] bg-primary p-2.5 text-[10px] text-white">…</div>
          <div className="w-3/4 rounded-[16px] rounded-bl-[4px] bg-white p-2.5 text-[10px] text-ink-soft">…</div>
        </div>
      </div>
      <div className="absolute inset-0 bg-obsidian/30" />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-5 pt-3 pb-6 shadow-nav">
        <span className="mx-auto block h-1 w-10 rounded-pill bg-border-subtle" />
        <div className="mt-4 rounded-[16px] border border-crisis-border bg-crisis-bg p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-crisis-text">
            <Siren className="size-3.5" /> Kamu tidak sendirian
          </p>
          <p className="mt-1 text-[10.5px] leading-snug text-crisis-text/80">
            Keselamatanmu yang utama. Bantuan profesional siap 24 jam, gratis.
          </p>
        </div>
        <span className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-pill bg-[#DC2626] text-[11px] font-semibold text-white shadow-[0_6px_18px_rgba(220,38,38,0.35)]">
          <PhoneCall className="size-4" /> Hubungi 119 Ext 8
        </span>
        <span className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-pill border-[1.5px] border-border-subtle text-[11px] font-semibold text-ink">
          <Plus className="size-3.5" /> Kabari kerabat terdaftar
        </span>
      </div>
    </div>
  )
}

const featureScreens: Record<FeatureId, ComponentType> = {
  voice: VoiceScreen,
  quest: QuestScreen,
  avatar: AvatarScreen,
  diary: DiaryScreen,
  screening: ScreeningScreen,
  safety: SafetyScreen,
}

export function FeatureScreen({ id }: { id: FeatureId }) {
  const Screen = featureScreens[id]
  return <Screen />
}
