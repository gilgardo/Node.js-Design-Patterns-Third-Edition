export const writeAsync = (socket, data) => {
  return new Promise((resolve, reject) => {
    const ok = socket.write(data, (err) => {
      if (err) return reject(err);
      resolve();
    });

    if (!ok) {
      socket.once("drain", resolve);
    }
  });
};
