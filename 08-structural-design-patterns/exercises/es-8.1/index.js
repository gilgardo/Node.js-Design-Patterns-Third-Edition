import https from "https";

const getAsync = (path) =>
  new Promise((resolve, reject) => {
    https
      .get(path, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            reject(new Error(`Failed to parse JSON: ${err.message}`));
          }
        });
      })
      .on("error", (err) => {
        reject(new Error(err.message));
      });
  });

const cachedFn = (fn) => {
  const cache = new Map();

  const trap = {
    async apply(target, thisArg, args) {
      const [key] = args;
      if (cache.has(key)) {
        console.log(`[CACHE HIT] ${key}`);
        return Promise.resolve(cache.get(key));
      }

      try {
        const result = await Reflect.apply(target, thisArg, args);
        cache.set(key, result);
        return result;
      } catch (error) {
        throw error;
      }
    },
  };

  return new Proxy(fn, trap);
};

const cachedGet = cachedFn(getAsync);
