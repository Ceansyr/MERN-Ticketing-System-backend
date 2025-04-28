import fs from "fs";

export const LogService = {
  logError: async (error) => {
    const date = new Date();
    const logFile = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-error.log`;
    const errorLog = `[${date.toISOString()}] ${error.stack || error.message}\n`;

    try {
      // Ensure logs directory exists
      const logDir = "./logs";
      if (!fs.existsSync(logDir)) {
        await fs.promises.mkdir(logDir, { recursive: true });
      }
      await fs.promises.appendFile(`${logDir}/${logFile}`, errorLog);
    } catch (writeErr) {
      console.error("Error writing to error log: ", writeErr);
    }
  },

  formatErrorResponse: (error) => {
    return {
      error: {
        message: error.message,
        status: error.status || 500,
      },
    };
  }
};