import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  // Prefer caller-provided (e.g., from load balancer) or create one
  const incoming = (req.headers['x-request-id'] as string) || (req.headers['x-correlation-id'] as string);
  const id = typeof incoming === 'string' && incoming.length > 0 ? incoming : randomUUID();
  // attach to req and response headers so downstream services see it
  (req as any).requestId = id;
  res.setHeader('x-request-id', id);
  next();
}
