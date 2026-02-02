import Database from 'better-sqlite3';
import { betterAuth } from 'better-auth';
import { organization, admin } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { env } from '@/env.js';

const adminUserIds = env.BETTER_AUTH_ADMIN_USER_IDS
    ? env.BETTER_AUTH_ADMIN_USER_IDS.split(',')
          .map((s) => s.trim())
          .filter(Boolean)
    : [];

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL ?? env.SERVER_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: new Database("data/auth.sqlite"),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        organization(),
        admin({ adminUserIds }),
        tanstackStartCookies(),
    ],
});
