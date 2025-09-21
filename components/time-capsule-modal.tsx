"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Calendar, Lock, FileText, ImageIcon, Music, File } from "lucide-react"

interface TimeCapsuleModalProps {
  isOpen: boolean
  onClose: () => void
  pageNumber: number
  tilePosition: number
  onSuccess: (capsuleData: any) => void
}

export function TimeCapsuleModal({ isOpen, onClose, pageNumber, tilePosition, onSuccess }: TimeCapsuleModalProps) {
  const [contentType, setContentType] = useState<"text" | "image" | "audio" | "file">("text")
  const [textContent, setTextContent] = useState("")
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [filename, setFilename] = useState("")
  const [unlockDate, setUnlockDate] = useState("")
  const [teaserMessage, setTeaserMessage] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFilename(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      setFileContent(e.target?.result as string)
    }

    if (contentType === "text") {
      reader.readAsText(file)
    } else {
      reader.readAsDataURL(file)
    }
  }

  const handleCreateCapsule = async () => {
    if (!unlockDate) return

    setIsCreating(true)

    const capsuleData = {
      unlockDate,
      teaserMessage,
      content: {
        type: contentType,
        data: contentType === "text" ? textContent : fileContent,
        filename: contentType !== "text" ? filename : undefined,
      },
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onSuccess(capsuleData)
    onClose()
    setIsCreating(false)

    // Reset form
    setTextContent("")
    setFileContent(null)
    setFilename("")
    setUnlockDate("")
    setTeaserMessage("")
    setContentType("text")
  }

  const getContentIcon = () => {
    switch (contentType) {
      case "text":
        return <FileText className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "audio":
        return <Music className="w-4 h-4" />
      case "file":
        return <File className="w-4 h-4" />
    }
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateString = minDate.toISOString().slice(0, 16)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary font-orbitron">
            <Lock className="w-5 h-5" />
            Create Time Capsule
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Seal content in tile {tilePosition + 1} to be revealed at a future date
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Type Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Content Type</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: "text" as const, label: "Text", icon: <FileText className="w-4 h-4" /> },
                { type: "image" as const, label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
                { type: "audio" as const, label: "Audio", icon: <Music className="w-4 h-4" /> },
                { type: "file" as const, label: "File", icon: <File className="w-4 h-4" /> },
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 text-xs ${
                    contentType === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <Label className="text-sm font-medium mb-2 flex items-center gap-2">
              {getContentIcon()}
              Capsule Content
            </Label>

            {contentType === "text" ? (
              <Textarea
                placeholder="Enter your message for the future..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[100px] bg-background/50 border-primary/20"
              />
            ) : (
              <div className="space-y-2">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept={contentType === "image" ? "image/*" : contentType === "audio" ? "audio/*" : "*/*"}
                  className="bg-background/50 border-primary/20"
                />
                {filename && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    {filename}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Unlock Date */}
          <div>
            <Label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Unlock Date & Time
            </Label>
            <div className="space-y-2">
              <Input
                type="datetime-local"
                value={unlockDate}
                onChange={(e) => {
                  console.log("[v0] Date changed:", e.target.value)
                  setUnlockDate(e.target.value)
                }}
                min={minDateString}
                className="bg-background/50 border-primary/20 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                style={{
                  colorScheme: "dark",
                }}
              />
              {unlockDate && (
                <p className="text-xs text-primary/70">Unlocks: {new Date(unlockDate).toLocaleString()}</p>
              )}
            </div>
          </div>

          {/* Teaser Message */}
          <div>
            <Label className="text-sm font-medium mb-2">Teaser Message (Optional)</Label>
            <Input
              placeholder="A hint about what's inside..."
              value={teaserMessage}
              onChange={(e) => setTeaserMessage(e.target.value)}
              className="bg-background/50 border-primary/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isCreating}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCapsule}
              disabled={!unlockDate || (contentType === "text" ? !textContent : !fileContent) || isCreating}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sealing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Create Capsule
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
