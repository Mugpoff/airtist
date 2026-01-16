# Airtist

AI-powered image generation and management platform.

## Architecture

```
airtist/
├── apps/
│   └── web/                 # Next.js 16 web application
├── packages/
│   ├── auth/                # Authentication (better-auth)
│   ├── cache/               # Caching layer (Dragonfly/Redis)
│   ├── config/              # Shared configuration constants
│   ├── db/                  # Database layer (Prisma + PostgreSQL)
│   ├── messages/            # i18n translation files (en, fr)
│   ├── trpc/                # Typesafe API layer (tRPC)
│   ├── ui/                  # UI component library
│   ├── utils/               # Shared utility functions
│   └── typescript-config/   # Shared TypeScript configs
└── docker-compose.yml       # Local infrastructure
```

## Tech Stack

### Frontend

| Technology                                      | Description                     |
| ----------------------------------------------- | ------------------------------- |
| [Next.js 16](https://nextjs.org/)               | React framework with App Router |
| [React 19](https://react.dev/)                  | UI library                      |
| [Tailwind CSS 4](https://tailwindcss.com/)      | Utility-first CSS framework     |
| [coss-ui](https://github.com/coss-ui/coss-ui)   | Component                       |
| library                                         |
| [Base UI](https://base-ui.com/)                 | Headless UI                     |
| primitives                                      |
| [Motion](https://motion.dev/)                   | Animation library               |
| [next-intl](https://next-intl.dev/)             | Internationalization            |
| [Jotai](https://jotai.org/)                     | Atomic state management         |
| [Zustand](https://zustand.docs.pmnd.rs/)        | State management                |
| [React Hook Form](https://react-hook-form.com/) | Form handling                   |

### Backend

| Technology                                  | Description              |
| ------------------------------------------- | ------------------------ |
| [tRPC](https://trpc.io/)                    | End-to-end typesafe APIs |
| [Prisma](https://www.prisma.io/)            | Database ORM             |
| [better-auth](https://www.better-auth.com/) | Authentication library   |
| [Zod](https://zod.dev/)                     | Schema validation        |

### Infrastructure

| Technology                                   | Description                    |
| -------------------------------------------- | ------------------------------ |
| [PostgreSQL 18](https://www.postgresql.org/) | Primary database               |
| [Dragonfly](https://www.dragonflydb.io/)     | Redis-compatible cache         |
| S3-compatible storage                        | Object storage (MinIO locally) |

## Requirements

- **Node.js** >= 25
- **Bun** >= 1.3.6
- **Docker** (for local infrastructure)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/airtist.git
cd airtist
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration values.

### 4. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL, Dragonfly, and MinIO.

### 5. Create default MinIO bucket

Configure the MinIO instance and create the default bucket:

```bash
# Configure the local alias
source .env && docker exec -it airtist-minio-1 mc alias set local $MINIO_ENDPOINT $MINIO_ACCESS_KEY $MINIO_SECRET_KEY

# Create the bucket
source .env && docker exec -it airtist-minio-1 mc mb -p local/$MINIO_BUCKET

# Allow public access
source .env && docker exec -it airtist-minio-1 mc anonymous set download local/$MINIO_BUCKET
```

### 6. Execute database migrations

```bash
bun db migrate dev
```

This will execute all pending database migrations or initialize your database.

### 7. Start development servers

```bash
bun dev
```

The web app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `bun dev`       | Start all development servers |
| `bun build`     | Build all packages and apps   |
| `bun typecheck` | Run TypeScript type checking  |
| `bun check:ws`  | Run Biome linting             |
| `bun clean`     | Clean all node_modules        |
| `bun db <cmd>`  | Run Prisma commands           |
| `bun knip`      | Find unused code              |

## Testing

Run tests using Bun's built-in test runner:

```bash
# Run all tests
bun test

# Run tests for a specific package
bun test packages/utils

# Run tests in watch mode
bun test --watch
```

## License

Private
