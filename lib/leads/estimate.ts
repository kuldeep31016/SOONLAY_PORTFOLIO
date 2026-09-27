import type { Feature, Platform, ProductType, Stage, UserType } from "./options"

// Indicative INR figures. Tune these as real project data comes in.
const BASE_COST: Record<ProductType, number> = {
  website: 35_000,
  "web-app": 120_000,
  "mobile-app": 160_000,
  saas: 250_000,
  "internal-tool": 120_000,
  ai: 100_000,
  ecommerce: 130_000,
  mvp: 150_000,
  "not-sure": 120_000
}

const FEATURE_COST: Record<Feature, number> = {
  auth: 15_000,
  payments: 30_000,
  admin: 40_000,
  notifications: 15_000,
  realtime: 50_000,
  ai: 60_000,
  integrations: 35_000,
  "existing-system": 40_000
}

const COST_PER_WEEK = 35_000

export interface EstimateInput {
  productType: ProductType
  users: UserType[]
  platforms: Platform
  features: Feature[]
  stage?: Stage
}

export interface PreliminaryEstimate {
  low: number
  high: number
  weeksLow: number
  weeksHigh: number
}

function roundTo(value: number, step: number) {
  return Math.max(step, Math.round(value / step) * step)
}

export function preliminaryEstimate(input: EstimateInput): PreliminaryEstimate {
  const base = BASE_COST[input.productType]
  let total = base

  const extraRoles = Math.max(0, input.users.length - 1)
  total += extraRoles * base * 0.25

  if (input.platforms === "both") total += base * 0.6

  for (const feature of new Set(input.features)) {
    total += FEATURE_COST[feature]
  }

  if (input.stage === "designs") total *= 0.9
  if (input.stage === "existing-product") total *= 1.1

  const low = roundTo(total * 0.85, 10_000)
  const high = roundTo(total * 1.4, 10_000)
  const weeksLow = Math.min(26, Math.max(1, Math.round(low / COST_PER_WEEK)))
  const weeksHigh = Math.min(30, Math.max(weeksLow + 1, Math.round(high / COST_PER_WEEK)))

  return { low, high, weeksLow, weeksHigh }
}

export function formatInr(amount: number): string {
  if (amount >= 100_000) {
    const lakhs = amount / 100_000
    return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)} lakh`
  }
  return `₹${Math.round(amount / 1000)}k`
}
