// lib/notion.ts

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

function ensureEnv() {
  if (!process.env.NOTION_TOKEN) {
    throw new Error("NOTION_TOKEN 이 .env.local 에 설정되어 있어야 합니다.");
  }

  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID 가 .env.local 에 설정되어 있어야 합니다.");
  }
}

export function getNotionClient() {
  ensureEnv();
  return notion;
}

export async function queryPublishedPages() {
  ensureEnv();

  const results: any[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId!,
      start_cursor: startCursor,
      page_size: 100,
    });

    results.push(...response.results);

    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }

  return results;
}

export async function getBlockChildren(blockId: string) {
  const results: any[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
      page_size: 100,
    });

    results.push(...response.results);

    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }

  return results;
}

export async function getBlockChildrenRecursive(blockId: string): Promise<any[]> {
  const blocks = await getBlockChildren(blockId);

  return Promise.all(
    blocks.map(async (block: any) => {
      if (block.has_children) {
        const children = await getBlockChildrenRecursive(block.id);
        return { ...block, children };
      }

      return block;
    })
  );
}

export async function getPageBlocks(pageId: string) {
  return getBlockChildrenRecursive(pageId);
}
