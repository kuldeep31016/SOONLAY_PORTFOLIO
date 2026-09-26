import type { PublicJob } from "./types"
import type { ParsedResume } from "./grok"

export interface ScoredJob {
  job: PublicJob
  score: number
  reasons: string[]
  matchDetails: {
    skills: { matched: string[]; jobSkills: string[]; resumeSkills: string[] }
    experienceLevel: boolean
    location: boolean
    role: boolean
    employmentType: boolean
    industry: { matched: string[] }
  }
}

const WEIGHTS = {
  skills: 40,
  experienceLevel: 20,
  location: 15,
  role: 15,
  employmentType: 10,
} as const

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim().replace(/[^a-z0-9+#.-]/g, "")
}

function getJobSkills(job: PublicJob): Set<string> {
  const skills = new Set<string>()
  job.skills.forEach(s => skills.add(normalizeSkill(s)))
  // Also extract from description, responsibilities, requirements
  const text = [job.title, job.description, ...job.responsibilities, ...job.requirements, ...job.niceToHave].join(" ")
  const techKeywords = [
    "react", "next.js", "nextjs", "typescript", "javascript", "node.js", "nodejs", "python", "go", "golang",
    "rust", "java", "kotlin", "swift", "flutter", "react native", "expo", "vue", "nuxt", "svelte",
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "dynamodb", "firebase", "supabase",
    "aws", "gcp", "azure", "vercel", "docker", "kubernetes", "k8s", "terraform", "ansible",
    "graphql", "rest", "grpc", "kafka", "rabbitmq", "nginx", "linux", "git", "ci/cd", "github actions",
    "figma", "tailwind", "css", "html", "sass", "webpack", "vite", "jest", "cypress", "playwright",
    "prisma", "drizzle", "sql", "nosql", "microservices", "serverless", "api", "oauth", "auth"
  ]
  techKeywords.forEach(kw => {
    if (text.toLowerCase().includes(kw)) skills.add(kw)
  })
  return skills
}

function getResumeSkills(parsed: ParsedResume): Set<string> {
  const skills = new Set<string>()
  parsed.skills.forEach(s => skills.add(normalizeSkill(s)))
  return skills
}

export function scoreJobsForResume(jobs: PublicJob[], parsed: ParsedResume): ScoredJob[] {
  const resumeSkills = getResumeSkills(parsed)
  const resumeExpLevel = parsed.experienceLevel.toLowerCase()

  const experienceOrder = ["entry", "mid", "senior", "lead", "executive"]
  const resumeExpIndex = experienceOrder.indexOf(resumeExpLevel)

  return jobs.map(job => {
    const reasons: string[] = []
    let score = 0

    // --- Skills matching (40%) ---
    const jobSkills = getJobSkills(job)
    const matchedSkills: string[] = []
    resumeSkills.forEach(rs => {
      if (jobSkills.has(rs)) matchedSkills.push(rs)
    })
    const skillMatchRatio = jobSkills.size > 0 ? matchedSkills.length / jobSkills.size : 0
    const skillScore = Math.round(skillMatchRatio * WEIGHTS.skills)
    score += skillScore
    if (matchedSkills.length > 0) {
      reasons.push(`${matchedSkills.length} matching skill${matchedSkills.length > 1 ? "s" : ""}`)
    }

    // --- Experience level (20%) ---
    let expMatch = false
    if (job.experienceLevel) {
      const jobExp = job.experienceLevel.toLowerCase()
      const jobExpIndex = experienceOrder.indexOf(jobExp)
      if (jobExpIndex !== -1 && Math.abs(jobExpIndex - resumeExpIndex) <= 1) {
        expMatch = true
        score += WEIGHTS.experienceLevel
        reasons.push("Experience level match")
      }
    }

    // --- Location (15%) ---
    let locationMatch = false
    const jobLoc = job.location.toLowerCase()
    const locMatch = parsed.preferredLocations.some(pl => 
      jobLoc.includes(pl.toLowerCase()) || pl.toLowerCase().includes(jobLoc)
    )
    if (locMatch || jobLoc.includes("remote") || parsed.preferredLocations.some(pl => pl.toLowerCase().includes("remote"))) {
      locationMatch = true
      score += WEIGHTS.location
      reasons.push("Location preference match")
    }

    // --- Role/Title match (15%) ---
    let roleMatch = false
    const jobTitle = job.title.toLowerCase()
    const roleMatchFound = parsed.preferredRoles.some(pr => 
      jobTitle.includes(pr.toLowerCase()) || pr.toLowerCase().includes(jobTitle)
    )
    if (roleMatchFound) {
      roleMatch = true
      score += WEIGHTS.role
      reasons.push("Role preference match")
    }

    // --- Employment type (10%) ---
    let empMatch = false
    if (parsed.employmentTypes.includes(job.employmentType)) {
      empMatch = true
      score += WEIGHTS.employmentType
      reasons.push("Employment type match")
    }

    // Industry bonus (not in weights, small bonus)
    const jobIndustries = [job.department, ...job.skills].map(s => s.toLowerCase())
    const matchedIndustries = parsed.industries.filter(i => 
      jobIndustries.some(ji => ji.includes(i.toLowerCase()) || i.toLowerCase().includes(ji))
    )
    if (matchedIndustries.length > 0) {
      score += 5
      reasons.push(`${matchedIndustries.length} industry match${matchedIndustries.length > 1 ? "es" : ""}`)
    }

    return {
      job,
      score: Math.min(100, score), // Cap at 100
      reasons: [...new Set(reasons)], // Deduplicate
      matchDetails: {
        skills: {
          matched: matchedSkills,
          jobSkills: Array.from(jobSkills),
          resumeSkills: Array.from(resumeSkills)
        },
        experienceLevel: expMatch,
        location: locationMatch,
        role: roleMatch,
        employmentType: empMatch,
        industry: { matched: matchedIndustries }
      }
    }
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}