import { Worker, Job } from 'bullmq'
import { createClient, RedisClientType } from 'redis'
import { simulateOCR } from './lib/ocr'
import { updateEntryStatus, updateEntryWithFailure, updateEntryWithSuccess } from './lib/redisHelper'
import { classifyDocument } from './lib/classification'
import { JobData } from './lib/types'

/////////
/* REDIS INITIALIZATION */
/////////

const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || '',
})

redis.on('error', (err) => {
    // Here we could add error tracking in the future such as Sentry, for now we just log
    console.error('Redis Client Error', err)
})

redis.connect()

/////////
/* OCR WORKER */
/////////

const ocrWorker = new Worker('ocrQueue', async (job: Job<JobData>) => {
    console.log(`[${job.data.fileId}] OCR job started`)

    try {
        await updateEntryStatus(job.data.fileId, 'processing', redis as RedisClientType)

        const result = await simulateOCR()

        const classifiedDocument = await classifyDocument(result.text)

        await updateEntryWithSuccess(job.data.fileId, result.text, classifiedDocument, redis as RedisClientType)

        console.log(`[${job.data.fileId}] OCR job completed successfully`)

        return;
    } catch (error) {
        // we throw again to trigger the failed event for the worker, but before we update the entry with failure
        await updateEntryWithFailure(job.data.fileId, error as string, redis as RedisClientType)
        throw error
    }
}, {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || '',
    },
    concurrency: 1,
})

ocrWorker.on('failed', (job, err) => {
    // Here we could add error tracking in the future such as Sentry, for now we just log
    console.error(`OCR job ${job?.id} has failed with ${err.message}`)
    return
})

/////////
/* PROCESS MANAGEMENT */
/////////

const gracefulShutdown = async () => {
    console.log('Shutting down workers...')
    await ocrWorker.close()
    // disconnect() is deprecated
    await redis.destroy()
    process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

console.log('OCR Worker: Processing jobs from "ocrQueue"')