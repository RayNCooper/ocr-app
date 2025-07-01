import { z } from "zod"

export interface JobData {
    fileId: string
    fileName: string
    s3Key: string
}

export const DocumentSchema = z.object({
    documentType: z.enum(['invoice', 'receipt', 'contract']),
    extractedData: z.object({
        title: z.string().optional(),
        date: z.string().optional(),
        amount: z.string().optional(),
        parties: z.array(z.string()).optional(),
        keyFields: z.record(z.string()).optional(),
    }),
    summary: z.string(),
})

export type ValidatedData = z.infer<typeof DocumentSchema>