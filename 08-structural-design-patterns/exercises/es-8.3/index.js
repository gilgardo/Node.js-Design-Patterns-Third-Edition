// 8.3 Colored console output: Write a decorator for the console that adds
// the red(message), yellow(message), and green(message) methods. These
// methods will have to behave like console.log(message) except they will
// print the message in red, yellow, or green, respectively. In one of the
// exercises from the previous chapter, we already pointed you to some useful
// packages to to create colored console output. If you want to try something
// different this time, have a look at ansi-styles (nodejsdp.link/ansi-styles)

const coloredConsole = (() => {
  const ansiColors = {
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m",
  };
  const reset = "\x1b[0m";
  const trap = {
    get(target, prop) {
      if (!(prop in ansiColors)) return target[prop];
      return (...args) => target.log(ansiColors[prop], ...args, reset);
    },
  };
  return new Proxy(console, trap);
})();
coloredConsole.yellow("hello");
coloredConsole.red("hello");
coloredConsole.log("hello");
