import { Buffer } from "node:buffer";
const convertArgs = (options, callback) => {
  switch (typeof options) {
    case "function":
      callback = options;
      options = { encoding: "utf8" };
      break;
    case "string":
      options = { encoding: options };
      break;
    case "object":
      if (!options.encoding) options.encoding = "utf8";
      break;
    default:
      options = { encoding: "utf8" };
      break;
  }
  if (!callback) {
    callback = (err, value) => {
      if (err) throw err;
    };
  }
  return { op: options, cb: callback };
};
export function createFSAdapter(fileMap) {
  return {
    readFile(filename, options, callback) {
      const { op, cb } = convertArgs(options, callback);
      const bufferValue = fileMap.get(filename);

      if (!bufferValue) {
        const err = new Error(`ENOENT, open "${filename}"`);
        err.code = "ENOENT";
        err.errno = 34;
        err.path = filename;

        return cb(err);
      }
      const value = bufferValue.toString(op.encoding);

      cb(null, value);
    },

    writeFile(filename, contents, options, callback) {
      const { op, cb } = convertArgs(options, callback);

      const bufferedValue = Buffer.from(contents, op.encoding);
      fileMap.set(filename, bufferedValue);
      cb();
    },
  };
}
