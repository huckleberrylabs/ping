import { isLeft, isRight } from "fp-ts/lib/Either";
import { Results, UUID, Errors } from "@huckleberryai/core";
import {
  AccountRepository,
  WidgetRepository,
  BillingService,
} from "../../../../interfaces";
import * as Account from "../../../../account";
import * as Command from "../command";
import * as Event from "../event";
import { Plan } from "../../../../plan";

export const Handler = (
  repo: AccountRepository,
  widgetRepo: WidgetRepository,
  billing: BillingService
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

  if (!Account.PhoneExists(account, newWidget.phone)) {
    const addedSeatMaybe = await billing.addSeat(
      event.id,
      account.stripeCustomer,
      Plan[newWidget.country]
    );
    if (isLeft(addedSeatMaybe)) {
      // TODO notify engineer
      return Results.Error.C(command);
    }
  }

  account.widgets.push(newWidget);
  const saved = await repo.update(account);

  // TODO move to subscriber
  const savedWidget = await widgetRepo.add(newWidget);
  if (isLeft(saved) || isLeft(savedWidget)) {
    const removedSeatMaybe = await billing.removeSeat(
      event.id,
      account.stripeCustomer,
      Plan[newWidget.country]
    );
    // TODO notify engineer
    console.log(
      "Widget could not be saved and removeSeat returned: ",
      isRight(removedSeatMaybe)
    );
    return Results.Error.C(command);
  }

  return Results.OKWithData.C(command, newWidget.id, UUID.Name);
};
