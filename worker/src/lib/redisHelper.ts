import { RedisClientType } from 'redis'
import { ValidatedData } from './types'

export async function updateEntryStatus(docId: string, status: string, redis: RedisClientType) {
  await redis.hSet(`file:${docId}`, 'status', status)
}

export async function updateEntryWithSuccess(docId: string, rawText: string, validatedData: ValidatedData, redis: RedisClientType) {
  await redis.hSet(`file:${docId}`, {
    status: 'validated',
    ocrResult: rawText,
    validatedData: JSON.stringify(validatedData),
    completedAt: new Date().toISOString(),
  })
}

export async function updateEntryWithFailure(docId: string, error: string, redis: RedisClientType) {
  await redis.hSet(`file:${docId}`, {
    status: 'failed',
    error: error,
    failedAt: new Date().toISOString(),
  })
}