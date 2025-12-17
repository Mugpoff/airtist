import { PrismaClient } from "./generated/prisma/client";
declare global {
    var prisma: PrismaClient | undefined;
}
export declare const db: PrismaClient;
export * from "./generated/prisma/client";
//# sourceMappingURL=index.d.ts.map