import { NextApiRequest, NextApiResponse } from "next"

const SUBTITLE_DOWNLOADER_URL = "https://savesubs.com"

export async function getYoutubeSubtitleUrls(videoId: string) {
  const response = await fetch(SUBTITLE_DOWNLOADER_URL + "/action/extract", {
    method: "POST",
    body: JSON.stringify({
      data: { url: `https://www.youtube.com/watch?v=${videoId}` },
    }),
    headers: {
      "Content-Type": "text/plain",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      "X-Auth-Token": process.env.SAVESUBS_X_AUTH_TOKEN || "",
      "X-Requested-Domain": "savesubs.com",
      "X-Requested-With": "xmlhttprequest",
    },
  })
  console.log(
    "[faiz:] === SAVESUBS_X_AUTH_TOKEN",
    process.env.SAVESUBS_X_AUTH_TOKEN
  )
  console.log("[faiz:] === response", response)
  const { response: json = {} } = await response.json()
  // {
  //   formats: [
  //     {
  //       quality: 'English',
  //       type: 'subs',
  //       url: '/save/0/aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g_dj1nU1NzWlJlSUZSaw,,',
  //       code: 'en',
  //       ext: 'srt'
  //     }
  //   ],
  //   title: 'Next_js App Router: Routing_ Data Fetching_ Caching',
  //   duration: '14 minutes and 31 seconds',
  //   duration_raw: '871',
  //   uploader: 'Vercel / 2023-04-04',
  //   thumbnail: '//i.ytimg.com/vi/gSSsZReIFRk/mqdefault.jpg',
  //   type: 'captions',
  //   request: {
  //     url: 'https://www.youtube.com/watch?v=gSSsZReIFRk',
  //     hash: 'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g_dj1nU1NzWlJlSUZSaw,,',
  //     domain: 'youtube.com'
  //   }
  // }
  return { title: json.title, subtitleList: json.formats }
}

const find = (subtitleList: any[] = [], args: { [key: string]: any }) => {
  const key = Object.keys(args)[0]
  return subtitleList.find((item) => item[key] === args[key])
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId } = req.query as { videoId: string }

  if (!videoId) {
    res.status(400).json({ error: "videoId is required" })
    return
  }

  try {
    const { title, subtitleList } = await getYoutubeSubtitleUrls(videoId)
    const betterSubtitle =
      find(subtitleList, { quality: "English" }) ||
      find(subtitleList, { quality: "English (auto" }) ||
      subtitleList[0]

    const subtitleUrl = `${SUBTITLE_DOWNLOADER_URL}${betterSubtitle.url}?ext=json`
    const response = await fetch(subtitleUrl)
    // [
    //   {
    //     start: 0,
    //     end: 1,
    //     lines: [ 'This video will be an overview of some of the' ]
    //   },
    //   {
    //     start: 2.3,
    //     end: 3.3,
    //     lines: [ 'new concepts and foundations in the Next.js app router' ]
    //   },
    // ]
    const subtitles = await response.json()
    res.status(200).json({ title, subtitlesArray: subtitles })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
