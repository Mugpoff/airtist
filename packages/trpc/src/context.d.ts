export declare const createTrpcContext: (opts: {
    headers: Headers;
}) => Promise<{
    auth: import("better-auth").Auth<{
        appName: string;
        database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
        secondaryStorage: {
            set: (id: string, value: string, ttl?: number) => Promise<"OK">;
            get: (id: string) => Promise<string | null>;
            delete: (id: string) => Promise<null>;
        };
        emailAndPassword: {
            enabled: true;
            minPasswordLength: number;
            maxPasswordLength: number;
            requireEmailVerification: true;
        };
        account: {
            storeStateStrategy: "cookie";
            storeAccountCookie: true;
        };
        session: {
            cookieCache: {
                enabled: true;
                maxAge: number;
                strategy: "jwe";
                refreshCache: true;
            };
        };
        advanced: {
            database: {
                generateId: "uuid";
            };
        };
        experimental: {
            joins: true;
        };
    }>;
    session: {
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined | undefined;
            userAgent?: string | null | undefined | undefined;
        };
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
        };
    } | null;
    db: import("../../db/src").PrismaClient;
    config: {
        general: {
            name: string;
        };
        env: {
            isSeed: boolean;
            isProduction: boolean;
        };
        auth: {
            cookieMaxAge: number;
        };
    };
    cache: {
        users: {
            auth: {
                set: (id: string, value: string, ttl?: number) => Promise<"OK">;
                get: (id: string) => Promise<string | null>;
                delete: (id: string) => Promise<null>;
            };
        };
    };
    openRouter: import("@openrouter/sdk").OpenRouter;
}>;
//# sourceMappingURL=context.d.ts.map