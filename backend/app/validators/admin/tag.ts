import db from "#database/client";
import { tagsTable } from "#schemas/tags";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";

export const showTagValidator = z.object({
  id: z.string(),
});

export const createTagValidator = z
  .object({
    name: z.string().min(1, "Tag name cannot be empty"),
    slug: z.string().min(1, "Slug cannot be empty"),
  })
  .refine(
    async (data) => {
      const [tag] = await db
        .select({ name: tagsTable.name })
        .from(tagsTable)
        .where(
          and(eq(tagsTable.name, data.name), eq(tagsTable.slug, data.slug))
        );
      return !tag;
    },
    { message: "This tag already exists.", path: ["root"] }
  );

export const updateTagValidator = z
  .object({
    params: z.object({
      id: z.string(),
    }),

    name: z.string().min(1, "Tag name cannot be empty"),
    slug: z.string().min(1, "Slug cannot be empty"),
  })
  .refine(
    async (data) => {
      const [tag] = await db
        .select({ name: tagsTable.name })
        .from(tagsTable)
        .where(
          and(
            eq(tagsTable.name, data.name),
            eq(tagsTable.slug, data.slug),
            ne(tagsTable.id, data.params.id)
          )
        );
      return !tag;
    },
    { message: "This tag already exists.", path: ["root"] }
  );

export const destroyTagValidator = z.object({
  id: z.string().uuid({ message: "Invalid tag id" }),
});
