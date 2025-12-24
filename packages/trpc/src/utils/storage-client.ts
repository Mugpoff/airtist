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

export const uploadPng = async (key: string, body: Buffer) => {
  const command = new PutObjectCommand({
    Bucket: env.MINIO_BUCKET,
    Key: key,
    Body: body,
    ContentType: "image/png",
  })

  await s3.send(command)

  return `${env.MINIO_PUBLIC_ENDPOINT}/${env.MINIO_BUCKET}/${key}`
}

export const deletePng = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: env.MINIO_BUCKET,
    Key: key,
  })

  await s3.send(command)
}
