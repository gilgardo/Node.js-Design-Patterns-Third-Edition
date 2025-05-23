//  6.2 Stream data processing: On Kaggle, you can find a lot of interesting data
// sets, such as the London Crime Data (nodejsdp.link/london-crime). You can
// download the data in CSV format and build a stream processing script that
// analyzes the data and tries to answer the following questions:
// • Did the number of crimes go up or down over the years?
// • What are the most dangerous areas of London?
// • What is the most common crime per area?
// • What is the least common crime?

import { createReadStream, createWriteStream } from "fs";
import CsvReadableStream from "csv-reader";
import { GetYearCrimes, logger } from "./trasforms.js";
import { pipeline } from "stream";

const input = process.argv[2];

const inputStream = createReadStream(input, { encoding: "utf8" });
const destStream = createWriteStream("./data.txt", { flags: "a" });
const csvStream = new CsvReadableStream({
  parseNumbers: true,
  parseBooleans: true,
  trim: true,
  asObject: true,
});
const crimesYearStream = new GetYearCrimes({});

pipeline(
  inputStream,
  csvStream,
  crimesYearStream,
  logger,
  destStream,
  (err) => {
    if (err) return console.log(err);
    console.log("All data readed \n");
  }
);
