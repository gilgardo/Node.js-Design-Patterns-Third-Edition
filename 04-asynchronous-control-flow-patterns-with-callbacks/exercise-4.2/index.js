// 4.2 List files recursively: Write listNestedFiles(), a callback-style function
// that takes, as the input, the path to a directory in the local filesystem and that
// asynchronously iterates over all the subdirectories to eventually return a list
// of all the files discovered. Here is what the signature of the function should
// look like:
// function listNestedFiles (dir, cb) { /* ... */ }

import listNestedFiles from "./listNestedFiles.js";
import fileEmitter from "./filesEmitter.js";

const dir = process.argv[2];

listNestedFiles(dir, (err, files) => {
  if (err) {
    console.error("Error:", err);
    process.exit(1);
  }
  console.log(files);
});

fileEmitter.on("filelistCompleted", () => {
  console.log("File listing completed.");
});
