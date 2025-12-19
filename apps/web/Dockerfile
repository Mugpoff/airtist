FROM oven/bun:1.3.4

WORKDIR /app

RUN apt-get update && apt-get install -y curl postgresql-client && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc && chmod +x /usr/local/bin/mc

COPY . .

RUN bun install

COPY apps/web/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
