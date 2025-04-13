import fs from "fs";

export class LogService {
  static async logError(error) {
    const date = new Date();
    const logFile = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-error.log`;
    const errorLog = `[${date.toISOString()}] ${error.stack || error.message}\n`;

    try {
      await fs.promises.appendFile(`./logs/${logFile}`, errorLog);
    } catch (writeErr) {
      console.error("Error writing to error log: ", writeErr);
    }
  }

  static formatErrorResponse(error) {
    return {
      error: {
        message: error.message,
        status: error.status || 500,
      },
    };
  }
}