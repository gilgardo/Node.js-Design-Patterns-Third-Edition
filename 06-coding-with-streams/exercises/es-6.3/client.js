import { connect } from "net";
import { makeMapBuffer } from "./utils/makeMapBuffer.js";
import { writeAsync } from "./utils/writeAsync.js";
import { multiplexingFiles } from "./multiplexingFiles.js";

const filesPaths = process.argv.slice(2);

const socket = connect(3000, async () => {
  const manifest = Buffer.concat(makeMapBuffer(filesPaths));
  await writeAsync(socket, manifest).catch((err) => console.error(err));
  await multiplexingFiles(socket, filesPaths).catch((err) =>
    console.error(err)
  );
  socket.end();
});
