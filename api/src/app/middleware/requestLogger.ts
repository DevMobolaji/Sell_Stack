import { Request, Response, NextFunction } from "express";
import logger, { logEvent } from "@/core/logging/logger";
import { LogEvent } from "@/core/logging/types";

// Extend Express Request to include logger, user, and correlationId
declare module "express-serve-static-core" {
  interface Request {
    logger?: typeof logger;
    user?: { id?: string };
    correlationId?: string;
    id?: string;
  }
}

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  // Set up correlation IDs if not already set
  req.correlationId = req.correlationId || `cid-${Date.now()}-${Math.random()}`;
  req.id = req.id || req.correlationId;

  // Attach a child logger for this request
  req.logger = logger.child({
    correlationId: req.correlationId,
    method: req.method,
    path: req.originalUrl,
    pid: process.pid,
  });

  const start = Date.now();
  req.logger.info("request.start");

  // Single finish listener
  res.on("finish", () => {
    const durationMs = Date.now() - start;

    const logMeta: LogEvent = {
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      duration: durationMs,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      requestId: req.id,
      traceId: req.correlationId,
      actor: req.user?.id || null,
      meta: {
        contentLength: res.get("Content-Length"),
      },
      action: "REST_REQUEST",
      url: ""
    };

    // Structured log for files and console
    logEvent(logMeta);

    // Simple info log for console
    req.logger?.info("request.finish", { statusCode: res.statusCode, durationMs });
  });

  next();
}
