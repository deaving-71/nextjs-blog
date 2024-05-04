import db from "#database/client";
import { config } from "#config/auth";
import { usersTable } from "#schemas/users";
import { sessionsTable } from "#schemas/sessions";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

export const luciaAdapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionsTable,
  usersTable
);

export const lucia = new Lucia(luciaAdapter, config);
