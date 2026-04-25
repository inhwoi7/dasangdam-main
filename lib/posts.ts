import {
  extractPageMeta,
  getBlockChildrenRecursive,
  queryPublishedPages,
} from "@/lib/notion";
import { isExternalUrl } from "@/lib/site";

export type Post = {
  id: string;
  title: string;
  slug: string;
  href: string;
  excerpt?: string | null;
  category?: string | null;
  date?: string | null;
  featured?: boolean;
  published?: boolean;
  coverImage?: string | null;
  notionUrl?: string | null;
  blocks?: any[];
  contentHtml?: string | null;
};

export function normalizeSlug(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "-")
    .replace(/[\\/]+/g, "-")
    .replace(/[^a-z0-9가-힣-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function richTextToHtml(richText?: any[]) {
  if (!Array.isArray(richText) || richText.length === 0) return "";

  return richText
    .map((item) => {
      const text = escapeHtml(item?.plain_text ?? "");
      const href = item?.href;
      const annotations = item?.annotations ?? {};

      let result = text;

      if (annotations.code) result = `<code>${result}</code>`;
      if (annotations.bold) result = `<strong>${result}</strong>`;
      if (annotations.italic) result = `<em>${result}</em>`;
      if (annotations.strikethrough) result = `<s>${result}</s>`;
      if (annotations.underline) result = `<u>${result}</u>`;
      if (href) result = `<a href="${href}" target="_blank" rel="noopener noreferrer">${result}</a>`;

      return result;
    })
    .join("");
}

function blocksToHtml(blocks: any[] = []): string {
  return blocks
    .map((block) => {
      const type = block?.type;
      const value = block?.[type];

      switch (type) {
        case "paragraph": {
          const inner = richTextToHtml(value?.rich_text);
          return inner ? `<p>${inner}</p>` : "";
        }
        case "heading_1":
          return `<h1>${richTextToHtml(value?.rich_text)}</h1>`;
        case "heading_2":
          return `<h2>${richTextToHtml(value?.rich_text)}</h2>`;
        case "heading_3":
          return `<h3>${richTextToHtml(value?.rich_text)}</h3>`;
        case "bulleted_list_item":
          return `<ul><li>${richTextToHtml(value?.rich_text)}</li></ul>`;
        case "numbered_list_item":
          return `<ol><li>${richTextToHtml(value?.rich_text)}</li></ol>`;
        case "quote":
          return `<blockquote>${richTextToHtml(value?.rich_text)}</blockquote>`;
        case "callout":
          return `<div class="callout">${richTextToHtml(value?.rich_text)}</div>`;
        case "to_do":
          return `<div><input type="checkbox" ${value?.checked ? "checked" : ""} disabled /> ${richTextToHtml(value?.rich_text)}</div>`;
        case "divider":
          return `<hr />`;
        case "code":
          return `<pre><code>${escapeHtml(
            value?.rich_text?.map((t: any) => t.plain_text).join("") ?? ""
          )}</code></pre>`;
        case "image": {
          const src =
            value?.type === "external"
              ? value?.external?.url
              : value?.file?.url;
          if (!src) return "";
          return `<figure><img src="${src}" alt="" /></figure>`;
        }
        default: {
          const childrenHtml = Array.isArray(block?.children)
            ? blocksToHtml(block.children)
            : "";
          return childrenHtml || "";
        }
      }
    })
    .join("\n");
}

function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }

    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });
}

export async function getPosts(): Promise<Post[]> {
  const pages = await queryPublishedPages();

  const posts: Post[] = pages
    .map((page: any) => {
      const meta = extractPageMeta(page);
      const normalizedSlug = normalizeSlug(meta.slug || meta.title);

      const href = isExternalUrl(meta.slug)
        ? meta.slug
        : `/library/${encodeURIComponent(normalizedSlug)}`;

      return {
        id: page.id,
        title: meta.title || "제목 없음",
        slug: normalizedSlug,
        href,
        excerpt: meta.excerpt ?? null,
        category: meta.category ?? null,
        date: meta.date ?? null,
        featured: Boolean(meta.featured),
        published: true,
        coverImage: meta.coverImage ?? null,
        notionUrl: meta.notionUrl ?? null,
      };
    })
    .filter((post) => Boolean(post.title));

  return sortPosts(posts);
}

export async function getAllPostSlugs() {
  const posts = await getPosts();
  return posts
    .filter((post) => !isExternalUrl(post.href))
    .map((post) => post.slug);
}

export async function getPostBySlug(inputSlug: string): Promise<Post | null> {
  const slug = normalizeSlug(decodeURIComponent(inputSlug));
  const pages = await queryPublishedPages();

  const matchedPage = pages.find((page: any) => {
    const meta = extractPageMeta(page);
    const pageSlug = normalizeSlug(meta.slug || meta.title);
    return pageSlug === slug;
  });

  if (!matchedPage) return null;

  const meta = extractPageMeta(matchedPage);
  const blocks = await getBlockChildrenRecursive(matchedPage.id);
  const contentHtml = blocksToHtml(blocks);

  return {
    id: matchedPage.id,
    title: meta.title || "제목 없음",
    slug,
    href: isExternalUrl(meta.slug)
      ? meta.slug
      : `/library/${encodeURIComponent(slug)}`,
    excerpt: meta.excerpt ?? null,
    category: meta.category ?? null,
    date: meta.date ?? null,
    featured: Boolean(meta.featured),
    published: true,
    coverImage: meta.coverImage ?? null,
    notionUrl: meta.notionUrl ?? null,
    blocks,
    contentHtml,
  };
}
