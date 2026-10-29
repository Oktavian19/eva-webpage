import { Pause, Play, RotateCcw, Sparkles, Wind, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LunaOrb } from './LunaOrb'
import { cn } from '@/lib/cn'

type Phase = 'inhale' | 'hold' | 'exhale'

interface PhaseMeta {
  label: string
  hint: string
  scale: string
}

const PHASE_DURATION = 4 // 4-4-4 box/calming breath (seconds)
const TOTAL_CYCLES = 3

const PHASE_CONFIG: Record<Phase, PhaseMeta> = {
  inhale: {
    label: 'Tarik Napas Perlahan…',
    hint: 'Rasakan udara segar memenuhi dada melalui hidung',
    scale: 'scale-125',
  },
  hold: {
    label: 'Tahan Sejenak…',
    hint: 'Biarkan bahu dan rahangmu rileks sepenuhnya',
    scale: 'scale-125',
  },
  exhale: {
    label: 'Hembuskan Perlahan…',
    hint: 'Lepaskan ketegangan hari ini lewat mulut secara lembut',
    scale: 'scale-90',
  },
}

const NEXT_PHASE: Record<Phase, Phase> = {
  inhale: 'hold',
  hold: 'exhale',
  exhale: 'inhale',
}

/**
 * Floating micro-relief widget ("Tarik Napas Sejenak Bersama EVA")
 * Gives visitors an immediate 30-second calming breathing exercise powered by LunaOrb.
 */
export function BreathingWidget() {
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATION)
  const [cycle, setCycle] = useState(1)

  const resetSession = (autoStart = true) => {
    setPhase('inhale')
    setSecondsLeft(PHASE_DURATION)
    setCycle(1)
    setCompleted(false)
    setRunning(autoStart)
  }

  const openModal = () => {
    setOpen(true)
    resetSession(true)
  }

  const closeModal = () => {
    setOpen(false)
    setRunning(false)
  }

  // Listen for custom trigger from anywhere on the page
  useEffect(() => {
    const onOpen = () => openModal()
    window.addEventListener('eva:open-breathing', onOpen)
    return () => window.removeEventListener('eva:open-breathing', onOpen)
  })

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Breathing timer tick
  useEffect(() => {
    if (!open || !running || completed) return

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1

        // Advance phase
        setPhase((currentPhase) => {
          const next = NEXT_PHASE[currentPhase]
          if (currentPhase === 'exhale') {
            setCycle((currentCycle) => {
              if (currentCycle >= TOTAL_CYCLES) {
                setRunning(false)
                setCompleted(true)
                return currentCycle
              }
              return currentCycle + 1
            })
          }
          return next
        })
        return PHASE_DURATION
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [open, running, completed])

  const meta = PHASE_CONFIG[phase]

  return (
    <>
      {/* Floating trigger pill at bottom-left */}
      <button
        type="button"
        onClick={openModal}
        data-cursor="TENANG"
        aria-label="Buka latihan tarik napas 30 detik bersama EVA"
        className="group fixed bottom-5 left-5 z-40 flex items-center gap-2.5 rounded-pill border border-primary/20 bg-white/95 py-2 pr-4 pl-2.5 text-left shadow-nav backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 ease-luna hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-fab"
      >
        <span className="relative flex size-8 items-center justify-center rounded-full bg-primary-container text-primary">
          <Wind className="size-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className="absolute -top-0.5 -right-0.5 size-2.5 animate-ping rounded-full bg-primary/60" />
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary" />
        </span>
        <span className="flex flex-col">
          <span className="text-[10px] font-extrabold tracking-wider text-primary uppercase">
            Jeda Tenang
          </span>
          <span className="text-caption !tracking-normal font-bold text-ink">
            Tarik Napas 30 Detik
          </span>
        </span>
      </button>

      {/* Calming Breathing Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="breathing-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            onClick={closeModal}
            data-cursor="TUTUP"
            data-cursor-theme="dark"
            className="fixed inset-0 bg-obsidian/75 backdrop-blur-md transition-opacity animate-enter"
          />

          {/* Dialog Card */}
          <div
            data-cursor-theme="dark"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-white/15 bg-obsidian p-6 text-center text-white shadow-2xl sm:p-8 animate-enter"
          >
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(108,99,255,0.32)_0%,transparent_70%)]"
            />

            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-pill border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold tracking-wider text-primary-light uppercase">
                <Sparkles className="size-3" /> Misi Koping Mikro EVA
              </span>
              <button
                type="button"
                onClick={closeModal}
                data-cursor="TUTUP"
                aria-label="Tutup latihan napas"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <h3 id="breathing-modal-title" className="mt-5 text-headline text-white">
              {completed ? 'Pikiranmu Lebih Ringan 💜' : meta.label}
            </h3>
            <p className="mt-1.5 min-h-[42px] text-body-md text-white/70">
              {completed
                ? 'Tiga siklus pernapasan 4-4-4 selesai. Terima kasih sudah memberi jeda untuk dirimu hari ini.'
                : meta.hint}
            </p>

            {/* Animated LunaOrb centerpiece */}
            <div className="my-10 flex flex-col items-center justify-center">
              <div className="relative flex size-40 items-center justify-center">
                <div
                  className={cn(
                    'transition-transform duration-[4000ms] ease-in-out',
                    running && !completed ? meta.scale : 'scale-100',
                  )}
                >
                  <LunaOrb className="size-28" />
                </div>
                {!completed && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-display font-extrabold text-ink drop-shadow-sm">
                    {secondsLeft}
                  </span>
                )}
              </div>
              <p className="mt-4 text-caption font-semibold tracking-widest text-primary-light uppercase">
                {completed
                  ? 'Selesai · 3 / 3 Siklus'
                  : `Siklus ${cycle} dari ${TOTAL_CYCLES} · Pola 4-4-4`}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {completed ? (
                <>
                  <button
                    type="button"
                    onClick={() => resetSession(true)}
                    data-cursor="ULANGI"
                    className="inline-flex h-11 items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-5 text-body-md font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    <RotateCcw className="size-4" /> Ulangi
                  </button>
                  <a
                    href="#early-access"
                    onClick={closeModal}
                    data-cursor="GABUNG"
                    className="inline-flex h-11 items-center gap-2 rounded-pill bg-white px-6 text-body-md font-bold text-primary shadow-subtle transition-transform hover:scale-[1.02]"
                  >
                    Coba di Aplikasi EVA
                  </a>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setRunning((r) => !r)}
                    data-cursor={running ? 'JEDA' : 'LANJUT'}
                    className="inline-flex h-11 items-center gap-2 rounded-pill bg-white px-6 text-body-md font-bold text-primary shadow-subtle transition-transform hover:scale-[1.02]"
                  >
                    {running ? (
                      <>
                        <Pause className="size-4" /> Jeda
                      </>
                    ) : (
                      <>
                        <Play className="size-4" /> Lanjutkan
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => resetSession(true)}
                    data-cursor="ULANGI"
                    aria-label="Mulai ulang siklus"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

