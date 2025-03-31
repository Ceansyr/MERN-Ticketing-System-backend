import fs from "fs";
import path from "path";

const logDirectory = path.join("../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}


export default function log(req, res, next) {
  const date = new Date();
  const logFile = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;
  const logPath = path.join(logDirectory, logFile);

  const logEntry = `${date.toISOString()} ${req.method} ${req.url} ${req.ip}\n`;

  fs.appendFile(logPath, logEntry, (err) => {
    if (err) throw err;
  });

  console.log("Request:", req.method, req.url, req.ip);
  next();
}