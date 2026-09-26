import "server-only"

export interface ParsedResume {
  skills: string[]
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead" | "Executive"
  yearsExperience: number
  preferredRoles: string[]
  preferredLocations: string[]
  employmentTypes: ("Full-time" | "Part-time" | "Contract" | "Internship")[]
  industries: string[]
  summary: string
}

export interface ResumeParserProvider {
  name: string
  parse(resumeText: string): Promise<ParsedResume>
}

export interface ProviderConfig {
  name: string
  apiUrl: string
  apiKeyEnv: string
  model: string
  fallbackModel?: string
  maxTokens: number
  temperature: number
}