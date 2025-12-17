import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: `http://localhost:${process.env.MINIO_PORT || "9000"}`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || "ai-picture",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || "ai-picture",
  },
})

export const uploadImage = async (buffer: Buffer, fileName: string) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: "generated-images",
      Key: fileName,
      Body: buffer,
      ContentType: "image/png",
    }),
  )

  return `http://localhost:${process.env.MINIO_PORT}/generated-images/${fileName}`
}
