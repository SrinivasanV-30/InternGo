import logger from "./logger.js";

const handleError = (error, operation) => {
    logger.error({
      message: `Error in ${operation}`,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`${operation} failed: ${error.message}`);
  };

export default handleError;