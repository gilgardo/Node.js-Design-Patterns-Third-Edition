// 7.2 Request builder: Create your own Builder class around the built-in
// http.request() function. The builder must be able to provide at least basic
// facilities to specify the HTTP method, the URL, the query component of
// the URL, the header parameters, and the eventual body data to be sent. To
// send the request, provide an invoke() method that returns a Promise for the
// invocation. You can find the docs for http.request() at the following URL:
// nodejsdp.link/docs-http-request.
import { request } from "http";

class Request {
  constructor(reqObj, cb) {
    this.reqObj = reqObj;
    this.cb = cb;
  }
  build() {
    return request(this.reqObj, this.cb);
  }
}

class RequestBuilder {
  constructor() {
    this.reqObj = {};
  }
  setCallback(cb) {
    this.cb = cb;
    return this;
  }
  setConnectionOptions(connectionObj = {}) {
    const { protocol, hostname, port, path, method } = connectionObj;
    this.reqObj.protocol = protocol ?? "http:";
    this.reqObj.hostname = hostname ?? "localhost";
    this.reqObj.port = port ?? 80;
    this.reqObj.path = path ?? "/api/data";
    this.reqObj.method = method ?? "GET";
    return this;
  }
  setHeaders(headeObj) {
    if (!headeObj) {
      this.reqObj.setDefaultHeaders = true;
      return this;
    }
    this.reqObj.headers = headeObj;
    return this;
  }
  setTuning(timeout) {
    this.reqObj.agent = false;
    this.reqObj.timeout = timeout ?? 5000;
    return this;
  }
  build() {
    return new Request(this.reqObj, this.cb).build();
  }
}
