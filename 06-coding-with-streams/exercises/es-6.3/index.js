// 6.3 File share over TCP: Build a client and a server to transfer files over TCP.
// Extra points if you add a layer of encryption on top of that and if you can
// transfer multiple files at once. Once you have your implementation ready,
// give the client code and your IP address to a friend or a colleague, then ask
// them to send you some files! Hint: You could use mux/demux to receive
// multiple files at once.

import { createWriteStream } from "fs";
import { createServer } from "net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readOnceAsync } from "./utils/readAsync.js";
import { readManifestFile } from "./utils/readManifestFile.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function demultiplexChannel(source, destinations) {
  let currentChannel = null;
  let currentLength = null;
  source
    .on("readable", () => {
      let chunk;
      if (currentChannel === null) {
        chunk = source.read(1);
        currentChannel = chunk && chunk.readUInt8(0);
      }
      if (currentLength === null) {
        chunk = source.read(4);
        currentLength = chunk && chunk.readUInt32BE(0);
        if (currentLength === null) {
          return null;
        }
      }
      chunk = source.read(currentLength); 
      if (chunk === null) {
        return null;
      }
      console.log(`Received packet from: ${currentChannel}`);
      destinations[currentChannel].write(chunk); 
      currentChannel = null;
      currentLength = null;
    })
    .on("end", () => {
      destinations.forEach((destination) => destination.end());
      console.log("Source channel closed");
    });
}
const server = createServer(async (socket) => {
  const filesData = await readOnceAsync(socket, readManifestFile);
  const sourcesDest = filesData.map((file) =>
    createWriteStream(join(__dirname, "recived", file))
  );
  demultiplexChannel(socket, sourcesDest);
});
server.listen(3000, () => console.log("Server started"));
