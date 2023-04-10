import React, { MouseEventHandler, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { fetchSubtitles } from "@/services/subtitles"
import { Loader2 } from "lucide-react"
import { useQuery } from "react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const home = () => {
  const [videoUrl, setVideoUrl] = useState<string>()
  const [time, setTime] = useState<number>(0)
  // https://www.youtube.com/watch?v=gSSsZReIFRk
  const videoId = videoUrl?.split("v=")?.[1]
  const { toast } = useToast()

  const {
    data: subtitles,
    error,
    isLoading,
    isError,
    refetch: getSubtitles,
  } = useQuery(
    ["subtitles", videoId],
    ({ queryKey }) => {
      return fetchSubtitles(queryKey[1])
    },
    {
      enabled: !!videoId, // 默认情况下禁用查询，只有在点击按钮时才触发
    }
  )
  console.log("[faiz:] === subtitles", subtitles)

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (!videoId) {
      console.log("[faiz:] === videoId", videoId)
      return toast({
        variant: "destructive",
        description: "Please enter a YouTube video URL",
      })
    }
    getSubtitles()
  }

  return (
    <section>
      <div className="w-full my-8">
        <div className="flex w-full items-center justify-center space-x-2">
          <Input
            type="url"
            placeholder="YouTube Video URL ..."
            className="w-1/2"
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Search
          </Button>
        </div>
      </div>
      <div>
        {subtitles?.subtitlesArray && (
          <div className="p-10">
            {subtitles.subtitlesArray.map((subtitle) => (
              <div key={subtitle.start} className="my-2">
                <span className="flex justify-center items-center w-10 h-6 bg-blue-300 rounded">
                  {subtitle.start}
                </span>
                <p>{subtitle.lines?.[0]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed right-1 top-80">
        <Input type="number" />
        <Button onClick={handleSubmit}>Search</Button>
      </div>
    </section>
  )
}

export default home
