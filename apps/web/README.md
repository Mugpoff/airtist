# AI Picture Web

Next.js 16 web application with React 19.

## Environment Variables

| Variable             | Required | Description                  |
| -------------------- | -------- | ---------------------------- |
| `BETTER_AUTH_URL`    | Yes      | Authentication base URL      |
| `BETTER_AUTH_SECRET` | Yes      | Authentication secret        |
| `DRAGONFLY_URL`      | Yes      | Cache connection URL         |
| `DATABASE_URL`       | Yes      | PostgreSQL connection string |

## Development

```bash
# From monorepo root
bun dev

# Or directly
cd apps/web
bun dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
├── layout.tsx      # Root layout
├── page.tsx        # Home page
├── globals.css     # Global styles
└── fonts/          # Custom fonts (Geist)
```

## Features

- Server-side rendering with React 19
- App Router
- Internationalization (next-intl)
- Shared UI components (@repo/ui)
- Authentication (@repo/auth)
