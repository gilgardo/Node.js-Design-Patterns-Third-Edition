const createLazyBuffer = (size) => {
  let bufferInstance = null;

  return new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === "write") {
          if (!bufferInstance) {
            bufferInstance = Buffer.alloc(size);
          }
          return bufferInstance.write.bind(bufferInstance);
        }
        return (...args) => {
          if (!bufferInstance) {
            throw new Error(
              `Cannot call '${prop}' on an uninitialized buffer (no write() called yet)`
            );
          }
          const value = bufferInstance[prop];
          return typeof value === "function"
            ? value.apply(bufferInstance, args)
            : value;
        };
      },
    }
  );
};

const buf = createLazyBuffer(10);
buf.write("hello", 0);
console.log(buf.toString());
