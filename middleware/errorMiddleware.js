import { LogService } from "../services/logService.js";

export const errorHandler = async (err, req, res, next) => {
  await LogService.logError(err);
  res.status(err.status || 500).json(LogService.formatErrorResponse(err));
};
