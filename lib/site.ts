// lib/site.ts

function normalizeUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "다상담",
  title: "다상담 | 마음을 돌보는 글과 상담",
  description: "다상담의 글과 상담 콘텐츠를 한곳에서 만나는 공간입니다.",
  url: normalizeUrl(
    process.env.NEXT_PUBLIC_SITE_URL || "https://dasangdam.com"
  ),
  ogImage: "/opengraph-image.png",
  links: {
    home: "/",
    library: "/library",
  },
};

export function getSiteUrl() {
  return siteConfig.url;
}

export function absUrl(path = "") {
  if (!path) return siteConfig.url;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isExternalUrl(url: string) {
  try {
    const target = new URL(url, siteConfig.url);
    const base = new URL(siteConfig.url);
    return target.origin !== base.origin;
  } catch {
    return false;
  }
}
