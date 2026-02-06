'use client'

import { useState, useEffect, useRef } from 'react'

const DEBOUNCE_MS = 1200

function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  let url = trimmed
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  try {
    new URL(url)
    return url
  } catch {
    return null
  }
}

export function useSiteScreenshot(websiteInput: string) {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const url = normalizeUrl(websiteInput)

    if (!url) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScreenshotUrl(null)
      setIsLoading(false)
      return
    }

    const currentId = ++requestIdRef.current
    setIsLoading(true)

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&screenshot.width=1280&screenshot.height=800&viewport.width=1280&viewport.height=800`
        )

        if (currentId !== requestIdRef.current) return

        if (!response.ok) {
          setScreenshotUrl(null)
          setIsLoading(false)
          return
        }

        const json = await response.json()
        const imgUrl = json?.data?.screenshot?.url

        setScreenshotUrl(imgUrl ?? null)
        setIsLoading(false)
      } catch {
        if (currentId !== requestIdRef.current) return
        setScreenshotUrl(null)
        setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [websiteInput])

  return { screenshotUrl, isLoading }
}
