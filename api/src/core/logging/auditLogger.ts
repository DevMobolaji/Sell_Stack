import logger from "./logger";

interface AuditEvent {
    userId?: string;
    action: string;
    status: string;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}

class AuditLogger {
    static async logEvent(event: AuditEvent) {
        try {
            // Structured log entry
            const logEntry = {
                ...event,
                timestamp: new Date().toISOString(),
            };

            // Log with Winston
            logger.info("Audit Event", logEntry);

        } catch (err) {
            console.error("Failed to log audit event:", err);
        }
    }

    // Optional helper for registration attempts
    static async logRegistrationAttempt(userId: string, status: string, req: any, action: string) {
        await this.logEvent({
            userId,
            action,
            status,
            ip: req.ip,
            userAgent: req.get("User-Agent") || "",
            metadata: { email: req.body.email },
        });
    }
}

export default AuditLogger;
