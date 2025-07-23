"use client"

import { useState, useEffect, useCallback } from "react"

export function useSpeech() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState([])

  useEffect(() => {
    // Check if speech synthesis is supported
    if ("speechSynthesis" in window) {
      setIsSupported(true)

      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      // Load voices immediately
      loadVoices()

      // Also load when voices change (some browsers load them asynchronously)
      window.speechSynthesis.onvoiceschanged = loadVoices

      // Listen for speech events
      const handleSpeechStart = () => setIsSpeaking(true)
      const handleSpeechEnd = () => setIsSpeaking(false)

      return () => {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  const speak = useCallback(
    (text, options = {}) => {
      if (!isSupported) {
        console.warn("Speech synthesis not supported")
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text)

      // Apply options
      utterance.rate = options.rate || 0.9
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 0.8

      // Try to find a good voice
      if (voices.length > 0) {
        const preferredVoice =
          voices.find(
            (voice) =>
              voice.name.includes("Google") ||
              voice.name.includes("Microsoft") ||
              (voice.lang.startsWith("en") && voice.localService),
          ) || voices.find((voice) => voice.lang.startsWith("en"))

        if (preferredVoice) {
          utterance.voice = preferredVoice
        }
      }

      // Set up event listeners
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      // Speak
      window.speechSynthesis.speak(utterance)
    },
    [isSupported, voices],
  )

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  const pause = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause()
    }
  }, [isSupported])

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume()
    }
  }, [isSupported])

  return {
    isSupported,
    isSpeaking,
    voices,
    speak,
    stop,
    pause,
    resume,
  }
}
