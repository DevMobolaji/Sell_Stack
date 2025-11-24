import { v4 as uuidv4 } from "uuid";


export function createRequestId() {
return uuidv4();
}


export function createTraceId() {
// for simplicity, use uuidv4; replace with real trace id if using OpenTelemetry
return uuidv4();
}
