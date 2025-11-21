export interface AppErrorPayload {
  code: string;
  httpStatus: number;
  details?: Record<string, any> | null;
}

export default class AppError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly details?: Record<string, any> | null;

  constructor(message: string, code: string, httpStatus = 500, details: Record<string, any> | null = null) {
    super(message);
    this.name = new.target.name; // class name
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;

    // // preserve stack trace (V8)
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, this.constructor);
    // }
  }
}
