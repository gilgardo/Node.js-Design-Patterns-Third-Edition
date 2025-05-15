import { fileURLToPath } from "url";
import path from "path";
import { readFile, appendFile } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function concatFiles(dest, cb, ...sources) {
  if (sources.length === 0) {
    return process.nextTick(cb);
  }
  readFile(path.join(__dirname, sources[0]), (err, content) => {
    if (err) return cb(err);
    appendContentToFile(dest, content, sources.slice(1), cb);
  });
}
function appendContentToFile(dest, content, next, cb) {
  appendFile(path.join(__dirname, dest), content, (err) => {
    if (err) return cb(err);
    return concatFiles(dest, cb, ...next);
  });
}

export default concatFiles;
