# @repo/cache

Caching layer using [Dragonfly](https://www.dragonflydb.io/) (Redis-compatible) via [ioredis](https://github.com/redis/ioredis).

## Environment Variables

| Variable        | Required | Description                                           |
| --------------- | -------- | ----------------------------------------------------- |
| `DRAGONFLY_URL` | Yes      | Redis connection URL (e.g., `redis://localhost:6379`) |

## Usage

```typescript
import { cacheClient } from "@repo/cache";

// Store auth session (with 60s TTL)
await cacheClient.users.auth.set("user-id", "session-data", 60);

// Retrieve auth session
const session = await cacheClient.users.auth.get("user-id");

// Delete auth session
await cacheClient.users.auth.delete("user-id");
```

## Structure

The cache client is organized by domain:

```typescript
cacheClient.users.auth; // User authentication sessions
```

Add new namespaces as needed for other caching requirements.
