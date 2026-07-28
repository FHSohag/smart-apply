/**
 * Thrown for expected, user-facing validation failures (bad input,
 * disallowed file type, size limits, etc.). Distinct from unexpected
 * errors (DB failures, third-party API errors) so route handlers can
 * return the correct status code and message instead of a generic 500.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}