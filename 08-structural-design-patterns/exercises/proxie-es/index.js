import * as fs from "fs/promises";

class RemoteFileServer {
  async fetchFile(path) {
    const file = await fs
      .readFile(path, { encoding: "utf-8" })
      .catch((err) => console.log(err));
    console.log(`Fetching '${path}' from remote server...`);
    return file;
  }
}

class FileAccesProxy {
  #role;
  #server;
  #cache;
  constructor(role, server) {
    this.#role = role;
    this.#server = server;
    this.#cache = new Map();
  }

  async fetchFile(path) {
    if (this.#cache.has(path)) return Promise.resolve(this.#cache.get(path));
    if (this.#role === "guest") throw new Error("acces denied");
    if (this.#role === "user" && path.startsWith("/secret"))
      throw new Error("acces denied");
    const file = await this.#server.fetchFile(path);
    this.#cache.set(path, file);
    return file;
  }
}
