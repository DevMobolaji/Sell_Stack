const { v4: uuid } = require('uuid');
import { NextFunction, Request, Response } from "express"

function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const id = req.headers['x-correlation-id'] || uuid();

  req.correlationId = id;

  // Attach to response for clients to see
  res.setHeader('x-correlation-id', id);

  next();
};

export default correlationIdMiddleware;