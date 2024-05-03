import db from "#database/client";
import { tagsTable } from "#schemas/tags";
import { requestHandler } from "#util/request_handler";
import { slugify } from "#util/slugify";
import { uuid } from "#util/uuid";
import {
  createTagValidator,
  destroyTagValidator,
  showTagValidator,
  updateTagValidator,
} from "#validators/admin/tag";
import { eq } from "drizzle-orm";

export const show = requestHandler(async (req, res) => {
  const { id } = showTagValidator.parse(req.params);

  const [tag] = await db
    .select({ id: tagsTable.id, name: tagsTable.name, slug: tagsTable.slug })
    .from(tagsTable)
    .where(eq(tagsTable.id, id));

  res.json(tag);
});

export const update = requestHandler(async (req, res) => {
  const request = {
    params: req.params,
    ...req.body,
  };

  const { params, ...values } = await updateTagValidator.parseAsync(request);
  const id = params.id;

  await db.update(tagsTable).set(values).where(eq(tagsTable.id, id));

  res.end();
});

export const create = requestHandler(async (req, res) => {
  const { name, slug } = await createTagValidator.parseAsync(req.body);
  const id = uuid();

  const [tag] = await db
    .insert(tagsTable)
    .values({ id, name, slug: slugify(slug) })
    .returning();

  res.created();
});

export const destroy = requestHandler(async (req, res) => {
  const { id } = destroyTagValidator.parse(req.params);

  await db.delete(tagsTable).where(eq(tagsTable.id, id));

  res.end();
});
