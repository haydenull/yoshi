import React, { MouseEventHandler, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { fetchSubtitles, type Subtitle } from "@/services/subtitles"
import clsx from "clsx"
import { Loader2 } from "lucide-react"
import { useQuery } from "react-query"

import { findClosestSubtitle, secondsToHMS } from "@/lib/subtitles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const getRef = (time: number) => `subtitle-${time}`

const home = () => {
  const [videoUrl, setVideoUrl] = useState<string>()
  const [goTime, setGoTime] = useState<string>()
  // https://www.youtube.com/watch?v=gSSsZReIFRk
  const videoId = videoUrl?.split("v=")?.[1]
  const { toast } = useToast()
  const [activeSubtitle, setActiveSubtitle] = useState<Subtitle>()
  const subtitleRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({})
  const assignRef = (id: string) => (el: HTMLSpanElement | null) => {
    subtitleRefs.current[id] = el
  }

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
      enabled: false, // 默认情况下禁用查询，只有在点击按钮时才触发
    }
  )

  const handleGetSubTitles: MouseEventHandler<HTMLButtonElement> = async () => {
    if (!videoId) {
      return toast({
        variant: "destructive",
        description: "Please enter a YouTube video URL",
      })
    }
    getSubtitles()
  }
  const handleNavToSubtitle = () => {
    const closestSubtitle = findClosestSubtitle(
      goTime,
      subtitles.subtitlesArray
    )
    if (!closestSubtitle) {
      return toast({
        variant: "destructive",
        description: "Please enter a valid time",
      })
    }
    subtitleRefs.current[getRef(closestSubtitle.start)].scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
    setActiveSubtitle(closestSubtitle)
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
          <Button
            type="submit"
            onClick={handleGetSubTitles}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Subtitles
          </Button>
        </div>
      </div>
      <div>
        {subtitles?.subtitlesArray && (
          <div className="p-10">
            {subtitles.subtitlesArray.map((subtitle) => (
              <div
                key={subtitle.start}
                className={clsx("my-2 flex px-1 py-1 rounded gap-2", {
                  "bg-slate-300": activeSubtitle?.start === subtitle.start,
                })}
                ref={assignRef(getRef(subtitle.start))}
              >
                <span className="flex justify-center items-center w-20 h-7 bg-blue-300 rounded">
                  {secondsToHMS(subtitle.start)}
                </span>
                <p>{subtitle.lines?.[0]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed right-1 top-80">
        <Input
          type="number"
          onChange={(e) => setGoTime(e.target.value)}
          className="w-24"
        />
        <Button onClick={handleNavToSubtitle} className="w-24">
          Go
        </Button>
      </div>
    </section>
  )
}

export default home
