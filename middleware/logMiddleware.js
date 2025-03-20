import fs from "fs";

export default function log(req, res, next) {
  const date = new Date();
  const logFile = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;
  fs.appendFile(`./logs/${logFile}`, `${req.method} ${req.url} ${req.ip}\n`, (err) => { 
    if (err) throw err;
  });
  console.log("Request:", req.method, req.url, req.ip);
  next();
}