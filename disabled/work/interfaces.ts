import { Type, UUID } from "@huckleberryai/core";

export interface IPolicy {
  id: UUID;
}

export interface ITask {
  type: Type;
  id: UUID;
  description: string;
}
