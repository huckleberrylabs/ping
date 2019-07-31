import Joi from "Joi";
// @ts-ignore
import { IResource, ResourceMeta } from "../Resource";
import Schemas from "./schemas";

export default class Edge implements IResource {
  subject!: string;
  predicate: string;
  object!: string;
  properties: Object;
  propertiesSchema: Object;
  constructor(first: IResource, second: IResource, options: any) {
    // Resolve Subject / Object
    let edgeTypes;
    if (Schemas[first.type]) {
      if (Schemas[first.type][second.type]) {
        edgeTypes = Schemas[first.type][second.type];
        this.subject = first.id;
        this.object = second.id;
      }
    } else if (Schemas[second.type]) {
      if (Schemas[second.type][first.type]) {
        edgeTypes = Schemas[second.type][first.type];
        this.subject = second.id;
        this.object = first.id;
      } else {
        throw new Error("Edge Type Doesn't Exist");
      }
    } else {
      throw new Error("Provided Subject and Object Types Don't Exist");
    }

    // Resolve Predicate
    const keys = Object.keys(edgeTypes);
    if (keys.length > 1) {
      if (options.predicate) {
        if (edgeTypes[options.predicate]) {
          this.predicate = options.predicate;
          this.propertiesSchema = edgeTypes[options.predicate];
        } else {
          throw new Error("Predicate Type Doesn't Exist");
        }
      } else {
        throw new Error("Predicate Type Must be Provided");
      }
    } else {
      this.propertiesSchema = edgeTypes[keys[0]];
      this.predicate = keys[0];
    }

    // Resolve Properties
    this.properties = options.properties;
  }
  get meta(): ResourceMeta {
    return {
      type: this.type,
      id: this.id,
      methods: Edge.methods
    };
  }
  get type(): string {
    return Edge.type;
  }
  get id(): string {
    return Edge.id;
  }
  async validate() {
    const validatedProperties = await Joi.object(
      this.propertiesSchema
    ).validate(this.properties);
  }
}
//mising folder casuing error
Edge.type = "Edge";
Edge.id = "edge";
Edge.methods = {
  1: {
    name: "validate",
    version: 1.0
  }
};
