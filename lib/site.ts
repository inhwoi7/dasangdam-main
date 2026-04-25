export const siteConfig = {
  name: "다상담",
  title: "다상담 | 써니와 함께하는 인생의 지혜로운 쉼터",
  description:
    "사주, MBTI, 로또, 주역점, 블로그, 1:1 상담 예약까지 한눈에 보는 다상담 메인 페이지",
  url: "https://dasangdam.com",
  ogImage: "https://dasangdam.com/og-image.png",
};

export function absoluteUrl(path: string = "") {
  if (!path) return siteConfig.url;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isExternalUrl(url?: string | null) {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
}
