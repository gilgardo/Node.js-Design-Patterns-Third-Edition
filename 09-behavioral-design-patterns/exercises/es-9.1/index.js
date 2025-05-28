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
    get(target, prop, receiver) {
      if (prop in target) return Reflect.get(target, prop, receiver);
      if (!target.getLogPlaces().includes(prop))
        throw new Error("invalid prop");
      return (...arg) => target.sendStrategyIstance[prop](...arg);
    },
    has(target, prop) {
      return prop in target || target.getLogPlaces().includes(prop);
    },
  });
};

const consoleStrategy = (logPlaces) => {
  return new Proxy(console, {
    get(target, prop, receiver) {
      if (!logPlaces.includes(prop)) throw new Error("invalid prop");
      return (...arg) => target[prop](...arg);
    },
  });
};

const fileStrategy = (logPlaces) => {
  return new Proxy(
    {},
    {
      get(_, prop) {
        if (!logPlaces.includes(prop)) throw new Error("invalid prop");

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
console.error("lol");
