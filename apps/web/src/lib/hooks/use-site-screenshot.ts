'use client'

import { useState, useEffect, useRef } from 'react'

const DEBOUNCE_MS = 1200
const CACHE_KEY = 'floqly:screenshots'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 часа

interface CacheEntry {
  screenshotUrl: string
  timestamp: number
}

function getCache(): Record<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function getCachedScreenshot(url: string): string | null {
  const cache = getCache()
  const entry = cache[url]
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    delete cache[url]
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
    return null
  }
  return entry.screenshotUrl
}

function setCachedScreenshot(url: string, screenshotUrl: string) {
  const cache = getCache()
  cache[url] = { screenshotUrl, timestamp: Date.now() }
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
}

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

    // Проверяем кеш
    const cached = getCachedScreenshot(url)
    if (cached) {
      setScreenshotUrl(cached)
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

        if (imgUrl) {
          setCachedScreenshot(url, imgUrl)
        }

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
