# AI Picture

AI-powered image generation and management platform.

## Architecture

```
ai-picture/
├── apps/
│   └── web/                 # Next.js 16 web application
├── packages/
│   ├── auth/                # Authentication (better-auth)
│   ├── cache/               # Caching layer (Dragonfly/Redis)
│   ├── config/              # Shared configuration
│   ├── db/                  # Database layer (Prisma + PostgreSQL)
│   ├── trpc/                # Typesafe API layer (tRPC)
│   ├── ui/                  # UI component library (coss-ui + Base UI)
│   └── typescript-config/   # Shared TypeScript configs
└── docker-compose.yml       # Local infrastructure
```

## Tech Stack

### Frontend

| Technology                                    | Description                     |
| --------------------------------------------- | ------------------------------- |
| [Next.js 16](https://nextjs.org/)             | React framework with App Router |
| [React 19](https://react.dev/)                | UI library                      |
| [coss-ui](https://github.com/coss-ui/coss-ui) | Component library               |
| [Base UI](https://base-ui.com/)               | Headless UI primitives          |
| [next-intl](https://next-intl.dev/)           | Internationalization            |

### Backend

| Technology                                  | Description              |
| ------------------------------------------- | ------------------------ |
| [tRPC](https://trpc.io/)                    | End-to-end typesafe APIs |
| [Prisma](https://www.prisma.io/)            | Database ORM             |
| [better-auth](https://www.better-auth.com/) | Authentication library   |

### Infrastructure

| Technology                                | Description                    |
| ----------------------------------------- | ------------------------------ |
| [PostgreSQL](https://www.postgresql.org/) | Primary database               |
| [Dragonfly](https://www.dragonflydb.io/)  | Redis-compatible cache         |
| S3-compatible storage                     | Object storage (MinIO locally) |

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/ai-picture.git
cd ai-picture
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

You'll need to configure the MinIO instance and create the default bucket with the following commands.

```bash
# Configure the local alias
source .env && docker exec -it ai-picture-minio-1 mc alias set local $MINIO_ENDPOINT $MINIO_ACCESS_KEY $MINIO_SECRET_KEY

# Create the bucket
source .env && docker exec -it ai-picture-minio-1 mc mb -p local/$MINIO_BUCKET

# Allow public access
source .env && docker exec -it ai-picture-minio-1 mc anonymous set download local/$MINIO_BUCKET
```

### 6. Execute database migrations

```bash
bun db migrate dev
```

This will execute all pending database migrations, if any or init your database.

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

## License

Private
