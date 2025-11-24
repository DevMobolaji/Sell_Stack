import User from '@/domain/auth/auth.interface';
import { Request } from 'express';
import { Logger } from 'winston';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      logger?: Logger;
      user: User | null
    }
  }
}
