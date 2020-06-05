import { isLeft } from "fp-ts/lib/Either";
import { Results, UUID, Errors } from "@huckleberrylabs/core";
import { AccountRepository, WidgetRepository } from "../../../../interfaces";
import * as Command from "../command";
import * as Event from "../event";

export const Handler = (
  repo: AccountRepository,
  widgetRepo: WidgetRepository
) => async (command: Command.T) => {
  // TODO IsAuthorized
  const event = Event.C(command);
  const acccountMaybe = await repo.get(event.account);
  if (isLeft(acccountMaybe)) {
    switch (acccountMaybe.left.type) {
      case Errors.NotFound.Name:
        return Results.NotFound.C(command);
      default:
        return Results.Error.C(command);
    }
  }
  const account = acccountMaybe.right;
  const newWidget = event.widget;

  if (account.widgets.filter(widget => widget.id === newWidget.id).length > 0)
    return Results.BadRequest.C(command);

  account.widgets.push(newWidget);
  const saved = await repo.update(account);

  // TODO move to subscriber
  const savedWidget = await widgetRepo.add(newWidget);
  if (isLeft(saved) || isLeft(savedWidget)) {
    // TODO notify engineer
    console.log("Widget could not be saved");
    return Results.Error.C(command);
  }

  return Results.OKWithData.C(command, newWidget.id, UUID.Name);
};
