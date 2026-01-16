FROM oven/bun:1.3.5 AS base
WORKDIR /app

FROM base AS builder
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG DRAGONFLY_URL
ARG MINIO_BUCKET
ARG MINIO_ENDPOINT
ARG MINIO_PUBLIC_ENDPOINT
ARG MINIO_ACCESS_KEY
ARG MINIO_SECRET_KEY
ARG OPENROUTER_API_KEY

ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV DRAGONFLY_URL=$DRAGONFLY_URL
ENV MINIO_BUCKET=$MINIO_BUCKET
ENV MINIO_ENDPOINT=$MINIO_ENDPOINT
ENV MINIO_PUBLIC_ENDPOINT=$MINIO_PUBLIC_ENDPOINT
ENV MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY
ENV MINIO_SECRET_KEY=$MINIO_SECRET_KEY
ENV OPENROUTER_API_KEY=$OPENROUTER_API_KEY
ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY . .
RUN bun install --frozen-lockfile

RUN bun run -F @repo/db prisma generate
RUN bun x turbo build --filter=web...

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/apps/web/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["bun", "run", "-F", "web", "start"]
