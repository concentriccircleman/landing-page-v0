import { getAllPosts } from "@/lib/blog";
import { siteUrl } from "@/utils/site-url";

interface RssPostItem {
  slug: string;
  metadata: {
    title: string;
    description?: string;
    date?: string;
    updated?: string;
  };
}

const escapeXml = (value: string) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
};

const formatRssDate = (value: string | undefined) => {
  if (!value) return new Date().toUTCString();
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return new Date().toUTCString();
  return parsedDate.toUTCString();
};

const getFeedLastBuildDate = (posts: RssPostItem[]) => {
  const mostRecentModifiedTimeMs = posts.reduce<number | null>(
    (currentMax, post) => {
      const rawDate = post.metadata.updated ?? post.metadata.date;
      if (!rawDate) return currentMax;
      const parsedDate = new Date(rawDate);
      if (Number.isNaN(parsedDate.getTime())) return currentMax;
      const timeMs = parsedDate.getTime();
      return currentMax === null || timeMs > currentMax ? timeMs : currentMax;
    },
    null
  );

  return mostRecentModifiedTimeMs !== null
    ? new Date(mostRecentModifiedTimeMs).toUTCString()
    : new Date().toUTCString();
};

const buildRssXml = (posts: RssPostItem[]) => {
  const itemsXml = posts
    .filter((post) => post.metadata.title.length > 0)
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const title = escapeXml(post.metadata.title);
      const description = escapeXml(post.metadata.description ?? "");
      const pubDate = formatRssDate(post.metadata.date);

      return [
        "<item>",
        `<title>${title}</title>`,
        `<link>${postUrl}</link>`,
        `<guid isPermaLink="true">${postUrl}</guid>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<description>${description}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const channelTitle = "Sentra Blog";
  const channelLink = `${siteUrl}/blog`;
  const channelDescription =
    "Insights on AI, institutional knowledge, and building better teams. Read the latest from the Sentra team.";
  const feedLink = `${siteUrl}/feed.xml`;
  const lastBuildDate = getFeedLastBuildDate(posts);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(channelTitle)}</title>`,
    `<link>${channelLink}</link>`,
    `<atom:link href="${feedLink}" rel="self" type="application/rss+xml" />`,
    `<description>${escapeXml(channelDescription)}</description>`,
    `<language>en</language>`,
    `<lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    itemsXml,
    "</channel>",
    "</rss>",
  ].join("");
};

export const GET = async () => {
  const posts = await getAllPosts();
  const rss = buildRssXml(posts);

  return new Response(rss, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "x-robots-tag": "noindex, nofollow",
    },
  });
};


