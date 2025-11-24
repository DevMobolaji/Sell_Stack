import { ERROR_CODES } from './errorCodes';
import statusCode from "http-status-codes";

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public safeMessage: string;
  public details?: any;

  constructor(message: string, { statusCode = 0, code = "", safeMessage, details }: {
    statusCode?: number;
    code?: string;
    safeMessage?: string;
    details?: any;
  } = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.safeMessage = safeMessage ?? message;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}




export class AuthenticationError extends AppError {
  constructor(message = 'NOT AUTHENTICATED', details?: any) {
    super(message, { statusCode: statusCode.FORBIDDEN, code: ERROR_CODES.UNAUTHENTICATED, safeMessage: message, details });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'ACCESS FORBIDDEN', details?: any) {
    super(message, { statusCode: statusCode.FORBIDDEN, code: ERROR_CODES.FORBIDDEN, safeMessage: message, details });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'NOT_FOUND', details?: any) {
    super(message, { statusCode: statusCode.NOT_FOUND, code: ERROR_CODES.NOT_FOUND, safeMessage: message, details });
  }
}

export class ValidationError extends AppError {
  constructor(message = 'VALIDATION_ERROR', details?: any) {
    super(message, { statusCode: statusCode.BAD_REQUEST, code: ERROR_CODES.VALIDATION_ERROR, safeMessage: message, details });
  }
}


export class BadRequestError extends AppError {
  constructor(message = 'BAD REQUEST', details?: any) {
    super(message, { statusCode: statusCode.BAD_REQUEST, code: ERROR_CODES.BAD_REQUEST, safeMessage: message, details });
  }
}


export class InternalServerError extends AppError {
  constructor(message = 'INTERNAL SERVER', details?: any) {
    super(message, { statusCode: statusCode.INTERNAL_SERVER_ERROR, code: ERROR_CODES.INTERNAL_SERVER_ERROR, safeMessage: message, details });
  }
}


