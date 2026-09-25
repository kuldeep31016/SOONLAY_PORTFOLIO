export type ErrorDetails = Record<string, unknown>

export class ApiError extends Error {
  readonly status: number
  readonly details: ErrorDetails | undefined

  constructor(status: number, message: string, details?: ErrorDetails) {
    super(message)
    this.name = new.target.name
    this.status = status
    this.details = details
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: ErrorDetails) {
    super(400, message, details)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Authentication required") {
    super(401, message)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You are not authorized to perform this action") {
    super(403, message)
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "The requested resource was not found") {
    super(404, message)
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor(message = "Method not allowed") {
    super(405, message)
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, message)
  }
}

export class ConfigurationError extends ApiError {
  constructor(message = "Service is not configured") {
    super(500, message)
  }
}

export class UpstreamError extends ApiError {
  constructor(message = "Unable to reach the careers datastore") {
    super(503, message)
  }
}
