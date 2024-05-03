import db from "#database/client";
import { tagsTable } from "#schemas/tags";
import { requestHandler } from "#util/request_handler";

export const index = requestHandler(async (_, res) => {
  const tags = await db
    .select({ id: tagsTable.id, name: tagsTable.name, slug: tagsTable.slug })
    .from(tagsTable);

  res.json(tags);
});
