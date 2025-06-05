// Exercise 9.2 Logging with Template: Implement the same logging
// component we defined in the previous exercise, but this time using the
// Template pattern. We would then obtain a ConsoleLogger class to log to
// the console or FileLogger class to log to a file. Appreciate the differences
// between the Template and the Strategy approaches.
// import * as fs from "fs/promises";
import * as fs from "fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logPlaces = ["log", "debug", "info", "warn", "error"];

class Logger {
  #methods;
  constructor(methods) {
    this.#methods = methods;
  }
  buildTemplate(obj = {}) {
    const methods = this.#methods;
    const logDestination = this._handleLogDestination.bind(this);
    return new Proxy(obj, {
      get(target, prop) {
        if (prop in target && !methods.includes(prop))
          return Reflect.get(target, prop);
        if (!methods.includes(prop)) throw new Error(`invalid prop: ${prop}`);
        return (...args) => {
          const formattedArgs = args.join(" ");
          const timeStap = new Date().toDateString();
          logDestination(
            `timestamp: ${timeStap}, message: ${formattedArgs}`,
            target,
            prop
          );
        };
      },
      has(target, prop) {
        return prop in target || methods.includes(prop);
      },
    });
  }
  _handleLogDestination(message, target, prop) {
    throw new Error(
      "method needs to be implemented in the subclass: _handleLogDestination"
    );
  }
}

class ConsoleLogger extends Logger {
  _handleLogDestination(message, target, prop) {
    target[prop](message);
  }
}
class FileLogger extends Logger {
  _handleLogDestination(message, target, prop) {
    const dir = join(__dirname, `${prop}.txt`);
    fs.writeFile(dir, `${message}\n`, { flag: "a" }).catch((err) =>
      console.log(err)
    );
  }
}

const consoleLogger = new ConsoleLogger(logPlaces).buildTemplate(console);
consoleLogger.log("hello");
const fileLogger = new FileLogger(logPlaces).buildTemplate();
fileLogger.log("test");
fileLogger.log("log" in fileLogger);
