import type { Subtitle } from "@/services/subtitles"

export function secondsToHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const formattedHours = hours.toString().padStart(2, "0")
  const formattedMinutes = minutes.toString().padStart(2, "0")
  const formattedSeconds = remainingSeconds
    .toFixed(0)
    .toString()
    .padStart(2, "0")

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

export function hmsStringToSeconds(hms: string): number {
  if (hms.length !== 6) {
    throw new Error(
      "Invalid input format. The input should be a 6-digit string (e.g. 000102)."
    )
  }

  const hours = parseInt(hms.slice(0, 2), 10)
  const minutes = parseInt(hms.slice(2, 4), 10)
  const seconds = parseInt(hms.slice(4, 6), 10)

  return hours * 3600 + minutes * 60 + seconds
}

export function findClosestSubtitle(
  hms: string,
  subtitles: Subtitle[]
): Subtitle | null {
  const inputSeconds = hmsStringToSeconds(hms)

  if (subtitles.length === 0) {
    return null
  }

  return subtitles.reduce((closestSubtitle, currentSubtitle) => {
    const currentDiff = Math.abs(
      inputSeconds - (currentSubtitle.start + currentSubtitle.end) / 2
    )
    const closestDiff = Math.abs(
      inputSeconds - (closestSubtitle.start + closestSubtitle.end) / 2
    )

    return currentDiff < closestDiff ? currentSubtitle : closestSubtitle
  }, subtitles[0])
}
