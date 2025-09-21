"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface RedeemModalProps {
  isOpen: boolean
  onClose: () => void
  pageNumber: number
  tilePosition: number
  onSuccess: () => void
}

export function RedeemModal({ isOpen, onClose, pageNumber, tilePosition, onSuccess }: RedeemModalProps) {
  const [licenseKey, setLicenseKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateKeyFormat = (key: string): boolean => {
    const keyPattern = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/
    return keyPattern.test(key)
  }

  const handleKeyChange = (value: string) => {
    // Remove any non-alphanumeric characters except dashes
    let formatted = value.toUpperCase().replace(/[^A-Z0-9-]/g, "")

    // Remove existing dashes to reformat
    formatted = formatted.replace(/-/g, "")

    // Add dashes at correct positions
    if (formatted.length > 5) {
      formatted = formatted.slice(0, 5) + "-" + formatted.slice(5)
    }
    if (formatted.length > 11) {
      formatted = formatted.slice(0, 11) + "-" + formatted.slice(11)
    }
    if (formatted.length > 17) {
      formatted = formatted.slice(0, 17) + "-" + formatted.slice(17)
    }

    // Limit to 23 characters (5-5-5-5 + 3 dashes)
    if (formatted.length > 23) {
      formatted = formatted.slice(0, 23)
    }

    setLicenseKey(formatted)
  }

  const handleRedeem = async () => {
    if (!licenseKey.trim()) {
      setError("Please enter a license key")
      return
    }

    if (!validateKeyFormat(licenseKey)) {
      setError("Invalid key format. Use: 2Z23H-YA548-FKBU2-8LAUL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/claim-tile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseKey: licenseKey.trim(),
          pageNumber,
          tilePosition,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim tile")
      }

      // Success!
      onSuccess()
      setLicenseKey("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyLicense = () => {
    window.open("https://payhip.com/b/qGsLD", "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-purple-500/30 text-white max-w-md animate-scanline-flicker">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-xl text-purple-400">Redeem License Key</DialogTitle>
          <DialogDescription className="text-gray-400 font-orbitron">
            Claim tile {tilePosition + 1} on page {pageNumber + 1}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="license-key" className="text-purple-400 font-orbitron">
              License Key
            </Label>
            <Input
              id="license-key"
              type="text"
              placeholder="2Z23H-YA548-FKBU2-8LAUL"
              value={licenseKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="bg-gray-900 border-purple-500/30 text-white placeholder-gray-500 font-doto"
              disabled={isLoading}
              maxLength={23}
            />
            <p className="text-xs text-gray-500 font-orbitron">Format: XXXXX-XXXXX-XXXXX-XXXXX</p>
          </div>

          {error && (
            <div className="text-red-400 text-sm font-orbitron bg-red-900/20 p-2 rounded border border-red-500/30">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleRedeem}
              disabled={isLoading || !licenseKey.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-orbitron"
            >
              {isLoading ? "Claiming..." : "Claim Tile"}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 font-orbitron bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs text-gray-400 mb-2 font-orbitron">Don't have a license key?</p>
            <Button
              onClick={handleBuyLicense}
              variant="outline"
              className="w-full border-gold-500/30 text-gold-400 hover:bg-gold-900/20 font-orbitron bg-transparent"
            >
              Buy a Tile License
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
