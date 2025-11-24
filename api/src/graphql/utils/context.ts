import { Request, Response } from "express";
import { createRequestId, createTraceId } from "@/core/logging/requestId";
import User from "@/domain/auth/auth.interface";

export interface GraphQLCtx {
  user: any;
  req: Request;
  res: Response;
  requestId: string;
  traceId: string;
  logger: any;   
  ip: any    
  userAgent?: string | undefined; 

}

export function buildGraphQLContext({ req, res }: { req: Request; res: Response }): GraphQLCtx {
  const requestId =
    req.headers["x-request-id"]?.toString() || createRequestId();

  const traceId =
    req.headers["x-trace-id"]?.toString() || createTraceId();

  const logger = req.logger ?? console; // fallback if middleware didn’t attach

  const user = req.user ?? null; // from your auth middleware
  const ip = req.ip
  const userAgent = req.headers["user-agent"] || undefined

  return {
    user,
    req,
    res,
    requestId,
    traceId,
    logger,
    ip,
    userAgent,
  };
}