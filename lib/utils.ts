import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * get youtube video id
 * https://www.youtube.com/watch?v=gSSsZReIFRk
 * https://youtu.be/o4h8PUVy5J8
 * https://youtube.com/shorts/tMsFlSYzSPE?feature=share
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null

  const urlObject = new URL(url)
  const videoIdFromParam = urlObject.searchParams.get("v")
  const pathSegments = urlObject.pathname.split("/")

  if (videoIdFromParam) {
    return videoIdFromParam
  } else if (pathSegments.length > 0) {
    return pathSegments[pathSegments.length - 1]
  } else {
    return null
  }
}
