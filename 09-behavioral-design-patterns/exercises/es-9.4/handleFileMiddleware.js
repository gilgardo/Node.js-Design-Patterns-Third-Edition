import * as fs from "fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const handleFileMiddleware = function () {
  return {
    async inbound(message) {
      await fs
        .appendFile(join(__dirname, "log.txt"), message)
        .catch((err) => console.log(err));
      return "added message to the log file";
    },
    async outbound() {
      const message = await fs
        .readFile(join(__dirname, "log.txt"), "utf-8")
        .catch((err) => console.log(err));
      return message;
    },
  };
};
