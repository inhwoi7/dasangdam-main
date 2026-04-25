// lib/posts.ts

import * as notionApi from "@/lib/notion";

type NotionPage = any;
type NotionProperty = any;
type NotionBlock = any;

export type Post = {
  id: string;
  title: string;
  slug: string;
  href: string;
  category: string;
  date: string | null;
  published: boolean;
  featured: boolean;
  excerpt: string;
  summary: string;
  coverImage: string | null;
  notionUrl: string | null;
  blocks: NotionBlock[];
  content: NotionBlock[];
  contentHtml: string | null;
};

const PROPERTY_ALIASES = {
  title: ["이름", "Name", "name", "title", "Title"],
  slug: ["slug", "Slug", "슬러그"],
  category: ["category", "Category", "카테고리"],
  date: ["date", "Date", "날짜", "게시일"],
  published: ["published", "Published", "공개", "게시", "노출"],
  featured: ["featured", "Featured", "추천", "대표", "pick", "Pick"],
  excerpt: [
    "excerpt",
    "Excerpt",
    "summary",
    "Summary",
    "description",
    "Description",
    "요약",
    "설명",
  ],
} as const;

/**
 * slug 정규화
 * - 앞뒤 공백 제거
 * - 소문자
 * - 공백/슬래시 등은 하이픈으로 변환
 * - 특수문자 정리
 * - 중복 하이픈 제거
 */
export function normalizeSlug(value: string) {
  return (value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[\/\\?#%]+/g, "-")
    .replace(/[^\p{L}\p{N}\-._~]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "");
}

function getProperties(page: NotionPage) {
  return page?.properties ?? {};
}

function getProperty(page: NotionPage, aliases: readonly string[]): NotionProperty | null {
  const properties = getProperties(page);

  for (const alias of aliases) {
    if (properties[alias]) return properties[alias];
  }

  const lowered = aliases.map((alias) => alias.toLowerCase());

  for (const [key, value] of Object.entries(properties)) {
    if (lowered.includes(key.toLowerCase())) {
      return value as NotionProperty;
    }
  }

  return null;
}

function getFirstPropertyByType(page: NotionPage, type: string): NotionProperty | null {
  const properties = getProperties(page);

  for (const value of Object.values(properties)) {
    if ((value as NotionProperty)?.type === type) {
      return value as NotionProperty;
    }
  }

  return null;
}

function richTextToPlainText(input: any): string {
  if (!input) return "";

  if (typeof input === "string") return input;
  if (typeof input === "number") return String(input);
  if (typeof input === "boolean") return input ? "true" : "false";

  if (Array.isArray(input)) {
    return input.map((item) => richTextToPlainText(item)).join("");
  }

  if (typeof input?.plain_text === "string") return input.plain_text;
  if (typeof input?.text?.content === "string") return input.text.content;
  if (typeof input?.content === "string") return input.content;
  if (typeof input?.name === "string") return input.name;

  return "";
}

function getTextFromProperty(property: NotionProperty | null): string {
  if (!property) return "";

  switch (property.type) {
    case "title":
      return richTextToPlainText(property.title);
    case "rich_text":
      return richTextToPlainText(property.rich_text);
    case "select":
      return property.select?.name ?? "";
    case "multi_select":
      return Array.isArray(property.multi_select)
        ? property.multi_select.map((item: any) => item?.name).filter(Boolean).join(", ")
        : "";
    case "formula": {
      const formula = property.formula;
      if (!formula) return "";
      if (formula.type === "string") return formula.string ?? "";
      if (formula.type === "number") return formula.number != null ? String(formula.number) : "";
      if (formula.type === "boolean") return formula.boolean ? "true" : "false";
      return "";
    }
    case "url":
      return property.url ?? "";
    case "email":
      return property.email ?? "";
    case "phone_number":
      return property.phone_number ?? "";
    case "number":
      return property.number != null ? String(property.number) : "";
    default:
      return "";
  }
}

function getBooleanFromProperty(property: NotionProperty | null, fallback = false): boolean {
  if (!property) return fallback;

  switch (property.type) {
    case "checkbox":
      return Boolean(property.checkbox);
    case "formula":
      if (property.formula?.type === "boolean") return Boolean(property.formula.boolean);
      if (property.formula?.type === "string") {
        const value = String(property.formula.string || "").trim().toLowerCase();
        return ["true", "yes", "y", "1", "on", "published", "featured"].includes(value);
      }
      return fallback;
    case "select": {
      const value = String(property.select?.name || "").trim().toLowerCase();
      return ["true", "yes", "y", "1", "on", "published", "featured"].includes(value);
    }
    case "rich_text":
    case "title": {
      const value = getTextFromProperty(property).trim().toLowerCase();
      return ["true", "yes", "y", "1", "on", "published", "featured"].includes(value);
    }
    default:
      return fallback;
  }
}

function getDateFromProperty(property: NotionProperty | null): string | null {
  if (!property) return null;

  switch (property.type) {
    case "date":
      return property.date?.start ?? null;
    case "created_time":
      return property.created_time ?? null;
    case "last_edited_time":
      return property.last_edited_time ?? null;
    case "formula":
      if (property.formula?.type === "date") {
        return property.formula.date?.start ?? null;
      }
      if (property.formula?.type === "string") {
        return property.formula.string ?? null;
      }
      return null;
    case "rich_text":
    case "title": {
      const value = getTextFromProperty(property).trim();
      return value || null;
    }
    default:
      return null;
  }
}

function getTitle(page: NotionPage): string {
  const titleProperty =
    getProperty(page, PROPERTY_ALIASES.title) ?? getFirstPropertyByType(page, "title");

  const title = getTextFromProperty(titleProperty).trim();
  return title || "제목 없음";
}

function getSlug(page: NotionPage, title: string): string {
  const slugProperty = getProperty(page, PROPERTY_ALIASES.slug);
  const rawSlug = getTextFromProperty(slugProperty).trim();

  const normalized = normalizeSlug(rawSlug || title);
  return normalized || page.id;
}

function getCategory(page: NotionPage): string {
  const property = getProperty(page, PROPERTY_ALIASES.category);
  return getTextFromProperty(property).trim();
}

function getExcerpt(page: NotionPage): string {
  const property = getProperty(page, PROPERTY_ALIASES.excerpt);
  return getTextFromProperty(property).trim();
}

function getPublished(page: NotionPage): boolean {
  const property = getProperty(page, PROPERTY_ALIASES.published);

  // published 속성이 아예 없으면 queryPublishedPages가 이미 필터했다고 보고 true 처리
  if (!property) return true;

  return getBooleanFromProperty(property, true);
}

function getFeatured(page: NotionPage): boolean {
  const property = getProperty(page, PROPERTY_ALIASES.featured);
  return getBooleanFromProperty(property, false);
}

function getDate(page: NotionPage): string | null {
  const dateProperty =
    getProperty(page, PROPERTY_ALIASES.date) ??
    getFirstPropertyByType(page, "date") ??
    getFirstPropertyByType(page, "created_time");

  return getDateFromProperty(dateProperty) ?? page?.created_time ?? null;
}

function getCoverImage(page: NotionPage): string | null {
  const cover = page?.cover;
  if (!cover) return null;

  if (cover.type === "external") return cover.external?.url ?? null;
  if (cover.type === "file") return cover.file?.url ?? null;

  return null;
}

function toPostSummary(page: NotionPage): Post {
  const title = getTitle(page);
  const slug = getSlug(page, title);
  const excerpt = getExcerpt(page);

  return {
    id: page.id,
    title,
    slug,
    href: `/library/${encodeURIComponent(slug)}`,
    category: getCategory(page),
    date: getDate(page),
    published: getPublished(page),
    featured: getFeatured(page),
    excerpt,
    summary: excerpt,
    coverImage: getCoverImage(page),
    notionUrl: page?.url ?? null,
    blocks: [],
    content: [],
    contentHtml: null,
  };
}

function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => {
    const aFeatured = a.featured ? 1 : 0;
    const bFeatured = b.featured ? 1 : 0;

    if (aFeatured !== bFeatured) return bFeatured - aFeatured;

    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;

    return bTime - aTime;
  });
}

/**
 * lib/notion.ts 에서 블록 조회 함수 이름이 달라도 최대한 자동으로 찾도록 처리
 * 아래 후보 중 하나만 export 되어 있어도 동작합니다.
 */
async function loadPageBlocks(pageId: string): Promise<NotionBlock[]> {
  const api = notionApi as any;

  const candidateNames = [
    "getPageBlocks",
    "getBlockChildrenRecursive",
    "getPageContentBlocks",
    "getBlocksByPageId",
    "getPageContent",
  ];

  for (const name of candidateNames) {
    const fn = api?.[name];
    if (typeof fn === "function") {
      const result = await fn(pageId);

      if (Array.isArray(result)) return result;
      if (Array.isArray(result?.results)) return result.results;
      if (Array.isArray(result?.blocks)) return result.blocks;
    }
  }

  return [];
}

export async function getPosts(): Promise<Post[]> {
  const api = notionApi as any;

  if (typeof api?.queryPublishedPages !== "function") {
    throw new Error(
      "lib/notion.ts 에 queryPublishedPages 함수가 export 되어 있어야 합니다."
    );
  }

  const pages: NotionPage[] = await api.queryPublishedPages();

  const posts = pages
    .map((page) => toPostSummary(page))
    .filter((post) => post.published && post.slug);

  const uniquePostsMap = new Map<string, Post>();

  for (const post of posts) {
    // 같은 slug가 중복되면 먼저 들어온 글 유지
    if (!uniquePostsMap.has(post.slug)) {
      uniquePostsMap.set(post.slug, post);
    }
  }

  return sortPosts(Array.from(uniquePostsMap.values()));
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((post) => post.slug);
}

export async function getPostBySlug(inputSlug: string): Promise<Post | null> {
  const targetSlug = normalizeSlug(decodeURIComponent(inputSlug || ""));
  if (!targetSlug) return null;

  const posts = await getPosts();

  const matched = posts.find(
    (post) => normalizeSlug(post.slug) === targetSlug
  );

  if (!matched) return null;

  const blocks = await loadPageBlocks(matched.id);

  return {
    ...matched,
    blocks,
    content: blocks,
    contentHtml: null,
  };
}
