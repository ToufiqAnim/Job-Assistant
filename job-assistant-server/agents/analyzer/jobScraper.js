import axios from "axios";
import * as cheerio from "cheerio";
import { CONFIG } from "../utility/config";

export const scrapeJobUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": CONFIG.SCRAPER.USER_AGENT,
      },
      timeout: CONFIG.SCRAPER.TIMEOUT,
      maxRetries: CONFIG.SCRAPER.MAX_RETRIES,
      retryDelay: CONFIG.SCRAPER.RETRY_DELAY,
    });
    const $ = cheerio.load(response.data);
    $("script, style, nav, footer, header").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();
    return text;
  } catch (error) {
    throw new Error(`Failed to scrape job URL: ${error.message}`);
  }
};
