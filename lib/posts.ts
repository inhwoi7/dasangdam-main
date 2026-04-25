// lib/posts.ts
import { Client } from "@notionhq/client";

export type Post = {
  id: string;
  title: string;
  category: string;
  date: string;
  href: string;
};

const notionApiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

const notion = notionApiKey ? new Client({ auth: notionApiKey }) : null;

function isValidNotionId(value?: string) {
  if (!value) return false;
  const normalized = value.replace(/-/g, "");
  return /^[a-f0-9]{32}$/i.test(normalized);
}

function richTextToPlainText(items: any[] = []) {
  return items.map((item) => item?.plain_text ?? "").join("").trim();
}

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getPropertyTitle(properties: Record<string, any>) {
  return (
    richTextToPlainText(properties?.title?.title) ||
    richTextToPlainText(properties?.Title?.title) ||
    richTextToPlainText(properties?.name?.title) ||
    richTextToPlainText(properties?.Name?.title) ||
    "제목 없음"
  );
}

function getPropertyCategory(properties: Record<string, any>) {
  return (
    properties?.category?.select?.name ||
    properties?.Category?.select?.name ||
    "미분류"
  );
}

function getPropertyDate(properties: Record<string, any>, createdTime: string) {
  return (
    properties?.date?.date?.start ||
    properties?.Date?.date?.start ||
    createdTime
  );
}

function getPropertySlug(
  properties: Record<string, any>,
  fallbackTitle: string,
  pageId: string
) {
  const slug =
    richTextToPlainText(properties?.slug?.rich_text) ||
    richTextToPlainText(properties?.Slug?.rich_text) ||
    properties?.slug?.formula?.string ||
    properties?.Slug?.formula?.string ||
    slugify(fallbackTitle);

  return slug || pageId.replace(/-/g, "");
}

export async function getPosts(): Promise<Post[]> {
  if (!notion || !isValidNotionId(databaseId)) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId!,
      filter: {
        property: "published",
        checkbox: {
          equals: true,
        },
      },
    });

    return response.results
      .filter((page: any) => page?.object === "page" && page?.properties)
      .map((page: any) => {
        const properties = page.properties as Record<string, any>;
        const title = getPropertyTitle(properties);
        const category = getPropertyCategory(properties);
        const rawDate = getPropertyDate(properties, page.created_time);
        const slug = getPropertySlug(properties, title, page.id);

        return {
          id: page.id,
          title,
          category,
          date: formatDate(rawDate),
          href: `/blog/${slug}`,
        };
      });
  } catch (error) {
    console.error("[getPosts] failed to load posts:", error);
    return [];
  }
}
