export const readManifestFile = (chunk) => {
  let pos = 0;
  const headerArr = [];

  while (pos < chunk.length) {
    if (pos + 4 > chunk.length) break;

    const length = chunk.readUInt32BE(pos);
    pos += 4;

    if (pos + length > chunk.length) break;

    const data = chunk.slice(pos, pos + length).toString();
    pos += length;

    headerArr.push(data);
  }

  return headerArr;
};
