import { requestHandler } from "#util/request_handler";
import db from "#database/client";
import { usersTable } from "#schemas/users";

export const show = requestHandler(async (_, res) => {
  const allUsers = await db.select().from(usersTable);
  res.json(allUsers);
});
