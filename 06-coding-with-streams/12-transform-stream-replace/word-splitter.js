import { Transform } from "stream";

export class WordSplitter extends Transform {
  constructor(options = {}) {
    super({ ...options, readableObjectMode: true });
    this._last = ""; // store remainder from previous chunk
  }

  _transform(chunk, encoding, callback) {
    const text = this._last + chunk.toString().toLowerCase(); // combine with previous remainder
    const words = text.split(/[\s"]+/);
    this._last = words.pop(); // keep the last (possibly incomplete) word

    for (const word of words) {
      if (word) this.push(word); // emit non-empty words
    }

    callback();
  }

  _flush(callback) {
    if (this._last) {
      this.push(this._last); // emit last buffered word
    }
    callback();
  }
}
