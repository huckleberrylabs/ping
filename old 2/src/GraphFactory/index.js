import gremlin from "gremlin";
import { type IServiceFactory } from "../interfaces";
import Framework from "../../Framework";

export type GraphClient = mixed;

export type GraphConfig = {
  url: string,
  username?: string,
  password?: string,
  host?: string,
  port?: number,
};
export default class GraphFactory
  implements IServiceFactory<GraphClient, GraphConfig> {
  config: GraphConfig;
  constructor(framework: Framework, config?: GraphConfig): void {
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
