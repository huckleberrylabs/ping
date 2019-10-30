import { isLeft } from "fp-ts/lib/Either";
import { Results, UUID } from "@huckleberryai/core";
import { AccountRepository, WidgetRepository } from "../../../../interfaces";
import * as Account from "../../../../account";
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
      case "core:error:not-found":
        return Results.NotFound.C(command);
      case "core:error:adapter":
      default:
        return Results.Error.C(command);
    }
  }
  const account = acccountMaybe.right;
  const newWidget = event.widget;

  if (account.widgets.filter(widget => widget.id === newWidget.id).length > 0)
    return Results.BadRequest.C(command);

  if (Account.PhoneExists(account, newWidget.phone)) {
    // TODO stripe add seat if error return error and sysadmin
  }

  account.widgets.push(newWidget);
  const saved = await repo.update(account);

  // TODO move to subscriber
  const savedWidget = await widgetRepo.add(newWidget);
  if (isLeft(saved) || isLeft(savedWidget)) {
    // TODO stripe remove seat error and sysadmin
    return Results.Error.C(command);
  }

  return Results.OKWithData.C(command, newWidget.id, UUID.Name);
};
