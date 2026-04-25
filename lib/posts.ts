import { notion, databaseId } from "./notion";

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "published",
      checkbox: { equals: true },
    },
    sorts: [
      {
        property: "date",
        direction: "descending",
      },
    ],
  });

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Name.title[0]?.plain_text ?? "",
    slug: page.properties.slug.rich_text[0]?.plain_text ?? "",
    category: page.properties.category.select?.name ?? "",
    date: page.properties.date.date?.start ?? "",
    href: `/blog/${page.properties.slug.rich_text[0]?.plain_text ?? ""}`,
  }));
}