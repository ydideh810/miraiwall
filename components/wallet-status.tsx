"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"

export function WalletStatus() {
  const [balance, setBalance] = useState(2.456)
  const [isConnected, setIsConnected] = useState(true)

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-card/90 backdrop-blur-md border-2 border-primary/50 rounded-lg px-4 py-3 shadow-[0_0_20px_rgba(155,89,182,0.3)]">
        <div className="flex items-center gap-3">
          <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-400 animate-pulse" : "bg-red-400")} />
          <div className="text-right">
            <div className="font-mono text-xs text-muted-foreground">WALLET</div>
            <div className="font-display text-sm font-bold text-primary">{balance.toFixed(3)} ETH</div>
          </div>
        </div>

        <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-primary" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-primary" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-primary" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-primary" />
      </div>
    </div>
  )
}
