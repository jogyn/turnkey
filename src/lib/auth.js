import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cwd } from 'node:process';
import Database from 'better-sqlite3';
import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { env } from '@/env.js';

const defaultDbPath = join(cwd(), 'data', 'auth.sqlite');
const dbPath = env.DATABASE_PATH ?? defaultDbPath;
const dbDir = dirname(dbPath);
if (typeof existsSync !== 'undefined' && !existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
}

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    database: new Database(dbPath),
    emailAndPassword: {
        enabled: true,
    },
    // tanstackStartCookies must be last so cookie-setting (signIn, signUp, etc.) works with TanStack Start
    plugins: [organization(), tanstackStartCookies()],
});
