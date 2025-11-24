import { Request, Response, NextFunction } from 'express';
import mapErrorToPayload from './ErrorMapper';
import { LogEvent } from '../logging/types';
import logger from '../logging/logger';

export function finalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // Map to standard payload
  const mapped = mapErrorToPayload(err);
  const status = mapped.httpStatus ?? 500;

  // log full error server-side
  const logMeta: any = {
    correlationId: req.correlationId,
    path: req.originalUrl,
    method: req.method
  };

  if (err instanceof Error) {
    logger.error(err.message, { ...logMeta, stack: err.stack });
    req.logger?.error(err.message, { stack: err.stack });
  } else {
    logger.error('Non-error thrown', { ...logMeta, err });
  }

  // Send JSON (REST) — GraphQL errors will be handled by Apollo plugin to include correlationId/status
  if (res.headersSent) return next(err);
  res.status(status).json({
    requestId: req.correlationId,
    error: {
      code: mapped.errorCode,
      message: mapped.message,
      details: mapped.details
    }
  });
}
