import { isLeft, Either, isRight, left } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import {
  IWidgetRepository,
  IAuthorizationService,
} from "../../../../interfaces";
import { Command as UpdateCommand } from "../update";
import { Query } from "../get-by-id";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.NotFound.T | Errors.Validation.T | Errors.Adapter.T, null>
>;

export default (
  repo: IWidgetRepository,
  auth: IAuthorizationService
): IHandler => async command => {
  // Check if a widget with the same id already exists
  const widgetMaybe = await repo.exists(command.widget.id);
  if (isRight(widgetMaybe)) {
    console.log("widget already exists");
    return left(Errors.Validation.C());
  }

  // Save the widget
  const savedMaybe = await repo.add(command.widget);
  if (isLeft(savedMaybe)) {
    console.log("widget could not be saved");
  }

  // Grant Authorization
  auth.grant(command.account, command.widget.id, UpdateCommand.Name);
  auth.grant(command.account, command.widget.id, Query.Name);

  // TODO atomic exist + add

  return savedMaybe;
};
