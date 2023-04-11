export type Subtitle = { start: number; end: number; lines: string[] }
export const fetchSubtitles = async (
  videoId: string
): Promise<{
  title: string
  subtitlesArray: Subtitle[]
}> => {
  const response = await fetch(`/api/subtitles?videoId=${videoId}`)

  if (!response.ok) {
    throw new Error(`Error fetching subtitles: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
