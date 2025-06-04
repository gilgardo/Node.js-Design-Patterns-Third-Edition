const evenNumbers = new Proxy([], {
  get: (target, index) => index * 2,
  has: (target, number) => number % 2 === 0,
});

const fiNumbers = (() => {
  const cache = new Map([
    [0, 0],
    [1, 1],
  ]);

  const useCache = (index) => {
    if (cache.has(index)) return cache.get(index);
    const value = useCache(index - 1) + useCache(index - 2);
    cache.set(index, value);
    return value;
  };

  const customProp = {
    forEach: (cb, limit = 10) => {
      for (let i = 0; i < limit; i++) {
        cb(useCache(i), i);
      }
    },
  };

  return new Proxy([], {
    get(_, prop) {
      if (prop in customProp) return customProp[prop];

      const index = Number(prop);
      if (!Number.isInteger(index) || index < 0) return undefined;
      return useCache(index);
    },
  });
})();

function createPiSequence() {
  let i = 1n;
  let x = 3n * 10n ** 1020n;
  let pi = x;
  return {
    next() {
      if (x > 0) {
        return { done: true };
      }
      x = (x * i) / ((i + 1n) * 4n);
      pi += x / (i + 2n);
      i += 2n;
      return { value: pi, done: false };
    },
  };
}

// console.log(2 in evenNumbers); // true
// console.log(5 in evenNumbers); // false
// console.log(fiNumbers[10]);
