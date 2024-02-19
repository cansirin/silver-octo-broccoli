import { PlaywrightCrawler } from "crawlee";

export const crawl = async (url: string) => {
  const links: string[] = [];
  try {
    const crawler = new PlaywrightCrawler({
      maxRequestsPerCrawl: 10,
      // Use the requestHandler to process each of the crawled pages.
      async requestHandler({ request, enqueueLinks }) {
        links.push(request.loadedUrl ?? "");

        await enqueueLinks();
      },
    });
    await crawler.run([url]);
  } catch (e) {
    console.error(e);
  }

  return links;
};
