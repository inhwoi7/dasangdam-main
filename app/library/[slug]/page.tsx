// app/library/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { absUrl, isExternalUrl } from "@/lib/site";

export const revalidate = 300;

type PageProps = {
  params: {
    slug: string;
  };
};

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

function extractPlainText(value: any): string {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value.map((item) => extractPlainText(item)).join("");
  }

  if (typeof value?.plain_text === "string") return value.plain_text;
  if (typeof value?.text?.content === "string") return value.text.content;
  if (typeof value?.content === "string") return value.content;

  return "";
}

function getBlockData(block: any) {
  if (!block?.type) return null;
  return block[block.type] ?? null;
}

function getBlockChildren(block: any): any[] {
  if (Array.isArray(block?.children)) return block.children;
  if (Array.isArray(block?.childBlocks)) return block.childBlocks;
  if (Array.isArray(block?.child_blocks)) return block.child_blocks;
  return [];
}

function renderRichText(richText: any[] = []) {
  return richText.map((item, index) => {
    let node: React.ReactNode = item?.plain_text ?? item?.text?.content ?? "";

    if (item?.href) {
      const external = isExternalUrl(item.href);
      node = (
        <a
          href={item.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="underline underline-offset-4 hover:opacity-70"
        >
          {node}
        </a>
      );
    }

    if (item?.annotations?.code) {
      node = (
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.95em]">
          {node}
        </code>
      );
    }
    if (item?.annotations?.bold) node = <strong>{node}</strong>;
    if (item?.annotations?.italic) node = <em>{node}</em>;
    if (item?.annotations?.strikethrough) node = <s>{node}</s>;
    if (item?.annotations?.underline) node = <u>{node}</u>;

    return <Fragment key={`${item?.plain_text ?? "text"}-${index}`}>{node}</Fragment>;
  });
}

function renderListItem(block: any) {
  const data = getBlockData(block);
  const children = getBlockChildren(block);

  return (
    <li key={block.id ?? `${block.type}-${Math.random()}`} className="mb-2">
      <span>{renderRichText(data?.rich_text ?? [])}</span>
      {children.length > 0 ? (
        <div className="mt-2">{renderBlocks(children, true)}</div>
      ) : null}
    </li>
  );
}

function renderSingleBlock(block: any, nested = false): React.ReactNode {
  const data = getBlockData(block);
  const children = getBlockChildren(block);
  const key = block.id ?? `${block.type}-${Math.random()}`;

  switch (block?.type) {
    case "paragraph":
      return (
        <p key={key} className={nested ? "mb-3 leading-8" : "mb-5 leading-8 text-neutral-800"}>
          {renderRichText(data?.rich_text ?? [])}
        </p>
      );

    case "heading_1":
      return (
        <h1 key={key} className="mb-5 mt-10 text-3xl font-bold tracking-tight text-neutral-950">
          {renderRichText(data?.rich_text ?? [])}
        </h1>
      );

    case "heading_2":
      return (
        <h2 key={key} className="mb-4 mt-10 text-2xl font-bold tracking-tight text-neutral-950">
          {renderRichText(data?.rich_text ?? [])}
        </h2>
      );

    case "heading_3":
      return (
        <h3 key={key} className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          {renderRichText(data?.rich_text ?? [])}
        </h3>
      );

    case "quote":
      return (
        <blockquote
          key={key}
          className="my-6 border-l-4 border-neutral-300 pl-5 text-lg leading-8 text-neutral-700"
        >
          {renderRichText(data?.rich_text ?? [])}
        </blockquote>
      );

    case "callout":
      return (
        <div key={key} className="my-6 rounded-2xl bg-neutral-100 px-5 py-4 text-neutral-800">
          <div className="flex items-start gap-3">
            <span className="text-xl">{data?.icon?.emoji ?? "💡"}</span>
            <div>
              <div className="leading-7">{renderRichText(data?.rich_text ?? [])}</div>
              {children.length > 0 ? (
                <div className="mt-3">{renderBlocks(children, true)}</div>
              ) : null}
            </div>
          </div>
        </div>
      );

    case "code":
      return (
        <pre
          key={key}
          className="my-6 overflow-x-auto rounded-2xl bg-neutral-950 p-5 text-sm leading-7 text-neutral-100"
        >
          <code>{extractPlainText(data?.rich_text ?? [])}</code>
        </pre>
      );

    case "divider":
      return <hr key={key} className="my-10 border-neutral-200" />;

    case "image": {
      const imageUrl =
        data?.type === "external"
          ? data?.external?.url
          : data?.file?.url ?? data?.external?.url;

      const caption = extractPlainText(data?.caption ?? []);

      if (!imageUrl) return null;

      return (
        <figure key={key} className="my-8">
          <img
            src={imageUrl}
            alt={caption || "본문 이미지"}
            className="w-full rounded-2xl border border-neutral-200"
          />
          {caption ? (
            <figcaption className="mt-3 text-center text-sm text-neutral-500">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case "to_do":
      return (
        <div key={key} className="my-3 flex items-start gap-3">
          <input
            type="checkbox"
            checked={Boolean(data?.checked)}
            readOnly
            className="mt-1 h-4 w-4 rounded border-neutral-300"
          />
          <div className={data?.checked ? "line-through opacity-60" : ""}>
            {renderRichText(data?.rich_text ?? [])}
          </div>
        </div>
      );

    case "toggle":
      return (
        <details key={key} className="my-5 rounded-2xl border border-neutral-200 p-4">
          <summary className="cursor-pointer font-medium text-neutral-900">
            {renderRichText(data?.rich_text ?? [])}
          </summary>
          {children.length > 0 ? (
            <div className="mt-4">{renderBlocks(children, true)}</div>
          ) : null}
        </details>
      );

    default:
      if (children.length > 0) {
        return (
          <div key={key} className="my-4">
            {renderBlocks(children, true)}
          </div>
        );
      }
      return null;
  }
}

function renderBlocks(blocks: any[] = [], nested = false): React.ReactNode[] {
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const type = block?.type;

    if (type === "bulleted_list_item" || type === "numbered_list_item") {
      const grouped: any[] = [];
      while (i < blocks.length && blocks[i]?.type === type) {
        grouped.push(blocks[i]);
        i += 1;
      }
      i -= 1;

      const ListTag = type === "numbered_list_item" ? "ol" : "ul";

      elements.push(
        <ListTag
          key={`group-${type}-${block?.id ?? i}`}
          className={
            type === "numbered_list_item"
              ? nested
                ? "my-2 list-decimal pl-6"
                : "my-5 list-decimal pl-6 text-neutral-800"
              : nested
              ? "my-2 list-disc pl-6"
              : "my-5 list-disc pl-6 text-neutral-800"
          }
        >
          {grouped.map((item) => renderListItem(item))}
        </ListTag>
      );

      continue;
    }

    elements.push(renderSingleBlock(block, nested));
  }

  return elements;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 | 다상담",
      description: "요청한 글을 찾을 수 없습니다.",
      alternates: {
        canonical: absUrl(`/library/${params.slug}`),
      },
    };
  }

  const title = post.title ?? "다상담 글";
  const description = post.excerpt ?? post.summary ?? "다상담 글 상세 페이지";
  const rawCover = post.coverImage ?? null;
  const ogImage =
    rawCover && /^https?:\/\//i.test(rawCover) ? rawCover : absUrl(rawCover || "/opengraph-image.png");

  return {
    title: `${title} | 다상담`,
    description,
    alternates: {
      canonical: absUrl(`/library/${params.slug}`),
    },
    openGraph: {
      title,
      description,
      url: absUrl(`/library/${params.slug}`),
      siteName: "다상담",
      type: "article",
      locale: "ko_KR",
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function LibraryPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

 const contentHtml =
  typeof post.contentHtml === "string" ? post.contentHtml : null;

  const blocks = Array.isArray(post.blocks)
    ? post.blocks
    : Array.isArray(post.content)
    ? post.content
    : [];

  const coverImage = post.coverImage ?? null;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← 홈으로
        </Link>
      </div>

      <article>
        <header className="mb-10 border-b border-neutral-200 pb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            {post.category ? (
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                {post.category}
              </span>
            ) : null}
            {post.date ? <span>{formatDate(post.date)}</span> : null}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              {post.excerpt}
            </p>
          ) : null}
        </header>

        {coverImage ? (
          <div className="mb-10 overflow-hidden rounded-3xl border border-neutral-200">
            <img
              src={coverImage}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        ) : null}

        <section className="text-[17px] leading-8 text-neutral-800">
          {contentHtml ? (
            <div
              className="prose prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : blocks.length > 0 ? (
            <div>{renderBlocks(blocks)}</div>
          ) : (
            <p className="text-neutral-500">본문 내용이 아직 없습니다.</p>
          )}
        </section>
      </article>
    </main>
  );
}
