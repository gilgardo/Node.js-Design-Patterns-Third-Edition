// 7.2 Request builder: Create your own Builder class around the built-in
// http.request() function. The builder must be able to provide at least basic
// facilities to specify the HTTP method, the URL, the query component of
// the URL, the header parameters, and the eventual body data to be sent. To
// send the request, provide an invoke() method that returns a Promise for the
// invocation. You can find the docs for http.request() at the following URL:
// nodejsdp.link/docs-http-request.

import { request } from "http";
import { stringify } from "querystring";

class RequestBuilder {
  constructor() {
    this.reqOptions = {
      protocol: "http:",
      hostname: "localhost",
      port: 80,
      path: "/",
      method: "GET",
      headers: {},
    };
    this.queryParams = {};
    this.bodyData = null;
  }

  setMethod(method) {
    this.reqOptions.method = method.toUpperCase();
    return this;
  }

  setURL({
    protocol = "http:",
    hostname = "localhost",
    port = 80,
    path = "/",
  }) {
    this.reqOptions.protocol = protocol;
    this.reqOptions.hostname = hostname;
    this.reqOptions.port = port;
    this.reqOptions.path = path;
    return this;
  }

  setQueryParams(params = {}) {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  setBody(data) {
    this.bodyData = typeof data === "object" ? JSON.stringify(data) : data;

    typeof data === "object"
      ? this.setHeaders({ "Content-Type": "application/json" })
      : this.setHeaders({ "Content-Type": "text/html; charset=utf-8" });

    return this;
  }

  setTimeout(ms) {
    this.reqOptions.timeout = ms;
    return this;
  }

  invoke() {
    return new Promise((resolve, reject) => {
      const queryString = stringify(this.queryParams);
      const fullPath =
        this.reqOptions.path + (queryString ? `?${queryString}` : "");
      this.reqOptions.path = fullPath;

      const req = request(this.reqOptions, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      });

      req.on("error", reject);

      if (this.bodyData) {
        req.write(this.bodyData);
      }

      req.end();
    });
  }
}
