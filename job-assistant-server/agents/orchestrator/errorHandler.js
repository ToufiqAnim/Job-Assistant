export const createValidationError = (message, field = null) => {
  const error = new Error(message);
  error.name = "ValidationError";
  error.field = field;
  error.statusCode = 400;
  return error;
};
export const createAIGenerationError = (message, operation = null) => {
  const error = new Error(message);
  error.name = "AIGenerationError";
  error.operation = operation;
  error.statusCode = 500;
  return error;
};

export const createScrapingError = (message, url = null) => {
  const error = new Error(message);
  error.name = "ScrapingError";
  error.url = url;
  error.statusCode = 500;
  return error;
};
export const createTimeoutError = (message, timeout = null) => {
  const error = new Error(message);
  error.name = "TimeoutError";
  error.timeout = timeout;
  error.statusCode = 504;
  return error;
};

const categorizeError = (error) => {
  switch (error.name) {
    case "ValidationError":
      return {
        type: "validation",
        message: error.message,
        field: error.field,
        statusCode: error.statusCode,
        recovarable: true,
      };
    case "AIGenerationError":
      return {
        type: "ai_generation",
        message: error.message,
        operation: error.operation,
        statusCode: error.statusCode,
        recovarable: true,
      };
    case "ScrapingError":
      return {
        type: "scraping",
        message: error.message,
        url: error.url,
        statusCode: error.statusCode,
        recovarable: true,
      };
    case "TimeoutError":
      return {
        type: "timeout",
        message: error.message,
        timeout: error.timeout,
        statusCode: error.statusCode,
        recovarable: false,
      };
  }
  if (error.code == "ECONNABORTED") {
    return {
      type: "network",
      message: "Network request timeout",
      statusCode: 504,
      recovarable: true,
    };
  }
  if (error.response?.status) {
    return {
      type: "http",
      message: error.message,
      statusCode: error.response.status,
      recoverable: error.response.status < 500,
    };
  }

  return {
    type: "unknown",
    message: error.message,
    statusCode: 500,
    recoverable: false,
  };
};
