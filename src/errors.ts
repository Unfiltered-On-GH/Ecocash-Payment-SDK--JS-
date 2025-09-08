export class EcoCashError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = "EcoCashError";
  }
}

export class BadRequestError extends EcoCashError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends EcoCashError {
  constructor(message: string, details?: any) {
    super(message, 401, details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends EcoCashError {
  constructor(message: string, details?: any) {
    super(message, 403, details);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends EcoCashError {
  constructor(message: string, details?: any) {
    super(message, 404, details);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends EcoCashError {
  constructor(message: string, details?: any) {
    super(message, 409, details);
    this.name = "ConflictError";
  }
}

export class TooManyRequestsError extends EcoCashError {
  constructor(message: string, details?: any) {
    super(message, 429, details);
    this.name = "TooManyRequestsError";
  }
}

export class ServerError extends EcoCashError {
  constructor(message: string, details?: any) {
    super(message, 500, details);
    this.name = "ServerError";
  }
}

export function handleError(
  statusCode: number,
  message: string,
  details?: any
): never {
  switch (statusCode) {
    case 400:
      throw new BadRequestError(message, details);
    case 401:
      throw new UnauthorizedError(message, details);
    case 403:
      throw new ForbiddenError(message, details);
    case 404:
      throw new NotFoundError(message, details);
    case 409:
      throw new ConflictError(message, details);
    case 429:
      throw new TooManyRequestsError(message, details);
    case 500:
      throw new ServerError(message, details);
    default:
      throw new EcoCashError(message, statusCode, details);
  }
}
