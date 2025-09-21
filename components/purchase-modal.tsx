"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  tileId: string
  price: number
}

export function PurchaseModal({ isOpen, onClose, onConfirm, tileId, price }: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsProcessing(true)
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onConfirm()
    setIsProcessing(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className={cn(
          "relative bg-card border-2 border-secondary/50 rounded-lg p-6 max-w-md w-full shadow-[0_0_30px_rgba(241,196,15,0.4)]",
          "animate-modal-scanline animate-scanline-flicker",
        )}
      >
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-primary" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-primary" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-primary" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-primary" />

        <div className="text-center">
          <h3 className="font-display text-xl font-bold text-secondary mb-2">PURCHASE TILE</h3>
          <p className="font-mono text-sm text-primary mb-4">{tileId.toUpperCase()}</p>

          <div className="bg-background/50 border border-secondary/30 rounded p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-sans text-foreground">Tile Price:</span>
              <span className="font-mono text-secondary font-bold">{price} ETH</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-sans text-foreground">Network Fee:</span>
              <span className="font-mono text-muted-foreground">0.001 ETH</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-sans font-bold text-foreground">Total:</span>
                <span className="font-mono text-secondary font-bold">{(price + 0.001).toFixed(3)} ETH</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 bg-border hover:bg-border/80 text-foreground font-display font-bold px-4 py-2 rounded transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={cn(
                "flex-1 font-display font-bold px-4 py-2 rounded transition-colors",
                isProcessing
                  ? "bg-blue-500 text-white animate-pulse"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
              )}
            >
              {isProcessing ? "PROCESSING..." : "CONFIRM"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
