# @repo/config

Shared configuration constants used across the monorepo.

## Environment Variables

None required.

## Usage

```typescript
import { config } from "@repo/config";

// Access app name
console.log(config.general.name); // "Airtist"

// Access auth settings
console.log(config.auth.cookieMaxAge); // 604800 (7 days in seconds)
```

## Configuration

| Key                 | Value       | Description                      |
| ------------------- | ----------- | -------------------------------- |
| `general.name`      | `"Airtist"` | Application name                 |
| `auth.cookieMaxAge` | `604800`    | Session cookie duration (7 days) |
