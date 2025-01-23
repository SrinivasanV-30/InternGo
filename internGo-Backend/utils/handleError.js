import logger from "./logger.js";

const handleError = (error,operation) => {
    logger.error(error.message);
    throw new Error(`${operation} failed.`);
};

export default handleError;