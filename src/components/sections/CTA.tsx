import { CheckCircle2, Lock, Mail, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Button, Container, Input, LunaOrb } from '@/components/ui'
import { waitlist } from '@/content/landing'
import { addWaitlistEntry } from '@/lib/portalStore'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^(\+62|62|0)8[0-9]{7,12}$/

type Status = 'idle' | 'invalid' | 'success'

export function CTA() {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [partnerTopic, setPartnerTopic] = useState<string | null>(null)

  useEffect(() => {
    const onPartnerInquiry = (e: Event) => {
      const customEvent = e as CustomEvent<{ topic: string }>
      const topic = customEvent.detail?.topic
      if (topic) {
        setPartnerTopic(topic)
        setStatus((prev) => (prev === 'success' ? 'idle' : prev))
        window.setTimeout(() => {
          document.getElementById('waitlist-contact')?.focus()
        }, 450)
      }
    }
    window.addEventListener('eva:partner-inquiry', onPartnerInquiry)
    return () => window.removeEventListener('eva:partner-inquiry', onPartnerInquiry)
  }, [])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const v = value.trim().replace(/[\s-]/g, '')
    if (!EMAIL_RE.test(value.trim()) && !PHONE_RE.test(v)) {
      setStatus('invalid')
      return
    }
    addWaitlistEntry(value.trim(), partnerTopic)
    setStatus('success')
  }

  return (
    <section
      id="early-access"
      aria-labelledby="early-access-title"
      className="relative isolate flex min-h-[100dvh] w-full flex-col justify-center py-20 sm:py-24 lg:py-28"
    >
      <Container className="my-auto">
        <div
          id="early-access-card"
          data-cursor-theme="dark"
          className="reveal relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-obsidian px-6 py-14 sm:px-12 sm:py-20 lg:px-24 lg:py-24 shadow-2xl"
        >
          {/* Ambient atmosphere behind the orb */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-1/2 left-1/2 size-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(83,88,203,0.35)_0%,transparent_70%)]" />
          </div>

          <div className="mx-auto flex max-w-4xl xl:max-w-5xl flex-col items-center text-center">
            <LunaOrb className="size-20" />
            <span className="mt-8 text-overline font-bold tracking-[0.14em] uppercase text-primary-light">
              {waitlist.kicker}
            </span>
            <h2 id="early-access-title" className="mt-4 text-section text-white max-w-3xl">
              {waitlist.title}
            </h2>
            <p className="mt-4 text-body-lg text-white/70 sm:text-[19px] sm:leading-relaxed max-w-2xl">
              {waitlist.description}
            </p>

            {/* Partner inquiry context banner triggered from Footer */}
            {partnerTopic && status !== 'success' && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-pill border border-primary-light/30 bg-primary/25 py-1.5 pr-2.5 pl-3.5 text-caption !tracking-normal text-white backdrop-blur-sm animate-enter">
                <Sparkles className="size-3.5 text-primary-light" />
                <span>
                  Topik: <strong>{partnerTopic}</strong> — masukkan kontakmu untuk dokumen lengkap
                </span>
                <button
                  type="button"
                  onClick={() => setPartnerTopic(null)}
                  data-cursor="HAPUS"
                  aria-label="Hapus topik kemitraan"
                  className="ml-1 flex size-5 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}

            {status === 'success' ? (
              <div
                role="status"
                className="mt-10 flex w-full max-w-2xl animate-enter items-center gap-3 rounded-card border border-white/15 bg-white/10 p-5 text-left backdrop-blur-md"
              >
                <CheckCircle2 className="size-7 shrink-0 text-success" />
                <div>
                  <p className="text-title-md text-white">Kamu sudah masuk daftar! 💜</p>
                  <p className="text-body-md text-white/70">
                    {partnerTopic
                      ? `Tim kemitraan kami juga akan mengirimkan informasi "${partnerTopic}" ke kontakmu.`
                      : 'Kami akan mengabari saat akses beta EVA dibuka.'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-10 w-full max-w-2xl">
                <div className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-white/5 p-2 backdrop-blur-md sm:flex-row sm:rounded-pill">
                  <label htmlFor="waitlist-contact" className="sr-only">
                    Email atau nomor WhatsApp
                  </label>
                  <Input
                    id="waitlist-contact"
                    name="contact"
                    autoComplete="email"
                    inputMode="email"
                    placeholder={
                      partnerTopic
                        ? `Email / WhatsApp untuk info ${partnerTopic}`
                        : waitlist.placeholder
                    }
                    value={value}
                    invalid={status === 'invalid'}
                    aria-describedby="waitlist-hint"
                    onChange={(e) => {
                      setValue(e.target.value)
                      if (status === 'invalid') setStatus('idle')
                    }}
                    leftIcon={<Mail />}
                    containerClassName="h-[52px] w-full border-transparent sm:h-[54px] sm:w-auto sm:flex-1"
                  />
                  <Button
                    id="waitlist-submit"
                    type="submit"
                    data-cursor="GABUNG"
                    size="lg"
                    variant="light"
                    className="h-[52px] w-full shrink-0 sm:h-[54px] sm:w-auto"
                    rightIcon={<Send />}
                  >
                    {waitlist.button}
                  </Button>
                </div>
                <p
                  id="waitlist-hint"
                  className={
                    status === 'invalid'
                      ? 'mt-3 text-caption text-[#FCA5A5]'
                      : 'mt-3 text-caption text-white/50'
                  }
                >
                  {status === 'invalid' ? (
                    'Masukkan email atau nomor WhatsApp yang valid ya.'
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <Lock className="size-3" /> Kami tidak akan pernah membagikan kontakmu.
                    </span>
                  )}
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
