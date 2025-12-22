import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

const endpoint = process.env.MINIO_ENDPOINT ?? "localhost"
const port = process.env.MINIO_PORT ?? "9000"
const bucket = process.env.MINIO_BUCKET ?? "ai-picture"
const publicBase = process.env.MINIO_PUBLIC_URL ?? `http://localhost:${port}`

const s3 = new S3Client({
  region: process.env.MINIO_REGION ?? "us-east-1",
  endpoint: `http://${endpoint}:${port}`,
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER ?? "",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD ?? "",
  },
  forcePathStyle: true,
})

export const uploadPng = async (objectKey: string, bytes: Uint8Array) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: bytes,
      ContentType: "image/png",
    }),
  )

  return `${publicBase}/${bucket}/${objectKey}`
}
