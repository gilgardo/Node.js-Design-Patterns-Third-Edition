import { PassThrough, Transform } from "stream";
export class GetYearCrimes extends Transform {
  constructor(options) {
    options.objectMode = true;
    super({ ...options });
    this.yearCrimesMap = new Map();
  }
  _transform(row, encoding, cb) {
    if (row.value <= 0) return cb();
    const oldData = this.yearCrimesMap.get(row.year) || 0;
    this.yearCrimesMap.set(row.year, oldData + row.value);
    cb();
  }
  _flush(cb) {
    const sorted = [...this.yearCrimesMap.entries()].sort(
      (a, b) => a[0] - b[0]
    );
    for (const data of sorted) {
      this.push({ year: data[0], total: data[1] });
    }
    cb();
  }
}

export const logger = new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    const message = `year: ${chunk.year} crimes: ${chunk.total} \n`;
    console.log(message);
    cb();
  },
});
