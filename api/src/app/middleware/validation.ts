import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '@/core/errors/AppError';

const validateBody = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.format();
    return next(new ValidationError('Invalid request body', details));
  }
  req.body = result.data;
  next();
};

export default validateBody;