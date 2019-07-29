import amqp from "amqplib";
import { type IServiceFactory } from "../interfaces";
import MessageBroker, { type IMessageBroker } from "../MessageBroker";
import Framework from "../../Framework";

export default class MessageBrokerFactory
  implements IServiceFactory<IMessageBroker, amqp.Options.Connect> {
  config: amqp.Options.Connect;
  client: amqp.Connection;
  constructor(framework: Framework, config?: amqp.Options.Connect): void {
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
