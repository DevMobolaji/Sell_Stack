import { AppError } from './AppError';
import { ERROR_CODES } from './errorCodes';
import statusCode from "http-status-codes";

export class AuthenticationError extends AppError {
  constructor(message = 'Not authenticated') {
    super(message, ERROR_CODES.UNAUTHENTICATED, statusCode.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, ERROR_CODES.FORBIDDEN, statusCode.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier: string | null = null) {
    const message = identifier ? `${resource} with ID ${identifier} not found` : `${resource} not found`;
    super(message, ERROR_CODES.NOT_FOUND, statusCode.NOT_FOUND, { resource, identifier });
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details: Record<string, any> | null = null) {
    super(message, ERROR_CODES.VALIDATION_ERROR, statusCode.BAD_REQUEST, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details: Record<string, any> | null = null) {
    super(message, ERROR_CODES.CONFLICT, statusCode.CONFLICT, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, ERROR_CODES.BAD_REQUEST, statusCode.BAD_REQUEST);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', details: Record<string, any> | null = null) {
    super(message, ERROR_CODES.INTERNAL_SERVER_ERROR, statusCode.INTERNAL_SERVER_ERROR, details);
  }
}

export { AppError };
