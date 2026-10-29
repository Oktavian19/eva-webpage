import { useEffect, useState } from 'react'
import { FeatureScreen } from '@/components/mockups/AppScreens'
import { PhoneFrame } from '@/components/mockups/PhoneFrame'
import { Container, IconTile, SectionHeading } from '@/components/ui'
import { features, type FeatureId } from '@/content/landing'
import { usePrefersReducedMotion } from '@/hooks/useScroll'
import { cn } from '@/lib/cn'

const AUTO_CYCLE_MS = 5500

export function Features() {
  const [activeId, setActiveId] = useState<FeatureId>('voice')
  const [paused, setPaused] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const active = features.find((f) => f.id === activeId)!

  // Gentle auto-cycle across features when not hovered/paused
  useEffect(() => {
    if (paused || reducedMotion) return

    const timer = window.setInterval(() => {
      setActiveId((current) => {
        const idx = features.findIndex((f) => f.id === current)
        const nextIdx = (idx + 1) % features.length
        return features[nextIdx].id
      })
    }, AUTO_CYCLE_MS)

    return () => window.clearInterval(timer)
  }, [paused, reducedMotion])

  return (
    <section id="fitur" aria-labelledby="fitur-title" className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="fitur-title"
          title={
            <>
              Dirancang untuk hari-hari yang <span className="text-primary">terasa berat</span>
            </>
          }
          description="Enam pendamping kecil yang bekerja bersama — dari curhat suara hingga jembatan ke psikolog profesional."
        />

        <div
          className="mt-14 grid items-start gap-10 lg:mt-20 lg:grid-cols-[1fr_420px] lg:gap-14 xl:grid-cols-[1fr_450px] xl:gap-20 2xl:grid-cols-[1fr_470px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* Feature cards */}
          <div
            className="order-2 grid gap-6 sm:grid-cols-2 lg:order-1"
            role="group"
            aria-label="Pilih fitur untuk pratinjau"
          >
            {features.map((f) => {
              const Icon = f.icon
              const isActive = f.id === activeId
              return (
                <button
                  key={f.id}
                  id={`feature-${f.id}`}
                  type="button"
                  data-cursor="PRATINJAU"
                  aria-pressed={isActive}
                  aria-controls="feature-preview"
                  onClick={() => setActiveId(f.id)}
                  onMouseEnter={() =>
                    window.matchMedia('(hover: hover)').matches && setActiveId(f.id)
                  }
                  className={cn(
                    'reveal group relative flex flex-col items-start rounded-card p-6 sm:p-8 text-left',
                    'border-[1.2px] transition-[transform,box-shadow,background-color,border-color] duration-300 ease-luna',
                    isActive
                      ? 'border-primary/25 bg-white shadow-nav lg:-translate-y-1'
                      : 'border-border-subtle/80 bg-white/80 shadow-subtle hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-nav',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-x-6 top-0 h-[3px] rounded-b-full bg-primary transition-opacity duration-300',
                      isActive ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="flex w-full items-center justify-between gap-3">
                    <IconTile
                      tone={f.tone}
                      className="transition-transform duration-300 ease-luna group-hover:scale-105"
                    >
                      <Icon />
                    </IconTile>
                    <span className="text-right text-[10px] font-extrabold tracking-[0.1em] text-ink-muted uppercase">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-title-md sm:text-[19px]">{f.title}</h3>
                  <p className="mt-2 text-body-md text-ink-soft leading-relaxed">{f.body}</p>
                </button>
              )
            })}
          </div>

          {/* Sticky preview */}
          <div className="order-1 lg:sticky lg:top-28 lg:order-2">
            <div className="relative mx-auto flex w-fit flex-col items-center">
              <PhoneFrame className="w-[300px] sm:w-[330px] lg:w-[350px] xl:w-[370px]">
                <div
                  id="feature-preview"
                  key={activeId}
                  role="img"
                  aria-label={`Pratinjau layar: ${active.title}`}
                  className="h-full animate-enter"
                >
                  <FeatureScreen id={activeId} />
                </div>
              </PhoneFrame>

              {/* Mobile & Tablet Quick-Switcher Pills so users don't have to scroll down/up */}
              <div
                role="tablist"
                aria-label="Ganti layar pratinjau fitur cepat"
                className="mt-5 flex max-w-[350px] flex-wrap items-center justify-center gap-1.5 lg:hidden"
              >
                {features.map((f) => {
                  const Icon = f.icon
                  const isActive = f.id === activeId
                  return (
                    <button
                      key={`pill-${f.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveId(f.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-caption !tracking-normal font-semibold transition-all duration-200',
                        isActive
                          ? 'border-primary bg-primary text-white shadow-btn'
                          : 'border-border-subtle bg-white text-ink-soft hover:border-primary/30 hover:text-ink',
                      )}
                    >
                      <Icon className="size-3.5" />
                      <span>{f.title.split(' ')[0]}</span>
                    </button>
                  )
                })}
              </div>

              <div
                className="mt-5 flex max-w-[360px] items-start gap-3 rounded-[18px] border border-border-subtle/80 bg-white p-4 shadow-subtle lg:mt-6"
                aria-live="polite"
              >
                <IconTile tone={active.tone} size="sm">
                  <active.icon />
                </IconTile>
                <div>
                  <p className="text-overline text-primary uppercase">Masalah yang diselesaikan</p>
                  <p className="mt-1 text-body-md text-ink">{active.problem}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
