import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateFile(file: File): { isValid: boolean; error?: string; status?: number } {
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  if (!file) {
    return { 
      isValid: false, 
      error: "No file provided",
      status: 400 
    }
  }

  if (file.type !== "application/pdf") {
    return {
      isValid: false,
      error: "Only PDF files are allowed",
      status: 400
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false, 
      error: "File size must be less than 10MB",
      status: 400
    }
  }

  return { 
    isValid: true,
    status: 200
  }
}

export async function uploadToS3(file: File, s3Key: string): Promise<void> {

  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })

  const buffer = Buffer.from(await file.arrayBuffer())
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: s3Key,
    Body: buffer,
    ContentType: file.type,
  })

  await s3Client.send(uploadCommand)
}