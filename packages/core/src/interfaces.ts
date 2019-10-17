import { TaskEither } from "fp-ts/lib/TaskEither";
import { Task } from "fp-ts/lib/Task";
import * as Event from "./event";
import * as Result from "./result";
import { Phone, NonEmptyString } from "./values";

export type IHandler = <Event extends Event.T>(event: Event) => Task<Result.T>;

export type ISMSClient = (
  body: NonEmptyString.T,
  to: Phone.T
) => TaskEither<Error, void>;
