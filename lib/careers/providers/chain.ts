import "server-only"

import { ParsedResume, ResumeParserProvider } from "../providers"

export interface ProviderResult {
  provider: string
  success: boolean
  data?: ParsedResume
  error?: string
}

export class ProviderConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ProviderConfigurationError"
  }
}

export class ProviderUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ProviderUnavailableError"
  }
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
  
  throw new ProviderUnavailableError(`All resume parsing providers failed: ${errorSummary}`)
}

/**
 * Get the default provider chain (Groq only)
 * Only includes providers with valid API keys configured
 */
export async function getDefaultProviderChain(): Promise<ResumeParserProvider[]> {
  const providers: ResumeParserProvider[] = []

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
    throw new ProviderConfigurationError(
      "AI resume parsing is not configured. Please contact the administrator to set up the service."
    )
  }

  return parseResumeWithFallback(resumeText, providers)
}