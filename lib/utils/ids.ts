import { v4 as uuidv4 } from "uuid";

export function generateRequestId(): string {
  return `REQ-${uuidv4().slice(0, 8).toUpperCase()}`;
}

export function generateLockId(): string {
  return `LOCK-${uuidv4().slice(0, 8).toUpperCase()}`;
}
