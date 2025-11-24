export type LogMeta = Record<string, any> | undefined;


export interface LogEvent {
actor?: string | null; // user id or HMAC'ed id
action: string; // e.g., REST_REQUEST, GRAPHQL_REQUEST, TRANSACTION_CREATE
status?: number;
method?: string;
route?: string;
operation?: string; // GraphQL operation name
duration?: number; // ms
ip?: string;
userAgent?: string;
requestId?: string;
traceId?: string;
host?: string; // hostname or pod id
meta?: LogMeta;
url: string;
}