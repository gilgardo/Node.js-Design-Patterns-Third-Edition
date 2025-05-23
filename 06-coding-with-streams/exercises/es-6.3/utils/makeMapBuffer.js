export const makeMapBuffer = (arr) => {
  return arr.map((el) => {
    const header = Buffer.alloc(4);
    const data = Buffer.from(el);
    header.writeUInt32BE(data.length, 0);
    return Buffer.concat([header, data]);
  });
};
