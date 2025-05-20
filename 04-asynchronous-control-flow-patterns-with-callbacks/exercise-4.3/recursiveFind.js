import fs from "fs";
import path from "path";

function recursiveFind(dir, keyword, cb) {
  const filesInfo = [];

  function readDirRecursive(currentDir, done) {
    fs.readdir(currentDir, { withFileTypes: true }, (err, entries) => {
      if (err) return done(err);

      let pending = entries.length;
      if (pending === 0) return done();

      let called = false;
      function readSubDir(newDir) {
        readDirRecursive(newDir, (err) => {
          if (err && !called) {
            called = true;
            return done(err);
          }
          if (--pending === 0 && !called) done();
        });
      }

      function checkFile(path) {
        fs.readFile(path, "utf8", (err, data) => {
          if (err && !called) {
            called = true;
            return done(err);
          }
          if (path.slice(-4) === ".txt" && data.includes(keyword))
            filesInfo.push(path);

          if (--pending === 0 && !called) done();
        });
      }

      entries
        .filter((entry) => entry.isDirectory())
        .map((dir) => path.join(currentDir, dir.name))
        .forEach((newDir) => readSubDir(newDir));

      entries
        .filter((entry) => entry.isFile())
        .forEach((file) => checkFile(path.join(currentDir, file.name)));
    });
  }

  readDirRecursive(dir, (err) => {
    if (err) return cb(err);
    cb(null, filesInfo);
  });
}

export default recursiveFind;
