import { LogMiddlewareManager } from "./logMiddlewareManager.js";
import { serializeMiddleware } from "./serializeMiddleware.js";
// import { zlibMiddleware } from "./zlibMiddleware.js";
import { handleFileMiddleware } from "./handleFileMiddleware.js";
import split from "split2";

async function main() {
  const log = new LogMiddlewareManager();
  log.use(serializeMiddleware());
  // log.use(zlibMiddleware());
  log.use(handleFileMiddleware());

  console.log("Type messages");
  const stdinStream = process.stdin.pipe(split());
  for await (const message of stdinStream) {
    try {
      await log.handleIncomingMessage(message);
      const savedMessages = await log.readLogMessages();
      process.stdout.write(savedMessages);
    } catch (err) {
      console.log(err);
    }
  }
}

main();
