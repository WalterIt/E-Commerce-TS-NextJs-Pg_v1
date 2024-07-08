import { drizzle} from 'drizzle-orm/vercel-postgres';
import postgres from 'vercel/postgres';
import * as schema from '@/db/schema';
// config({ path: ".env" })

const client = postgres(process.env.AUTH_DRIZZLE_URL!, {prepare: false});
export const db = drizzle(client, { schema });