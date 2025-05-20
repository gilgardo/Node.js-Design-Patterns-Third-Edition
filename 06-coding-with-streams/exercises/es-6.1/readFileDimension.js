import { Readable } from "stream";
import Chance from "chance";
const chance = new Chance();

export class ReadFileDimension extends Readable {
  constructor(options, fileDimension, phase) {
    super(options);
    this.fileDimension = fileDimension;
  }
  _read(size) {
    const chunk = chance.string({ length: size });
    this.fileDimension[phase] += chunk.length;
    this.push(chunk, "utf8");
  }
}
