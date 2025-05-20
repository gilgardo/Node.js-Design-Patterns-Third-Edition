import { basename } from "path";
import { ReplaceStream } from "./replace-stream.js";
import { WordSplitter } from "./word-splitter.js";
import { createReadStream } from "fs";

const replaceStream = new ReplaceStream("World", "Node.js");
replaceStream.on("data", (chunk) => console.log(chunk.toString()));

replaceStream.write("Hello W");
replaceStream.write("orld!");
replaceStream.end();

const filePath = process.argv[2];
const wordsNumber = process.argv[3];

const splitter = new WordSplitter();

const words = new Map();

createReadStream(filePath)
  .pipe(splitter)
  .on("data", (chunk) => {
    const count = words.get(chunk) || 0;
    words.set(chunk, count + 1);
  })
  .on("end", () =>
    [...words]
      .sort((a, b) => b[1] - a[1])
      .slice(0, wordsNumber)
      .forEach((word) => console.log(word))
  );
