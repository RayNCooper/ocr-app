"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DocumentEntry } from "@/lib/types"
import { getEntries, removeEntry, viewOriginalFile } from "@/app/actions"
import { useState } from 'react'
import useSWR from "swr"
import { FileText, Receipt, FileSignature, Trash2, ExternalLink, Loader, FileQuestionMark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function EntryList({ entriesProp }: { entriesProp: DocumentEntry[] }) {

    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState<DocumentEntry | null>(null)
    const [isQueryingOriginalFile, setIsQueryingOriginalFile] = useState(false)

    const { data: entries, mutate } = useSWR('entries', getEntries, {
        refreshInterval: 3000,
        fallbackData: entriesProp,
        onSuccess: () => {
            if (selectedEntry) {
                // updates the dialog with the latest entry data
                setSelectedEntry(entries.find(entry => entry.id === selectedEntry.id) || null)
            }
        },
        onError: () => {
            toast.error('Failed to fetch entries')
        }
    })

    const handleRemoveEntry = async (id: string) => {
        await removeEntry(id)
        mutate()
    }

    const handleViewOriginalFile = async (id: string) => {
        setIsQueryingOriginalFile(true)
        try {
            const url = await viewOriginalFile(id)
            
            // Create a temporary anchor element to handle the download/view
            const link = document.createElement('a')
            link.href = url
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            
            // Add to DOM, click, and remove (required for some mobile browsers)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error(error)
            toast.error('Failed to view original file')
        } finally {
            setIsQueryingOriginalFile(false)
        }
    }

    if (entries.length === 0) {
        return <div className="text-center text-sm text-muted-foreground">No entries found. Please upload a file.</div>
    }

    return (
        <>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full max-w-md"
            >
                <CarouselContent>
                    {entries.map((entry, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 cursor-pointer">
                            <div className="p-1 flex flex-col gap-2">
                                <Card onClick={() => {
                                    setSelectedEntry(entry)
                                    setDialogOpen(true)
                                }}>
                                    <CardHeader>
                                        <CardTitle className="text-wrap flex items-center gap-2">
                                            {
                                                entry.validatedData?.documentType ? (
                                                    <>
                                                        {entry.validatedData.documentType === 'invoice' && <FileText className="h-4 w-4" />}
                                                        {entry.validatedData.documentType === 'receipt' && <Receipt className="h-4 w-4" />}
                                                        {entry.validatedData.documentType === 'contract' && <FileSignature className="h-4 w-4" />}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Loader className="h-4 w-4 animate-spin" />
                                                        <FileQuestionMark className="h-4 w-4" />
                                                    </>
                                                )
                                            }
                                        </CardTitle>
                                        <CardDescription className="text-wrap">{new Date(entry.uploadedAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</CardDescription>
                                    </CardHeader>
                                </Card>

                                <Button variant="destructive" onClick={() => handleRemoveEntry(entry.id)} className="cursor-pointer w-fit">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="lg:max-w-2xl overflow-y-scroll" style={{ maxHeight: '80dvh' }}>
                    <DialogHeader>
                        <DialogTitle>OCR&apos;d Content</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4 col-span-2 lg:col-span-1">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-muted-foreground">Original File Name</span>
                                <span className="text-sm">{selectedEntry?.fileName}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <div className="flex items-center gap-2">
                                    {selectedEntry?.status === 'validated' && (
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            Validated
                                        </span>
                                    )}
                                    {selectedEntry?.status === 'processing' && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                                            <Loader className="h-3 w-3 animate-spin" />
                                            Processing
                                        </span>
                                    )}
                                    {selectedEntry?.status === 'failed' && (
                                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                            Failed
                                        </span>
                                    )}
                                </div>
                            </div>
                            {selectedEntry?.validatedData && (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm text-muted-foreground">Document Type</span>
                                        <div className="flex items-center gap-2">
                                            {selectedEntry.validatedData.documentType === 'invoice' && <FileText className="h-4 w-4" />}
                                            {selectedEntry.validatedData.documentType === 'receipt' && <Receipt className="h-4 w-4" />}
                                            {selectedEntry.validatedData.documentType === 'contract' && <FileSignature className="h-4 w-4" />}
                                            <span className="inline-flex items-center rounded-md capitalize bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                                                {selectedEntry.validatedData.documentType}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm text-muted-foreground">Summary</span>
                                        <span className="text-sm whitespace-pre-wrap">{selectedEntry.validatedData.summary}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        {selectedEntry?.validatedData && <div className="flex flex-col gap-2 col-span-2 lg:col-span-1">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-muted-foreground">Extracted Data</span>
                                <div className="grid gap-3 p-2 rounded-lg border bg-muted/10">
                                    {Object.entries(selectedEntry.validatedData.extractedData).map(([key, value]) => {
                                        if (key === 'parties' && Array.isArray(value)) {
                                            return (
                                                <div key={key} className="flex flex-col gap-1.5">
                                                    <span className="text-xs font-medium text-muted-foreground capitalize">
                                                        {key}
                                                    </span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {value.map((party, index) => (
                                                            <span key={index} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                                {party}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return (
                                            <div key={key} className="flex flex-col gap-1.5">
                                                <span className="text-xs font-medium text-muted-foreground capitalize">
                                                    {key}
                                                </span>
                                                <span className="text-sm bg-background rounded p-2">
                                                    {value?.toString() || 'N/A'}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 items-end w-full">
                                <Button 
                                    variant={"outline"} 
                                    className="flex items-center gap-2 cursor-pointer min-h-[44px] px-4 py-2 touch-manipulation" 
                                    disabled={isQueryingOriginalFile} 
                                    onClick={() => handleViewOriginalFile(selectedEntry.id)}
                                >
                                    {isQueryingOriginalFile ? (
                                        <Loader className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ExternalLink className="h-4 w-4" />
                                    )}
                                    <span>View Original File</span>
                                </Button>
                            </div>
                        </div>}
                    </div>
                    {selectedEntry?.ocrResult && <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                    >
                        <AccordionItem value="raw-ocr-result">
                            <AccordionTrigger>
                                <span className="text-sm text-muted-foreground">Raw OCR Result</span>
                            </AccordionTrigger>
                            <AccordionContent className="overflow-y-scroll">
                                <span className="text-sm bg-background rounded font-mono">{selectedEntry.ocrResult}</span>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>}
                </DialogContent>
            </Dialog >
        </>
    )
}