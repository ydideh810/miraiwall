"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ChevronLeft, ChevronRight, Shield, Clock, Key, Grid3X3 } from "lucide-react"

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
}

const tutorialSteps = [
  {
    title: "Welcome to MiraiWall",
    icon: <Grid3X3 className="w-8 h-8 text-purple-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          MiraiWall is a cyberpunk digital space where you can claim tiles using license keys and create time capsules
          for the future.
        </p>
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="text-purple-400 font-semibold mb-2">How it works:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Use license keys to claim tiles</li>
            <li>• Create time capsules with content</li>
            <li>• Set unlock dates for future reveals</li>
            <li>• Explore completed pages</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "License Keys & Claiming",
    icon: <Key className="w-8 h-8 text-gold-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          License keys follow the format:{" "}
          <code className="bg-gray-800 px-2 py-1 rounded text-gold-400">XXXXX-XXXXX-XXXXX-XXXXX</code>
        </p>
        <div className="bg-gold-900/20 border border-gold-500/30 rounded-lg p-4">
          <h4 className="text-gold-400 font-semibold mb-2">Key Rules:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Each key can only be used once</li>
            <li>• Keys must match the exact format</li>
            <li>• Invalid keys will be rejected</li>
            <li>• Successful claims open time capsule creation</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Time Capsules",
    icon: <Clock className="w-8 h-8 text-cyan-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          After claiming a tile, create a time capsule with content that unlocks at a future date.
        </p>
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
          <h4 className="text-cyan-400 font-semibold mb-2">Capsule Features:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Upload text, images, audio, or files</li>
            <li>• Set unlock dates (days, months, or years ahead)</li>
            <li>• Add optional teaser messages</li>
            <li>• Countdown timers until unlock</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Community Rules",
    icon: <Shield className="w-8 h-8 text-red-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          MiraiWall is a creative digital space. Please follow these rules to keep it safe and enjoyable for everyone.
        </p>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h4 className="text-red-400 font-semibold mb-2">Prohibited Content:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• No NSFW or adult content</li>
            <li>• No illegal activities or content</li>
            <li>• No promotion of drugs, gambling, or vices</li>
            <li>• No harassment or hate speech</li>
            <li>• No spam or malicious content</li>
            <li>• No copyright infringement</li>
          </ul>
        </div>
        <p className="text-sm text-gray-400">Violations may result in content removal and account restrictions.</p>
      </div>
    ),
  },
]

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentTutorial = tutorialSteps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-purple-500/30 shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
            <div className="flex items-center gap-3">
              {currentTutorial.icon}
              <h2 className="text-xl font-bold text-white font-orbitron">{currentTutorial.title}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[300px]">{currentTutorial.content}</div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-purple-500/30">
            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-purple-400" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              {currentStep === tutorialSteps.length - 1 ? (
                <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Get Started
                </Button>
              ) : (
                <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
