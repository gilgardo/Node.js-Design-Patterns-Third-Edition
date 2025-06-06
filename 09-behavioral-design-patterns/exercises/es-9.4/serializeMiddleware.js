export const serializeMiddleware = function () {
  return {
    inbound(message) {
      const timestamp = new Date().toLocaleString();
      return `timestamp: ${timestamp}, ${message}\n`;
    },
    outbound(message) {
      return message + "\n";
    },
  };
};
