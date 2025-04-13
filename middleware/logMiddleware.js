import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = process.env.VERCEL ? "/tmp/logs" : path.join(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
  try {
    fs.mkdirSync(logDirectory, { recursive: true });
  } catch (err) {
    console.error("Failed to create log directory:", err);
  }
}

export default function log(req, res, next) {
  const date = new Date();
  const logFile = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}.log`;
  const logPath = path.join(logDirectory, logFile);

  const logEntry = `${date.toISOString()} ${req.method} ${req.url} ${req.ip}\n`;

  fs.appendFile(logPath, logEntry, (err) => {
    if (err) console.error("Error writing to log file:", err);
  });

  console.log(`[LOG] ${req.method} ${req.url} from ${req.ip}`);
  next();
}
