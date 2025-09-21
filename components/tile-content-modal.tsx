"use client"

import { Download, Calendar, Lock } from "lucide-react"

interface TileContentModalProps {
  isOpen: boolean
  onClose: () => void
  tileId: string
  content: string
  timeCapsule?: {
    unlockDate: Date
    teaserMessage?: string
    capsuleContent: {
      type: "text" | "image" | "audio" | "file"
      data: string
      filename?: string
    }
    isUnlocked: boolean
  }
}

export function TileContentModal({ isOpen, onClose, tileId, content, timeCapsule }: TileContentModalProps) {
  if (!isOpen) return null

  const contentTypes = [
    "GitHub Repository",
    "Legal Document Pack",
    "ASCII QR Code",
    "Dataset Collection",
    "API Endpoint",
    "Utility Script",
  ]

  const randomContentType = contentTypes[Math.floor(Math.random() * contentTypes.length)]

  const handleDownload = () => {
    if (!timeCapsule?.capsuleContent) return

    const { type, data, filename } = timeCapsule.capsuleContent

    if (type === "text") {
      const blob = new Blob([data], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename || "time-capsule-content.txt"
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // For files with data URLs
      const a = document.createElement("a")
      a.href = data
      a.download = filename || "time-capsule-content"
      a.click()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border-2 border-primary/50 rounded-lg p-6 max-w-md w-full shadow-[0_0_30px_rgba(155,89,182,0.4)]">
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-secondary" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-secondary" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-secondary" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-secondary" />

        <div className="text-center">
          {timeCapsule ? (
            <>
              <h3 className="font-display text-xl font-bold text-emerald-400 mb-2 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                TIME CAPSULE OPENED
              </h3>
              <p className="font-mono text-sm text-emerald-300 mb-2">{tileId.toUpperCase()}</p>
              <p className="font-mono text-xs text-muted-foreground mb-4 flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" />
                Unlocked: {new Date(timeCapsule.unlockDate).toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <h3 className="font-display text-xl font-bold text-primary mb-2">TILE ACQUIRED</h3>
              <p className="font-mono text-sm text-secondary mb-4">{tileId.toUpperCase()}</p>
            </>
          )}

          <div className="bg-background/50 border border-primary/30 rounded p-4 mb-6">
            {timeCapsule ? (
              <>
                <h4 className="font-sans font-semibold text-foreground mb-2 capitalize">
                  {timeCapsule.capsuleContent.type} Content
                </h4>
                {timeCapsule.capsuleContent.type === "text" ? (
                  <p className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">
                    {timeCapsule.capsuleContent.data}
                  </p>
                ) : timeCapsule.capsuleContent.type === "image" ? (
                  <div className="space-y-2">
                    <img
                      src={timeCapsule.capsuleContent.data || "/placeholder.svg"}
                      alt="Time capsule content"
                      className="max-w-full h-auto rounded border border-primary/20"
                    />
                    <p className="text-xs text-muted-foreground">{timeCapsule.capsuleContent.filename}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-mono text-sm text-muted-foreground">📁 {timeCapsule.capsuleContent.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {timeCapsule.capsuleContent.type.toUpperCase()} file ready for download
                    </p>
                  </div>
                )}
                {timeCapsule.teaserMessage && (
                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <p className="text-xs text-amber-400 italic">"{timeCapsule.teaserMessage}"</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h4 className="font-sans font-semibold text-foreground mb-2">{randomContentType}</h4>
                <p className="font-mono text-sm text-muted-foreground">{content}</p>
              </>
            )}
          </div>

          <div className="flex gap-3">
            {timeCapsule && timeCapsule.capsuleContent.type !== "text" && (
              <button
                onClick={handleDownload}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold px-4 py-2 rounded transition-colors flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-display font-bold px-6 py-2 rounded transition-colors flex-1"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
