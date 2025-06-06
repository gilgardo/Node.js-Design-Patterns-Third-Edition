export class LogMiddlewareManager {
  constructor() {
    this.inboundMiddleware = [];
    this.outboundMiddleware = [];
  }

  async handleIncomingMessage(message) {
    await this.executeMiddleware(this.inboundMiddleware, message).catch(
      (err) => {
        console.error("Error while processing the message", err);
      }
    );
  }

  async readLogMessages() {
    const logMessages = await this.executeMiddleware(this.outboundMiddleware);
    return logMessages;
  }

  use(middleware) {
    if (middleware.inbound) {
      this.inboundMiddleware.push(middleware.inbound);
    }
    if (middleware.outbound) {
      this.outboundMiddleware.unshift(middleware.outbound);
    }
  }

  async executeMiddleware(middlewares, initialMessage = "") {
    let message = initialMessage;
    for await (const middlewareFunc of middlewares) {
      message = await middlewareFunc.call(this, message);
    }
    return message;
  }
}
