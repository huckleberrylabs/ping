import { TypeName } from "../type-name";
import { ID } from "../id";

export interface INewable<T> {
  new (...args: any[]): T;
}

// POLICY

export interface IPolicy {
  id: ID;
}

export interface IPolicyStatic extends INewable<IPolicy> {
  id: ID;
}

// TASK

export interface ITask {
  type: TypeName;
  id: ID;
  description: string;
}

export interface ITaskStatic extends INewable<ITask> {
  type: TypeName;
  id: ID;
  description: string;
}
