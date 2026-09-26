import "server-only"

import { ParsedResume, ResumeParserProvider } from "../providers"

export interface ProviderResult {
  provider: string
  success: boolean
  data?: ParsedResume
  error?: string
}

export async function parseResumeWithFallback(
  resumeText: string,
  providers: ResumeParserProvider[]
): Promise<ParsedResume> {
  const results: ProviderResult[] = []

  for (const provider of providers) {
    try {
      console.log(`[resume/parse] Trying provider: ${provider.name}`)
      const startTime = Date.now()
      const data = await provider.parse(resumeText)
      const duration = Date.now() - startTime
      console.log(`[resume/parse] ${provider.name} succeeded in ${duration}ms`)
      
      results.push({ provider: provider.name, success: true, data })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.warn(`[resume/parse] ${provider.name} failed:`, errorMessage)
      results.push({ provider: provider.name, success: false, error: errorMessage })
    }
  }

  // All providers failed
  const errorSummary = results
    .map(r => `${r.provider}: ${r.error ?? "unknown error"}`)
    .join("; ")
  
  throw new Error(`All resume parsing providers failed: ${errorSummary}`)
}

/**
 * Get the default provider chain (Grok -> Groq)
 * Only includes providers with valid API keys configured
 */
export async function getDefaultProviderChain(): Promise<ResumeParserProvider[]> {
  const providers: ResumeParserProvider[] = []

  // Try to load Grok provider
  if (process.env.GROK_API_KEY) {
    try {
      const { grokProvider } = await import("./grok")
      providers.push(grokProvider)
    } catch (e) {
      console.warn("[resume/parse] Failed to load Grok provider:", e)
    }
  }

  // Try to load Groq provider
  if (process.env.GROQ_API_KEY) {
    try {
      const { groqProvider } = await import("./groq")
      providers.push(groqProvider)
    } catch (e) {
      console.warn("[resume/parse] Failed to load Groq provider:", e)
    }
  }

  return providers
}

/**
 * Parse resume with the default provider chain
 * Throws if no providers are configured or all fail
 */
export async function parseResumeWithDefaultProviders(resumeText: string): Promise<ParsedResume> {
  const providers = await getDefaultProviderChain()
  
  if (providers.length === 0) {
    throw new Error("No resume parsing providers configured. Set GROK_API_KEY or GROQ_API_KEY.")
  }

  return parseResumeWithFallback(resumeText, providers)
}