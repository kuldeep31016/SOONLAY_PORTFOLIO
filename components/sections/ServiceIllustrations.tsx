import { BarChart3, BrainCircuit, Cloud, FileText, Settings, UserRound } from "lucide-react"

const card = "rounded-lg border border-border bg-surface shadow-[0_12px_30px_-12px_rgba(14,19,17,0.18)]"
const line = "h-1.5 rounded-full bg-[#E3E7E4]"

export function WebIllustration() {
  return (
    <div className={`${card} w-[150px] -rotate-3 p-2.5`}>
      <div className="mb-2 flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#E3E7E4]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#E3E7E4]" />
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
      </div>
      <div className="grid grid-cols-[1fr_1.3fr] gap-2">
        <div className="space-y-1.5 pt-1">
          <div className={`${line} w-full`} />
          <div className={`${line} w-3/4`} />
          <div className={`${line} w-5/6`} />
          <div className={`${line} mt-3 w-2/3`} />
        </div>
        <div className="h-12 rounded bg-accent/90" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="space-y-1.5">
          <div className={`${line} w-14`} />
          <div className={`${line} w-10`} />
        </div>
        <span className="h-6 w-6 rounded-full bg-[conic-gradient(#F2C230_0_65%,#DDEFE6_65%)]" />
      </div>
    </div>
  )
}

export function MobileIllustration() {
  return (
    <div className="relative h-[130px] w-[130px]">
      <div className="absolute left-2 top-1 h-[108px] w-[56px] -rotate-12 rounded-[14px] border-[3px] border-primary bg-gradient-to-b from-accent-2 to-accent p-1.5 shadow-lg">
        <div className="mt-8 h-6 rounded bg-white/25" />
      </div>
      <div className="absolute left-12 top-4 h-[112px] w-[58px] rotate-6 rounded-[14px] border-[3px] border-primary bg-surface p-1.5 shadow-xl">
        <div className="mx-auto mb-2 h-1 w-5 rounded-full bg-primary" />
        <div className="space-y-1.5">
          <div className="h-5 rounded bg-surface-2" />
          <div className={`${line} w-full`} />
          <div className={`${line} w-2/3`} />
          <div className="h-5 rounded bg-surface-2" />
        </div>
      </div>
    </div>
  )
}

export function SaasIllustration() {
  return (
    <div className="relative w-[150px] pt-3">
      <div className={`${card} grid grid-cols-2 gap-2 p-2.5`}>
        <div className="flex h-14 items-end gap-1 rounded bg-surface-2 p-1.5">
          {[40, 65, 50, 85, 70].map((h) => (
            <span key={h} className="w-1.5 rounded-sm bg-accent" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex h-14 items-center rounded bg-surface-2 p-1.5">
          <svg viewBox="0 0 40 20" className="w-full text-accent-2" fill="none">
            <path d="M1 16 L9 10 L15 13 L24 5 L31 9 L39 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <div className={`${line} col-span-2 w-2/3`} />
      </div>
      <span className={`${card} absolute -right-2 top-0 flex h-8 w-8 items-center justify-center text-accent`}>
        <Cloud className="h-4 w-4" />
      </span>
    </div>
  )
}

export function AiIllustration() {
  return (
    <div className="relative h-[120px] w-[150px]">
      <svg viewBox="0 0 150 120" className="absolute inset-0 h-full w-full text-border-bright" fill="none">
        <path d="M75 60 H30 V30 M75 60 H122 V22 M75 60 V104 H40" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className={`${card} absolute left-[52px] top-[36px] flex h-12 w-12 items-center justify-center text-accent`}>
        <BrainCircuit className="h-7 w-7" strokeWidth={1.4} />
      </span>
      <span className={`${card} absolute left-[18px] top-[18px] flex h-6 w-6 items-center justify-center text-muted`}>
        <FileText className="h-3 w-3" />
      </span>
      <span className={`${card} absolute right-[16px] top-[8px] flex h-7 w-7 items-center justify-center text-muted`}>
        <FileText className="h-3.5 w-3.5" />
      </span>
      <span className={`${card} absolute right-[6px] top-[70px] flex h-6 w-6 items-center justify-center text-muted`}>
        <Settings className="h-3 w-3" />
      </span>
    </div>
  )
}

export function BusinessIllustration() {
  const rows = [
    { icon: UserRound, tone: "text-muted", shift: "translate-x-4" },
    { icon: UserRound, tone: "text-accent", shift: "" },
    { icon: BarChart3, tone: "text-accent", shift: "translate-x-2" }
  ]
  return (
    <div className="w-[140px] space-y-2">
      {rows.map((row, index) => (
        <div key={index} className={`${card} flex items-center gap-2 p-2 ${row.shift}`}>
          <span className={`flex h-6 w-6 items-center justify-center rounded bg-surface-2 ${row.tone}`}>
            <row.icon className="h-3.5 w-3.5" />
          </span>
          <div className="flex-1 space-y-1">
            <div className={`${line} w-full`} />
            <div className={`${line} w-2/3`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DesignIllustration() {
  return (
    <div className="relative w-[150px]">
      <div className={`${card} rotate-3 p-2.5`}>
        <div className={`${line} mb-2 w-1/3`} />
        <div className="grid grid-cols-[1fr_1.4fr] gap-2">
          <div className="h-10 rounded bg-surface-2" />
          <div className="space-y-1.5 pt-1">
            <div className={`${line} w-full`} />
            <div className={`${line} w-3/4`} />
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <div className="h-3 w-10 rounded bg-accent/20" />
          <div className="h-3 w-8 rounded bg-surface-2" />
        </div>
      </div>
      <svg viewBox="0 0 24 24" className="absolute -bottom-2 right-8 h-6 w-6 text-primary" fill="currentColor">
        <path d="M5 3 L19 12 L12 13.5 L9 20 Z" />
      </svg>
    </div>
  )
}
