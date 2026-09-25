/**
 * Generate a scrypt hash for use in CAREERS_ADMIN_USERS.
 *
 *   npm run hash-password -- 'your-password'
 *
 * Reads the real implementation from lib/password.ts (no duplicated crypto) and
 * never writes the password to disk or echoes it back. TypeScript is stripped by
 * Node's --experimental-strip-types, so there is no build step.
 */

import { hashPassword } from "../lib/password.ts"

function readPassword() {
  const fromArgs = process.argv.slice(2).filter((value) => value !== "--")
  if (fromArgs.length > 0) {
    return Promise.resolve(fromArgs.join(" "))
  }

  return new Promise((resolve, reject) => {
    const chunks = []
    process.stdin.on("data", (chunk) => chunks.push(chunk))
    process.stdin.on("end", () =>
      resolve(Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, ""))
    )
    process.stdin.on("error", reject)
  })
}

const password = await readPassword()
if (password.length === 0) {
  console.error("No password supplied.")
  console.error("Usage: npm run hash-password -- 'your-password'")
  process.exit(1)
}

const hash = await hashPassword(password)
const email = process.env.CAREERS_ADMIN_EMAILS?.split(",")[0]?.trim() || "admin@example.com"

// Next.js expands "$VAR" while reading a .env file, and a scrypt hash is full of
// "$" separators. Escaping them keeps the hash intact in .env.local. Values set
// through the Vercel dashboard are used literally and need no escaping.
const forEnvFile = `${email}:${hash}`.replaceAll("$", "\\$")

console.log("")
console.log("Add this to the admin app's .env.local (the password is not stored anywhere):")
console.log("")
console.log(`  CAREERS_ADMIN_USERS=${forEnvFile}`)
console.log("")
console.log("If you set this through the Vercel dashboard instead, use it unescaped:")
console.log("")
console.log(`  ${email}:${hash}`)
console.log("")

process.exit(0)
