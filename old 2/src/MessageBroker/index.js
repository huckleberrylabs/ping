import amqp from "amqplib";
import { URL } from "url";
import Agent from "../../Domain/Agent";
import { type Context } from "../../Domain/interfaces";

export type MessageBrokerRequest = {
  url: string,
  originalUrl: string,
  // contentType: string,
  // contentEncoding: string,
  // type: string,
  content: Buffer,
  context?: Context,
  original?: amqp.Message,

  // cc?: Array<string>,
  // bcc?: Array<string>,
  // persistant?: boolean,

  // priority?: number,
  // timestamp?: number,
  // expiration?: string,

  /** Stores Agent ID */
  appId: string,
  // correlationId?: string,

  /** on error */
  requeue?: boolean,
  /**  Previously requeued? */
  redelivered?: string,
  /**  Dead Letter Queue */

  /** Queue Name */
  // replyTo?: string,
  /** if replyTo set to true */
  // response?: {}, // TODO: Decide what props are propagated from request to response
};

export type AMQPHandle = (req: MessageBrokerRequest, next: () => void) => void;

export interface IMessageBroker {
  queueName: string;
  client: amqp.Connection;
  channel: amqp.Channel;
  constructor(queueName: string, client: amqp.Connection): void;
  initialize(): void;
  send(data: mixed, asAgent: Agent): boolean;
  use(route: string, handle: AMQPHandle): void;
  handle(message: amqp.Message): void;
  start(): void;
  stop(): void;
}
export default class MessageBroker implements IMessageBroker {
  queueName: string;
  consumerTag: string;
  client: amqp.Connection;
  channel: amqp.Channel;
  route: string;
  stack: Array<{ route: string, handle: AMQPHandle }>;
  constructor(queueName: string, client: amqp.Connection): void {
    if (!queueName) {
      throw new Error("Message Queue Name (Namespace) Must Be Provided");
    }
    this.queueName = queueName;
    this.client = client;
    this.route = "/";
    this.stack = [];
    this.initialize();
  }
  async initialize() {
    this.channel = await this.client.createChannel();
    await this.channel.prefetch(5);
    await this.channel.assertQueue(this.queueName);
  }
  send(data: mixed, asAgent: Agent): void {
    return this.channel.sendToQueue(this.queueName, Buffer.from(data), {
      headers: {
        url: "/graphql",
        requeue: true,
      },
      persistent: true,
      appId: asAgent.id,
    });
  }
  use(route: ?string, handle: AMQPHandle): void {
    if (!route) {
      route = "/";
    }
    // strip trailing slash
    if (route[route.length - 1] === "/") {
      route = route.slice(0, -1);
    }
    this.stack.push({ route, handle });
  }
  handle(message: amqp.Message): void {
    let index = 0;
    let { stack } = this;
    const req: MessageBrokerRequest = {
      url: message.properties.headers.url,
      originalUrl: message.properties.headers.url,
      requeue: message.properties.headers.requeue,
      appId: message.properties.appId,
      redelivered: message.fields.redelivered,
      content: message.content,
      original: message,
    };
    // Route Related
    let protohost;
    if (req.url.length === 0 || req.url[0] === "/") {
      protohost = "";
    }
    const searchIndex = req.url.indexOf("?");
    const pathLength = searchIndex !== -1 ? searchIndex : req.url.length;
    const fqdnIndex = req.url.substr(0, pathLength).indexOf("://");
    protohost =
      fqdnIndex !== -1
        ? req.url.substr(0, req.url.indexOf("/", 3 + fqdnIndex))
        : "";
    let removed = "";
    let slashAdded = false;

    // Handle
    function next(err: Error) {
      if (slashAdded) {
        req.url = req.url.substr(1);
        slashAdded = false;
      }
      if (removed.length !== 0) {
        req.url = protohost + removed + req.url.substr(protohost.length);
        removed = "";
      }
      // next callback
      const layer = stack[index++];

      // final function handle
      if (!layer) {
        const defer =
          typeof setImmediate === "function"
            ? setImmediate
            : function(fn) {
                process.nextTick(fn.bind.apply(fn, arguments));
              };
        defer(this.handleLast, err);
        return;
      }

      // route data
      const url = new URL(req.url);
      const path = url.pathname || "/";
      const route = layer.route;

      // skip this layer if the route doesn't match
      if (path.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
        return next(err);
      }

      // skip if route match does not border "/", ".", or end
      const c = path.length > route.length && path[route.length];
      if (c && c !== "/" && c !== ".") {
        return next(err);
      }

      // trim off the part of the url that matches the route
      if (route.length !== 0 && route !== "/") {
        removed = route;
        req.url = protohost + req.url.substr(protohost.length + removed.length);
        // ensure leading slash
        if (!protohost && req.url[0] !== "/") {
          req.url = "/" + req.url;
          slashAdded = true;
        }
      }

      // call the layer handle
      const handle = layer.handle;
      const arity = handle.length;
      let error = err;
      const hasError = Boolean(err);
      try {
        if (hasError && arity === 3) {
          handle(err, req, next);
          return;
        } else if (!hasError && arity < 3) {
          handle(req, next);
          return;
        }
      } catch (e) {
        error = e;
      }
      next(error);
    }
    next();
  }
  handleLast(err: Error, req: MessageBrokerRequest): void {
    if (err) {
      if (req.redelivered) {
        this.logger.log("error", err.toString());
        // Implement Dead Letter Exchange Here
      } else {
        this.channel.nack(req.original, false, req.requeue);
      }
    }
    if (req.replyTo) {
      throw new Error("Not Implemented Yet!");
      // this.channel.assertQueue(req.replyTo);
      // Implement ReplyTo Here
    }
    this.channel.ack(req.original);
  }
  async start(): void {
    this.consumerTag = await this.channel.consume(this.queueName, this.handle, {
      noAck: false,
      exclusive: false,
      priority: undefined,
    });
  }
  stop(): void {
    if (this.consumerTag) {
      this.channel.cancel(this.consumerTag);
    }
  }
}
