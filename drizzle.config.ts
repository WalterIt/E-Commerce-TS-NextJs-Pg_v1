import { cwd } from 'node:process'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(cwd())

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: "./db/schema.ts", 
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL!,
  },
  verbose: true,
  strict: true,
});
