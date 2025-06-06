import { inflateRaw, deflateRaw } from "zlib";
import { promisify } from "util";

const inflateRawAsync = promisify(inflateRaw);
const deflateRawAsync = promisify(deflateRaw);

export const zlibMiddleware = function () {
  return {
    inbound(message) {
      return inflateRawAsync(message);
    },
    outbound(message) {
      return deflateRawAsync(message);
    },
  };
};
