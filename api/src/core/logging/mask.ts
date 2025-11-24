export function maskEmail(email?: string | null) {
if (!email) return email;
const [local, domain] = email.split("@");
if (!local || !domain) return email;
const first = local.slice(0, 2);
const last = local.slice(-1);
return `${first}***${last}@${domain}`;
}


export function maskPhone(phone?: string | null) {
if (!phone) return phone;
const digits = phone.replace(/\D/g, "");
if (digits.length <= 4) return "****";
return `${digits.slice(0, 2)}******${digits.slice(-2)}`;
}


export function maskAny(obj: Record<string, any> | undefined) {
if (!obj) return obj;
const clone: Record<string, any> = { ...obj };
const PII = ["email", "phone", "password", "card", "accountNumber"];
for (const k of Object.keys(clone)) {
if (!PII.includes(k)) continue;
const v = clone[k];
if (!v) continue;
switch (k) {
case "email": clone[k] = maskEmail(v); break;
case "phone": clone[k] = maskPhone(v); break;
case "password": clone[k] = "***"; break;
case "card": clone[k] = `**** **** **** ${String(v).slice(-4)}`; break;
case "accountNumber": clone[k] = `****${String(v).slice(-4)}`; break;
}
}
return clone;
}
