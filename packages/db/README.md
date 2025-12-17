# @repo/db

Database layer powered by [Prisma](https://www.prisma.io/) with PostgreSQL. Uses the new Prisma Client engine with the `@prisma/adapter-pg` driver adapter for optimal performance.

## Environment Variables

| Variable       | Required | Description                                                                  |
| -------------- | -------- | ---------------------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | PostgreSQL connection URL (e.g., `postgresql://user:pass@localhost:5432/db`) |

## Usage

### Basic Queries

```typescript
import { db } from "@repo/db";

// Find a user
const user = await db.users.findUnique({
  where: { id: "user-id" },
});

// Create a user
const newUser = await db.users.create({
  data: {
    email: "user@example.com",
    name: "John Doe",
  },
});

// Update a user
await db.users.update({
  where: { id: "user-id" },
  data: { name: "Jane Doe" },
});
```

### TypedSQL (Raw SQL with Type Safety)

```typescript
import { db } from "@repo/db";
import { myCustomQuery } from "@repo/db/sql/myCustomQuery.sql";

// Execute typed SQL queries
const results = await db.$queryRawTyped(myCustomQuery(param1, param2));
```

## Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `bun db migrate dev` | Run migrations in development |
| `bun db db seed`     | Seed the database             |
| `bun db studio`      | Open Prisma Studio            |
| `bun db generate`    | Generate Prisma Client        |

## Features

- Prisma Client with PostgreSQL adapter
- TypedSQL for raw queries with full type safety
- Zod schema generation from Prisma models
- Development query logging
- Global client instance for hot reload support
