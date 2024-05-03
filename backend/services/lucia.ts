import db from "#database/client";
import { config } from "#config/auth";
import { usersTable } from "app/schemas/users.js";
import { sessionsTable } from "app/schemas/sessions.js";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

export const luciaAdapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionsTable,
  usersTable
);

export const lucia = new Lucia(luciaAdapter, config);
