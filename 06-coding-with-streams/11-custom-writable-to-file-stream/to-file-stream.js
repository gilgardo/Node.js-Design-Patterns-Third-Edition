import { Writable } from "stream";
import { promises as fs } from "fs";
import { dirname } from "path";
import mkdirp from "mkdirp-promise";

export class ToFileStream extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  async _write(chunk, encoding, cb) {
    try {
      await mkdirp(dirname(chunk.path));
      await fs.writeFile(chunk.path, chunk.content);
      cb();
    } catch (err) {
      cb(err);
    }
  }
}
