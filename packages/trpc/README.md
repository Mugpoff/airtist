# @repo/trpc

End-to-end typesafe API layer powered by [tRPC](https://trpc.io/) v11.

## Environment Variables

None required.

## Usage

### Defining procedures

```typescript
import { createTRPCRouter, publicProcedure } from "@repo/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return { id: input.id, name: "John" };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      return { id: "1", name: input.name };
    }),
});
```

### Adding routers to app router

```typescript
import { createTRPCRouter } from "@repo/trpc";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => "ok"),
  user: userRouter,
});

export type AppRouter = typeof appRouter;
```

### Client usage

```typescript
import { createTRPCClient } from "@trpc/client";
import type { AppRouter } from "@repo/trpc";

const client = createTRPCClient<AppRouter>({
  url: "/api/trpc",
});

// Query
const user = await client.user.getById.query({ id: "1" });

// Mutation
const newUser = await client.user.create.mutate({ name: "Jane" });
```

## Exports

| Export             | Description                    |
| ------------------ | ------------------------------ |
| `appRouter`        | Main application router        |
| `AppRouter`        | Type for client type inference |
| `createTRPCRouter` | Create nested routers          |
| `publicProcedure`  | Public (unauthenticated) route |
