import { createReadStream } from "fs";
import { Transform } from "stream";

const addHeaderToChunk = (id) =>
  new Transform({
    transform(chunk, en, cb) {
      const header = Buffer.alloc(5);
      header.writeUInt8(id, 0);
      header.writeUInt32BE(chunk.length, 1);
      const newChunck = Buffer.concat([header, chunk]);
      this.push(newChunck);
      cb();
    },
  });

const writeToSocket = (chunk, socket, stream) => {
  {
    const ok = socket.write(chunk);
    if (!ok) {
      stream.pause();
      socket.once("drain", () => stream.resume());
    }
  }
};

export const multiplexingFiles = async (socket, paths) => {
  const activeStreams = [];

  for (const [id, path] of paths.entries()) {
    const fileStream = createReadStream(path);
    const headerStream = addHeaderToChunk(id);

    const promise = new Promise((resolve, reject) => {
      fileStream
        .pipe(headerStream)
        .on("data", (chunk) => writeToSocket(chunk, socket, headerStream))
        .on("end", resolve)
        .on("error", reject);
    });

    activeStreams.push(promise);
  }

  await Promise.all(activeStreams);
};
