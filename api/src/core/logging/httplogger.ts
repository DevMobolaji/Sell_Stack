import { Request, Response, NextFunction } from "express";
import { LogEvent } from "./types";
import { createRequestId, createTraceId } from "./requestId";


export function httpLogger(req: Request, res: Response, next: NextFunction) {
const start = Date.now();


// attach request id & trace id if not present
const reqId = (req as any).id || createRequestId();
(req as any).id = reqId;
const traceId = (req as any).traceId || createTraceId();
(req as any).traceId = traceId;


res.on("finish", () => {
const duration = Date.now() - start;

const log: LogEvent = {
    actor: (req as any).user?.id || null,
    action: "REST_REQUEST",
    status: res.statusCode,
    method: req.method,
    route: req.originalUrl,
    duration,
    ip: req.ip,
    userAgent: req.headers["user-agent"] as string,
    requestId: reqId,
    traceId,
    host: req.hostname,
    meta: {
        // we mask inside logger; keep body small or redact in prod
        body: req.body,
        query: req.query,
    },
    url: ""
};
});


next();
}
