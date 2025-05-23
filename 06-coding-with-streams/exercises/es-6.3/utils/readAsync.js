export const readOnceAsync = (socket, cb) => {
  return new Promise((resolve, reject) => {
    socket.once("data", (chunk) => {
      try {
        resolve(cb(chunk));
      } catch (err) {
        reject(err);
      }
    });
  });
};
