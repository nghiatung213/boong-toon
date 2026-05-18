import "server-only";

import fs from "node:fs";
import type { EmailOutboxEntry } from "@/lib/types/notification";
import { ensureDataDirs, getEmailOutboxPath } from "@/lib/data/repository/paths";
import { generateId } from "@/lib/utils/slug";
import type { SendEmailInput } from "@/lib/email/types";

function readOutbox(): EmailOutboxEntry[] {
  ensureDataDirs();
  const file = getEmailOutboxPath();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
    return [];
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as EmailOutboxEntry[];
}

function writeOutbox(items: EmailOutboxEntry[]): void {
  ensureDataDirs();
  fs.writeFileSync(getEmailOutboxPath(), JSON.stringify(items, null, 2), "utf-8");
}

export function logEmailToOutbox(input: SendEmailInput): EmailOutboxEntry {
  const entry: EmailOutboxEntry = {
    id: generateId("email"),
    to: input.to,
    subject: input.subject,
    template: input.template,
    html: input.html,
    createdAt: Date.now(),
  };
  const items = readOutbox();
  items.unshift(entry);
  writeOutbox(items.slice(0, 200));
  return entry;
}
