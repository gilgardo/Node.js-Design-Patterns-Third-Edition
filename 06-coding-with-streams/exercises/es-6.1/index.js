// 6.1 Data compression efficiency: Write a command-line script that takes a
// file as input and compresses it using the different algorithms available in the
// zlib module (Brotli, Deflate, Gzip). You want to produce a summary table
// that compares the algorithm's compression time and compression efficiency
// on the given file. Hint: This could be a good use case for the fork pattern, but
// remember that we made some important performance considerations when
// we discussed it earlier in this chapter.

import { createBrotliCompress, createDeflate, createGzip } from "zlib";
import { do_compression } from "./doCompression.js";

const gzip = createGzip();
const deflate = createDeflate();
const brotli = createBrotliCompress();

const input = process.argv[2];
const output = process.argv[3];

const compAlgos = [
  { stream: gzip, name: "gzip" },
  { stream: deflate, name: "deflate" },
  { stream: brotli, name: "brotli" },
];

for (const algo of compAlgos) {
  await do_compression(input, output, algo.stream, algo.name);
}
