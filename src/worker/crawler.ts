import { logWarn } from "./utils/logger";

export interface CrawlPageResult {
  url: string;
  html: string;
}

const isHtmlResponse = (contentType: string | null) =>
  contentType?.includes("text/html") ?? false;

export const crawlSite = async (rootUrl: string, pageLimit: number): Promise<CrawlPageResult[]> => {
  const visited = new Set<string>();
  const queue: string[] = [rootUrl];
  const results: CrawlPageResult[] = [];

  while (queue.length > 0 && results.length < pageLimit) {
    const current = queue.shift();
    if (!current || visited.has(current)) {
      continue;
    }

    visited.add(current);

    try {
      const response = await fetch(current, {
        redirect: "follow",
        headers: { "User-Agent": "SEOAI-Worker/1.0" }
      });

      if (!response.ok) {
        logWarn("Page fetch failed", { url: current, status: response.status });
        continue;
      }

      if (!isHtmlResponse(response.headers.get("content-type"))) {
        continue;
      }

      const html = await response.text();
      results.push({ url: current, html });

      const links = extractLinks(html, current);
      for (const link of links) {
        if (visited.size + queue.length >= pageLimit * 2) {
          break;
        }
        if (!visited.has(link) && !queue.includes(link)) {
          queue.push(link);
        }
      }
    } catch (error) {
      logWarn("Page fetch error", { url: current, error });
    }
  }

  return results;
};

const extractLinks = (html: string, baseUrl: string): string[] => {
  const matches = Array.from(html.matchAll(/href=["']([^"']+)["']/gi));
  const links: string[] = [];

  for (const match of matches) {
    const href = match[1];
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) {
      continue;
    }

    try {
      const url = new URL(href, baseUrl);
      if (url.protocol === "http:" || url.protocol === "https:") {
        links.push(url.toString());
      }
    } catch {
      continue;
    }
  }

  return links;
};
