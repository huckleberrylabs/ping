import { injectable } from "inversify";
import { staticImplements } from "../../helpers";
import { IEventHandler, IEventHandlerStatic } from "../../interfaces";
import {
  TaskCancelAction,
  TaskCreateAction,
  TaskPauseAction,
  TaskRescheduleAction,
  TaskStartAction,
} from "./actions";
import { TaskFailEvent, TaskResultEvent } from "./events";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TaskCreateActionHandler implements IEventHandler {
  async handle(event: TaskCreateAction) {
    return;
  }
  public static get type() {
    return TaskCreateAction.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TaskStartActionHandler implements IEventHandler {
  async handle(event: TaskStartAction) {
    return;
  }
  public static get type() {
    return TaskStartAction.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TaskPauseActionHandler implements IEventHandler {
  async handle(event: TaskPauseAction) {
    return;
  }
  public static get type() {
    return TaskPauseAction.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TaskCancelActionHandler implements IEventHandler {
  async handle(event: TaskCancelAction) {
    return;
  }
  public static get type() {
    return TaskCancelAction.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TaskRescheduleActionHandler implements IEventHandler {
  async handle(event: TaskRescheduleAction) {
    return;
  }
  public static get type() {
    return TaskRescheduleAction.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TaskResultEventHandler implements IEventHandler {
  async handle(event: TaskResultEvent) {
    return;
  }
  public static get type() {
    return TaskResultEvent.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TaskFailEventHandler implements IEventHandler {
  async handle(event: TaskFailEvent) {
    return;
  }
  public static get type() {
    return TaskFailEvent.type;
  }
}
