import { sql } from "@vercel/postgres";
import postgres from "postgres";
import {
  drizzle as VercelDrizzle,
  type VercelPgDatabase,
} from "drizzle-orm/vercel-postgres";
import {
  drizzle as LocalDrizzle,
  type PostgresJsDatabase,
} from "drizzle-orm/postgres-js";

let db:
  | VercelPgDatabase<Record<string, never>>
  | PostgresJsDatabase<Record<string, never>>;
if (process.env.NODE_ENV === "production") {
  db = VercelDrizzle(sql);
} else {
  const migrationClient = postgres(process.env.POSTGRES_URL as string);
  db = LocalDrizzle(migrationClient);
}

export default db;



// import { drizzle} from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from '@/db/schema';
// // config({ path: ".env" });

// const client = postgres(process.env.AUTH_DRIZZLE_URL!, {prepare: false});
// export const db = drizzle(client, { schema });






// import * as schema from './schema'

// import { drizzle } from 'drizzle-orm/vercel-postgres'
// import { sql } from '@vercel/postgres'
// const db = drizzle(sql, {
//   schema,
// })
// export default db