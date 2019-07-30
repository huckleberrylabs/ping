import { type IResource, type ResourceMeta } from "../Resource";
import { type IFactories } from "../Factories";
import { type IGraph } from "../Graph";
import Edge from "../Edge";

export interface ICollection {
  collection: Array<IResource>;
  graph: IGraph;
  constructor(factories: IFactories): void;
  add(...resource: Array<IResource>): void;
  commit(): void;
}

export default class Collection implements IResource, ICollection {
  collection: Array<IResource>;
  graph: IGraph;
  constructor(factories: IFactories): void {
    this.graph = factories.graph.get("collection");
    this.collection = [];
  }
  add(...resource: Array<IResource>): void {
    this.collection.push(...resource);
  }
  async commit(): void {
    const nodes = [];
    const edges = [];
    this.collection.forEach(resource => {
      if (resource.type === Edge.type) {
        edges.push(resource);
      } else {
        nodes.push(resource);
      }
    });
  }
}
