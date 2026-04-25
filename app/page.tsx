// app/page.tsx

import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { isExternalUrl } from "@/lib/site";

export const revalidate = 300;

type PostItem = Awaited<ReturnType<typeof getPosts>>[number];

function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getPostHref(post: PostItem) {
  if (post?.href && /^https?:\/\//i.test(post.href)) return post.href;
  return `/library/${post.slug}`;
}

function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function PostCard({ post }: { post: PostItem }) {
  const href = getPostHref(post);

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center gap-2 text-sm text-neutral-500">
        {post.category ? (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
            {post.category}
          </span>
        ) : null}
        {post.date ? <span>{formatDate(post.date)}</span> : null}
      </div>

      <h3 className="mb-3 text-xl font-bold tracking-tight text-neutral-900">
        <SmartLink href={href} className="hover:text-neutral-600">
          {post.title}
        </SmartLink>
      </h3>

      {post.excerpt ? (
        <p className="mb-5 line-clamp-3 text-sm leading-6 text-neutral-600">
          {post.excerpt}
        </p>
      ) : null}

      <SmartLink
        href={href}
        className="inline-flex items-center text-sm font-semibold text-neutral-900 hover:text-neutral-600"
      >
        자세히 보기 →
      </SmartLink>
    </article>
  );
}

export default async function HomePage() {
  const posts = await getPosts();

  const featuredPost = posts.find((post) => post.featured) ?? posts[0] ?? null;
  const libraryPosts = featuredPost
    ? posts.filter((post) => post.id !== featuredPost.id)
    : posts;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <section className="mb-14">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            DASANGDAM
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl">
            마음을 돌보는 글과 상담
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
            다상담의 Notion 글을 홈페이지와 상세 페이지에 연동한 서재입니다.
            운영 도메인 기준 내부 라우팅은 모두 dasangdam.com 에 맞게
            동작합니다.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
              TODAY&apos;S PICK
            </p>
            <h2 className="mt-1 text-2xl font-bold text-neutral-950">
              마음을 깨우는 문장
            </h2>
          </div>
        </div>

        {featuredPost ? (
          <article className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 md:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
              {featuredPost.category ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                  {featuredPost.category}
                </span>
              ) : null}
              {featuredPost.date ? <span>{formatDate(featuredPost.date)}</span> : null}
            </div>

            <h3 className="mb-4 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              <SmartLink
                href={getPostHref(featuredPost)}
                className="hover:text-neutral-700"
              >
                {featuredPost.title}
              </SmartLink>
            </h3>

            {featuredPost.excerpt ? (
              <p className="mb-6 max-w-3xl text-base leading-7 text-neutral-700 md:text-lg">
                {featuredPost.excerpt}
              </p>
            ) : null}

            <SmartLink
              href={getPostHref(featuredPost)}
              className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              글 읽으러 가기
            </SmartLink>
          </article>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-neutral-500">
            아직 추천 글이 없습니다.
          </div>
        )}
      </section>

      <section>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            LIBRARY
          </p>
          <h2 className="mt-1 text-2xl font-bold text-neutral-950">
            다상담 서재
          </h2>
        </div>

        {libraryPosts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {libraryPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-10 text-neutral-500">
            서재에 표시할 다른 글이 아직 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}
