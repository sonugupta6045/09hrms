import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToS3(file: Buffer, fileName: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `resumes/${fileName}`,
    Body: file,
    ContentType: "application/pdf",
  })

  await s3Client.send(command)

  // Generate a pre-signed URL for secure access
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // URL expires in 1 hour

  return url
}

export function getS3Url(fileName: string): string {
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/resumes/${fileName}`
}

