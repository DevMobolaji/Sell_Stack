import { AuditModel } from "./audit.model";

export type AuditEvent = {
    userId?: string | null;
    action: string;
    status?: string;
    ip?: string;
    userAgent?: string;
    metadata?: any;
};

class AuditLogger {
    event: AuditEvent;
    constructor(event: AuditEvent) {
        this.event = event;
    }

    async log(): Promise<void> {
        try {
            await AuditModel.create({
                userId: this.event.userId ?? null,
                action: this.event.action,
                status: this.event.status,
                ip: this.event.ip,
                userAgent: this.event.userAgent,
                metadata: this.event.metadata,
            });
        } catch (error) {
            console.error("Audit log failed:", error);
        }
    }

    static async logEvent(event: AuditEvent) {
      const logger = new AuditLogger(event);
      await logger.log();
  }
    
}

export default AuditLogger;