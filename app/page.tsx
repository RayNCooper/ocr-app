import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"

export default async function Home() {

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
            <FileUpload />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
