import db from "#database/client";
import { usersTable } from "#schemas/users";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const signupValidator = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })
  .refine(
    async (data) => {
      const [user] = await db
        .select({ email: usersTable.email })
        .from(usersTable)
        .where(eq(usersTable.email, data.email));

      if (!user) return true;

      return user.email !== data.email;
    },
    { message: "This email is already in use", path: ["email"] }
  );

export const signinValidator = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string(),
  remember: z.boolean().default(false),
});
