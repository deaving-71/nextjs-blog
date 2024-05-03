import { config } from "#config/database";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const client = new pg.Pool(config);
const db = drizzle(client);

export default db;
