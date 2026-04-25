import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: `글을 찾을 수 없습니다 | ${siteConfig.name}`,
    };
  }

  const title = `${post.title} | ${siteConfig.name}`;
  const description = post.excerpt || siteConfig.description;
  const url = absoluteUrl(`/library/${encodeURIComponent(post.slug)}`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function LibraryPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="space-y-8">
        <header className="space-y-4 border-b border-neutral-200 pb-8">
          {post.category ? (
            <p className="text-sm font-medium text-emerald-700">{post.category}</p>
          ) : null}

          <h1 className="text-3xl font-bold leading-tight text-neutral-900 md:text-4xl">
            {post.title}
          </h1>

          {post.date ? (
            <p className="text-sm text-neutral-500">{formatDate(post.date)}</p>
          ) : null}

          {post.excerpt ? (
            <p className="text-base leading-7 text-neutral-600">{post.excerpt}</p>
          ) : null}

          {post.coverImage ? (
            <div className="overflow-hidden rounded-2xl border border-neutral-200">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}
        </header>

        <section
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-emerald-700"
          dangerouslySetInnerHTML={{
            __html:
              post.contentHtml ||
              "<p>본문이 아직 준비되지 않았습니다.</p>",
          }}
        />
      </article>
    </main>
  );
}
