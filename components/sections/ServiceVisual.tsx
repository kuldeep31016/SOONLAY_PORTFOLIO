import Image from "next/image"
import { Sparkles } from "lucide-react"

export type ServiceVisualKind = "web" | "mobile" | "saas" | "ai" | "business" | "mvp"

function BrowserShot({ src, alt, label, className }: { src: string; alt: string; label: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-surface shadow-[0_30px_60px_-25px_rgba(28,24,16,0.45)] ring-1 ring-black/5 ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-border-bright" />
        <span className="h-2 w-2 rounded-full bg-border-bright" />
        <span className="h-2 w-2 rounded-full bg-border-bright" />
        <span className="ml-2 truncate rounded bg-surface px-2 py-0.5 text-[10px] text-muted">{label}</span>
      </div>
      <Image src={src} alt={alt} width={1470} height={836} sizes="(min-width:1024px) 560px, 90vw" className="h-auto w-full" />
    </div>
  )
}

function Phone({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`w-[34%] rounded-[1.6rem] bg-primary p-[5px] shadow-[0_30px_60px_-20px_rgba(28,24,16,0.55)] ${className ?? ""}`}>
      <Image src={src} alt={alt} width={402} height={874} sizes="200px" className="h-auto w-full rounded-[1.3rem]" />
    </div>
  )
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="service-visual relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] bg-[radial-gradient(ellipse_at_70%_20%,rgba(242,194,48,0.28),transparent_55%),linear-gradient(160deg,#EFE9DD,#E6DECE)] p-6 sm:p-8">
      {children}
    </div>
  )
}

function AiAssistant() {
  return (
    <div className="absolute inset-6 flex flex-col justify-center sm:inset-10">
      <div className="rounded-2xl bg-surface p-5 shadow-[0_30px_60px_-25px_rgba(28,24,16,0.45)] ring-1 ring-black/5">
        <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-2 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold text-primary">Support assistant</span>
          <span className="ml-auto flex items-center gap-1 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
          </span>
        </div>
        <div className="space-y-3 text-[13px]">
          <p className="sv-bubble ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-white" style={{ animationDelay: "0.2s" }}>
            Where is my order #4821?
          </p>
          <p className="sv-bubble w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2 text-primary" style={{ animationDelay: "1s" }}>
            It shipped this morning and arrives Thursday. Want delivery updates on WhatsApp?
          </p>
          <p className="sv-bubble ml-auto w-fit rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-white" style={{ animationDelay: "1.8s" }}>
            Yes please
          </p>
          <div className="sv-bubble flex w-fit gap-1 rounded-2xl bg-surface-2 px-3.5 py-3" style={{ animationDelay: "2.4s" }}>
            <span className="sv-dot h-1.5 w-1.5 rounded-full bg-muted" />
            <span className="sv-dot h-1.5 w-1.5 rounded-full bg-muted [animation-delay:0.15s]" />
            <span className="sv-dot h-1.5 w-1.5 rounded-full bg-muted [animation-delay:0.3s]" />
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Answers from your docs", "Connected to your CRM", "Hands off to a human"].map((chip) => (
          <span key={chip} className="rounded-full bg-surface/80 px-3 py-1 text-[11px] font-medium text-secondary ring-1 ring-black/5">
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

function MvpPrototype() {
  return (
    <div className="absolute inset-6 sm:inset-10">
      <div className="absolute left-0 top-0 w-[62%] -rotate-3 rounded-xl border-2 border-dashed border-border-bright bg-surface/70 p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted">Wireframe</p>
        <div className="mb-2 h-3 w-2/3 rounded bg-border" />
        <div className="mb-4 h-3 w-1/2 rounded bg-border" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 rounded border border-dashed border-border-bright" />
          <div className="h-12 rounded border border-dashed border-border-bright" />
          <div className="h-12 rounded border border-dashed border-border-bright" />
        </div>
        <div className="mt-3 h-6 w-24 rounded border border-dashed border-border-bright" />
      </div>
      <div className="sv-rise absolute bottom-0 right-0 w-[68%] rotate-2 rounded-xl bg-surface p-4 shadow-[0_30px_60px_-25px_rgba(28,24,16,0.45)] ring-1 ring-black/5">
        <p className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-accent">
          Version 1 <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] text-emerald-700">Live</span>
        </p>
        <p className="font-display text-lg font-semibold text-primary">Book a consultation</p>
        <p className="mb-3 text-[11px] text-muted">Pick a time that works for you</p>
        <div className="grid grid-cols-3 gap-2">
          {["10:00", "11:30", "15:00"].map((slot, i) => (
            <span
              key={slot}
              className={`rounded-lg py-2 text-center text-xs font-semibold ${i === 1 ? "bg-primary text-white" : "bg-surface-2 text-primary"}`}
            >
              {slot}
            </span>
          ))}
        </div>
        <span className="mt-3 block rounded-lg bg-accent-2 py-2 text-center text-xs font-semibold text-primary">Confirm booking</span>
      </div>
      <svg className="absolute left-[40%] top-[34%] hidden h-16 w-16 text-accent lg:block" viewBox="0 0 64 64" fill="none" aria-hidden>
        <path d="M8 8 C 40 8, 52 24, 52 50" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" />
        <path d="M44 44 L52 54 L60 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function ServiceVisual({ kind }: { kind: ServiceVisualKind }) {
  switch (kind) {
    case "web":
      return (
        <Stage>
          <BrowserShot
            src="/images/Telemedine-3.png"
            alt="Telemedicine admin dashboard built by Soonlay"
            label="telemedicine · admin"
            className="absolute left-6 top-6 w-[78%] sm:left-8 sm:top-8"
          />
          <BrowserShot
            src="/images/travel-2.png"
            alt="Travel booking website built by Soonlay"
            label="travel · packages"
            className="sv-rise absolute bottom-6 right-6 w-[72%] sm:bottom-8 sm:right-8"
          />
        </Stage>
      )
    case "saas":
      return (
        <Stage>
          <BrowserShot
            src="/images/Telemedine-2.png"
            alt="Telemedicine billing screen built by Soonlay"
            label="telemedicine · billing"
            className="absolute left-6 top-6 w-[74%] sm:left-8 sm:top-8"
          />
          <BrowserShot
            src="/images/Telemedine-3.png"
            alt="Telemedicine analytics dashboard built by Soonlay"
            label="telemedicine · analytics"
            className="sv-rise absolute bottom-6 right-6 w-[74%] sm:bottom-8 sm:right-8"
          />
        </Stage>
      )
    case "business":
      return (
        <Stage>
          <BrowserShot
            src="/images/mydukan-3.png"
            alt="MyDukan barcode stock entry built by Soonlay"
            label="mydukan · add stock"
            className="absolute left-6 top-6 w-[74%] sm:left-8 sm:top-8"
          />
          <BrowserShot
            src="/images/mydukan-1.png"
            alt="MyDukan inventory dashboard built by Soonlay"
            label="mydukan · inventory"
            className="sv-rise absolute bottom-6 right-6 w-[74%] sm:bottom-8 sm:right-8"
          />
        </Stage>
      )
    case "mobile":
      return (
        <Stage>
          <div className="absolute inset-0 flex items-center justify-center gap-4 px-6">
            <Phone src="/images/dealora-2.png" alt="Dealora coupon app built by Soonlay" className="translate-y-6 -rotate-6" />
            <Phone src="/images/dealora-1.png" alt="Dealora coupon app built by Soonlay" className="sv-rise z-10" />
            <Phone src="/images/Betturmux-1.png" alt="BetterMux terminal app built by Soonlay" className="translate-y-6 rotate-6" />
          </div>
        </Stage>
      )
    case "ai":
      return (
        <Stage>
          <AiAssistant />
        </Stage>
      )
    case "mvp":
      return (
        <Stage>
          <MvpPrototype />
        </Stage>
      )
  }
}
