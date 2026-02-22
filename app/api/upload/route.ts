import { auth } from "@/lib/auth"
import { getPresignedUploadUrl, generateS3Key } from "@/lib/s3"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug, role, contentType, filename } = await req.json()

  if (!slug || !role || !contentType || !filename) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const s3Key = generateS3Key(slug, role, filename)
  const { uploadUrl, publicUrl } = await getPresignedUploadUrl(s3Key, contentType)

  return NextResponse.json({ uploadUrl, s3Key, publicUrl })
}
