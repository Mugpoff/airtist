import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { env } from "../env"

const s3 = new S3Client({
  endpoint: env.MINIO_ENDPOINT,
  region: env.MINIO_REGION,
  credentials: {
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
})

/**
 * Sanitizes a file name for safe storage and URL usage.
 * - Normalizes accents (é → e, ñ → n)
 * - Replaces spaces with underscores
 * - Removes unsafe URL characters and emojis
 * - Preserves file extension
 * - Falls back to "file" if name becomes empty
 */
export const sanitizeFileName = (name: string): string => {
  const lastDot = name.lastIndexOf(".")
  const baseName = lastDot > 0 ? name.slice(0, lastDot) : name
  const extension = lastDot > 0 ? name.slice(lastDot) : ""

  const sanitized = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "_")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .replace(/[_-]+/g, "_")
    .replace(/^[_-]+|[_-]+$/g, "")

  return (sanitized || "file") + extension.toLowerCase()
}

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/heic",
])

const assertAllowedImageMimeType = (mimeType: string) => {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
    throw new Error(`Unsupported image mime type: ${mimeType}`)
  }
}

export const uploadImage = async (
  key: string,
  body: Buffer,
  mimeType: string,
) => {
  assertAllowedImageMimeType(mimeType)

  const command = new PutObjectCommand({
    Bucket: env.MINIO_BUCKET,
    Key: key,
    Body: body,
    ContentType: mimeType,
  })

  await s3.send(command)

  return `${env.MINIO_PUBLIC_ENDPOINT}/${env.MINIO_BUCKET}/${key}`
}

const deleteObject = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: env.MINIO_BUCKET,
    Key: key,
  })

  await s3.send(command)
}

export const deletePng = async (key: string) => {
  await deleteObject(key)
}
