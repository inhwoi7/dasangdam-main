import Link from "next/link";

export const metadata = {
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
    description:
      "위대한 사상가들이 건네는 오늘의 위로를 만나보세요.",
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
    name: "MBTI",
    description: "성향과 관계 패턴을 쉽고 명확하게 이해해보세요.",
    href: "https://dasangdam-mbti-sunny.vercel.app",
    iconBg: "#EAF4FF",
    iconStroke: "#3C82F6",
  },
  {
    key: "chemi", // 궁합 앱 추가
    name: "사주 궁합",
    description: "우리 둘의 성향 차이와 조화를 확인해보세요.",
    href: "https://dasangdam-chemi-app.vercel.app", 
    iconBg: "#FFF0F3",
    iconStroke: "#E11D48",
  },
  {
    key: "ipip", // 성격검사 추가
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

const POSTS = [
  {
    id: 1,
    category: "마음돌봄",
    title: "봄철 마음이 지칠 때, 나를 다독이는 가장 쉬운 방법",
    date: "2026.04.24",
    href: "/blog/comforting-myself-in-spring",
  },
  {
    id: 2,
    category: "사주이야기",
    title: "사주를 너무 어렵게 보지 않아도 되는 이유",
    date: "2026.04.18",
    href: "/blog/why-saju-can-be-simple",
  },
  {
    id: 3,
    category: "관계이해",
    title: "관계가 답답할 때 MBTI를 활용하는 현실적인 팁",
    date: "2026.04.12",
    href: "/blog/mbti-for-relationships",
  },
  {
    id: 4,
    category: "주역점",
    title: "주역점은 결국 무엇을 알려주는가",
    date: "2026.04.05",
    href: "/blog/what-iching-really-tells-you",
  },
  {
    id: 5,
    category: "상담가이드",
    title: "처음 상담을 신청할 때 부담을 줄이는 방법",
    date: "2026.03.29",
    href: "/blog/how-to-start-consulting-comfortably",
  },
];

const BRAND = {
  title: "다상담",
  subtitle: "써니와 함께하는 인생의 지혜로운 쉼터",
};

const ACTIVE_CONSULT_CHANNEL = CONSULT_CHANNELS.find(
  (item) => item.href && item.href !== "#"
);

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
          <rect x="10" y="10" width="12" height="12" rx="3" stroke={stroke} strokeWidth="2.5" />
          <rect x="26" y="10" width="12" height="12" rx="3" stroke={stroke} strokeWidth="2.5" />
          <rect x="10" y="26" width="12" height="12" rx="3" stroke={stroke} strokeWidth="2.5" />
          <path
            d="M30 26H34C36.2 26 38 27.8 38 30V34C38 36.2 36.2 38 34 38H30C27.8 38 26 36.2 26 34V30C26 27.8 27.8 26 30 26Z"
            stroke={stroke}
            strokeWidth="2.5"
          />
        </svg>
      );
    case "lotto":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="17" cy="17" r="6" stroke={stroke} strokeWidth="2.5" />
          <circle cx="31" cy="17" r="6" stroke={stroke} strokeWidth="2.5" />
          <circle cx="24" cy="30" r="6" stroke={stroke} strokeWidth="2.5" />
          <path
            d="M17 11V23M11 17H23M31 11V23M25 17H37M24 24V36M18 30H30"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "iching":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M12 14H36" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          <path d="M12 22H20M28 22H36" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          <path d="M12 30H36" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          <path d="M12 38H20M28 38H36" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "tarot":
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="13" y="9" width="22" height="30" rx="4" stroke={stroke} strokeWidth="2.5" />
          <circle cx="24" cy="24" r="5" stroke={stroke} strokeWidth="2.5" />
          <path
            d="M24 15V17M24 31V33M15 24H17M31 24H33"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
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
  children: React.ReactNode;
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

export default function Page() {
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
                <span className="recommendMini">{item.subtitle}</span>
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
            <h2>필요한 상담 도구를 바로 선택하세요</h2>
            
          </div>

          <div className="serviceGrid">
            {SERVICES.map((service) => (
              <Link
                key={service.key}
                href={service.href}
                className="serviceCard"
                aria-label={`${service.name} 페이지로 이동`}
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
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">    
            <h2>다상담 서재</h2>
            
          </div>

          <div className="postList">
            {POSTS.map((post) => (
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
            ))}
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
