import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

export type NotionPage = any;
export type NotionBlock = any;

function getRichTextPlainText(richText?: any[]) {
  if (!Array.isArray(richText)) return "";
  return richText.map((item) => item?.plain_text ?? "").join("").trim();
}

function getTitleProperty(page: any, keys: string[]) {
  for (const key of keys) {
    const prop = page?.properties?.[key];
    if (prop?.type === "title") {
      return getRichTextPlainText(prop.title);
    }
  }
  return "";
}

function getRichTextProperty(page: any, keys: string[]) {
  for (const key of keys) {
    const prop = page?.properties?.[key];
    if (prop?.type === "rich_text") {
      return getRichTextPlainText(prop.rich_text);
    }
  }
  return "";
}

function getCheckboxProperty(page: any, keys: string[]) {
  for (const key of keys) {
    const prop = page?.properties?.[key];
    if (prop?.type === "checkbox") {
      return Boolean(prop.checkbox);
    }
  }
  return false;
}

function getDateProperty(page: any, keys: string[]) {
  for (const key of keys) {
    const prop = page?.properties?.[key];
    if (prop?.type === "date") {
      return prop.date?.start ?? null;
    }
  }
  return null;
}

function getSelectProperty(page: any, keys: string[]) {
  for (const key of keys) {
    const prop = page?.properties?.[key];
    if (prop?.type === "select") {
      return prop.select?.name ?? "";
    }
    if (prop?.type === "multi_select") {
      return prop.multi_select?.map((item: any) => item.name).join(", ") ?? "";
    }
  }
  return "";
}

export async function queryPublishedPages() {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 100,
  });

  return response.results.filter((page: any) => {
    const published = getCheckboxProperty(page, [
      "published",
      "Published",
      "공개",
      "게시",
    ]);

    return published || published === false ? published : true;
  });
}

export async function getPageBlocks(pageId: string) {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined = undefined;

  while (true) {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });

    blocks.push(...response.results);
    if (!response.has_more) break;
    cursor = response.next_cursor ?? undefined;
  }

  return blocks;
}

export async function getBlockChildrenRecursive(blockId: string): Promise<NotionBlock[]> {
  const children = await getPageBlocks(blockId);

  const results = await Promise.all(
    children.map(async (block: any) => {
      if (block.has_children) {
        const nestedChildren = await getBlockChildrenRecursive(block.id);
        return {
          ...block,
          children: nestedChildren,
        };
      }
      return block;
    })
  );

  return results;
}

export function extractPageMeta(page: any) {
  const title = getTitleProperty(page, ["title", "Title", "이름", "제목", "name", "Name"]);

  const slug =
    getRichTextProperty(page, ["slug", "Slug", "URL", "url"]) ||
    title;

  const excerpt = getRichTextProperty(page, [
    "excerpt",
    "Excerpt",
    "summary",
    "Summary",
    "설명",
    "요약",
  ]);

  const category = getSelectProperty(page, [
    "category",
    "Category",
    "카테고리",
  ]);

  const date =
    getDateProperty(page, ["date", "Date", "publishDate", "발행일", "작성일"]) ??
    page?.created_time ??
    null;

  const featured = getCheckboxProperty(page, [
    "featured",
    "Featured",
    "대표",
    "추천",
  ]);

  let coverImage: string | null = null;

  if (page?.cover?.type === "external") {
    coverImage = page.cover.external?.url ?? null;
  } else if (page?.cover?.type === "file") {
    coverImage = page.cover.file?.url ?? null;
  }

  return {
    title,
    slug,
    excerpt,
    category,
    date,
    featured,
    coverImage,
    notionUrl: page?.url ?? null,
  };
}
