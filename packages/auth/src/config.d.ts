export declare const auth: import("better-auth").Auth<{
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
export type Session = (typeof auth)["$Infer"]["Session"];
//# sourceMappingURL=config.d.ts.map