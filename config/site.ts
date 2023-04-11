import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    docs: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Yoshi 耀西",
  description: "Youtube 字幕助手",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/haydenull",
    github: "https://github.com/haydenull/yoshi",
    docs: "https://github.com/haydenull/yoshi",
  },
}
