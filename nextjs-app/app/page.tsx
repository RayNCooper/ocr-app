import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import EntryList from "@/components/entry-list"
import { RateLimitIndicator } from "@/components/rate-limit-indicator"
import { getEntries, getRateLimit } from "./actions"

export const dynamic = 'force-dynamic'

export default async function Home() {

  const entriesData = await getEntries()  
  const rateLimit = await getRateLimit()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>OCR File Upload</CardTitle>
            <CardDescription>
              Upload PDF files for OCR processing and content extraction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload rateLimitProp={rateLimit} />
          </CardContent>
        </Card>
        <EntryList entriesProp={entriesData} />
      </div>
      <RateLimitIndicator rateLimitProp={rateLimit} />
    </div>
  )
}
