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
