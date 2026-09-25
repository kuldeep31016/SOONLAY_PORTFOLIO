import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  type ScryptOptions
} from "node:crypto"

// promisify() picks the 3-argument overload, which drops the options bag.
function scrypt(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) {
        reject(error)
        return
      }
      resolve(derivedKey)
    })
  })
}

/**
 * Password hashing for the careers admin portal.
 *
 * The portal has no user database: credentials live in `CAREERS_ADMIN_USERS` as
 * `email:hash` pairs, so a leaked environment file yields hashes rather than
 * plaintext. scrypt is used from node:crypto to avoid pulling in a native
 * dependency.
 *
 * Hash format: `scrypt$<N>$<r>$<p>$<saltBase64url>$<hashBase64url>`
 */

const ALGORITHM = "scrypt"
const COST = 32768 // N
const BLOCK_SIZE = 8 // r
const PARALLELIZATION = 1 // p
const KEY_LENGTH = 64
const SALT_LENGTH = 16

// scrypt memory is roughly 128 * N * r bytes (~32 MB at these parameters), which
// is above Node's default 32 MB cap.
const MAX_MEMORY = 96 * 1024 * 1024

const HASH_PATTERN = /^scrypt\$(\d+)\$(\d+)\$(\d+)\$([A-Za-z0-9_-]+)\$([A-Za-z0-9_-]+)$/

export class InvalidPasswordHashError extends Error {
  constructor(message = "The stored password hash is malformed") {
    super(message)
    this.name = "InvalidPasswordHashError"
  }
}

export async function hashPassword(password: string): Promise<string> {
  if (password.length === 0) {
    throw new Error("Refusing to hash an empty password")
  }

  const salt = randomBytes(SALT_LENGTH)
  const derived = await scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELIZATION,
    maxmem: MAX_MEMORY
  })

  return [
    ALGORITHM,
    COST,
    BLOCK_SIZE,
    PARALLELIZATION,
    salt.toString("base64url"),
    derived.toString("base64url")
  ].join("$")
}

/**
 * Constant-time verification. Returns false for any malformed hash rather than
 * throwing, so a corrupted env value fails the login instead of the request.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const match = HASH_PATTERN.exec(storedHash)
  if (match === null || password.length === 0) {
    return false
  }

  const [, cost, blockSize, parallelization, salt, expected] = match
  const parameters = {
    N: Number(cost),
    r: Number(blockSize),
    p: Number(parallelization)
  }

  // Guard against absurd parameters from a tampered env value.
  if (
    !Number.isInteger(parameters.N) ||
    !Number.isInteger(parameters.r) ||
    !Number.isInteger(parameters.p) ||
    parameters.N < 1024 ||
    parameters.r < 1 ||
    parameters.p < 1 ||
    parameters.N > 1 << 20
  ) {
    return false
  }

  const expectedBuffer = Buffer.from(expected, "base64url")
  if (expectedBuffer.length === 0) {
    return false
  }

  let derived: Buffer
  try {
    derived = await scrypt(password.normalize("NFKC"), Buffer.from(salt, "base64url"), expectedBuffer.length, {
      ...parameters,
      maxmem: MAX_MEMORY
    })
  } catch {
    return false
  }

  return derived.length === expectedBuffer.length && timingSafeEqual(derived, expectedBuffer)
}
