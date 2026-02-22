import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

let _s3: S3Client

function getS3(): S3Client {
  if (!_s3) {
    _s3 = new S3Client({
      region: process.env.AWS_DEFAULT_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  }
  return _s3
}

const bucket = () => process.env.AWS_S3_BUCKET!

export async function getPresignedUploadUrl(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const command = new PutObjectCommand({
    Bucket: bucket(),
    Key: key,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(getS3(), command, { expiresIn: 600 })
  const publicUrl = `https://${bucket()}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${key}`

  return { uploadUrl, publicUrl }
}

export async function deleteS3Object(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket(),
    Key: key,
  })
  await getS3().send(command)
}

export function generateS3Key(
  slug: string,
  role: string,
  filename: string
): string {
  const ext = filename.split(".").pop() || "jpg"
  const timestamp = Date.now()
  return `sites/${slug}/${role}-${timestamp}.${ext}`
}
