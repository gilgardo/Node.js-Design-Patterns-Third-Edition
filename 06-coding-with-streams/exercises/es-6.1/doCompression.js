import { promisify } from "node:util";
import { pipeline } from "node:stream";
import { PassThrough } from "node:stream";
import { createWriteStream, createReadStream } from "fs";

const pipe = promisify(pipeline);

export async function do_compression(
  input,
  output,
  compressionSteram,
  compressionName
) {
  const start = Date.now();
  let originalFileDimension = 0;
  let compressedFileDimension = 0;

  const source = createReadStream(input);
  const dest = createWriteStream(output, { flags: "a" });

  const originalMonitor = new PassThrough();
  const compressedMonitor = new PassThrough();

  originalMonitor.on("data", (chunk) => {
    originalFileDimension += chunk.length;
  });

  compressedMonitor.on("data", (chunk) => {
    compressedFileDimension += chunk.length;
  });

  try {
    await pipe(source, originalMonitor, compressionSteram, compressedMonitor);
  } catch (err) {
    throw err;
  }

  const report = `${compressionName}, efficiency: ${
    originalFileDimension / compressedFileDimension
  } time in ms: ${Date.now() - start} \n`;

  console.log(report);

  dest.write(report);
}
