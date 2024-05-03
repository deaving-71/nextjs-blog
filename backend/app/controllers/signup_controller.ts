import db from "#database/client";
import { usersTable } from "#schemas/users";
import { requestHandler } from "#util/request_handler";
import { uuid } from "#util/uuid";
import { signupValidator } from "#validators/auth";
import { Argon2id } from "oslo/password";

export const create = requestHandler(async (req, res) => {
  const { email, password } = await signupValidator.parseAsync(req.body);

  const hashedPassword = await new Argon2id().hash(password);
  const userId = uuid();

  await db.insert(usersTable).values({
    id: userId,
    email,
    password: hashedPassword,
  });

  res.created();
});
