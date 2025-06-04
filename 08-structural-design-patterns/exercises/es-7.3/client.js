//client.js

import net from "net";
const sock = net.connect(3000, () => {
  console.log("connecting to the server");
  process.stdin.resume();
  process.stdin.pipe(sock);
});
