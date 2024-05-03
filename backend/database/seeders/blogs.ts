import { config } from "#config/database";
import { blogsTable, blogsToTags } from "#schemas/blogs";
import { tagsTable } from "#schemas/tags";
import { usersTable } from "#schemas/users";
import logger from "#services/logger";
import { NewBlog, NewBlogToTag } from "#types/blog";
import { NewTag } from "#types/tag";
import { slugify } from "#util/slugify";
import { uuid } from "#util/uuid";
import { drizzle } from "drizzle-orm/node-postgres";
import { DateTime } from "luxon";
import pg from "pg";
import { faker } from "@faker-js/faker";

logger.info("Seeding database...");

const client = new pg.Pool(config);

try {
  const db = drizzle(client);
  logger.info("Generating tags...");

  const tags = [
    "Technology",
    "Mobiles Phones",
    "Artificial Intelligence",
    "Games",
    "Computer Science",
    "Programming",
    "Education",
    "Art",
    "Rocket Science",
  ].map((tag) => {
    const newTag: NewTag = {
      id: uuid(),
      name: tag,
      slug: slugify(tag),
    };

    return newTag;
  });

  logger.info("Tags generated");

  function randomNumber() {
    const numbers: number[] = [];
    while (numbers.length < 3) {
      const randomNumber = Math.floor(Math.random() * 9) + 1;
      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    }
    return numbers;
  }

  const content = `
  ${faker.lorem.paragraph(10)}
  ${faker.lorem.lines(10)}
  ${faker.lorem.paragraphs(5)}
  `;

  const blogs: NewBlog[] = [];
  const blogTagRelations: NewBlogToTag[] = [];

  logger.info("Generating blogs with relations...");
  for (let i = 0; i < 100; i++) {
    const blogId = uuid();
    const title = faker.lorem.sentence(10);
    const randomNumbers = randomNumber();
    randomNumbers.forEach((n) => {
      blogTagRelations.push({
        blogId,
        tagId: tags[n - 1].id,
      });
    });

    const status = Math.random() >= 0.5 ? "published" : "draft";

    blogs.push({
      id: blogId,
      title: title,
      thumbnail: faker.image.url(),
      slug: faker.helpers.slugify(title),
      content,
      status,
      publishedAt: faker.date.between({
        from: "2023-04-29T14:32:31+00:00",
        to: "2024-04-29T14:32:31+00:00",
      }),
    });
  }

  logger.info("Blogs generated");
  logger.info("inserting..");

  await db.insert(tagsTable).values(tags);
  await db.insert(blogsTable).values(blogs);
  await db.insert(blogsToTags).values(blogTagRelations);

  logger.info("Done");
} catch (err) {
  logger.error(`an error occured while seeding db.\n ${err}`);
} finally {
  client.end();
}
