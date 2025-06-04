// 7.3 A tamper-free queue: Create a Queue class that has only one publicly
// accessible method called dequeue(). Such a method returns a Promise
// that resolves with a new element extracted from an internal queue data
// structure. If the queue is empty, then the Promise will resolve when a new

// item is added. The Queue class must also have a revealing constructor that
// provides a function called enqueue() to the executor that pushes a new
// element to the end of the internal queue. The enqueue() function can be
// invoked asynchronously and it must also take care of "unblocking" any
// eventua
// l Promise returned by the dequeue() method. To try out the Queue
// class, you co
// uld build a small HTTP server into the executor function. Such
// a server would receive messages or tasks from a client and would push them
// into the queue. A loop would then consume all those messages using the
// dequeue() method.

import net from "net";
import repl from "node:repl";

repl.start("> ").context;
class Queue {
  #queue = [];
  #waiting = [];

  constructor(executor) {
    const enqueue = (item) => {
      if (this.#waiting.length > 0) {
        const resolve = this.#waiting.shift();
        resolve(item);
      } else {
        this.#queue.push(item);
      }
    };

    executor(enqueue);
  }

  dequeue() {
    return new Promise((resolve) => {
      if (this.#queue.length > 0) {
        resolve(this.#queue.shift());
      } else {
        this.#waiting.push(resolve);
      }
    });
  }
}

// const clientQueue = new Queue((enqueue) => {
//   const server = net.createServer((socket) => {
//     let body = "";
//     socket.on("data", (chunk) => {
//       body += chunk.toString();
//     });

//     socket.on("end", () => {
//       enqueue(body.trim());
//     });
//   });

//   server.listen(3000, () => {
//     console.log("TCP server listening on port 3000");
//   });
// });

// const r = repl.start("> ");

// (async () => {
//   while (true) {
//     const item = await clientQueue.dequeue();
//     r.context.msg = item;
//     console.log(`\nNew message received and stored as 'msg': ${item}`);
//   }
// })();
net
  .createServer((socket) => {
    socket.on("data", (chunk) => {
      console.log("Received:", chunk.toString());
    });
  })
  .listen(3000, () => {
    console.log("Server listening on port 3000");
  });
