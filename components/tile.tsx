"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface TileProps {
  pageNumber: number
  tilePosition: number
  status: "available" | "pending" | "owned"
  content?: string
  owner?: string
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
  onRedeem: (pageNumber: number, tilePosition: number) => void
  onViewContent?: () => void
  onCreateTimeCapsule?: (pageNumber: number, tilePosition: number) => void
}

export function Tile({
  pageNumber,
  tilePosition,
  status,
  content,
  owner,
  timeCapsule,
  onRedeem,
  onViewContent,
  onCreateTimeCapsule,
}: TileProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    if (timeCapsule && !timeCapsule.isUnlocked) {
      const updateCountdown = () => {
        const now = new Date().getTime()
        const unlockTime = new Date(timeCapsule.unlockDate).getTime()
        const difference = unlockTime - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

          if (days > 0) {
            setTimeRemaining(`${days}d`)
          } else {
            setTimeRemaining(`${hours}h`)
          }
        } else {
          setTimeRemaining("OPEN")
          if (timeCapsule) {
            timeCapsule.isUnlocked = true
          }
        }
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 300000)
      return () => clearInterval(interval)
    }
  }, [timeCapsule])

  const getStatusStyles = () => {
    if (timeCapsule && !timeCapsule.isUnlocked) {
      return "border-amber-500 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300"
    }
    if (timeCapsule && timeCapsule.isUnlocked) {
      return "border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
    }

    switch (status) {
      case "available":
        return "border-purple-500 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
      case "pending":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-300"
      case "owned":
        return "border-gray-400 bg-gray-400/10 hover:bg-gray-400/20 text-gray-300"
      default:
        return "border-gray-600 bg-gray-600/10"
    }
  }

  const getStatusIcon = () => {
    if (timeCapsule && !timeCapsule.isUnlocked) {
      return "🔒"
    }
    if (timeCapsule && timeCapsule.isUnlocked) {
      return "🔓"
    }

    switch (status) {
      case "available":
        return "◯"
      case "pending":
        return "◐"
      case "owned":
        return "●"
      default:
        return "◯"
    }
  }

  const getTitle = () => {
    if (timeCapsule && !timeCapsule.isUnlocked) {
      return `Time Capsule - Unlocks: ${new Date(timeCapsule.unlockDate).toLocaleDateString()}${timeCapsule.teaserMessage ? ` - ${timeCapsule.teaserMessage}` : ""}`
    }
    if (timeCapsule && timeCapsule.isUnlocked) {
      return `Time Capsule Unlocked - Click to view`
    }
    if (status === "owned") {
      return content
        ? `${content} - Click to view or create time capsule`
        : `Tile ${tilePosition + 1} - Click to create time capsule`
    }
    if (status === "available") {
      return `Redeem tile ${tilePosition + 1}`
    }
    return `Tile ${tilePosition + 1} - ${status}`
  }

  const handleClick = () => {
    if (status === "available") {
      onRedeem(pageNumber, tilePosition)
    } else if (status === "owned" && !timeCapsule && onViewContent) {
      onViewContent()
    } else if (status === "owned" && !timeCapsule && onCreateTimeCapsule) {
      onCreateTimeCapsule(pageNumber, tilePosition)
    } else if (timeCapsule && timeCapsule.isUnlocked && onViewContent) {
      onViewContent()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "pending"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "aspect-square border-2 rounded-lg transition-all duration-200",
        "flex flex-col items-center justify-center text-xs font-sans relative",
        "hover:scale-105 active:scale-95",
        getStatusStyles(),
        isHovered && "shadow-lg",
      )}
      title={getTitle()}
    >
      <span className="text-lg font-bold mb-1">{getStatusIcon()}</span>

      <span className="text-[10px] opacity-90 font-bold tracking-wider">
        {timeCapsule && !timeCapsule.isUnlocked && timeRemaining}
        {timeCapsule && timeCapsule.isUnlocked && "OPEN"}
        {!timeCapsule && status === "available" && "REDEEM"}
        {!timeCapsule && status === "pending" && "WAIT"}
        {!timeCapsule && status === "owned" && "CAPSULE"}
      </span>

      <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-current opacity-30" />
      <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-current opacity-30" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-current opacity-30" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-current opacity-30" />
    </button>
  )
}
