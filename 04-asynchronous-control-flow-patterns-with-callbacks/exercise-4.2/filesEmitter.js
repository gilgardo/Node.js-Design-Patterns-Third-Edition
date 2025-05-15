import EventEmitter from "node:events";
class FileEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

const fileEmitter = new FileEmitter();

export default fileEmitter;
