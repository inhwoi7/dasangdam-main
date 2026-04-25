// app/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "다상담 | 써니와 함께하는 인생의 지혜로운 쉼터",
  description:
    "사주, MBTI, 로또, 주역점, 블로그, 1:1 상담 예약까지 한눈에 보는 다상담 메인 페이지",
};

const CONSULT_CHANNELS = [
  {
    key: "kakao",
    label: "상담 오픈 준비중 (카카오)",
    href: "#",
    tone: "dark",
  },
  {
    key: "naver",
    label: "상담 오픈 준비중 (네이버)",
    href: "#",
    tone: "light",
  },
];

const FEATURED_CONSULTS = [
  {
    id: "today-recommend",
    badge: "TODAY'S PICK",
    title: "마음을 깨우는 문장",
    description: "위대한 사상가들이 건네는 오늘의 위로를 만나보세요.",
    href: "/consult/recommended",
    cta: "자세히 보기",
  },
];

const SERVICES = [
  {
    key: "saju",
    name: "사주",
    description: "타고난 흐름과 현재의 운을 편안하게 살펴보세요.",
    href: "https://my-saju-app.vercel.app",
    iconBg: "#FFF2CC",
    iconStroke: "#D89B00",
  },
  {
    key: "mbti",
    name: "MBTI 매칭",
    description: "성향과 관계 패턴을 쉽고 명확하게 이해해보세요.",
    href: "https://dasangdam-mbti-sunny.vercel.app",
    iconBg: "#EAF4FF",
    iconStroke: "#3C82F6",
  },
  {
    key: "chemi",
    name: "사주 궁합",
    description: "우리 둘의 성향 차이와 조화를 확인해보세요.",
    href: "https://dasangdam-chemi-app.vercel.app",
    iconBg: "#FFF0F3",
    iconStroke: "#E11D48",
  },
  {
    key: "ipip",
    name: "IPIP-50 성격검사",
    description: "과학적인 5대 성격 요인을 정밀하게 측정합니다.",
    href: "https://ipip50-rho.vercel.app/",
    iconBg: "#EAFBF0",
    iconStroke: "#16A34A",
  },
  {
    key: "number",
    name: "행운의 숫자",
    description: "가벼운 마음으로 행운의 숫자를 확인해보세요.",
    href: "/services/lucky-number",
    iconBg: "#FFF0F3",
    iconStroke: "#E11D48",
  },
  {
    key: "today-fortune",
    name: "오늘의 운세",
    description: "오늘 하루의 기운을 가볍고 편안하게 확인해보세요.",
    href: "/services/today-fortune",
    iconBg: "#FFF7E8",
    iconStroke: "#EA580C",
  },
];

const BRAND = {
  title: "다상담",
  subtitle: "써니와 함께하는 인생의 지혜로운 쉼터",
};

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function SmartLink({
  href,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function SunLogo() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="12" fill="#FDBA2D" />
      <path
        d="M32 6V14M32 50V58M6 32H14M50 32H58M13.5 13.5L19.2 19.2M44.8 44.8L50.5 50.5M50.5 13.5L44.8 19.2M19.2 44.8L13.5 50.5"
        stroke="#F6A500"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceIcon({
  type,
  stroke = "#222",
}: {
  type: string;
  stroke?: string;
}) {
  switch (type) {
    case "saju":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="13" stroke={stroke} strokeWidth="2.5" />
          <path
            d="M17 24C17 20.1 20.1 17 24 17"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M31 24C31 27.9 27.9 31 24 31"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="24" r="3" fill={stroke} />
        </svg>
      );
    case "mbti":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect
            x="10"
            y="10"
            width="12"
            height="12"
            rx="3"
            stroke={stroke}
            strokeWidth="2.5"
          />
          <rect
            x="26"
            y="10"
            width="12"
            height="12"
            rx="3"
            stroke={stroke}
            strokeWidth="2.5"
          />
          <rect
            x="10"
            y="26"
            width="12"
            height="12"
            rx="3"
            stroke={stroke}
            strokeWidth="2.5"
          />
          <path
            d="M30 26H34C36.2 26 38 27.8 38 30V34C38 36.2 36.2 38 34 38H30C27.8 38 26 36.2 26 34V30C26 27.8 27.8 26 30 26Z"
            stroke={stroke}
            strokeWidth="2.5"
          />
        </svg>
      );
    case "today-fortune":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="8" stroke={stroke} strokeWidth="2.5" />
          <path
            d="M24 8V13M24 35V40M8 24H13M35 24H40M13.5 13.5L17 17M31 31L34.5 34.5M34.5 13.5L31 17M17 31L13.5 34.5"
            stroke={stroke}
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "chemi":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M17.5 14C14 14 11 16.8 11 20.6C11 28 24 35 24 35S37 28 37 20.6C37 16.8 34 14 30.5 14C27.9 14 25.8 15.4 24 17.6C22.2 15.4 20.1 14 17.5 14Z"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ipip":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect
            x="10"
            y="8"
            width="28"
            height="32"
            rx="4"
            stroke={stroke}
            strokeWidth="2.5"
          />
          <path
            d="M17 18H31M17 24H31M17 30H25"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "number":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="14" stroke={stroke} strokeWidth="2.5" />
          <path
            d="M20 18L24 14L28 18M24 14V34"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="12" stroke={stroke} strokeWidth="2.5" />
        </svg>
      );
  }
}

function ExternalLinkBadge({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <span className={`external-badge ${tone}`}>
      <span>{children}</span>
      <ArrowRightIcon />
    </span>
  );
}

function ConsultAction({
  channel,
}: {
  channel: { key: string; label: string; href: string; tone: string };
}) {
  const isReady = channel.href && channel.href !== "#";

  if (!isReady) {
    return (
      <button
        type="button"
        className={`consultButton ${channel.tone} disabled`}
        disabled
        aria-disabled="true"
      >
        <ExternalLinkBadge tone={channel.tone}>{channel.label}</ExternalLinkBadge>
      </button>
    );
  }

  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noreferrer"
      className={`consultButton ${channel.tone}`}
      aria-label={`${channel.label} 새 창으로 열기`}
    >
      <ExternalLinkBadge tone={channel.tone}>{channel.label}</ExternalLinkBadge>
    </a>
  );
}

export default async function Page() {
  const POSTS = await getPosts();

  return (
    <main className="page">
      <div className="container">
        <header className="hero">
          <div className="brandShell">
            <div className="sunWrap">
              <SunLogo />
            </div>

            <div className="brandText">
              <p className="brandEyebrow">WISE REST WITH SUNNY</p>
              <h1>{BRAND.title}</h1>
              <p className="brandSubtitle">{BRAND.subtitle}</p>
            </div>
          </div>
        </header>

        <section className="recommendSection">
          {FEATURED_CONSULTS.map((item) => (
            <Link key={item.id} href={item.href} className="recommendCard">
              <div className="recommendHead">
                <span className="sectionBadge warm">{item.badge}</span>
              </div>

              <div className="recommendBody">
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>

                <div className="recommendCTA">
                  <span>{item.cta}</span>
                  <ArrowRightIcon />
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionBadge">PLAYGROUND</span>
            <h2>지금 나에게 필요한 게 뭘까요?</h2>
          </div>

          <div className="serviceGrid">
            {SERVICES.map((service) => (
              <SmartLink
                key={service.key}
                href={service.href}
                className="serviceCard"
                ariaLabel={`${service.name} 페이지로 이동`}
              >
                <div
                  className="serviceIcon"
                  style={{ backgroundColor: service.iconBg }}
                >
                  <ServiceIcon type={service.key} stroke={service.iconStroke} />
                </div>

                <div className="serviceText">
                  <strong>{service.name}</strong>
                  <p>{service.description}</p>
                </div>

                <div className="cardArrow">
                  <ArrowRightIcon />
                </div>
              </SmartLink>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <h2>다상담 서재</h2>
          </div>

          <div className="postList">
            {POSTS.length > 0 ? (
              POSTS.map((post) => (
                <Link key={post.id} href={post.href} className="postRow">
                  <div className="postMain">
                    <div className="postMeta">
                      <span className="categoryTag">{post.category}</span>
                      <span className="postDate">{post.date}</span>
                    </div>
                    <h3>{post.title}</h3>
                  </div>

                  <div className="postArrow">
                    <ArrowRightIcon />
                  </div>
                </Link>
              ))
            ) : (
              <div className="postRow" aria-live="polite">
                <div className="postMain">
                  <div className="postMeta">
                    <span className="categoryTag">안내</span>
                  </div>
                  <h3>아직 공개된 글이 없습니다.</h3>
                </div>
              </div>
            )}
          </div>

          <div className="consultBanner" id="consult">
            <div className="consultText">
              <span className="sectionBadge warm">CONSULT</span>
              <h3>1:1 상담 예약</h3>
              <p>
                현재 상담 채널은 오픈 준비중입니다. 오픈 전까지는 메인 화면에서
                서비스와 글을 먼저 둘러보실 수 있어요.
              </p>
            </div>

            <div className="consultButtons">
              {CONSULT_CHANNELS.map((channel) => (
                <ConsultAction key={channel.key} channel={channel} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
