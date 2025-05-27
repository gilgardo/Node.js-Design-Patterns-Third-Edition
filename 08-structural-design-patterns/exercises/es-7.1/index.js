// 7.1 Console color factory: Create a class called ColorConsole that has just
// one empty method called log(). Then, create three subclasses: RedConsole,
// BlueConsole, and GreenConsole. The log() method of every ColorConsole
// subclass will accept a string as input and will print that string to the console
// using the color that gives the name to the class. Then, create a factory
// function that takes color as input, such as 'red', and returns the related
// ColorConsole subclass. Finally, write a small command-line script to try
// the new console color factory. You can use this Stack Overflow answer as
// a reference for using colors in the console: nodejsdp.link/console-colors.

class ColorConsole {
  log() {}
}

const colorConsoleFactory = (color) => {
  const ansiColorMap = new Map([
    ["black", "\x1b[30m"],
    ["red", "\x1b[31m"],
    ["green", "\x1b[32m"],
    ["yellow", "\x1b[33m"],
    ["blue", "\x1b[34m"],
    ["magenta", "\x1b[35m"],
    ["cyan", "\x1b[36m"],
    ["white", "\x1b[37m"],
    ["reset", "\x1b[0m"],
  ]);
  const ansiColor = ansiColorMap.get(color);
  if (!ansiColor) throw new Error("unknown color");
  const colorConsole = new ColorConsole();
  colorConsole.log = function (message) {
    console.log(ansiColor, message);
  };
  return colorConsole;
};

const redLog = colorConsoleFactory("lilla");
redLog.log("hello");
