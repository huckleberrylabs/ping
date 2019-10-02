import gremlin from "gremlin";

export type GraphClient = gremlin.process.GraphTraversalSource;
export type GraphConfig = {
  url: string;
  username?: string;
  password?: string;
  host?: string;
  port?: number;
};
export default class GraphFactory {
  config: GraphConfig;
  client: GraphClient;
  constructor(config: GraphConfig) {
    this.config = config;
    const Graph = gremlin.structure.Graph;
    const graph = new Graph();
    const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
    const driver = new DriverRemoteConnection(this.config.url);
    this.client = graph.traversal().withRemote(driver);
    this.client = graph.traversal();
  }
  get(): GraphClient {
    return this.client;
  }
}
