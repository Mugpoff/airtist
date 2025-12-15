# @repo/auth

Authentication package powered by [better-auth](https://www.better-auth.com/). Provides server-side authentication, session management, and a React client for the frontend.

## Environment Variables

| Variable             | Required | Description                                                 |
| -------------------- | -------- | ----------------------------------------------------------- |
| `BETTER_AUTH_URL`    | Yes      | Base URL for authentication (e.g., `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Yes      | Secret key for signing tokens and cookies                   |

## Usage

### Server-side

```typescript
import { auth } from "@repo/auth";

// Get session in API routes or server components
const session = await auth.api.getSession({
  headers: request.headers,
});
```

### Client-side

```typescript
import { authClient } from "@repo/auth/client";

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "password",
});

// Sign out
await authClient.signOut();

// Get current session
const session = await authClient.getSession();
```

## Features

- Email/password authentication
- Session caching with Dragonfly
- JWE encrypted cookie sessions
- 7-day session duration
