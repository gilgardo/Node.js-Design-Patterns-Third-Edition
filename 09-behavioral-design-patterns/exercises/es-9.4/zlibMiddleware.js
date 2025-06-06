import { inflateRaw, deflateRaw } from "zlib";
import { promisify } from "util";

const inflateRawAsync = promisify(inflateRaw);
const deflateRawAsync = promisify(deflateRaw);

export const zlibMiddleware = function () {
  return {
    outbound(message) {
      const bufferMessage = Buffer.isBuffer(message)
        ? message
        : Buffer.from(message);
      return inflateRawAsync(bufferMessage);
    },
    inbound(message) {
      const bufferMessage = Buffer.isBuffer(message)
        ? message
        : Buffer.from(message);
      return deflateRawAsync(bufferMessage);
    },
  };
};
