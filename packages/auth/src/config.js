import { cacheClient } from "../../cache/src";
import { config } from "../../config/src";
import { db } from "../../db/src";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
export const auth = betterAuth({
    appName: config.general.name,
    database: prismaAdapter(db, {
        provider: "postgresql",
        transaction: true,
        usePlural: true,
    }),
    secondaryStorage: cacheClient.users.auth,
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 50,
        requireEmailVerification: true,
    },
    account: {
        storeStateStrategy: "cookie",
        storeAccountCookie: true,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: config.auth.cookieMaxAge,
            strategy: "jwe",
            refreshCache: true,
        },
    },
    advanced: { database: { generateId: "uuid" } },
    experimental: { joins: true },
});
