export const fetchSubtitles = async (
  videoId: string
): Promise<{
  title: string
  subtitlesArray: { start: number; end: number; lines: string[] }[]
}> => {
  console.log("[faiz:] === videoId", videoId)
  const response = await fetch(`/api/subtitles?videoId=${videoId}`)

  if (!response.ok) {
    throw new Error(`Error fetching subtitles: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
