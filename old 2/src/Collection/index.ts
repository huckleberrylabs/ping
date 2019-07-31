// @ts-ignore
import { IResource, ResourceMeta } from "../Resource";
// @ts-ignore
import { IFactories } from "../Factories";
// @ts-ignore
import { IGraph } from "../Graph";
import Edge from "../Edge";

export interface ICollection {
  collection: Array<IResource>;
  graph: IGraph;
  constructor(factories: IFactories): any;
  add(...resource: Array<IResource>): any;
  commit(): any;
}

export default class Collection implements IResource, ICollection {
  collection: Array<IResource>;
  graph: IGraph;
  constructor(factories: any) {
    this.graph = factories.graph.get("collection");
    this.collection = [];
  }
  add(...resource: Array<IResource>) {
    this.collection.push(...resource);
  }
  async commit() {
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
