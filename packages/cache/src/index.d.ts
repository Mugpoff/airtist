export declare const cacheClient: {
    users: {
        auth: {
            set: (id: string, value: string, ttl?: number) => Promise<"OK">;
            get: (id: string) => Promise<string | null>;
            delete: (id: string) => Promise<null>;
        };
    };
};
//# sourceMappingURL=index.d.ts.map