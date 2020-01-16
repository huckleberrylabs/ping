import { isLeft } from "fp-ts/lib/Either";
import { Results, Errors } from "@huckleberryai/core";
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
  const updatedWidget = event.widget;

  const oldWidget = account.widgets.filter(
    widget => widget.id === updatedWidget.id
  )[0];

  if (!oldWidget) return Results.BadRequest.C(command);

  if (updatedWidget.homePage !== oldWidget.homePage) {
    // TODO add installation verification if new homePage
  }

  const widgets = account.widgets.filter(
    widget => widget.id !== updatedWidget.id
  );
  widgets.push(updatedWidget);
  account.widgets = widgets;

  const saved = await repo.update(account);

  // TODO move to subscriber
  const savedWidget = await widgetRepo.update(updatedWidget);
  if (isLeft(saved) || isLeft(savedWidget)) {
    // TODO notify engineer
    console.log("Widget could not be saved");
    return Results.Error.C(command);
  }

  return Results.OK.C(command);
};
