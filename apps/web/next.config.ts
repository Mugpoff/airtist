import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  typedRoutes: true,
  async rewrites() {
    // Allow rendering images stored in local MinIO during development.
    return [
      {
        source: "/cdn/images/:path*",
        destination: `${process.env.MINIO_PUBLIC_ENDPOINT}/${process.env.MINIO_BUCKET}/images/:path*`,
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin({
  experimental: {
    // Keep messages typings in sync with the shared messages package.
    createMessagesDeclaration: "../../packages/messages/src/en.json",
  },
})

export default withNextIntl(nextConfig)
