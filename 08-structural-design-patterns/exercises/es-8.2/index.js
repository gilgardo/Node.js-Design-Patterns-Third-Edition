const createTimeLogger = () => {
  const logFn = ["log", "error", "debug", "info"];
  const trap = {
    get(target, prop, receiver) {
      if (!logFn.includes(prop)) return Reflect.get(target, prop, receiver);

      const timeStamp = new Date();

      return (...args) => target[prop](timeStamp, ...args);
    },
  };
  return new Proxy(console, trap);
};

const timeLogger = createTimeLogger();

timeLogger.log("hello");
