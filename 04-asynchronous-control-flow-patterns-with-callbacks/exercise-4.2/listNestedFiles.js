import fs from "fs";
import path from "path";
import fileEmitter from "./filesEmitter.js";

function listNestedFiles(dir, cb) {
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

      entries
        .filter((entry) => entry.isDirectory())
        .map((dir) => path.join(currentDir, dir.name))
        .forEach((newDir) => readSubDir(newDir));

      entries
        .filter((entry) => entry.isFile())
        .map((file) => ({ name: file.name, dir: currentDir }))
        .forEach((fileObj) => {
          filesInfo.push(fileObj);
          if (--pending === 0 && !called) done();
        });
    });
  }

  readDirRecursive(dir, (err) => {
    if (err) return cb(err);
    fileEmitter.emit("filelistCompleted");
    cb(null, filesInfo);
  });
}

export default listNestedFiles;
