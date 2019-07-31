import gremlin from "gremlin";
// @ts-ignore
import { IServiceFactory } from "../interfaces";
export type GraphClient = mixed;
// @ts-ignore
import Framework from "../../Framework";
export type GraphConfig = {
  url: string;
  username?: string;
  password?: string;
  host?: string;
  port?: number;
};
export default class GraphFactory
  implements IServiceFactory<GraphClient, GraphConfig> {
  config: GraphConfig;
  client: any;
  constructor(config: GraphConfig) {
    this.config = config;
    const Graph = gremlin.structure.Graph;
    const graph = new Graph();
    // const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
    // const driver = new DriverRemoteConnection(this.config.url);
    // this.client = graph.traversal().withRemote(driver);
    this.client = graph.traversal();
  }
  get(): GraphClient {
    return this.client;
  }
}
