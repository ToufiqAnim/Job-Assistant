import axios from "axios";
import axiosRetry from "axios-retry";
import * as cheerio from "cheerio";
import { CONFIG } from "../utility/config";

axiosRetry(axios, {
  retries: CONFIG.SCRAPER.MAX_RETRIES,
  retryDelay: (retryCount) => retryCount * CONFIG.SCRAPER.RETRY_DELAY,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.code === "ECONNABORTED",
});

export const scrapeJobUrl = async (url) => {
  try {
    const { data } = await axios.get(url, {
      timeout: CONFIG.SCRAPER.TIMEOUT,
      headers: {
        "User-Agent": CONFIG.SCRAPER.USER_AGENT,
        Accept: "text/html, application/xhtml+xml",
      },
    });

    const $ = cheerio.load(data);

    $(
      "script, style, noscript, iframe, svg, nav, footer, header, aside, .sidebar, .ads, .cookie, .popup, [class*='modal']"
    ).remove();

    const selectors = [
      '[class*="job-description" i]',
      '[id*="job-description" i]',
      '[class*="description" i]',
      '[class*="posting" i]',
      ".job-details",
      "article",
      "main",
      ".content",
      "[role='main']",
    ];

    let text = "";
    for (const sel of selectors) {
      const $el = $(sel).first();
      const content = $el.text().trim();
      if (content.length > 400) {
        text = content;
        break;
      }
    }
    if (!text) {
      text = $("body").text();
    }
    return text
      .replace(/\s+/g, " ")
      .replace(/[\n\r\t]+/g, " ")
      .replace(/\.{3,}/g, "…")
      .replace(/([.!?])\s*(?=[A-Z])/g, "$1 ")
      .trim()
      .slice(0, 15000);
  } catch (error) {
    const msg = `Job scraping failed for ${url}: ${error.message}`;
    console.error(msg);
    error.message = msg;
    throw error;
  }
};
/* const response = await axios.get(url, {
  headers: {
    "User-Agent": CONFIG.SCRAPER.USER_AGENT,
  },
  timeout: CONFIG.SCRAPER.TIMEOUT,
  maxRetries: CONFIG.SCRAPER.MAX_RETRIES,
  retryDelay: CONFIG.SCRAPER.RETRY_DELAY,
}); */
