"use server"

import RedisClient from "@/lib/redisClient"
import S3Client from "@/lib/s3Client"
import { DocumentEntry } from "@/lib/types"
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export async function getEntries() {

    const redis = await RedisClient.getInstance()

    const entries = await redis.keys('file:*') as string[]

    const entriesData = await Promise.all(entries.map(async (entry) => {
        const entryData = await redis.hGetAll(entry)
        return {
            ...entryData,
            validatedData: entryData.validatedData ? JSON.parse(entryData.validatedData) : null,
            uploadedAt: new Date(entryData.uploadedAt).toLocaleString(),
            id: entry.split(':')[1]
        } as unknown as DocumentEntry
    }))

    const sortedEntries = entriesData.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return sortedEntries
}

export async function removeEntry(id: string) {

    const redis = await RedisClient.getInstance()

    const entry = await redis.hGet(`file:${id}`, 's3Key') as string | null

    if (!entry) {
        throw new Error('Entry not found')
    }

    const s3Client = await S3Client.getInstance()

    await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: entry
    }))

    await redis.del(`file:${id}`)
}

export async function viewOriginalFile(id: string) {

    const redis = await RedisClient.getInstance()

    const entry = await redis.hGet(`file:${id}`, 's3Key') as string | null

    if (!entry) {
        throw new Error('Entry not found')
    }

    const s3Client = await S3Client.getInstance()

    const url = await getSignedUrl(s3Client, new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: entry
    }), {
        expiresIn: 60 * 60 * 24 * 1 // 1 day
    })

    return url
}