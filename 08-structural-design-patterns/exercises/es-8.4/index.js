import { createFSAdapter } from "./fs-adapter.js";

const fileMap = new Map();
const fs = createFSAdapter(fileMap);

fs.writeFile("file.txt", "Hello!", () => {
  fs.readFile("file.txt", { encoding: "utf8" }, (err, res) => {
    if (err) {
      return console.error(err);
    }
    console.log(res);
  });
});

// try to read a missing file
fs.readFile("missing.txt", { encoding: "utf8" }, (err, res) => {
  console.error(err);
});
