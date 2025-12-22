import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import "./src/env"

const minioPublicEndpoint =
  process.env.MINIO_PUBLIC_ENDPOINT ?? "http://localhost:9000"
const minioBucket = process.env.MINIO_BUCKET ?? "ai-picture"

const nextConfig: NextConfig = {
  typedRoutes: true,
  async rewrites() {
    // Allow rendering images stored in local MinIO during development.
    return [
      {
        source: "/cdn/images/:path*",
        destination: `${minioPublicEndpoint}/${minioBucket}/images/:path*`,
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin({
  experimental: {
    // Keep messages typing in sync with the shared messages package.
    createMessagesDeclaration: "../../packages/messages/src/en.json",
  },
})

export default withNextIntl(nextConfig)
