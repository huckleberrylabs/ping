import amqp from "amqplib";
// @ts-ignore
import { IServiceFactory } from "../interfaces";
import MessageBroker, { IMessageBroker } from "../MessageBroker";
// @ts-ignore
import Framework from "../../Framework";

export default class MessageBrokerFactory
  implements IServiceFactory<IMessageBroker, amqp.Options.Connect> {
  config: amqp.Options.Connect;
  client!: amqp.Connection;
  constructor(framework: Framework, config: amqp.Options.Connect) {
    this.config = config;
    this.initialize();
  }
  async initialize() {
    this.client = await amqp.connect(this.config);
    process.once("SIGINT", this.client.close);
  }
  get(namespaced?: string): IMessageBroker {
    if (!namespaced) {
      throw new Error(
        "Message Queue Channel Name (Namespace) Must Be Provided"
      );
    }
    return new MessageBroker(namespaced, this.client);
  }
}
