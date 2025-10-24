export const CONFIG = {
  AI: {
    MODEL: "gemini-2.5-flash",
    MAX_DESCRIPTION_LENGTH: 8000,
    MAX_RAW_DESCRIPTION: 5000,
  },
  SCRAPER: {
    TIMEOUT: 10000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    USER_AGENT: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  SCORING: {
    MIN_SCORE: 0,
    MAX_SCORE: 100,
  },
};
