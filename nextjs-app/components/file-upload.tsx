"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"

export function FileUpload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const validateFile = (file: File): boolean => {
        setError("")

        if (file.type !== "application/pdf") {
            setError("Only PDF files are allowed")
            return false
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("File size must be less than 10MB")
            return false
        }

        return true
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (validateFile(file)) {
                setSelectedFile(file)
                setSuccess(false)
            }
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (validateFile(file)) {
                setSelectedFile(file)
                setSuccess(false)
            }
        }
    }

    const handleSubmit = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append("file", selectedFile)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const faultyResponse = await response.json()
                throw new Error(faultyResponse.error)
            } else {
                setSuccess(true)
                setSelectedFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            }
        } catch {
            setError("Upload failed. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="space-y-4">
                    <Upload className="w-10 h-10 mx-auto" />
                    <div>
                        <p className="text-lg font-medium">Drop your PDF file here</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            or{" "}
                            <span
                                className="underline cursor-pointer hover:text-foreground transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                click to browse
                            </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            PDF files only, max 10MB
                        </p>
                    </div>
                </div>
            </div>

            <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileSelect}
                required
            />

            {selectedFile && (
                <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">File uploaded successfully!</p>
                </div>
            )}

            <Button
                onClick={handleSubmit}
                disabled={!selectedFile || isUploading}
                className="w-full cursor-pointer"
            >
                {isUploading ? "Uploading..." : "Submit"}
            </Button>
        </div>
    )
}