import { NextRequest, NextResponse } from "next/server"
import { Queue } from "bullmq"
import { v4 as uuidv4 } from "uuid"
import { validateFile, uploadToS3 } from "@/lib/utils"
import RedisClient from "@/lib/redisClient"
import { RateLimit } from "@/lib/rateLimit"

export async function POST(request: NextRequest) {

  try {
    // Check rate limit
    const { allowed, count } = await RateLimit.check()

    if (!allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. ${count}/5 uploads used this hour.` },
        { status: 429 }
      )
    }

    const redis = await RedisClient.getInstance()

    const ocrQueue = new Queue("ocrQueue", {
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD || "",
      },
    })

    const formData = await request.formData()
    const file = formData.get("file") as File

    const { isValid, error, status } = validateFile(file)
    if (!isValid) {
      return NextResponse.json({ error }, { status })
    }

    // Generate unique ID and S3 key
    const fileId = uuidv4()
    const s3Key = `uploads/${fileId}`

    await uploadToS3(file, s3Key)

    // Connect to Redis and save file metadata
    if (!redis.isOpen) {
      await redis.connect()
    }

    await redis.hSet(`file:${fileId}`, {
      fileName: file.name,
      fileSize: file.size.toString(),
      s3Key,
      status: "uploaded",
      uploadedAt: new Date().toISOString(),
    })

    await ocrQueue.add("simulateOCR", {
      fileId,
      fileName: file.name,
      s3Key,
    })

    await redis.hSet(`file:${fileId}`, "status", "processing")

    // Record the upload for rate limiting
    await RateLimit.record()

    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}