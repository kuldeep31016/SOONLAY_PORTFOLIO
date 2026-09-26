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

const GROK_API_URL = "https://api.x.ai/v1/chat/completions"
const GROK_MODEL = "grok-beta"

const RECOMMENDATION_PROMPT = `You are an expert technical recruiter. Analyze the resume and extract structured data.

Resume text:
{{RESUME_TEXT}}

Return ONLY valid JSON matching this schema:
{
  "skills": string[],
  "experienceLevel": "Entry" | "Mid" | "Senior" | "Lead" | "Executive",
  "yearsExperience": number,
  "preferredRoles": string[],
  "preferredLocations": string[],
  "employmentTypes": ("Full-time" | "Part-time" | "Contract" | "Internship")[],
  "industries": string[],
  "summary": string
}

Guidelines:
- skills: Technical skills only (languages, frameworks, databases, tools, cloud platforms). No soft skills.
- experienceLevel: Based on years and role seniority. Entry: 0-2, Mid: 2-5, Senior: 5-8, Lead: 8-12, Executive: 12+
- yearsExperience: Estimated total professional years
- preferredRoles: Job titles they would fit (e.g., "Senior Frontend Engineer", "Backend Developer", "Full Stack Developer")
- preferredLocations: Cities, regions, or "Remote" preferences mentioned or inferred
- employmentTypes: Based on current/preferred employment
- industries: Domain experience (fintech, healthtech, e-commerce, SaaS, AI/ML, etc.)
- summary: 2-3 sentence professional summary highlighting key strengths`

function getApiKey(): string {
  const key = process.env.GROK_API_KEY
  if (!key) {
    throw new Error("GROK_API_KEY environment variable is not set")
  }
  return key
}

export async function parseResumeWithGrok(resumeText: string): Promise<ParsedResume> {
  const prompt = RECOMMENDATION_PROMPT.replace("{{RESUME_TEXT}}", resumeText.slice(0, 15000))

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a precise technical recruiter. Output only valid JSON. No markdown, no explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Grok API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error("Grok API returned empty response")
  }

  try {
    const parsed = JSON.parse(content)

    // Validate and normalize
    return {
      skills: Array.isArray(parsed.skills) ? parsed.skills.filter((s: unknown) => typeof s === "string").slice(0, 50) : [],
      experienceLevel: ["Entry", "Mid", "Senior", "Lead", "Executive"].includes(parsed.experienceLevel)
        ? parsed.experienceLevel
        : "Mid",
      yearsExperience: typeof parsed.yearsExperience === "number" ? Math.max(0, Math.floor(parsed.yearsExperience)) : 3,
      preferredRoles: Array.isArray(parsed.preferredRoles) ? parsed.preferredRoles.filter((r: unknown) => typeof r === "string").slice(0, 10) : [],
      preferredLocations: Array.isArray(parsed.preferredLocations) ? parsed.preferredLocations.filter((l: unknown) => typeof l === "string").slice(0, 10) : [],
      employmentTypes: Array.isArray(parsed.employmentTypes)
        ? parsed.employmentTypes.filter((e: unknown) => ["Full-time", "Part-time", "Contract", "Internship"].includes(e as string)) as ("Full-time" | "Part-time" | "Contract" | "Internship")[]
        : ["Full-time"],
      industries: Array.isArray(parsed.industries) ? parsed.industries.filter((i: unknown) => typeof i === "string").slice(0, 10) : [],
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 500) : "Experienced professional seeking new opportunities."
    }
  } catch (e) {
    throw new Error(`Failed to parse Grok response: ${e instanceof Error ? e.message : "Invalid JSON"}`)
  }
}