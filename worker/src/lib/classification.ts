import { z } from "zod"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { DocumentSchema, ValidatedData } from "./types"

export async function classifyDocument(rawText: string) {
    const aiClient = openai('gpt-4o-mini')

    const { object } = await generateObject({
        model: aiClient,
        schema: DocumentSchema,
        prompt: `Analyze this OCR text and extract structured information.
        Determine the document type, extract key data and provide a summary.
        Correct possible OCR errors such as typos or incomplete words, etc.

        OCR text:
        ${rawText}`,
    })

    return object
}