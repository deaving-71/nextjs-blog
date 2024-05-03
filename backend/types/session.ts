import { sessionsTable } from "#schemas/sessions";

export type Session = typeof sessionsTable.$inferSelect;
export type NewSession = typeof sessionsTable.$inferInsert;
