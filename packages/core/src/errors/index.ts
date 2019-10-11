import { Type } from "../values";

export class Validation extends Error {
  name = "core:error:validation" as Type.T;
}
export class Parsing extends Error {
  name = "core:error:parsing" as Type.T;
}

export class Adapter extends Error {
  name = "core:error:adapter" as Type.T;
}

export class Environment extends Error {
  name = "core:error:environment" as Type.T;
}
