// Exercise 9.1 Logging with Strategy: Implement a logging component having
// at least the following methods: debug(), info(), warn(), and error(). The
// logging component should also accept a strategy that defines where the log
// messages are sent. For example, we might have a ConsoleStrategy to send
// the messages to the console, or a FileStrategy to save the log messages
// to a file.
import * as fs from "fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const logPlaces = ["log", "debug", "info", "warn", "error"];

class Logger {
  #logPlaces;
  #sendStrategy;
  constructor(sendStrategy, logPlaces) {
    this.#logPlaces = logPlaces;
    this.#sendStrategy = sendStrategy;
    this.sendStrategyIstance = sendStrategy(logPlaces);
  }
  getLogPlaces() {
    return this.#logPlaces;
  }
  setLogPlaces(places) {
    this.#logPlaces = places;
    this.sendStrategyIstance = this.#sendStrategy(this.#logPlaces);
  }
  setSendStrategy(strategy) {
    this.#sendStrategy = strategy;
    this.sendStrategyIstance = this.#sendStrategy(this.#logPlaces);
  }
}

const decorateLogger = (strategy) => {
  const logger = new Logger(strategy, logPlaces);
  return new Proxy(logger, {
    get(target, prop) {
      if (prop in target) return Reflect.get(target, prop);
      if (!target.getLogPlaces().includes(prop))
        throw new Error("invalid prop");
      return (...arg) => target.sendStrategyIstance[prop](...arg);
    },
    has(target, prop) {
      return prop in target || target.getLogPlaces().includes(prop);
    },
  });
};

const consoleStrategy = () => {
  return new Proxy(console, {
    get(target, prop) {
      const date = new Date().toLocaleTimeString();
      return (...arg) => target[prop](date, ...arg);
    },
  });
};

const fileStrategy = () => {
  return new Proxy(
    {},
    {
      get(_, prop) {
        return async (data) => {
          const dir = join(__dirname, `${prop}.txt`);
          try {
            await fs.writeFile(dir, `${data}\n`, { flag: "a" });
          } catch (err) {
            console.log(err);
          }
        };
      },
    }
  );
};

const consoleLogger = decorateLogger(consoleStrategy);

const fileLogger = decorateLogger(fileStrategy);
consoleLogger.log("hello");
fileLogger.error("error");
